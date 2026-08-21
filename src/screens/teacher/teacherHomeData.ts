/** 선생님 대시보드 한 명의 영적 활동 현황입니다. */
export interface TeacherStudentStatus {
  id: string;
  name: string;
  avatar: string;
  streakDays: number;
  didQt: boolean;
  didQuiz: boolean;
  talentPoints: number;
}

/** DB 연결 전 화면과 상호작용을 확인하기 위한 12명 Mock 데이터입니다. */
export const MOCK_STUDENT_STATUSES: TeacherStudentStatus[] = [
  { id: 'student-01', name: '김하늘', avatar: '👧🏻', streakDays: 7, didQt: true, didQuiz: true, talentPoints: 340 },
  { id: 'student-02', name: '이사랑', avatar: '👦🏻', streakDays: 12, didQt: true, didQuiz: true, talentPoints: 520 },
  { id: 'student-03', name: '박은혜', avatar: '👧🏽', streakDays: 4, didQt: false, didQuiz: false, talentPoints: 210 },
  { id: 'student-04', name: '최다윗', avatar: '🧒🏻', streakDays: 9, didQt: true, didQuiz: false, talentPoints: 455 },
  { id: 'student-05', name: '정소망', avatar: '👧🏻', streakDays: 3, didQt: true, didQuiz: true, talentPoints: 185 },
  { id: 'student-06', name: '한요셉', avatar: '👦🏽', streakDays: 15, didQt: true, didQuiz: true, talentPoints: 610 },
  { id: 'student-07', name: '윤샬롬', avatar: '👧🏻', streakDays: 1, didQt: false, didQuiz: false, talentPoints: 95 },
  { id: 'student-08', name: '오이삭', avatar: '👦🏻', streakDays: 6, didQt: true, didQuiz: true, talentPoints: 290 },
  { id: 'student-09', name: '장온유', avatar: '👧🏽', streakDays: 8, didQt: true, didQuiz: false, talentPoints: 375 },
  { id: 'student-10', name: '임찬양', avatar: '🧒🏽', streakDays: 2, didQt: false, didQuiz: true, talentPoints: 140 },
  { id: 'student-11', name: '서기쁨', avatar: '👧🏻', streakDays: 11, didQt: true, didQuiz: true, talentPoints: 480 },
  { id: 'student-12', name: '문예준', avatar: '👦🏻', streakDays: 5, didQt: false, didQuiz: false, talentPoints: 260 },
];

export type TeacherShortcut = 'students' | 'template' | 'mindTalk' | 'safety' | 'noticeCalendar' | 'video';

/** 각 관리 기능은 추후 실제 화면으로 연결할 수 있도록 고유 id를 가집니다. */
export const TEACHER_SHORTCUTS: { id: TeacherShortcut; emoji: string; title: string; description: string; color: string }[] = [
  { id: 'students', emoji: '👦', title: '학생 계정 관리', description: '새 학생 등록 및 PIN 초기화', color: '#EAF0F6' },
  { id: 'template', emoji: '📝', title: '주간 템플릿 등록', description: 'AI 음성 큐티 & 퀴즈 업로드', color: '#FFF2ED' },
  { id: 'noticeCalendar', emoji: '📖', title: '알림장 & 캘린더 관리', description: '공지사항 작성, 일정 등록/수정/삭제', color: '#FFF8E4' },
  { id: 'video', emoji: '🎬', title: '영상 등록 관리', description: '율동 & 성경 이야기 영상 추천', color: '#EAF4DE' },
  { id: 'mindTalk', emoji: '💬', title: '1:1 마음 톡 목록', description: '아이들이 보낸 비밀 상담 피드', color: '#FFF1F0' },
  { id: 'safety', emoji: '🚨', title: 'AI 안전 모니터링', description: '비속어 감지 게시글 검수함', color: '#EFF7F4' },
];
