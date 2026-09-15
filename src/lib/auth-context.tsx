'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Profile } from '@/types';

interface AuthContextType {
  userRole: UserRole;
  isLoggedIn: boolean;
  currentUser: Profile | null;
  setRole: (role: UserRole) => void;
  login: (userObj?: any, role?: UserRole) => void;
  logout: () => void;
  refreshSession: () => Promise<Profile | null>;
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
  refreshSession: async () => null,
  shortlistedIds: [],
  toggleShortlist: () => {},
  isShortlisted: () => false,
});

const ROLE_STORAGE_KEY = '2ndchance_user_role';
const USER_STORAGE_KEY = '2ndchance_current_user';

function mapApiUserToProfile(apiUser: any): Profile {
  return {
    id: apiUser.id,
    fullName: apiUser.fullName,
    email: apiUser.email,
    phone: apiUser.phone,
    age: apiUser.profile?.age ?? 30,
    gender: apiUser.profile?.gender || 'Female',
    maritalStatus: apiUser.profile?.maritalStatus || 'Divorced',
    hasChildren: false,
    height: apiUser.profile?.height || "5'5\"",
    religion: apiUser.profile?.religion || 'Islam',
    education: apiUser.profile?.education || 'Bachelor Degree',
    profession: apiUser.profile?.profession || 'Professional',
    location: apiUser.profile?.location || 'Dhaka, Bangladesh',
    city: apiUser.profile?.location || 'Dhaka',
    country: apiUser.country || 'Bangladesh',
    countryFlag: apiUser.countryFlag || '🇧🇩',
    photoUrl: apiUser.photoUrl || apiUser.profile?.photoUrl || '',
    isVerified: !!apiUser.isVerified,
    matchPercentage: apiUser.profile?.matchPercentage ?? 85,
    bio: apiUser.profile?.bio || '',
    trustScore: apiUser.profile?.trustScore ?? 80,
    subscriptionExpiresAt: apiUser.profile?.subscriptionExpiresAt,
    isSubscriptionActive: apiUser.profile?.isSubscriptionActive ?? false,
    userRole: apiUser.userRole || 'FREE',
    createdAt: apiUser.createdAt || '',
    photoPrivacy: 'PUBLIC',
    matchReasons: [],
    partnerPreferences: {
      ageRange: '',
      maritalStatuses: [],
      religion: '',
      minHeight: '',
      education: '',
      location: '',
    },
    membershipTier: apiUser.userRole === 'PAID' || apiUser.profile?.isSubscriptionActive ? 'Premium' : 'Free',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshSession = useCallback(async (): Promise<Profile | null> => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const profile = mapApiUserToProfile(data.user);
          const role: UserRole =
            data.user.userRole === 'ADMIN'
              ? 'ADMIN'
              : data.user.userRole === 'PAID'
              ? 'PREMIUM'
              : 'FREE';
          setCurrentUser(profile);
          setUserRole(role);
          if (typeof window !== 'undefined') {
            localStorage.setItem(ROLE_STORAGE_KEY, role);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
          }
          return profile;
        }
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const restore = async () => {
      // Prefer the real server session; localStorage is only a fast-path fallback.
      const profile = await refreshSession();
      if (profile) return;

      if (typeof window !== 'undefined') {
        const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
        const savedUserStr = localStorage.getItem(USER_STORAGE_KEY);

        if (savedUserStr) {
          try {
            const parsedUser = JSON.parse(savedUserStr);
            if (parsedUser && parsedUser.id) {
              const isSubExpired =
                parsedUser.subscriptionExpiresAt &&
                new Date(parsedUser.subscriptionExpiresAt).getTime() < Date.now();
              const activeRole = isSubExpired
                ? 'EXPIRED'
                : savedRole && savedRole !== 'GUEST'
                ? savedRole
                : 'FREE';
              setCurrentUser(parsedUser);
              setUserRole(activeRole);
              return;
            }
          } catch (e) {}
        }
        setUserRole('GUEST');
        setCurrentUser(null);
      }
    };
    restore();
  }, [refreshSession]);

  const setRole = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
  };

  const login = (userObj?: any, role: UserRole = 'FREE') => {
    if (!userObj) return;

    const isSubExpired =
      userObj.subscriptionExpiresAt &&
      new Date(userObj.subscriptionExpiresAt).getTime() < Date.now();
    const effectiveRole: UserRole = isSubExpired ? 'EXPIRED' : role || 'FREE';

    setCurrentUser(userObj);
    setUserRole(effectiveRole);

    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, effectiveRole);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
    }
  };

  const logout = () => {
    // Invalidate the httpOnly session cookie server-side (best effort).
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUserRole('GUEST');
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, 'GUEST');
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('2ndchance_user_session');
      localStorage.removeItem('2ndnikah_admin_authenticated');
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

  const isLoggedIn = mounted ? currentUser !== null && userRole !== 'GUEST' : false;

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isLoggedIn,
        currentUser,
        setRole,
        login,
        logout,
        refreshSession,
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