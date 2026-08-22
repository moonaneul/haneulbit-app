import { isSupabaseConfigured, supabase } from './supabase';

/**
 * QT 조회와 완료 기록입니다.
 * 완료와 달란트 지급을 서버가 한 번에 처리해, 오늘 QT가 실제로 있는지와
 * 이미 받지 않았는지를 서버가 확인합니다.
 */

export interface QtTemplate {
  id: string;
  reference: string;
  verse: string;
  teacherMessage: string;
  audioUrl: string | null;
}

export interface TodayQt {
  /** 주말이라 오늘은 QT가 없는 날입니다. */
  isRestDay: boolean;
  template: QtTemplate | null;
  /** 이미 나눔을 남겼다면 그 내용입니다. */
  myReflection: string | null;
}

export interface QtSummary {
  streakDays: number;
  completedDates: string[];
}

export interface FriendQtPost {
  id: string;
  name: string;
  reflection: string;
}

export type QtFailure = 'NO_QT_TODAY' | 'ALREADY_DONE' | 'EMPTY_REFLECTION' | 'UNKNOWN';

export const isQtApiReady = isSupabaseConfigured;

async function call<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) {
    const known: QtFailure[] = ['NO_QT_TODAY', 'ALREADY_DONE', 'EMPTY_REFLECTION'];
    throw new Error(known.find((code) => error.message?.includes(code)) ?? 'UNKNOWN');
  }
  return data as T;
}

export const fetchTodayQt = () => call<TodayQt>('get_today_qt');
export const fetchQtSummary = (month?: string) =>
  call<QtSummary>('get_my_qt_summary', month ? { p_month: month } : undefined);
export const fetchQtFriendFeed = () => call<FriendQtPost[]>('get_qt_friend_feed');

/** 나눔을 등록하고, 지급된 뒤의 달란트와 출석 요약을 함께 받습니다. */
export const submitQtReflection = (reflection: string) =>
  call<{ talents: number; summary: QtSummary }>('complete_qt', { p_reflection: reflection });
