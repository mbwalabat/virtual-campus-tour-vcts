import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

// ✅ Define AuthContext here
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log(response, "response");

      const { user: userData, token: userToken } = response.data.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'superAdmin',
    isDepartmentAdmin: user?.role === 'departmentAdmin',
    isAdmin: user?.role === 'superAdmin' || user?.role === 'departmentAdmin',
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
