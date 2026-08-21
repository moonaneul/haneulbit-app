/** 내가 이번 주 몰래 기도해 줄 마니또 친구입니다. */
export interface ManitoBuddy {
  id: string;
  name: string;
  avatar: string;
}

// Supabase 연동 전, 선생님이 이번 주 배정한 것처럼 보이는 Mock 마니또 대상입니다.
export const MY_MANITO_BUDDY: ManitoBuddy = { id: 'student-09', name: '장온유', avatar: '👧🏽' };

/** 누군가 나를 위해 몰래 보내 준 익명의 기도 편지입니다. */
export interface ReceivedPrayer {
  id: string;
  message: string;
  receivedAt: string;
}

// Supabase 연동 전, 다른 친구가 나의 마니또여서 보내 준 것처럼 보이는 Mock 편지함입니다.
export const MOCK_RECEIVED_PRAYERS: ReceivedPrayer[] = [
  { id: 'prayer-1', message: '네가 오늘도 씩씩하게 하루를 보내길 기도할게! 🌱', receivedAt: '어제' },
  { id: 'prayer-2', message: '요즘 힘든 일이 있어도 하나님이 항상 함께하실 거야. 힘내! 💛', receivedAt: '2일 전' },
];
