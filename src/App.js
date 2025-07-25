import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Auth from './components/Auth';
import Home from './components/Home';
import AICMS from './components/AICMS';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <GoogleOAuthProvider clientId="569529506391-hqfnduhiv3n9j58i9qbah09p1lct9q6q.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes - accessible without login */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Private routes - require authentication */}
            <Route 
              path="/ai-cms" 
              element={
                <PrivateRoute>
                  <AICMS />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
