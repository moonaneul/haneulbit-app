export { containsUnsafeLanguage } from '@/data/contentSafety';
export { REACTION_OPTIONS, type ReactionKey } from '@/data/reactions';

/** Supabase 주간 QT 템플릿이 연결되기 전 사용하는 화면용 데이터입니다. */
export interface DailyQtContent {
  reference: string;
  verse: string;
  teacherMessage: string;
  mockDurationSeconds: number;
}

export interface FriendQtPost {
  id: string;
  name: string;
  reflection: string;
}

export const TODAY_QT: DailyQtContent = {
  reference: '빌립보서 4장 13절',
  verse: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.',
  teacherMessage:
    '하늘빛 친구들, 오늘 어려운 일이 생겨도 혼자가 아니에요. 예수님이 주시는 힘을 믿고 작은 일부터 용기 내어 시작해 보아요! 🌱',
  mockDurationSeconds: 24,
};

/** Supabase 피드 연결 전 잠금 해제 흐름을 확인하기 위한 친구 나눔입니다. */
export const MOCK_FRIEND_QT_POSTS: FriendQtPost[] = [
  {
    id: 'minjun',
    name: '김민준',
    reflection: '오늘 하나님이 나와 늘 함께 계신다는 말씀에 용기가 났어요! 🌸',
  },
  {
    id: 'seoyeon',
    name: '이서연',
    reflection: '힘든 숙제도 예수님께 기도하며 끝까지 해 볼래요. 🌱',
  },
  {
    id: 'jiho',
    name: '박지호',
    reflection: '친구가 어려울 때 먼저 다가가 도와주는 사람이 되고 싶어요! 💛',
  },
];
