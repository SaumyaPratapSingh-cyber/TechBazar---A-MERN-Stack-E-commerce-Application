    // src/context/AuthContext.jsx
    import React, { createContext, useState, useEffect, useContext } from 'react';

    // Create the AuthContext
    const AuthContext = createContext();

    // Create a provider component
    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null); // Stores user info (name, email, isAdmin)
      const [token, setToken] = useState(null); // Stores the JWT token

      // Load user and token from localStorage on initial load
      useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        const storedToken = localStorage.getItem('userToken');
        if (storedUser && storedToken) {
          try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } catch (e) {
            console.error("Failed to parse user info from localStorage", e);
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userToken');
          }
        }
      }, []);

      // Function to handle login/registration
      const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('userToken', userToken);
      };

      // Function to handle logout
      const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
      };

      return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
    };

    // Custom hook to use the AuthContext
    export const useAuth = () => {
      return useContext(AuthContext);
    };
    