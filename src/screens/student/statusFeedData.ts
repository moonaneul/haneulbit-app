/** 우리 마을 마음 게시판에 표시되는 한 명의 한 줄 상태메시지입니다. */
export interface CommunityStatusPost {
  id: string;
  name: string;
  avatar: string;
  message: string;
}

/** Supabase 연동 전 12명 전체 공동체 공개 피드를 확인하기 위한 Mock 데이터입니다. */
export const MOCK_COMMUNITY_STATUS_POSTS: CommunityStatusPost[] = [
  { id: 'student-02', name: '이사랑', avatar: '👦🏻', message: '오늘도 웃으며 친구들에게 먼저 인사할래요! 😊' },
  { id: 'student-03', name: '박은혜', avatar: '👧🏽', message: '엄마 말씀 잘 듣는 하루 보내기로 다짐했어요 🌸' },
  { id: 'student-04', name: '최다윗', avatar: '🧒🏻', message: '골리앗도 이긴 다윗처럼 오늘도 용기 낼래요!' },
  { id: 'student-05', name: '정소망', avatar: '👧🏻', message: '동생이랑 안 싸우고 사이좋게 지내게 해주세요 🙏' },
  { id: 'student-06', name: '한요셉', avatar: '👦🏽', message: '시험 잘 보게 도와주셔서 감사해요 🕊️' },
  { id: 'student-07', name: '윤샬롬', avatar: '👧🏻', message: '아픈 할머니가 빨리 나으시길 기도해요' },
  { id: 'student-08', name: '오이삭', avatar: '👦🏻', message: '오늘 급식 반찬 다 남기지 않고 먹을게요 😆' },
  { id: 'student-09', name: '장온유', avatar: '👧🏽', message: '친구가 슬퍼 보이면 먼저 다가가 물어볼래요' },
  { id: 'student-10', name: '임찬양', avatar: '🧒🏽', message: '피아노 학원 가기 싫어도 힘내 볼게요 🎹' },
  { id: 'student-11', name: '서기쁨', avatar: '👧🏻', message: '오늘 배운 말씀 한 구절 외워볼래요!' },
  { id: 'student-12', name: '문예준', avatar: '👦🏻', message: '동생 숙제 도와주는 멋진 형이 될래요 💪' },
];
