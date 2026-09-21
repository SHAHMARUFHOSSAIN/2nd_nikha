import { db } from '@/lib/db';

export function buildMatchId(id1: string, id2: string): string {
  if (!id1 || !id2) return id1 || id2 || 'match-default';
  const cleanId1 = id1.replace(/^match[-_]/, '');
  const cleanId2 = id2.replace(/^match[-_]/, '');
  const sorted = [cleanId1, cleanId2].sort();
  return `match_${sorted[0]}_${sorted[1]}`;
}

export function parseMatchId(matchId: string): [string, string] | null {
  if (!matchId) return null;
  const clean = matchId.replace(/^match[-_]/, '');
  const parts = clean.split('_').filter(Boolean);
  if (parts.length < 2) return null;
  return [parts[0], parts.slice(1).join('_')];
}

export function mapProfile(user: any): any {
  if (!user) return null;
  const p = user.profile || {};
  const location = p.location || [p.city, user.country].filter(Boolean).join(', ');
  return {
    id: user.id,
    fullName: user.fullName || 'Member',
    email: user.email || '',
    phone: user.phone || '',
    age: p.age ?? 30,
    gender: p.gender || 'Female',
    height: p.height || "5'5\"",
    maritalStatus: p.maritalStatus || 'Divorced',
    religion: p.religion || 'Islam',
    motherTongue: p.motherTongue || '',
    location: location || 'Bangladesh',
    city: p.city || user.country || '',
    country: user.country || 'Bangladesh',
    countryFlag: user.countryFlag || '🌐',
    education: p.education || '',
    institution: p.institution || '',
    profession: p.profession || '',
    company: p.company || '',
    bio: p.bio || '',
    photoUrl: p.photoUrl || user.photoUrl || '/images/default-avatar.jpg',
    additionalPhotos: p.additionalPhotos || [],
    partnerPreferences: p.partnerPreferences || null,
    matchReasons: p.matchReasons || [],
    photoPrivacy: p.photoPrivacy || 'PUBLIC',
    isVerified: Boolean(user.isVerified),
    matchPercentage: p.matchPercentage ?? 85,
    trustScore: p.trustScore ?? 80,
    membershipTier: user.userRole === 'PREMIUM' ? 'Premium' : user.userRole === 'ADMIN' ? 'Admin' : 'Free',
    createdAt: user.createdAt,
  };
}

const PROFILE_INCLUDE = { profile: true } as const;

export async function ensureConversation(userId: string, partnerId: string) {
  if (!userId || !partnerId || userId === partnerId) return null;
  const [userAId, userBId] = [userId, partnerId].sort();

  const existing = await db.conversation.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });
  if (existing) return existing;

  try {
    return await db.conversation.create({ data: { userAId, userBId } });
  } catch {
    return db.conversation.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
    });
  }
}

export async function isBlockedBetween(userId: string, partnerId: string) {
  const block = await db.blockedUser.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: partnerId },
        { blockerId: partnerId, blockedId: userId },
      ],
    },
  });
  return block || null;
}

export async function loadPartnerProfile(partnerId: string) {
  const user = await db.user.findUnique({
    where: { id: partnerId },
    include: PROFILE_INCLUDE,
  });
  return mapProfile(user);
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function mapMessage(m: any): any {
  return {
    id: m.id,
    matchId: m.matchId,
    senderId: m.senderId,
    receiverId: m.receiverId,
    content: m.content,
    type: m.type,
    status: m.status,
    mediaUrl: m.mediaUrl || undefined,
    contactDetails: m.contactDetails || undefined,
    createdAt: formatTime(m.createdAt),
  };
}

export function mapConversation(conv: any, me: string, partnerProfile: any, lastMessage: any, unreadCount: number, block: any): any {
  const partnerId = conv.userAId === me ? conv.userBId : conv.userAId;
  const matchId = buildMatchId(conv.userAId, conv.userBId);
  const blockedBy = block ? block.blockerId : undefined;
  return {
    id: conv.id,
    matchId,
    partnerId,
    participantIds: [conv.userAId, conv.userBId],
    lastMessage: lastMessage ? lastMessage.content : '',
    lastMessageAt: formatTime(lastMessage ? lastMessage.createdAt : conv.lastMessageAt),
    lastSenderId: lastMessage ? lastMessage.senderId : undefined,
    unreadCount,
    unreadCounts: { [me]: 0, [partnerId]: unreadCount },
    status: block ? 'BLOCKED' : 'ACTIVE',
    blockedBy,
    profile: partnerProfile,
  };
}

export async function resolveMatchId(rawId: string): Promise<{ matchId: string; userAId: string; userBId: string } | null> {
  const parsed = parseMatchId(rawId);
  if (parsed) {
    return { matchId: buildMatchId(parsed[0], parsed[1]), userAId: parsed[0], userBId: parsed[1] };
  }
  const conv = await db.conversation.findUnique({ where: { id: rawId } });
  if (conv) {
    return { matchId: buildMatchId(conv.userAId, conv.userBId), userAId: conv.userAId, userBId: conv.userBId };
  }
  return null;
}
