import { isSupabaseConfigured, supabase } from './supabase';

/**
 * 학생 로그인은 이메일이 없어서 두 단계로 나뉩니다.
 *   1) 익명 로그인으로 세션만 먼저 만들고
 *   2) claim_student_login(이름, PIN)으로 그 세션을 실제 학생 행에 연결합니다.
 * PIN 비교는 서버에서만 일어나므로 앱에는 비밀번호가 내려오지 않습니다.
 */

export interface StudentProfile {
  id: string;
  name: string;
  avatarEmoji: string;
}

/** 아이들 목록을 읽으려면 익명이라도 세션이 있어야 합니다. */
async function ensureSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: created, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return created.session;
}

/**
 * 로그인 화면에 보여 줄 우리 반 아이들 목록입니다.
 * .env가 아직 비어 있으면 null을 돌려주고, 화면은 Mock 목록을 그대로 씁니다.
 */
export async function fetchStudentNames(): Promise<StudentProfile[] | null> {
  if (!isSupabaseConfigured) return null;

  await ensureSession();
  const { data, error } = await supabase.rpc('list_student_names');
  if (error) throw error;

  return (data ?? []).map((row: { id: string; name: string; avatar_emoji: string }) => ({
    id: row.id,
    name: row.name,
    avatarEmoji: row.avatar_emoji,
  }));
}

/**
 * 이름과 PIN이 맞으면 그 학생 정보를 돌려줍니다.
 * PIN이 틀린 것과 서버 문제를 구분해야, 아이에게 엉뚱한 안내를 하지 않습니다.
 */
export async function loginStudent(name: string, pin: string): Promise<StudentProfile | null> {
  await ensureSession();

  const { data, error } = await supabase.rpc('claim_student_login', {
    student_name: name,
    pin,
  });

  if (error) {
    // 서버가 일부러 던진 '이름 또는 PIN이 올바르지 않아요'만 로그인 실패로 봅니다.
    if (error.message?.includes('PIN')) return null;
    // 그 밖의 오류(권한, 함수 없음 등)는 삼키지 않고 위로 올려 화면이 구분해 안내하게 합니다.
    throw error;
  }
  if (!data) return null;

  return { id: data.id, name: data.name, avatarEmoji: data.avatar_emoji };
}
