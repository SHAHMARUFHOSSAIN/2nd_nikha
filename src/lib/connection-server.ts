import { mapProfile, buildMatchId, formatTime } from '@/lib/chat-server';

const USER_INCLUDE = { profile: true } as const;
export { USER_INCLUDE };

export function mapInterest(i: any, me: string) {
  const status =
    i.status === 'PENDING' ? (i.senderId === me ? 'SENT' : 'PENDING') : i.status;
  return {
    id: i.id,
    senderId: i.senderId,
    receiverId: i.receiverId,
    senderProfile: mapProfile(i.sender),
    receiverProfile: mapProfile(i.receiver),
    status,
    message: i.message || undefined,
    createdAt: formatTime(i.createdAt),
    updatedAt: formatTime(i.updatedAt),
  };
}

export function mapMatch(m: any, me: string) {
  const partner = m.userAId === me ? m.userB : m.userA;
  const matchId = buildMatchId(m.userAId, m.userBId);
  return {
    id: matchId,
    matchId,
    userOneId: m.userAId,
    userTwoId: m.userBId,
    profile: mapProfile(partner),
    compatibilityScore: m.matchScore ?? 85,
    matchedAt: formatTime(m.createdAt),
    status: m.status || 'ACTIVE',
  };
}
