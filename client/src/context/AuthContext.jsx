import React, { createContext, useState, useEffect, useContext } from 'react';
const AuthContext = createContext();

// Base URL for your authentication API
const API_URL = 'http://localhost:5000/api/users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Function to check user status based on the LOCAL STORAGE TOKEN
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // No token found, user is definitely logged out.
        setUser(null);
        setIsLoggedIn(false);
        setAuthLoading(false);
        return;
    }

    try {
      setAuthLoading(true);
      
      // 🟢 CRITICAL CHANGE: Send the token in the Authorization header
      const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Use token for authorization
          }
      });
      
      const data = await response.json();

      if (response.ok && data.user) {
        // User data successfully fetched using the token
        setUser({ 
          _id: data.user._id, 
          name: data.user.name, 
          email: data.user.email,
          isAdmin: data.user.isAdmin
        });
        setIsLoggedIn(true);
      } else {
        // Token was invalid or expired, log out the user
        console.warn('Token invalid or expired. Logging out.');
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  };
  //update user data
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
                name: data.name,
                email: data.email,
                // isAdmin and _id should remain unchanged
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

  // Run only once when the provider mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Custom login function
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
      // 🟢 Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      setUser({ 
        _id: data._id, 
        name: data.name, 
        email: data.email,
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
      // If your backend /logout also revokes the token server-side, keep this. 
      // Otherwise, the essential step is removing the token locally.
      // ⚠️ NOTE: If using Bearer tokens, the POST request here won't use the cookie, 
      // so it needs the token in the header too, but for simple logout, removing the 
      // token locally is usually sufficient in a token-only setup.
      // await fetch(`${API_URL}/logout`, { method: 'POST' }); 
      
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
    checkAuthStatus,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Show children only after auth status is checked */}
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