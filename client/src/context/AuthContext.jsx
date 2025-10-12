import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context object
const AuthContext = createContext();

// Base URL for your authentication API
const API_URL = 'http://localhost:5000/api/users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Function to check user status based on the HTTP-only cookie
  const checkAuthStatus = async () => {
    try {
      setAuthLoading(true);
      const response = await fetch(`${API_URL}/me`);
      const data = await response.json();

      if (data.isLoggedIn && data.user) {
        // --- MODIFICATION 1: Capture isAdmin during status check ---
        // This ensures that if the user loads the page while already logged in, 
        // the context gets the latest isAdmin value.
        setUser({ 
          _id: data.user._id, 
          name: data.user.name, 
          email: data.user.email,
          isAdmin: data.user.isAdmin
        });
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
      // Even on error, we assume the user is logged out
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // Run only once when the provider mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Custom login function for clarity, can be used by Login.jsx
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // --- MODIFICATION 2: Capture isAdmin during successful login ---
      // This is crucial for the immediate UI update after form submission.
      localStorage.setItem('token', data.token);
      setUser({ 
        _id: data._id, 
        name: data.name, 
        email: data.email,
        isAdmin: data.isAdmin // <-- Capture isAdmin from the backend response
      }); 
      setIsLoggedIn(true);
      return { success: true, user: data };
    } else {
      return { success: false, message: data.message || 'Login failed.' };
    }
  };


  // Logout function
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
       localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    } catch(error) {
      console.error('Logout error:', error);
    }
  };

  const contextValue = { 
    user, 
    isLoggedIn, 
    authLoading, 
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Optionally show a global loading indicator while checking auth status */}
      {authLoading ? (
        <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-700">
          Authenticating...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};