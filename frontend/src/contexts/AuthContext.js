import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };    case 'LOAD_USER':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case 'LOAD_USER_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };  // Load user
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          dispatch({
            type: 'LOAD_USER',
            payload: data.user
          });
        } else {
          throw new Error('Failed to load user');
        }
      } catch (error) {
        console.error('Load user error:', error);
        dispatch({ type: 'LOAD_USER_FAIL' });
        setAuthToken(null);
      }    } else {
      dispatch({ type: 'LOAD_USER_FAIL' });
    }
  };

  // Login user
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setAuthToken(data.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Login failed';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message = 'Unable to connect to server. Please ensure the backend is running on port 5000.';
      } else {
        message = error.message || 'Login failed';
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      setAuthToken(null);
      return { success: false, error: message };
    }
  };  // Register user
  const register = async (name, email, password, role = 'guest') => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setAuthToken(data.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      let message = 'Registration failed';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message = 'Unable to connect to server. Please ensure the backend is running on port 5000.';
      } else {
        message = error.message || 'Registration failed';
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      setAuthToken(null);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
