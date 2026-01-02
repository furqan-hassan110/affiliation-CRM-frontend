import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@crm.com': {
    id: '1',
    name: 'John Admin',
    email: 'admin@crm.com',
    role: 'admin',
    password: 'admin123',
  },
  'agent@crm.com': {
    id: '2',
    name: 'Sarah Agent',
    email: 'agent@crm.com',
    role: 'agent',
    password: 'agent123',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('crm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userData } = mockUser;
    setUser(userData);
    localStorage.setItem('crm_user', JSON.stringify(userData));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('crm_user');
  }, []);

  const hasRole = useCallback((role: UserRole) => {
    return user?.role === role;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
