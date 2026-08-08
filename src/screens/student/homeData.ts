import { COLORS } from '@/constants/theme';

export interface StudentProfile {
  name: string;
  streakDays: number;
  talentPoints: number;
}

export interface StudentMission {
  id: 'qt' | 'wwjd' | 'gratitude' | 'talk';
  emoji: string;
  title: string;
  description: string;
  color: string;
}

// DB 연결 전 화면을 바로 확인할 수 있도록 사용하는 학생 정보입니다.
export const MOCK_STUDENT: StudentProfile = {
  name: '김하늘',
  streakDays: 5,
  talentPoints: 150,
};

// 각 미션은 디자인 시스템의 파스텔 색상과 연결합니다.
export const STUDENT_MISSIONS: StudentMission[] = [
  { id: 'qt', emoji: '📖', title: '3분 QT', description: '오늘의 말씀 만나기', color: COLORS.accentSoft },
  { id: 'wwjd', emoji: '🚦', title: '2단계 WWJD 퀴즈', description: '예수님이라면 어떻게?', color: '#F1F7EA' },
  { id: 'gratitude', emoji: '📸', title: '감사 보물상자', description: '감사한 순간 담기', color: COLORS.primarySoft },
  { id: 'talk', emoji: '💬', title: '하늘빛 마음 톡', description: '선생님과 1:1 상담', color: '#FFF8E4' },
];
