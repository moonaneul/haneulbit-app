import { MOCK_STUDENT_STATUSES } from './teacherHomeData';

/** 선생님이 사전 등록한 학생 계정 한 명입니다. */
export interface ManagedStudent {
  id: string;
  name: string;
  avatar: string;
  registeredAt: string;
}

// 대시보드 로스터와 같은 12명을 가리키도록 이름·아바타를 그대로 가져와 씁니다.
export const MOCK_MANAGED_STUDENTS: ManagedStudent[] = MOCK_STUDENT_STATUSES.map((student) => ({
  id: student.id,
  name: student.name,
  avatar: student.avatar,
  registeredAt: '2026년 3월 새 학기 등록',
}));

// PROJECT_RULES.md: "학생 12명 사전 계정 생성 (초기 PIN 0000 발급)"
export const DEFAULT_STUDENT_PIN = '0000';

// 새 학생을 등록할 때 고를 수 있는 아바타 이모지 후보입니다.
export const AVATAR_OPTIONS = ['👧🏻', '👦🏻', '👧🏽', '🧒🏻', '👧🏼', '👦🏽', '🧒🏽', '👦🏼'];
