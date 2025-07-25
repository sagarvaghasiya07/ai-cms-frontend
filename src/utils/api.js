// API utility functions for AI CMS

const API_BASE_URL = 'https://ai-cms-backend.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get template list from API
export const getTemplateList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/ai/get-template-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Template List API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch template list');
    }
  } catch (error) {
    console.error('❌ Error fetching template list:', error);
    throw error;
  }
};

// Generate content using AI
export const generateContent = async (templateId, userInput) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/content/ai/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userInput,
        templateId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Content Generation API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to generate content');
    }
  } catch (error) {
    console.error('❌ Error generating content:', error);
    throw error;
  }
};

// Regenerate content using AI
export const regenerateContent = async (contentId, userInput) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/content/ai/regenerate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contentId,
        userInput
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Content Regeneration API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to regenerate content');
    }
  } catch (error) {
    console.error('❌ Error regenerating content:', error);
    throw error;
  }
};

// Edit content
export const editContent = async (contentData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/content/ai/edit-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contentData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Content Edit API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to edit content');
    }
  } catch (error) {
    console.error('❌ Error editing content:', error);
    throw error;
  }
};

// Get content list with filters
export const getContentList = async (params = {}) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      category: params.category || '',
      templateId: params.templateId || ''
    });

    const response = await fetch(`${API_BASE_URL}/content/ai/get-content-list?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Content List API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch content list');
    }
  } catch (error) {
    console.error('❌ Error fetching content list:', error);
    throw error;
  }
};

// Get content detail
export const getContentDetail = async (contentId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/content/ai/get-content-detail?contentId=${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Content Detail API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch content detail');
    }
  } catch (error) {
    console.error('❌ Error fetching content detail:', error);
    throw error;
  }
};

// Delete content
export const deleteContent = async (contentId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/content/ai/delete-content?contentId=${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Content Delete API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to delete content');
    }
  } catch (error) {
    console.error('❌ Error deleting content:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStatistics = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/user/get-statastic`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ User Statistics API Response:', result);

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch user statistics');
    }
  } catch (error) {
    console.error('❌ Error fetching user statistics:', error);
    throw error;
  }
}; 