export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
];

/** 하루치 QT 템플릿 초안입니다. */
export interface DailyTemplateDraft {
  reference: string;
  verse: string;
  teacherMessage: string;
  isVoiceGenerated: boolean;
  isPublished: boolean;
}

/** Supabase 연동 전, 이번 주 등록 현황을 보여 주기 위한 Mock 초기값입니다. */
export const MOCK_WEEKLY_TEMPLATE: Record<Weekday, DailyTemplateDraft> = {
  mon: {
    reference: '빌립보서 4장 13절',
    verse: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.',
    teacherMessage: '하늘빛 친구들, 오늘 어려운 일이 생겨도 혼자가 아니에요. 예수님이 주시는 힘을 믿고 작은 일부터 용기 내어 시작해 보아요! 🌱',
    isVoiceGenerated: true,
    isPublished: true,
  },
  tue: { reference: '', verse: '', teacherMessage: '', isVoiceGenerated: false, isPublished: false },
  wed: { reference: '', verse: '', teacherMessage: '', isVoiceGenerated: false, isPublished: false },
  thu: { reference: '', verse: '', teacherMessage: '', isVoiceGenerated: false, isPublished: false },
  fri: { reference: '', verse: '', teacherMessage: '', isVoiceGenerated: false, isPublished: false },
};
