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

export type VideoCategory = 'dance' | 'bible';

/** 선생님이 추천한 율동/성경 이야기 영상 한 편입니다. */
export interface RecommendedVideo {
  id: string;
  category: VideoCategory;
  title: string;
  duration: string;
  thumbnailEmoji: string;
  thumbnailColor: string;
  youtubeUrl: string;
}

// Supabase 연동 전, 선생님이 등록한 것처럼 보이는 예시 추천 영상입니다.
// 실제 서비스에서는 선생님이 등록한 정확한 영상 링크(youtube.com/watch?v=...)가 들어가며,
// 지금은 존재하지 않는 영상 ID를 지어내는 대신 실제로 열리는 유튜브 검색 링크를 사용합니다.
export const MOCK_VIDEOS: RecommendedVideo[] = [
  {
    id: 'video-1', category: 'dance', title: '만나 송 함께 춤춰요 🎵',
    duration: '3:12', thumbnailEmoji: '🕺', thumbnailColor: '#FFF2ED',
    youtubeUrl: 'https://www.youtube.com/results?search_query=어린이+찬양+율동+만나',
  },
  {
    id: 'video-2', category: 'dance', title: '예수 사랑하심은 율동',
    duration: '2:45', thumbnailEmoji: '💃', thumbnailColor: '#EFF7F4',
    youtubeUrl: 'https://www.youtube.com/results?search_query=예수+사랑하심은+어린이+율동',
  },
  {
    id: 'video-3', category: 'bible', title: '다윗과 골리앗 이야기',
    duration: '5:30', thumbnailEmoji: '🪨', thumbnailColor: '#F2EEE9',
    youtubeUrl: 'https://www.youtube.com/results?search_query=다윗과+골리앗+어린이+성경+이야기',
  },
  {
    id: 'video-4', category: 'bible', title: '노아의 방주 이야기',
    duration: '4:50', thumbnailEmoji: '🐘', thumbnailColor: '#EAF4DE',
    youtubeUrl: 'https://www.youtube.com/results?search_query=노아의+방주+어린이+성경+이야기',
  },
];

export { containsUnsafeLanguage } from '@/data/contentSafety';
