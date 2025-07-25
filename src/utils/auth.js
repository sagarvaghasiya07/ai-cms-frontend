import { jwtDecode } from 'jwt-decode';

// Store Google token and user data
export const storeGoogleAuth = async (credential) => {
  try {
    const decoded = jwtDecode(credential);


    // Send token to backend API
    const response = await fetch('https://ai-cms-backend.onrender.com/api/user/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: credential
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Backend API Response:', result);

    if (result.code === 200) {
      // Store backend response data in localStorage
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('userData', JSON.stringify({
        userId: result.data.userId,
        name: result.data.name,
        email: result.data.email,
        profile_url: result.data.profile_url,
        singUpType: result.data.singUpType
      }));

      return {
        userId: result.data.userId,
        name: result.data.name,
        email: result.data.email,
        profile_url: result.data.profile_url,
        singUpType: result.data.singUpType
      };
    } else {
      throw new Error(result.message || 'Authentication failed');
    }
  } catch (error) {
    console.error('❌ Error processing Google token:', error);
    throw error;
  }
};

// Get current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Get current token
export const getCurrentToken = () => {
  return localStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Logout user
export const logout = () => {
  console.log('🚪 User logged out');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Log token information
export const logTokenInfo = () => {
  const token = getCurrentToken();
  const user = getCurrentUser();

  if (token && user) {
    console.log('🔍 Current Token Info:');
    console.log('Token:', token);
    console.log('User:', user);
    console.log('Token Length:', token.length);
  } else {
    console.log('❌ No token found');
  }
}; 