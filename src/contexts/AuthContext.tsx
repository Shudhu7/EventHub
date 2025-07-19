import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/event';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Generate a unique user ID based on email
  const generateUniqueUserId = (email: string): string => {
    // Create a simple hash from email + timestamp for uniqueness
    const timestamp = Date.now().toString();
    const emailHash = email.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0).toString(36);
    return `user_${emailHash}_${timestamp}`;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if this is a returning user
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '{}');
      let mockUser: User;

      if (existingUsers[email]) {
        // Returning user - use existing ID
        mockUser = existingUsers[email];
      } else {
        // New user for demo purposes or admin
        const userId = email === 'admin@example.com' ? 'admin_1' : generateUniqueUserId(email);
        mockUser = {
          id: userId,
          email,
          name: email.split('@')[0],
          role: email === 'admin@example.com' ? 'admin' : 'user',
        };
        
        // Store the user for future logins
        existingUsers[email] = mockUser;
        localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      });
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '{}');
      
      if (existingUsers[email]) {
        // User already exists, return false to indicate registration failure
        return false;
      }

      // Create new user with unique ID
      const userId = generateUniqueUserId(email);
      const mockUser: User = {
        id: userId,
        email,
        name,
        role: 'user',
      };
      
      // Store the new user
      existingUsers[email] = mockUser;
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      });
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};