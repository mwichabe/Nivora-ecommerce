import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const AuthContext = createContext();

// Base URL for your authentication API
const API_URL = 'https://one-man-server.onrender.com/api/users';

const LOADING_MESSAGES = [
  "Checking authentication...",
  "Verifying session...",
  "Almost ready...",
];
const MESSAGE_INTERVAL_MS = 1000; // Reduced from 2000ms
const MAX_LOADING_TIME_MS = 10000; // Reduced from 60000ms (60s) to 10000ms (10s)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  const messageIntervalRef = useRef(null);
  const maxTimeoutRef = useRef(null);

  // Function to check user status based on the LOCAL STORAGE TOKEN
  const checkAuthStatus = async () => {
    clearTimeout(maxTimeoutRef.current);
    clearInterval(messageIntervalRef.current);

    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setAuthLoading(false);
      setLoadingMessage("Authentication not required.");
      return;
    }

    try {
      setAuthLoading(true);
      setLoadingMessage(LOADING_MESSAGES[0]);

      let messageIndex = 0;
      messageIntervalRef.current = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, MESSAGE_INTERVAL_MS);

      // Start the max loading timeout (1 minute)
      maxTimeoutRef.current = setTimeout(() => {
        console.warn('Authentication timeout (1 minute). Clearing token.');
        localStorage.removeItem('token'); // Clear the token!
        setUser(null);
        setIsLoggedIn(false);
        setAuthLoading(false);
        setLoadingMessage("Timeout: Failed to connect. Token cleared. Redirecting...");
        clearInterval(messageIntervalRef.current);

        // 🟢 Redirect on timeout using window.location.href
        window.location.href = '/';
      }, MAX_LOADING_TIME_MS);


      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for the fetch

      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          isAdmin: data.user.isAdmin
        });
        setIsLoggedIn(true);
        setLoadingMessage("Session verified. Application loading...");
      } else {
        // Token was invalid or expired, log out the user
        console.warn('Token invalid or expired. Logging out.');
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
        setLoadingMessage("Session expired. Please log in. Redirecting...");

        // 🟢 NEW: Redirect to the home page with a slight delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);

      // Handle specific error types
      if (error.name === 'AbortError') {
        console.warn('Authentication request timed out');
        setLoadingMessage("Network timeout. Please check your connection.");
      } else {
        setLoadingMessage("Connection error. Check network. Redirecting...");
      }

      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);

      // 🟢 Redirect on error
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } finally {
      clearInterval(messageIntervalRef.current);
      clearTimeout(maxTimeoutRef.current);
      setTimeout(() => {
        setAuthLoading(false);
      }, 500);
    }
  };

  // Function to update user data
  const updateUser = async (updateData) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return { success: false, message: 'Not authenticated.' };
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the user state with the returned data
        setUser(prevUser => ({
          ...prevUser,
          name: data.name ?? prevUser.name,
          email: data.email ?? prevUser.email,
          phone: data.phone ?? prevUser.phone,
        }));
        return { success: true, message: data.message || 'Profile updated successfully!' };
      } else {
        return { success: false, message: data.message || 'Failed to update profile.' };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Network error or server connection failed.' };
    }
  };

  // Custom login function
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        isAdmin: data.isAdmin
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
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // --------------------------------------------------------

  useEffect(() => {
    checkAuthStatus();

    // Cleanup on unmount
    return () => {
      clearInterval(messageIntervalRef.current);
      clearTimeout(maxTimeoutRef.current);
    }
  }, []);

  const contextValue = {
    user,
    isLoggedIn,
    authLoading,
    login,
    logout,
    checkAuthStatus,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {authLoading ? (
        <div className="flex flex-col justify-center items-center h-screen text-lg font-medium text-gray-700">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-center px-4">{loadingMessage}</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};