import { UserRole, MatchStatus } from '@/types';

export interface CommunicationPermissionCheck {
  allowed: boolean;
  reason?: 'GUEST_LOGIN_REQUIRED' | 'PREMIUM_REQUIRED' | 'MATCH_REQUIRED' | 'BLOCKED';
  message?: string;
}

export function checkChatPermission(
  userRole: UserRole,
  isMutualMatch: boolean,
  matchStatus?: MatchStatus,
  isBlocked?: boolean
): CommunicationPermissionCheck {
  if (isBlocked) {
    return {
      allowed: false,
      reason: 'BLOCKED',
      message: 'Conversation unavailable. This user or connection has been blocked.',
    };
  }

  if (userRole === 'GUEST') {
    return {
      allowed: false,
      reason: 'GUEST_LOGIN_REQUIRED',
      message: 'Please login or create a free profile to view candidate profiles.',
    };
  }

  if (userRole === 'FREE') {
    return {
      allowed: false,
      reason: 'PREMIUM_REQUIRED',
      message: 'Premium membership allows you to send Interests. Messaging becomes available only after a mutual match.',
    };
  }

  if (!isMutualMatch || matchStatus !== 'ACTIVE') {
    return {
      allowed: false,
      reason: 'MATCH_REQUIRED',
      message: 'Conversation Locked. Messaging becomes available after both members accept the connection.',
    };
  }

  return {
    allowed: true,
  };
}

export function canShareContact(isMutualMatch: boolean, matchStatus?: MatchStatus): boolean {
  return isMutualMatch && matchStatus === 'ACTIVE';
}

export function canSharePhotos(isMutualMatch: boolean, matchStatus?: MatchStatus): boolean {
  return isMutualMatch && matchStatus === 'ACTIVE';
}
