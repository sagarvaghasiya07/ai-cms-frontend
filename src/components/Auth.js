import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { storeGoogleAuth, getCurrentUser, logout } from '../utils/auth';

const Auth = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Store and decode the token using utility function
      const decoded = await storeGoogleAuth(credentialResponse.credential);
      
      // Update state
      setUser(decoded);
      
      // Navigate to home page after successful login
      navigate('/ai-cms');
      
    } catch (error) {
      console.error('Error processing Google login:', error);
      setError('Failed to process login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">AI CMS</h1>
            <p className="text-white/70">Welcome to the future of content management</p>
          </div>

          {!user ? (
            <>
              {/* Google Login Section */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Sign in with Google</h2>
                <p className="text-white/70 mb-6">Access your AI-powered content management system</p>
                
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_white"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="300"
                    disabled={isLoading}
                  />
                </div>
                
                {isLoading && (
                  <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">Processing login...</p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Back Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleBack}
                  className="text-white/50 hover:text-white transition-colors duration-300"
                >
                  ← Back
                </button>
              </div>
            </>
          ) : (
            <>
              {/* User Profile Section */}
              <div className="text-center mb-6">
                <div className="mb-4">
                  {user.picture && (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full mx-auto border-4 border-white/20"
                    />
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome, {user.name}!
                </h2>
                <p className="text-white/70 mb-4">{user.email}</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/home')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Dashboard
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  );
};

export default Auth; 