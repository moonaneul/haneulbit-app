// Supabase 연결 전 로그인 화면에서 사용할 학생 예시 목록입니다.
// 나중에는 이 배열 대신 학생 테이블에서 받아온 데이터를 넣으면 됩니다.
export const MOCK_STUDENTS = [
  { id: 'student-haneul', name: '하늘이', emoji: '🐰' },
  { id: 'student-sarang', name: '사랑이', emoji: '🐥' },
  { id: 'student-mideum', name: '믿음이', emoji: '🐻' },
];

// 개발 중 로그인 흐름을 확인하기 위한 임시 PIN입니다.
// 실제 서비스에서는 PIN을 앱 코드에 저장하지 않고 서버에서 안전하게 확인해야 합니다.
export const MOCK_LOGIN_PIN = '0000';
