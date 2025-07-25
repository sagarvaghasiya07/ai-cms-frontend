import React from 'react';

const Dashboard = () => {
  // Static data for analytics
  const analytics = {
    totalContent: 156,
    thisMonth: 23,
    lastMonth: 18,
    growth: '+27.8%',
    templates: {
      'social-media': 67,
      'email-subject': 45,
      'product-description': 44
    },
    topKeywords: [
      { keyword: 'AI Technology', count: 23 },
      { keyword: 'Product Launch', count: 18 },
      { keyword: 'Customer Success', count: 15 },
      { keyword: 'Innovation', count: 12 },
      { keyword: 'Digital Marketing', count: 10 }
    ]
  };

  // Static data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'generated',
      template: 'Social Media Posts',
      title: 'Product Launch Announcement',
      timestamp: '2 hours ago',
      icon: '🚀'
    },
    {
      id: 2,
      type: 'edited',
      template: 'Email Subject Lines',
      title: 'VIP Access Campaign',
      timestamp: '4 hours ago',
      icon: '✏️'
    },
    {
      id: 3,
      type: 'generated',
      template: 'Product Descriptions',
      title: 'Premium Software Solution',
      timestamp: '1 day ago',
      icon: '🛍️'
    },
    {
      id: 4,
      type: 'deleted',
      template: 'Social Media Posts',
      title: 'Old Campaign Post',
      timestamp: '2 days ago',
      icon: '🗑️'
    },
    {
      id: 5,
      type: 'generated',
      template: 'Email Subject Lines',
      title: 'Newsletter Subject',
      timestamp: '3 days ago',
      icon: '📧'
    }
  ];

  // Static data for monthly trends
  const monthlyTrends = [
    { month: 'Jan', content: 12, social: 8, email: 3, product: 1 },
    { month: 'Feb', content: 15, social: 10, email: 4, product: 1 },
    { month: 'Mar', content: 18, social: 12, email: 5, product: 1 },
    { month: 'Apr', content: 22, social: 15, email: 5, product: 2 },
    { month: 'May', content: 25, social: 17, email: 6, product: 2 },
    { month: 'Jun', content: 23, social: 16, email: 5, product: 2 }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'generated': return '🚀';
      case 'edited': return '✏️';
      case 'deleted': return '🗑️';
      default: return '📝';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'generated': return 'text-green-400';
      case 'edited': return 'text-blue-400';
      case 'deleted': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Dashboard & Analytics
          </h1>
          <p className="text-xl text-white/70">
            Track your content creation progress and performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
              <div className="text-green-400 text-sm font-medium">+27.8%</div>
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
              <div className="text-purple-400 text-sm font-medium">Most Used</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{analytics.templates['social-media']}</h3>
            <p className="text-white/60">Social Media Posts</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🎯</div>
              <div className="text-orange-400 text-sm font-medium">Top Keyword</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{analytics.topKeywords[0].count}</h3>
            <p className="text-white/60">AI Technology</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Template Usage */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Template Usage</h2>
            <div className="space-y-4">
              {Object.entries(analytics.templates).map(([template, count]) => (
                <div key={template} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {template === 'social-media' ? '📱' : template === 'email-subject' ? '📧' : '🛍️'}
                    </span>
                    <span className="text-white font-medium capitalize">
                      {template.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(analytics.templates))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Top Keywords</h2>
            <div className="space-y-4">
              {analytics.topKeywords.map((item, index) => (
                <div key={item.keyword} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-white/60 text-sm w-6">#{index + 1}</span>
                    <span className="text-white font-medium">{item.keyword}</span>
                  </div>
                  <span className="text-white/60 text-sm">{item.count} uses</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">{activity.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{activity.title}</h3>
                    <p className="text-white/60 text-sm">{activity.template}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium mr-3 ${getActivityColor(activity.type)}`}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                  <span className="text-white/40 text-sm">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Monthly Content Trends</h2>
          <div className="grid grid-cols-6 gap-4">
            {monthlyTrends.map((month, index) => (
              <div key={month.month} className="text-center">
                <div className="text-white/60 text-sm mb-2">{month.month}</div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white font-bold text-lg mb-1">{month.content}</div>
                  <div className="text-white/40 text-xs">
                    <div>📱 {month.social}</div>
                    <div>📧 {month.email}</div>
                    <div>🛍️ {month.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
            🚀 Generate New Content
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-2xl font-semibold text-lg transition-all duration-300 border border-white/20">
            📊 View Detailed Analytics
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-2xl font-semibold text-lg transition-all duration-300 border border-white/20">
            📈 Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 