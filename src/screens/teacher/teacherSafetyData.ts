/** 게시글이 올라온 학생용 화면입니다. */
export type SafetySource = 'qt' | 'gratitude' | 'status' | 'manito' | 'mindTalk';

export const SOURCE_LABELS: Record<SafetySource, string> = {
  qt: '3분 QT 나눔',
  gratitude: '감사 보물상자',
  status: '한 줄 상태메시지',
  manito: '마니또 기도 편지',
  mindTalk: '마음 톡',
};

export type FlaggedStatus = 'pending' | 'approved' | 'blocked';

/** AI가 1차로 걸러낸 뒤 선생님의 최종 검수를 기다리는 게시글 한 건입니다. */
export interface FlaggedPost {
  id: string;
  studentName: string;
  studentAvatar: string;
  source: SafetySource;
  content: string;
  flaggedWord: string;
  flaggedAt: string;
  status: FlaggedStatus;
}

// Supabase/AI Moderation 연동 전, 검수함 화면을 확인하기 위한 Mock 데이터입니다.
export const MOCK_FLAGGED_POSTS: FlaggedPost[] = [
  {
    id: 'flag-1', studentName: '박은혜', studentAvatar: '👧🏽', source: 'status',
    content: '오늘 짝꿍이 진짜 바보 같이 굴어서 속상했어요 ㅠㅠ',
    flaggedWord: '바보', flaggedAt: '10분 전', status: 'pending',
  },
  {
    id: 'flag-2', studentName: '임찬양', studentAvatar: '🧒🏽', source: 'gratitude',
    content: '동생이 자꾸 꺼져 라고 해서 감사하기 어려웠지만 그래도 감사해요',
    flaggedWord: '꺼져', flaggedAt: '32분 전', status: 'pending',
  },
  {
    id: 'flag-3', studentName: '윤샬롬', studentAvatar: '👧🏻', source: 'qt',
    content: '오늘 숙제가 너무 많아서 죽어 버리고 싶다는 생각까지 들었어요',
    flaggedWord: '죽어', flaggedAt: '1시간 전', status: 'pending',
  },
  {
    id: 'flag-4', studentName: '오이삭', studentAvatar: '👦🏻', source: 'manito',
    content: '너 진짜 멍청 하지만 그래도 잘 지내길 기도할게 ㅋㅋ',
    flaggedWord: '멍청', flaggedAt: '어제', status: 'approved',
  },
];
