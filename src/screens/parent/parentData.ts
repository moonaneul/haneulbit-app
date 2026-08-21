/** 부모님 계정과 연동된 자녀 정보입니다. */
export interface LinkedChild {
  id: string;
  name: string;
  avatar: string;
  grade: string;
}

// Supabase 연동 전, 로그인 시 자녀 연동 코드로 찾은 것처럼 보이는 Mock 자녀입니다.
export const MOCK_LINKED_CHILD: LinkedChild = {
  id: 'student-01', name: '김하늘', avatar: '👧🏻', grade: '초등부 3학년',
};

/** 자녀가 QT 후 남긴 한 줄 성찰 기록입니다. */
export interface QtReflection {
  id: string;
  date: string;
  reference: string;
  reflection: string;
}

/** 월간 영적 자람 리포트 한 건입니다. */
export interface MonthlyReport {
  month: number;
  completedDays: number;
  totalDaysSoFar: number;
  reflections: QtReflection[];
}

// Supabase 연동 전, 자녀의 이번 달 QT 이행률과 성찰 기록을 보여 주는 Mock 데이터입니다.
export const MOCK_MONTHLY_REPORT: MonthlyReport = {
  month: 8,
  completedDays: 16,
  totalDaysSoFar: 21,
  reflections: [
    { id: 'r1', date: '8월 21일', reference: '빌립보서 4장 13절', reflection: '어려운 일이 생겨도 예수님이 힘을 주신다는 걸 믿고 용기를 내 봤어요!' },
    { id: 'r2', date: '8월 20일', reference: '시편 23편 1절', reflection: '하나님이 목자처럼 저를 지켜주신다는 게 든든했어요.' },
    { id: 'r3', date: '8월 19일', reference: '요한복음 3장 16절', reflection: '하나님이 저를 정말 많이 사랑하신다는 걸 다시 느꼈어요 🌸' },
  ],
};

export type HomeMissionStatus = 'pending' | 'approved';

/** 가정에서 실천한 뒤 부모님의 도장 승인을 기다리는 미션입니다. */
export interface HomeMission {
  id: string;
  emoji: string;
  title: string;
  childNote: string;
  submittedAt: string;
  status: HomeMissionStatus;
}

// Supabase 연동 전, 자녀가 스스로 실천을 완료로 표시한 것처럼 보이는 Mock 가정 미션입니다.
export const MOCK_HOME_MISSIONS: HomeMission[] = [
  {
    id: 'mission-1', emoji: '🙏', title: '가족과 함께 식사 기도하기',
    childNote: '오늘 저녁에 온 가족이 손잡고 기도했어요!',
    submittedAt: '오늘', status: 'pending',
  },
  {
    id: 'mission-2', emoji: '📖', title: '성경 한 구절 외우기',
    childNote: '요한복음 3장 16절을 다 외웠어요.',
    submittedAt: '어제', status: 'approved',
  },
  {
    id: 'mission-3', emoji: '🧹', title: '부모님 심부름 돕기',
    childNote: '설거지랑 방 청소를 도와드렸어요!',
    submittedAt: '2일 전', status: 'approved',
  },
];
