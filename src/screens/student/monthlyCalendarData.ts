/** 달력 한 칸(하루)의 만나 스티커 부착 상태입니다. */
export interface DailyStickerRecord {
  day: number;
  completed: boolean;
  isFuture: boolean;
  isToday: boolean;
}

// 실제 서비스에서는 매월 1일에 달성률만 초기화하고 달란트는 그대로 유지합니다.
const RECENT_STREAK_DAYS = 5;

const today = new Date();
const year = today.getFullYear();
const monthIndex = today.getMonth();
const todayDate = today.getDate();

/** 이번 달 달력 그리드를 그리는 데 필요한 기본 정보입니다. */
export const MONTHLY_CALENDAR_INFO = {
  year,
  month: monthIndex + 1,
  daysInMonth: new Date(year, monthIndex + 1, 0).getDate(),
  // 1일이 무슨 요일인지(0=일요일)를 알아야 첫 주 앞을 빈 칸으로 채울 수 있습니다.
  firstWeekday: new Date(year, monthIndex, 1).getDay(),
  today: todayDate,
};

/** Supabase 연동 전, 최근 연속 완료 기록과 자연스러운 패턴을 함께 보여주는 Mock 데이터입니다. */
export const MOCK_MONTHLY_STICKERS: DailyStickerRecord[] = Array.from(
  { length: MONTHLY_CALENDAR_INFO.daysInMonth },
  (_, index) => {
    const day = index + 1;
    const isFuture = day > todayDate;
    const isToday = day === todayDate;
    const isRecentStreak = day > todayDate - RECENT_STREAK_DAYS && day <= todayDate;
    const completed = !isFuture && (isRecentStreak || day % 3 !== 0);
    return { day, completed, isFuture, isToday };
  },
);

/**
 * 서버가 준 완료 날짜('YYYY-MM-DD')로 이번 달 스티커를 만듭니다.
 * 스티커 전용 표를 따로 두지 않고, QT 완료 기록 자체가 곧 스티커입니다.
 */
export function buildStickersFromDates(completedDates: string[]): DailyStickerRecord[] {
  const completedDays = new Set(
    completedDates
      .map((date) => Number(date.slice(8, 10)))
      .filter((day) => Number.isFinite(day)),
  );
  return Array.from({ length: MONTHLY_CALENDAR_INFO.daysInMonth }, (_, index) => {
    const day = index + 1;
    return {
      day,
      completed: completedDays.has(day),
      isFuture: day > todayDate,
      isToday: day === todayDate,
    };
  });
}

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
