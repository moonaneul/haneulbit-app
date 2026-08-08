/** Supabase 주간 QT 템플릿이 연결되기 전 사용하는 화면용 데이터입니다. */
export interface DailyQtContent {
  reference: string;
  verse: string;
  teacherMessage: string;
  mockDurationSeconds: number;
}

export const TODAY_QT: DailyQtContent = {
  reference: '빌립보서 4장 13절',
  verse: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.',
  teacherMessage:
    '하늘빛 친구들, 오늘 어려운 일이 생겨도 혼자가 아니에요. 예수님이 주시는 힘을 믿고 작은 일부터 용기 내어 시작해 보아요! 🌱',
  mockDurationSeconds: 24,
};

// 실제 서비스에서는 이 목록을 서버의 AI 언어 감지 결과와 함께 사용합니다.
const BLOCKED_WORDS = ['바보', '멍청', '죽어', '꺼져', '시발', '씨발'];

/** 띄어쓰기로 필터를 피하지 못하도록 공백을 제거한 뒤 1차 확인합니다. */
export function containsUnsafeLanguage(value: string) {
  const normalized = value.toLowerCase().replace(/\s/g, '');
  return BLOCKED_WORDS.some((word) => normalized.includes(word));
}
