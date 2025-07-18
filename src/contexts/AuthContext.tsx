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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - in real app, this would call your API
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email === 'admin@example.com' ? 'admin' : 'user',
      };
      
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
      // Mock registration - in real app, this would call your API
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
      };
      
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