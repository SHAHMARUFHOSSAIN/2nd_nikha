'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';

interface AuthContextType {
  userRole: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  login: (role?: UserRole) => void;
  logout: () => void;
  shortlistedIds: string[];
  toggleShortlist: (profileId: string) => void;
  isShortlisted: (profileId: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  userRole: 'PREMIUM',
  isLoggedIn: true,
  setRole: () => {},
  login: () => {},
  logout: () => {},
  shortlistedIds: [],
  toggleShortlist: () => {},
  isShortlisted: () => false,
});

const ROLE_STORAGE_KEY = '2ndchance_user_role';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('PREMIUM');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['p-101', 'p-102', 'p-103', 'p-104']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
      if (savedRole && savedRole !== 'GUEST') {
        setUserRole(savedRole);
      } else {
        setUserRole('PREMIUM');
        localStorage.setItem(ROLE_STORAGE_KEY, 'PREMIUM');
      }
    }
  }, []);

  const setRole = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
  };

  const login = (role: UserRole = 'PREMIUM') => {
    setRole(role);
  };

  const logout = () => {
    setRole('PREMIUM');
  };

  const toggleShortlist = (profileId: string) => {
    setShortlistedIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const isShortlisted = (profileId: string) => shortlistedIds.includes(profileId);

  const isLoggedIn = true; // Always active logged in state for seamless navigation

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isLoggedIn,
        setRole,
        login,
        logout,
        shortlistedIds,
        toggleShortlist,
        isShortlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
