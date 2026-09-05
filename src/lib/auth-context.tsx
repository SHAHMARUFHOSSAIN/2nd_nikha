'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Profile } from '@/types';
import { MOCK_PROFILES } from '@/data/mock-data';

interface AuthContextType {
  userRole: UserRole;
  isLoggedIn: boolean;
  currentUser: Profile | null;
  setRole: (role: UserRole) => void;
  login: (userObj?: any, role?: UserRole) => void;
  logout: () => void;
  shortlistedIds: string[];
  toggleShortlist: (profileId: string) => void;
  isShortlisted: (profileId: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  userRole: 'GUEST',
  isLoggedIn: false,
  currentUser: null,
  setRole: () => {},
  login: () => {},
  logout: () => {},
  shortlistedIds: [],
  toggleShortlist: () => {},
  isShortlisted: () => false,
});

const ROLE_STORAGE_KEY = '2ndchance_user_role';
const USER_STORAGE_KEY = '2ndchance_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['p-101', 'p-102', 'p-103', 'p-104']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
      const savedUserStr = localStorage.getItem(USER_STORAGE_KEY);

      if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          setCurrentUser(parsedUser);
          setUserRole(savedRole && savedRole !== 'GUEST' ? savedRole : 'PREMIUM');
          return;
        } catch (e) {}
      }

      if (savedRole && savedRole !== 'GUEST') {
        setUserRole(savedRole);
        setCurrentUser(MOCK_PROFILES[0]);
      } else {
        setUserRole('GUEST');
        setCurrentUser(null);
      }
    }
  }, []);

  const setRole = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
  };

  const login = (userObj?: any, role: UserRole = 'PREMIUM') => {
    const userToSet = userObj || MOCK_PROFILES[0];
    setCurrentUser(userToSet);
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSet));
    }
  };

  const logout = () => {
    setUserRole('GUEST');
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, 'GUEST');
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('2ndchance_user_session');
      localStorage.removeItem('2ndchance_chat_messages');
      localStorage.removeItem('2ndchance_chat_conversations');
      localStorage.removeItem('2ndchance_chat_shared_photos');
    }
  };

  const toggleShortlist = (profileId: string) => {
    setShortlistedIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const isShortlisted = (profileId: string) => shortlistedIds.includes(profileId);

  const isLoggedIn = mounted ? userRole !== 'GUEST' && currentUser !== null : false;

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isLoggedIn,
        currentUser,
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
