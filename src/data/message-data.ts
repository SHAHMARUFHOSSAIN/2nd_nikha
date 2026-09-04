import { Conversation, Message, SharedPhoto } from '@/types';
import { MOCK_PROFILES } from './mock-data';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-201',
    matchId: 'match-201',
    participantIds: ['p-101', 'p-103'],
    lastMessage: 'I agree! I have shared my WhatsApp number so our families can talk.',
    lastMessageAt: '10:25 AM',
    unreadCount: 2,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[2], // Nusrat Jahan (Boston USA)
  },
  {
    id: 'conv-202',
    matchId: 'match-202',
    participantIds: ['p-101', 'p-106'],
    lastMessage: 'Thank you for accepting my interest ❤️ Looking forward to our conversation.',
    lastMessageAt: '11:40 AM',
    unreadCount: 0,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[5], // Dr. Tariqul Islam (Dubai UAE)
  },
  {
    id: 'conv-203',
    matchId: 'match-203',
    participantIds: ['p-101', 'p-102'],
    lastMessage: 'Assalamu Alaikum! I liked your profile and career achievements.',
    lastMessageAt: 'Yesterday',
    unreadCount: 1,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[1], // Tanvir Hossain (Dhaka)
  },
  {
    id: 'conv-204',
    matchId: 'match-204',
    participantIds: ['p-101', 'p-104'],
    lastMessage: 'Hello! I saw you are living in London. My family is also looking for an expat candidate.',
    lastMessageAt: 'Yesterday',
    unreadCount: 0,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[3], // Mahmudul Hasan (London UK)
  },
  {
    id: 'conv-205',
    matchId: 'match-205',
    participantIds: ['p-101', 'p-105'],
    lastMessage: 'Hello! Nice to meet you on 2nd Chance Matrimonial platform.',
    lastMessageAt: '2 days ago',
    unreadCount: 0,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[4], // Farhana Yasmin (Dhaka)
  },
  {
    id: 'conv-206',
    matchId: 'match-206',
    participantIds: ['p-101', 'p-107'],
    lastMessage: 'Assalamu Alaikum! Would love to connect and discuss family values.',
    lastMessageAt: '3 days ago',
    unreadCount: 0,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[6], // Syeda Sadia Rahman (Dhaka)
  },
  {
    id: 'conv-207',
    matchId: 'match-207',
    participantIds: ['p-101', 'p-108'],
    lastMessage: 'Hello Imran Saheb! My family expressed interest in your profile.',
    lastMessageAt: 'Feb 15',
    unreadCount: 0,
    status: 'ACTIVE',
    profile: MOCK_PROFILES[7], // Kazi Imran Hossain (Saudi Arabia)
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'match-201': [
    {
      id: 'msg-1',
      matchId: 'match-201',
      senderId: 'p-103',
      receiverId: 'p-101',
      content: 'Hello Anika! I read your profile and felt deeply moved by your story and family values.',
      type: 'TEXT',
      status: 'READ',
      createdAt: '10:15 AM',
    },
    {
      id: 'msg-2',
      matchId: 'match-201',
      senderId: 'p-101',
      receiverId: 'p-103',
      content: 'Hello Nusrat! Thank you for accepting my interest. I appreciated reading about your medical career and parenting journey as well.',
      type: 'TEXT',
      status: 'READ',
      createdAt: '10:20 AM',
    },
    {
      id: 'msg-3',
      matchId: 'match-201',
      senderId: 'p-103',
      receiverId: 'p-101',
      content: 'I agree! I have shared my WhatsApp number so our families can talk.',
      type: 'CONTACT',
      status: 'READ',
      createdAt: '10:25 AM',
      contactDetails: {
        phone: '+880 1712-345678',
        whatsapp: '+880 1712-345678',
        email: 'nusrat.jahan@example.com',
      },
    },
  ],
  'match-202': [
    {
      id: 'msg-4',
      matchId: 'match-202',
      senderId: 'p-106',
      receiverId: 'p-101',
      content: 'Thank you for accepting my interest ❤️ Looking forward to our conversation.',
      type: 'TEXT',
      status: 'READ',
      createdAt: '11:40 AM',
    },
  ],
  'match-203': [
    {
      id: 'msg-5',
      matchId: 'match-203',
      senderId: 'p-102',
      receiverId: 'p-101',
      content: 'Assalamu Alaikum Anika! Thank you for sending express interest. I am glad to connect with you.',
      type: 'TEXT',
      status: 'READ',
      createdAt: 'Yesterday',
    },
  ],
  'match-204': [
    {
      id: 'msg-6',
      matchId: 'match-204',
      senderId: 'p-104',
      receiverId: 'p-101',
      content: 'Hello! Thank you for expressing interest. I live in London and work in FinTech. Looking forward to talking with your family.',
      type: 'TEXT',
      status: 'READ',
      createdAt: 'Yesterday',
    },
  ],
  'match-205': [
    {
      id: 'msg-7',
      matchId: 'match-205',
      senderId: 'p-105',
      receiverId: 'p-101',
      content: 'Hello! Nice to meet you on 2nd Chance Matrimonial platform.',
      type: 'TEXT',
      status: 'READ',
      createdAt: '2 days ago',
    },
  ],
  'match-206': [
    {
      id: 'msg-8',
      matchId: 'match-206',
      senderId: 'p-107',
      receiverId: 'p-101',
      content: 'Assalamu Alaikum! Would love to connect and discuss family values.',
      type: 'TEXT',
      status: 'READ',
      createdAt: '3 days ago',
    },
  ],
  'match-207': [
    {
      id: 'msg-9',
      matchId: 'match-207',
      senderId: 'p-108',
      receiverId: 'p-101',
      content: 'Hello Imran Saheb! My family expressed interest in your profile.',
      type: 'TEXT',
      status: 'READ',
      createdAt: 'Feb 15',
    },
  ],
};

export const MOCK_SHARED_PHOTOS: Record<string, SharedPhoto[]> = {
  'match-201': [
    {
      id: 'sp-1',
      matchId: 'match-201',
      senderId: 'p-103',
      url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
      createdAt: 'Feb 16, 2026',
      privacy: 'MATCH_ONLY',
    },
    {
      id: 'sp-2',
      matchId: 'match-201',
      senderId: 'p-101',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      createdAt: 'Feb 17, 2026',
      privacy: 'MATCH_ONLY',
    },
  ],
};
