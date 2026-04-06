import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, login as authLogin, logout as authLogout, register as authRegister, updateProfile as authUpdateProfile, UserRole, initializeUsers } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User | null>;
  updateProfile: (data: Partial<User>) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUsers();
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authLogin(email, password);
    if (u) setUser(u);
    return u;
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    const u = await authRegister(name, email, password, role);
    if (u) setUser(u);
    return u;
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return null;
    const u = await authUpdateProfile(user.id, data);
    if (u) setUser(u);
    return u;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
