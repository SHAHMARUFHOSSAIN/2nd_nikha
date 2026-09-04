import { Interest, Match } from '@/types';
import { MOCK_PROFILES } from './mock-data';

export const INITIAL_MOCK_INTERESTS: Interest[] = [
  {
    id: 'int-101',
    senderId: 'p-102', // Tanvir Hossain
    receiverId: 'p-101', // Anika Rahman
    senderProfile: MOCK_PROFILES[1],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '2 hours ago',
  },
  {
    id: 'int-102',
    senderId: 'p-103', // Nusrat Jahan
    receiverId: 'p-101',
    senderProfile: MOCK_PROFILES[2],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '1 day ago',
  },
  {
    id: 'int-103',
    senderId: 'p-104', // Mahmudul Hasan
    receiverId: 'p-101',
    senderProfile: MOCK_PROFILES[3],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '2 days ago',
  },
  {
    id: 'int-104',
    senderId: 'p-105', // Farhana Yasmin
    receiverId: 'p-101',
    senderProfile: MOCK_PROFILES[4],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '3 days ago',
  },
  {
    id: 'int-105',
    senderId: 'p-106', // Dr. Tariqul Islam
    receiverId: 'p-101',
    senderProfile: MOCK_PROFILES[5],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '4 days ago',
  },
  {
    id: 'int-106',
    senderId: 'p-107', // Syeda Sadia Rahman
    receiverId: 'p-101',
    senderProfile: MOCK_PROFILES[6],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '5 days ago',
  },
  {
    id: 'int-107',
    senderId: 'p-108', // Kazi Imran Hossain
    receiverId: 'p-101',
    senderProfile: MOCK_PROFILES[7],
    receiverProfile: MOCK_PROFILES[0],
    status: 'ACCEPTED',
    createdAt: '1 week ago',
  },
];

export const INITIAL_MOCK_MATCHES: Match[] = [
  {
    id: 'match-201',
    userOneId: 'p-101',
    userTwoId: 'p-103', // Nusrat Jahan
    profile: MOCK_PROFILES[2],
    compatibilityScore: 94,
    matchedAt: 'Matched on Feb 15, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'match-202',
    userOneId: 'p-101',
    userTwoId: 'p-106', // Dr. Tariqul Islam
    profile: MOCK_PROFILES[5],
    compatibilityScore: 92,
    matchedAt: 'Matched on Feb 22, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'match-203',
    userOneId: 'p-101',
    userTwoId: 'p-102', // Tanvir Hossain
    profile: MOCK_PROFILES[1],
    compatibilityScore: 88,
    matchedAt: 'Matched on Feb 24, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'match-204',
    userOneId: 'p-101',
    userTwoId: 'p-104', // Mahmudul Hasan
    profile: MOCK_PROFILES[3],
    compatibilityScore: 95,
    matchedAt: 'Matched on Feb 25, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'match-205',
    userOneId: 'p-101',
    userTwoId: 'p-105', // Farhana Yasmin
    profile: MOCK_PROFILES[4],
    compatibilityScore: 87,
    matchedAt: 'Matched on Feb 26, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'match-206',
    userOneId: 'p-101',
    userTwoId: 'p-107', // Syeda Sadia Rahman
    profile: MOCK_PROFILES[6],
    compatibilityScore: 89,
    matchedAt: 'Matched on Feb 27, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'match-207',
    userOneId: 'p-101',
    userTwoId: 'p-108', // Kazi Imran Hossain
    profile: MOCK_PROFILES[7],
    compatibilityScore: 91,
    matchedAt: 'Matched on Feb 28, 2026',
    status: 'ACTIVE',
  },
];

export const MOCK_INTERESTS = INITIAL_MOCK_INTERESTS;
export const MOCK_MATCHES = INITIAL_MOCK_MATCHES;
