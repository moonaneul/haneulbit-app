import { isSupabaseConfigured, supabase } from './supabase';

/**
 * 선생님은 이메일·비밀번호로 로그인합니다.
 * 서버가 auth.uid()로 teachers 표를 확인하기 때문에, 실제로 로그인해야
 * 우리 반 아이들 기록을 볼 수 있습니다.
 */

export interface TeacherStudentStatus {
  id: string;
  name: string;
  avatar: string;
  streakDays: number;
  didQt: boolean;
  didQuiz: boolean;
  talentPoints: number;
}

export type TeacherLoginFailure = 'WRONG_LOGIN' | 'NOT_TEACHER' | 'UNKNOWN';

export const isTeacherApiReady = isSupabaseConfigured;

/** 로그인에 성공하면 선생님 이름을, 실패하면 사유를 돌려줍니다. */
export async function loginTeacher(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { ok: false as const, reason: 'WRONG_LOGIN' as TeacherLoginFailure };

  // 로그인은 됐어도 teachers 표에 없으면 선생님 권한이 없습니다.
  const { data: profile } = await supabase
    .from('teachers')
    .select('name')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false as const, reason: 'NOT_TEACHER' as TeacherLoginFailure };
  }
  return { ok: true as const, name: profile.name as string };
}

/** 우리 반 아이들의 오늘 현황입니다. */
export async function fetchTeacherDashboard(): Promise<TeacherStudentStatus[]> {
  const { data, error } = await supabase.rpc('get_teacher_dashboard');
  if (error) throw new Error(error.message.includes('NOT_TEACHER') ? 'NOT_TEACHER' : 'UNKNOWN');
  return (data ?? []) as TeacherStudentStatus[];
}

export interface ManagedStudent {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

/** 계정 관리 화면에 보여 줄 아이들 목록입니다. */
export async function fetchManagedStudents(): Promise<ManagedStudent[]> {
  const { data, error } = await supabase
    .from('students')
    .select('id,name,avatar_emoji,created_at')
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    avatar: row.avatar_emoji as string,
    createdAt: row.created_at as string,
  }));
}

export type CreateStudentFailure = 'DUPLICATE_NAME' | 'EMPTY_NAME' | 'NOT_TEACHER' | 'UNKNOWN';

/** 새 학생을 만듭니다. PIN 해시는 서버가 만들기 때문에 앱은 이름만 넘깁니다. */
export async function createStudent(name: string, avatar: string) {
  const { data, error } = await supabase.rpc('create_student', { p_name: name, p_avatar: avatar });
  if (error) {
    const known: CreateStudentFailure[] = ['DUPLICATE_NAME', 'EMPTY_NAME', 'NOT_TEACHER'];
    return { ok: false as const, reason: known.find((c) => error.message?.includes(c)) ?? ('UNKNOWN' as CreateStudentFailure) };
  }
  return { ok: true as const, student: data as ManagedStudent };
}

/** PIN을 초기값(0000)으로 되돌립니다. */
export async function resetStudentPin(studentId: string) {
  const { error } = await supabase.rpc('reset_student_pin', { p_student: studentId });
  return !error;
}
