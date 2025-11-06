import React, { createContext, useState, useEffect, useContext } from 'react';
// We need to import the new 'getCurrentUser' and 'loginUser' functions from your api.js
// and also the 'logoutUser' function which we will rename to 'apiLogout' here
import { getCurrentUser, loginUser as apiLoginUser, logoutUser as apiLogout } from '../api';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // 3. Check for a user on initial app load
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Token exists, try to get user details
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (e) {
          // Token was invalid or expired
          apiLogout(); // Clear tokens
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // 4. Login function for the context
  const login = async (username, password) => {
    // This will throw an error if login fails, which LoginPage will catch
    await apiLoginUser(username, password); 
    // If login is successful, get the user data
    const userData = await getCurrentUser();
    setUser(userData);
  };

  // 5. Logout function for the context
  const logout = () => {
    apiLogout(); // Clear tokens from api.js
    setUser(null); // Clear user from state
  };

  // Don't render the app until we've checked for a user
  if (loading) {
    // You can replace this with a proper loading spinner if you have one
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  // 6. Provide the user, login, and logout functions to all children
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Create a custom hook for easy access in other components (like Navbar)
export const useAuth = () => {
  return useContext(AuthContext);
};