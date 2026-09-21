'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Profile } from '@/types';

interface AuthContextType {
  userRole: UserRole;
  isLoggedIn: boolean;
  currentUser: Profile | null;
  sessionReady: boolean;
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
  sessionReady: false,
  setRole: () => {},
  login: () => {},
  logout: () => {},
  refreshSession: async () => null,
  shortlistedIds: [],
  toggleShortlist: () => {},
  isShortlisted: () => false,
});

// Obsolete localStorage keys from the previous client-only auth implementation.
// They are cleared on logout but are never read to make auth decisions.
const OBSOLETE_AUTH_KEYS = [
  '2ndchance_user_role',
  '2ndchance_current_user',
  '2ndchance_auth_user',
  '2ndchance_user_session',
  '2ndnikah_admin_authenticated',
  'auth_token',
];

function normalizeRole(apiRole: string | undefined, isSubscriptionActive?: boolean): UserRole {
  if (apiRole === 'ADMIN') return 'ADMIN';
  if (apiRole === 'PREMIUM' || apiRole === 'PAID') return 'PREMIUM';
  if (isSubscriptionActive) return 'PREMIUM';
  return 'FREE';
}

export function mapApiUserToProfile(apiUser: any): Profile {
  const profile = apiUser.profile || {};
  const photos: string[] = Array.isArray(profile.additionalPhotos)
    ? profile.additionalPhotos.filter((p: any) => typeof p === 'string')
    : [];
  const photoUrl = apiUser.photoUrl || profile.photoUrl || photos[0] || '';

  return {
    id: apiUser.id,
    fullName: apiUser.fullName,
    email: apiUser.email,
    phone: apiUser.phone,
    age: profile.age ?? 30,
    gender: profile.gender || 'Female',
    maritalStatus: profile.maritalStatus || 'Divorced',
    hasChildren: false,
    height: profile.height || "5'5\"",
    religion: profile.religion || 'Islam',
    motherTongue: profile.motherTongue || 'Bengali',
    education: profile.education || 'Bachelor Degree',
    profession: profile.profession || 'Professional',
    location: profile.location || 'Dhaka, Bangladesh',
    city: profile.location || 'Dhaka',
    country: apiUser.country || 'Bangladesh',
    countryFlag: apiUser.countryFlag || '🇧🇩',
    photoUrl,
    photos: photoUrl ? [photoUrl, ...photos] : photos,
    additionalPhotos: photos,
    isVerified: !!apiUser.isVerified,
    emailVerifiedAt: apiUser.emailVerifiedAt || null,
    matchPercentage: profile.matchPercentage ?? 85,
    bio: profile.bio || '',
    trustScore: profile.trustScore ?? 80,
    subscriptionExpiresAt: profile.subscriptionExpiresAt,
    isSubscriptionActive: profile.isSubscriptionActive ?? false,
    userRole: apiUser.userRole || 'FREE',
    createdAt: apiUser.createdAt || '',
    photoPrivacy: profile.photoPrivacy || 'PUBLIC',
    matchReasons: Array.isArray(profile.matchReasons) ? profile.matchReasons : [],
    partnerPreferences: profile.partnerPreferences || {
      ageRange: '',
      maritalStatuses: [],
      religion: '',
      minHeight: '',
      education: '',
      location: '',
    },
    membershipTier:
      apiUser.userRole === 'PREMIUM' || apiUser.userRole === 'PAID' || profile.isSubscriptionActive
        ? 'Premium'
        : 'Free',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sessionReady, setSessionReady] = useState(false);

  const refreshSession = useCallback(async (): Promise<Profile | null> => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const profile = mapApiUserToProfile(data.user);
          setCurrentUser(profile);
          setUserRole(normalizeRole(data.user.userRole, data.user.profile?.isSubscriptionActive));
          return profile;
        }
      }
      setCurrentUser(null);
      setUserRole('GUEST');
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await refreshSession();
      if (active) setSessionReady(true);
    })();
    return () => {
      active = false;
    };
  }, [refreshSession]);

  useEffect(() => {
    if (!sessionReady || !currentUser) return;
    (async () => {
      try {
        const res = await fetch('/api/shortlists', { credentials: 'include', cache: 'no-store' });
        const json = await res.json().catch(() => null);
        if (json?.success) setShortlistedIds(json.shortlistedIds || []);
      } catch {}
    })();
  }, [sessionReady, currentUser]);

  useEffect(() => {
    if (!sessionReady || !currentUser) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/shortlists', { credentials: 'include', cache: 'no-store' });
        const json = await res.json().catch(() => null);
        if (active && json?.success) setShortlistedIds(json.shortlistedIds || []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, [sessionReady, currentUser]);

  const setRole = (role: UserRole) => {
    setUserRole(role);
  };

  const login = (userObj?: any, role: UserRole = 'FREE') => {
    if (!userObj) return;
    const isSubExpired =
      userObj.subscriptionExpiresAt &&
      new Date(userObj.subscriptionExpiresAt).getTime() < Date.now();
    const effectiveRole: UserRole = isSubExpired ? 'EXPIRED' : role || 'FREE';
    setCurrentUser(userObj);
    setUserRole(effectiveRole);
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUserRole('GUEST');
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      for (const key of OBSOLETE_AUTH_KEYS) {
        try {
          localStorage.removeItem(key);
        } catch {
          /* ignore storage errors */
        }
      }
    }
  };

  const toggleShortlist = (profileId: string) => {
    setShortlistedIds((prev) => {
      const isAdding = !prev.includes(profileId);
      if (isAdding) {
        fetch('/api/shortlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ profileId }),
        }).catch(() => {});
      } else {
        fetch(`/api/shortlists?profileId=${encodeURIComponent(profileId)}`, {
          method: 'DELETE',
          credentials: 'include',
        }).catch(() => {});
      }
      return isAdding ? [...prev, profileId] : prev.filter((id) => id !== profileId);
    });
  };

  const isShortlisted = (profileId: string) => shortlistedIds.includes(profileId);

  const isLoggedIn = sessionReady ? currentUser !== null && userRole !== 'GUEST' : false;

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isLoggedIn,
        currentUser,
        sessionReady,
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
