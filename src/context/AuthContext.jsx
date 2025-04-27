import { createContext, useContext, useState, useEffect } from 'react';
import defaultUsers from '../data/users.json';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Move useNavigate here

  const [authState, setAuthState] = useState({
    users: [],
    currentUser: null,
    loading: true,
    error: null
  });

  // Initialize auth system
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('app_users'));
        const storedUser = JSON.parse(localStorage.getItem('current_user'));

        const mergedUsers = storedUsers?.length > 0 
          ? storedUsers 
          : defaultUsers.users;

        setAuthState({
          users: mergedUsers,
          currentUser: storedUser || null,
          loading: false,
          error: null
        });

        if (!storedUsers || storedUsers.length === 0) {
          localStorage.setItem('app_users', JSON.stringify(defaultUsers.users));
        }
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to initialize authentication'
        }));
        console.error('Auth initialization error:', error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (authState.users.length > 0 && !authState.loading) {
      localStorage.setItem('app_users', JSON.stringify(authState.users));
    }
  }, [authState.users, authState.loading]);

  const findUserByEmail = (email) => {
    return [...authState.users, ...defaultUsers.users].find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  };

  const login = (email, password) => {
    try {
      const user = findUserByEmail(email);

      if (!user) {
        throw new Error('No account found with this email');
      }

      if (user.password !== password) {
        throw new Error('Incorrect password');
      }

      const updatedState = {
        ...authState,
        currentUser: user,
        error: null
      };

      setAuthState(updatedState);
      localStorage.setItem('current_user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      return { success: false, message: error.message };
    }
  };

  const register = (userData) => {
    try {
      if (findUserByEmail(userData.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
        role: userData.role || 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedUsers = [...authState.users, newUser];
      const updatedState = {
        ...authState,
        users: updatedUsers,
        currentUser: newUser,
        error: null
      };

      setAuthState(updatedState);
      localStorage.setItem('current_user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setAuthState(prev => ({
      ...prev,
      currentUser: null,
      error: null
    }));
    localStorage.removeItem('current_user');
    navigate('/'); 
    
  };

  const updateUser = (updatedData) => {
    try {
      if (!authState.currentUser) {
        throw new Error('No user logged in');
      }

      const updatedUser = {
        ...authState.currentUser,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      const updatedUsers = authState.users.map(user =>
        user.id === authState.currentUser.id ? updatedUser : user
      );

      const updatedState = {
        ...authState,
        users: updatedUsers,
        currentUser: updatedUser,
        error: null
      };

      setAuthState(updatedState);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        updateUser,
        findUserByEmail,
        clearError: () => setAuthState(prev => ({ ...prev, error: null })), 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
