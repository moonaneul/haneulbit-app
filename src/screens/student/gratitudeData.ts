export type ReactionKey = 'pray' | 'amen' | 'great';

export interface GratitudePost {
  id: string;
  name: string;
  avatar: string;
  photoEmoji: string;
  photoColor: string;
  title: string;
  reactions: Record<ReactionKey, number>;
}

// Supabase 연동 전에도 피드와 응원 기능을 확인할 수 있는 예시 게시물입니다.
export const MOCK_GRATITUDE_POSTS: GratitudePost[] = [
  {
    id: 'post-1', name: '사랑이', avatar: '🐥', photoEmoji: '🌈', photoColor: '#EFF7F4',
    title: '비 온 뒤 예쁜 무지개를 보여 주셔서 감사해요!',
    reactions: { pray: 2, amen: 5, great: 3 },
  },
  {
    id: 'post-2', name: '믿음이', avatar: '🐻', photoEmoji: '🐶', photoColor: '#FFF2ED',
    title: '강아지와 즐겁게 산책해서 감사해요!',
    reactions: { pray: 4, amen: 3, great: 6 },
  },
];

export const REACTION_OPTIONS: { key: ReactionKey; label: string }[] = [
  { key: 'pray', label: '기도할게 🙏' },
  { key: 'amen', label: '아멘 🤍' },
  { key: 'great', label: '멋져요 👍' },
];

// 실제 서비스에서는 이 1차 검사 뒤 서버의 AI 검수를 한 번 더 거칩니다.
const UNSAFE_WORDS = ['바보', '멍청', '죽어', '꺼져'];

export const containsUnsafeLanguage = (text: string) =>
  UNSAFE_WORDS.some((word) => text.replace(/\s/g, '').includes(word));
