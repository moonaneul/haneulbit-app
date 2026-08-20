/** 선생님이 작성한 공지사항 한 건입니다. */
export interface NoticePost {
  id: string;
  title: string;
  date: string;
  content: string;
  isPinned?: boolean;
}

/** 초등부 스마트 캘린더에 등록된 일정 한 건입니다. */
export interface CalendarEvent {
  id: string;
  emoji: string;
  date: string;
  title: string;
  detail: string;
}

// Supabase 연동 전 알림장 화면을 확인하기 위한 Mock 공지사항입니다.
export const MOCK_NOTICES: NoticePost[] = [
  {
    id: 'notice-01',
    title: '이번 주 준비물 안내 📎',
    date: '11월 18일 (화)',
    content: '이번 주 감사 보물상자 시간에는 가족사진을 한 장씩 준비해 주세요. 사진이 없어도 그림으로 대신할 수 있어요!',
    isPinned: true,
  },
  {
    id: 'notice-02',
    title: '주일 성탄 발표회 배역 안내 🎄',
    date: '11월 16일 (일)',
    content: '성탄 발표회 배역이 정해졌어요! 다음 주부터 매일 QT 후 5분씩 대사 연습을 해볼 거예요. 선생님이 곧 개별 연락드릴게요.',
  },
  {
    id: 'notice-03',
    title: '달란트 상점 새 아이템 오픈 🪙',
    date: '11월 12일 (수)',
    content: '다윗의 물맷돌에 이어 모세의 지팡이 아이템이 곧 상점에 추가돼요! 열심히 QT하고 달란트를 모아 보아요.',
  },
];

// Supabase 연동 전 캘린더 화면을 확인하기 위한 Mock 일정입니다.
export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'event-01', emoji: '🙏', date: '11월 23일 (일)', title: '주일 예배 & QR 출석체크', detail: '오전 11시, 초등부 예배실. 출석 체크인 시 +50 달란트!' },
  { id: 'event-02', emoji: '🎭', date: '11월 30일 (일)', title: '성탄 발표회 리허설', detail: '오전 10시 30분, 초등부 예배실. 배역 의상을 미리 입어봐요.' },
  { id: 'event-03', emoji: '🎂', date: '12월 3일 (수)', title: '이사랑 어린이 생일 축하', detail: '수요일 저녁, 다 함께 축하 노래를 불러요!' },
  { id: 'event-04', emoji: '🎄', date: '12월 21일 (일)', title: '성탄 발표회 본 공연', detail: '오전 11시, 초등부 예배실. 가족들을 초대해요.' },
];
