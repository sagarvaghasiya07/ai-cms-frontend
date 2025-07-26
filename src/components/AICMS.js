import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import { getTemplateList, generateContent, regenerateContent, getContentList, editContent, deleteContent, getUserStatistics } from '../utils/api';

const AICMS = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState('generator');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentList, setContentList] = useState([]);
  const [currentContent, setCurrentContent] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingContent, setDeletingContent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  useEffect(() => {
    // Get current user data
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Fetch templates from API
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError('');
        const templateData = await getTemplateList();
        setTemplates(templateData);
        // Set first template as selected if available
        if (templateData.length > 0) {
          setSelectedTemplate(templateData[0].templateId);
        }
      } catch (err) {
        setError('Failed to load templates. Please try again.');
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch content list
    const fetchContentList = async () => {
      try {
        const contentData = await getContentList({
          page: 1,
          limit: 50,
          search: searchTerm,
          // category: selectedCategory === 'all' ? '' : selectedCategory,
          templateId: selectedCategory === 'all' ? '' : selectedCategory
        });
        setContentList(contentData.list || []);
      } catch (err) {
        console.error('Error fetching content list:', err);
      }
    };

    // Fetch user statistics
    const fetchStatistics = async () => {
      try {
        setStatisticsLoading(true);
        const statsData = await getUserStatistics();
        setStatistics(statsData);
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setStatisticsLoading(false);
      }
    };

    fetchTemplates();
    fetchContentList();
    fetchStatistics();
  }, []);

  // Template icons mapping
  const templateIcons = {
    'Social Media Post': '📱',
    'Email Subject Line': '📧',
    'Product Descriptions': '🛍️'
  };

  // Analytics data based on API response
  const analytics = {
    totalContent: statistics?.totalContentGenerated || 0,
    thisMonth: statistics?.totalContentThisMonth || 0,
    socialMediaPosts: statistics?.totalSocialMediaPostGenerated || 0,
    emails: statistics?.totalEmailGenerated || 0,
    productDescriptions: statistics?.totalProductDescriptionGenerated || 0,
    templates: templates.reduce((acc, template) => {
      // Map template types to statistics
      let count = 0;
      if (template.name === 'Social Media Post') {
        count = statistics?.totalSocialMediaPostGenerated || 0;
      } else if (template.name === 'Email Subject Line') {
        count = statistics?.totalEmailGenerated || 0;
      } else if (template.name === 'Product Descriptions') {
        count = statistics?.totalProductDescriptionGenerated || 0;
      }
      acc[template.templateId] = count;
      return acc;
    }, {}),
    topKeywords: [
      { keyword: 'AI Technology', count: 23 },
      { keyword: 'Product Launch', count: 18 },
      { keyword: 'Customer Success', count: 15 },
      { keyword: 'Innovation', count: 12 },
      { keyword: 'Digital Marketing', count: 10 }
    ]
  };

  const categories = [
    { key: 'all', name: 'All Content', icon: '📄' },
    ...templates.map(template => ({
      key: template.templateId,
      name: template.name,
      icon: templateIcons[template.name] || '📄'
    }))
  ];

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleGenerateContent = async () => {
    if (!keywords.trim()) {
      alert('Please enter keywords to generate content');
      return;
    }

    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    try {
      setGeneratingContent(true);
      setError('');
      const result = await generateContent(selectedTemplate, keywords);
      setGeneratedContent(result.content || result);
      setCurrentContent(result);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Error generating content:', err);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleRegenerateContent = async () => {
    if (!currentContent?.contentId) {
      alert('No content to regenerate');
      return;
    }

    try {
      setGeneratingContent(true);
      setError('');
      const result = await regenerateContent(currentContent.contentId, keywords);
      setGeneratedContent(result.content || result);
      setCurrentContent(result);
    } catch (err) {
      setError('Failed to regenerate content. Please try again.');
      console.error('Error regenerating content:', err);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleSearchAndFilter = async () => {
    try {
      const contentData = await getContentList({
        page: 1,
        limit: 50,
        search: searchTerm,
        // category: selectedCategory === 'all' ? '' : selectedCategory,
        templateId: selectedCategory === 'all' ? '' : selectedCategory
      });
      setContentList(contentData.list || []);
    } catch (err) {
      console.error('Error fetching filtered content:', err);
    }
  };

  const handleEditContent = (content) => {
    setEditingContent({
      contentId: content.contentId,
      title: content.title || '',
      content: content.content || '',
      category: content.category || '',
      keywords: content.keywords || [],
      tags: content.tags || []
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingContent) return;

    try {
      setEditLoading(true);
      const result = await editContent(editingContent);

      // Update the content list with the edited content
      setContentList(prevList =>
        prevList.map(item =>
          item.contentId === editingContent.contentId
            ? { ...item, ...editingContent }
            : item
        )
      );

      setShowEditModal(false);
      setEditingContent(null);
    } catch (err) {
      console.error('Error updating content:', err);
      alert('Failed to update content. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingContent(null);
  };

  const handleDeleteContent = async (content) => {
    if (!window.confirm(`Are you sure you want to delete "${content.title || 'Untitled Content'}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeletingContent(content.contentId);

      await deleteContent(content.contentId);

      // Remove the deleted content from the list
      setContentList(prevList =>
        prevList.filter(item => item.contentId !== content.contentId)
      );

    } catch (err) {
      console.error('Error deleting content:', err);
      alert('Failed to delete content. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeletingContent(null);
    }
  };

  // Update content list when search or category changes
  useEffect(() => {
    if (activeTab === 'manager') {
      handleSearchAndFilter();
    }
  }, [searchTerm, selectedCategory, activeTab]);

  // Clear generated content when tab changes
  useEffect(() => {
    setCurrentContent(null);
    setGeneratedContent('');
    setShowRawData(false);
    setKeywords('');
  }, [activeTab]);

  // Clear generated content when template changes
  useEffect(() => {
    setCurrentContent(null);
    setGeneratedContent('');
    setShowRawData(false);
    setKeywords('');
  }, [selectedTemplate]);

  const tabs = [
    { id: 'generator', name: 'Content Generator', icon: '🚀' },
    { id: 'manager', name: 'Content Manager', icon: '📝' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white">AI CMS</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="hidden sm:flex items-center space-x-3">
                {user?.profile_url && (
                  <img
                    src={user.profile_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                )}
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{user?.name || 'User'}</div>
                  <div className="text-white/60 text-xs">Content Creator</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Scrollable horizontal tabs */}
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
            <div className="flex min-w-full sm:min-w-0 sm:space-x-8 px-4 sm:px-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 py-4 px-3 sm:px-1 border-b-2 font-medium text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-white/60 hover:text-white/80'
                    }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Generator Tab */}
        {activeTab === 'generator' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">AI Content Generator</h2>
              <p className="text-lg sm:text-xl text-white/70">Create engaging content with the power of artificial intelligence</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Content Generation Panel */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-6">Generate Content</h3>

                {/* Template Selection */}
                <div className="mb-6">
                  <label className="block text-white/80 mb-3 font-medium">Content Template</label>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-white/60">Loading templates...</div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <div className="text-red-400">{error}</div>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-blue-400 hover:text-blue-300"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.templateId}
                          onClick={() => setSelectedTemplate(template.templateId)}
                          className={`p-4 rounded-xl border transition-all duration-300 text-left ${selectedTemplate === template.templateId
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white'
                              : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                            }`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{templateIcons[template.name] || '📄'}</span>
                            <span className="font-medium">{template.name}</span>
                            <span className="text-xs text-white/60 ml-2">({template.usedCount})</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Keywords Input */}
                <div className="mb-6">
                  <label className="block text-white/80 mb-3 font-medium">Keywords/Context</label>
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords, topics, or context for your content..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                    rows="4"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateContent}
                  disabled={generatingContent || !selectedTemplate}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${generatingContent || !selectedTemplate
                      ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:scale-105'
                    }`}
                >
                  {generatingContent ? '🔄 Generating...' : '🚀 Generate Content'}
                </button>
              </div>

              {/* Generated Content Display */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-6">Generated Content</h3>

                {currentContent ? (
                  <div className="space-y-6">
                    {/* Content ID and Status */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white">
                          {templates.find(t => t.templateId === selectedTemplate)?.name || 'Generated Content'}
                        </h4>
                        <div className="flex items-center gap-2">
                          {currentContent.isRegenerated && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                              Regenerated
                            </span>
                          )}
                        </div>
                      </div>
                      


                      {/* Title */}
                      {currentContent.title && (
                        <div className="mb-4">
                          <h5 className="text-white/80 font-medium mb-2">Title:</h5>
                          <p className="text-white font-semibold text-lg">{currentContent.title}</p>
                        </div>
                      )}

                      {/* Main Content */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white/80 font-medium">Content:</h5>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{currentContent.content}</p>
                        </div>
                      </div>

                      {/* Category */}
                      {currentContent.category && (
                        <div className="mb-4">
                          <h5 className="text-white/80 font-medium mb-2">Category:</h5>
                          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full border border-indigo-400/30">
                            {currentContent.category}
                          </span>
                        </div>
                      )}

                      {/* Keywords */}
                      {currentContent.keywords && currentContent.keywords.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-white/80 font-medium mb-2">Keywords:</h5>
                          <div className="flex flex-wrap gap-2">
                            {currentContent.keywords.map((keyword, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {currentContent.tags && currentContent.tags.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-white/80 font-medium mb-2">Tags:</h5>
                          <div className="flex flex-wrap gap-2">
                            {currentContent.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/30">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      

                      {/* Whole Content (if different from content) */}
                      {currentContent.wholeContent && currentContent.wholeContent !== currentContent.content && (
                        <div className="mb-4">
                          <h5 className="text-white/80 font-medium mb-2">Full Response:</h5>
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">{currentContent.wholeContent}</p>
                          </div>
                        </div>
                      )}


                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleRegenerateContent}
                        disabled={generatingContent}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${generatingContent
                            ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                          }`}
                      >
                        {generatingContent ? '🔄 Regenerating...' : '🔄 Regenerate'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-white/60 text-lg">
                      Enter keywords and click generate to create amazing content
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Manager Tab */}
        {activeTab === 'manager' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Content Manager</h2>
              <p className="text-lg sm:text-xl text-white/70">Organize, edit, and manage your generated content</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Search Content</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, content, or tags..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                  >
                    {categories.map(category => (
                      <option
                        key={category.key}
                        value={category.key}
                        className="bg-slate-800 text-white"
                      >
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-white/80">
                  <span className="font-medium">{contentList.length}</span> content items found
                </div>
                <div className="text-white/60 text-sm">
                  Showing all content
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {contentList.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-white/60 text-lg">
                    No content found. Generate some content to see it here!
                  </p>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    🚀 Start Generating Content
                  </button>
                </div>
              ) : (
                contentList.map(content => (
                  <div key={content.contentId} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{content.title || 'Untitled Content'}</h3>
                        <div className="flex items-center text-white/60 text-sm mb-3 flex-wrap gap-4">
                          <span>📅 {new Date(content.createdAt).toLocaleDateString()}</span>
                          <span>🏷️ {content.templateDetails?.name || 'Unknown Template'}</span>
                          <span>🤖 {content.aiProvider || 'Unknown'}</span>
                          <span>📂 {content.category || 'Uncategorized'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditContent(content)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-300"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteContent(content)}
                          disabled={deleteLoading && deletingContent === content.contentId}
                          className={`p-2 rounded-lg transition-colors duration-300 ${deleteLoading && deletingContent === content.contentId
                              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            }`}
                          title="Delete"
                        >
                          {deleteLoading && deletingContent === content.contentId ? '🔄' : '🗑️'}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{content.content}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Keywords */}
                      {content.keywords && content.keywords.length > 0 && (
                        <div>
                          <span className="text-white/60 text-sm font-medium">Keywords:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {content.keywords.map(keyword => (
                              <span key={keyword} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {content.tags && content.tags.length > 0 && (
                        <div>
                          <span className="text-white/60 text-sm font-medium">Tags:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {content.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/30">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Dashboard & Analytics</h2>
              <p className="text-lg sm:text-xl text-white/70">Track your content creation progress and performance</p>
              <button
                onClick={async () => {
                  try {
                    setStatisticsLoading(true);
                    const statsData = await getUserStatistics();
                    setStatistics(statsData);
                  } catch (err) {
                    console.error('Error refreshing statistics:', err);
                  } finally {
                    setStatisticsLoading(false);
                  }
                }}
                disabled={statisticsLoading}
                className={`mt-4 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  statisticsLoading
                    ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                }`}
              >
                {statisticsLoading ? '🔄 Refreshing...' : '🔄 Refresh Statistics'}
              </button>
            </div>

            {/* Key Metrics */}
            {statisticsLoading ? (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">📊</div>
                        <div className="h-4 bg-white/20 rounded w-16"></div>
                      </div>
                      <div className="h-8 bg-white/20 rounded mb-2"></div>
                      <div className="h-4 bg-white/20 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">📊</div>
                    <div className="text-green-400 text-sm font-medium">
                      {statistics ? 'Live Data' : 'Loading...'}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{analytics.totalContent}</h3>
                  <p className="text-white/60">Total Content Generated</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">📅</div>
                    <div className="text-blue-400 text-sm font-medium">This Month</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{analytics.thisMonth}</h3>
                  <p className="text-white/60">Content This Month</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">📱</div>
                    <div className="text-purple-400 text-sm font-medium">Social Media</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{analytics.socialMediaPosts}</h3>
                  <p className="text-white/60">Social Media Posts</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">📧</div>
                    <div className="text-orange-400 text-sm font-medium">Email Content</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{analytics.emails}</h3>
                  <p className="text-white/60">Email Subject Lines</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Content Breakdown */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-6">Content Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📱</span>
                      <span className="text-white font-medium">Social Media Posts</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                          style={{ width: `${analytics.totalContent > 0 ? (analytics.socialMediaPosts / analytics.totalContent) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold">{analytics.socialMediaPosts}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📧</span>
                      <span className="text-white font-medium">Email Subject Lines</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${analytics.totalContent > 0 ? (analytics.emails / analytics.totalContent) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold">{analytics.emails}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🛍️</span>
                      <span className="text-white font-medium">Product Descriptions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                          style={{ width: `${analytics.totalContent > 0 ? (analytics.productDescriptions / analytics.totalContent) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold">{analytics.productDescriptions}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-6">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-white/60 text-sm w-6">📊</span>
                      <span className="text-white font-medium">Total Generated</span>
                    </div>
                    <span className="text-white/60 text-sm">{analytics.totalContent} items</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-white/60 text-sm w-6">📅</span>
                      <span className="text-white font-medium">This Month</span>
                    </div>
                    <span className="text-white/60 text-sm">{analytics.thisMonth} items</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-white/60 text-sm w-6">🎯</span>
                      <span className="text-white font-medium">Most Popular</span>
                    </div>
                    <span className="text-white/60 text-sm">
                      {analytics.emails > analytics.socialMediaPosts && analytics.emails > analytics.productDescriptions 
                        ? 'Email Content' 
                        : analytics.socialMediaPosts > analytics.productDescriptions 
                          ? 'Social Media' 
                          : 'Product Descriptions'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-white/60 text-sm w-6">📈</span>
                      <span className="text-white font-medium">Success Rate</span>
                    </div>
                    <span className="text-white/60 text-sm">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Profile</h2>
              <p className="text-lg sm:text-xl text-white/70">Your basic information</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
                {/* Profile Photo and Basic Info */}
                <div className="text-center mb-8">
                  {user?.profile_url ? (
                    <img
                      src={user.profile_url}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
                    />
                  ) : (
                    <div className="text-6xl sm:text-8xl mb-4">👤</div>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user?.name || 'User'}</h3>
                  <p className="text-white/60 text-base sm:text-lg">Content Creator</p>
                </div>

                {/* Basic Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/60 font-medium">Email</span>
                    <span className="text-white font-medium">{user?.email || 'user@example.com'}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/60 font-medium">Role</span>
                    <span className="text-white font-medium">Content Creator</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/60 font-medium">Member Since</span>
                    <span className="text-white font-medium">January 2024</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/60 font-medium">Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Content Modal */}
        {showEditModal && editingContent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Edit Content</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-white/60 hover:text-white/80 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Title</label>
                  <input
                    type="text"
                    value={editingContent.title}
                    onChange={(e) => setEditingContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                    placeholder="Enter content title..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Content</label>
                  <textarea
                    value={editingContent.content}
                    onChange={(e) => setEditingContent(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                    rows="6"
                    placeholder="Enter content..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Category</label>
                  <input
                    type="text"
                    value={editingContent.category}
                    onChange={(e) => setEditingContent(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                    placeholder="Enter category..."
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Keywords</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="keywordInput"
                        className="flex-1 p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                        placeholder="Add a keyword..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newKeyword = e.target.value.trim();
                            if (!editingContent.keywords.includes(newKeyword)) {
                              setEditingContent(prev => ({
                                ...prev,
                                keywords: [...prev.keywords, newKeyword]
                              }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('keywordInput');
                          const value = input.value.trim();
                          if (value && !editingContent.keywords.includes(value)) {
                            setEditingContent(prev => ({
                              ...prev,
                              keywords: [...prev.keywords, value]
                            }));
                            input.value = '';
                          }
                        }}
                        className="px-4 py-4 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl transition-colors duration-300"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingContent.keywords.map((keyword, index) => (
                        <span key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                          {keyword}
                          <button
                            onClick={() => {
                              setEditingContent(prev => ({
                                ...prev,
                                keywords: prev.keywords.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Tags</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="tagInput"
                        className="flex-1 p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors duration-300"
                        placeholder="Add a tag..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newTag = e.target.value.trim();
                            if (!editingContent.tags.includes(newTag)) {
                              setEditingContent(prev => ({
                                ...prev,
                                tags: [...prev.tags, newTag]
                              }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('tagInput');
                          const value = input.value.trim();
                          if (value && !editingContent.tags.includes(value)) {
                            setEditingContent(prev => ({
                              ...prev,
                              tags: [...prev.tags, value]
                            }));
                            input.value = '';
                          }
                        }}
                        className="px-4 py-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-colors duration-300"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingContent.tags.map((tag, index) => (
                        <span key={index} className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                          #{tag}
                          <button
                            onClick={() => {
                              setEditingContent(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${editLoading
                        ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      }`}
                  >
                    {editLoading ? '🔄 Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICMS; 