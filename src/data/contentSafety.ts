// 학생이 글을 작성하는 모든 화면(QT 나눔, 감사 보물상자, 마음 톡, 상태메시지, 마니또 등)이
// 공통으로 쓰는 클라이언트 측 1차 비속어 필터입니다.
// 실제 서비스에서는 이 필터를 통과한 뒤에도 서버의 AI Moderation 검수를 한 번 더 거칩니다.
const UNSAFE_WORDS = ['바보', '멍청', '죽어', '꺼져', '싫어', '시발', '씨발'];

/** 띄어쓰기로 필터를 피하지 못하도록 공백을 제거한 뒤 확인합니다. */
export function containsUnsafeLanguage(value: string) {
  const normalized = value.toLowerCase().replace(/\s/g, '');
  return UNSAFE_WORDS.some((word) => normalized.includes(word));
}
