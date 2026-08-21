-- 🕊️ [매일 만나 하늘빛] Supabase 데이터베이스 스키마
--
-- 사용법: Supabase 대시보드 → SQL Editor에 이 파일 전체를 붙여넣고 실행하세요.
-- 이 파일은 지금까지 앱 화면들이 쓰던 Mock 데이터(각 화면의 xxxData.ts)를
-- 그대로 옮겨 담을 수 있는 실제 테이블 구조입니다. 화면을 Supabase에 연결할 때
-- 테이블 하나당 어떤 Mock 데이터 파일이 대응하는지 각 섹션 주석에 적어 두었습니다.
--
-- 인증 전략 (PROJECT_RULES.md 3장 기준):
--   - 선생님: Supabase Auth 이메일/비밀번호 로그인 → teachers 테이블에 프로필 연결
--   - 학생: 이메일이 없으므로 Supabase Auth "익명 로그인"으로 세션을 만든 뒤,
--           claim_student_login() 함수로 이름+PIN을 검증해 그 학생 행에 연결합니다.
--   - 부모님: Supabase Auth 휴대폰 번호 OTP 로그인 → 자녀 연동 코드로 parent_child_links 생성.

create extension if not exists pgcrypto;

-- =========================================================
-- 0. 공통 헬퍼 함수 (RLS 정책에서 반복 사용)
-- =========================================================

-- 현재 로그인한 사용자가 선생님인지 확인합니다.
create or replace function is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from teachers where id = auth.uid());
$$;

-- 현재 로그인한 학생 계정(익명 인증 후 연결된 학생 행)의 student id를 돌려줍니다.
create or replace function current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from students where auth_user_id = auth.uid();
$$;

-- 현재 로그인한 부모님 계정이 특정 학생과 연동돼 있는지 확인합니다.
create or replace function is_linked_parent_of(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from parent_child_links
    where parent_id = auth.uid() and student_id = target_student_id
  );
$$;

-- updated_at 컬럼을 가진 테이블에 붙여 쓰는 공용 트리거 함수입니다.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- 1. 계정 (역할별로 완전히 분리된 테이블)
-- =========================================================

-- 선생님 계정. auth.users의 id를 그대로 PK로 씁니다 (이메일/비밀번호 로그인).
create table teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '선생님',
  church_name text not null default '하늘빛기쁨교회',
  created_at timestamptz not null default now()
);

-- 학생 계정. teacherHomeData.ts의 MOCK_STUDENT_STATUSES, homeData.ts의 MOCK_STUDENT에 대응합니다.
-- auth_user_id는 처음엔 비어 있다가, claim_student_login()으로 첫 로그인할 때 채워집니다.
create table students (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  avatar_emoji text not null default '🧒',
  -- 실제 비교는 verify_student_pin()이 서버에서만 수행하므로 클라이언트는 평문 PIN을 볼 수 없습니다.
  pin_hash text not null,
  streak_days int not null default 0,
  talent_points int not null default 0,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now()
);

-- 부모님 계정. auth.users의 id를 PK로 씁니다 (휴대폰 번호 OTP 로그인).
create table parents (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone_number text,
  created_at timestamptz not null default now()
);

-- 부모님과 자녀를 잇는 연동 코드/관계. parentData.ts의 MOCK_LINKED_CHILD, mockParent.js에 대응합니다.
create table parent_child_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references parents(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  link_code text not null,
  linked_at timestamptz not null default now(),
  unique (parent_id, student_id)
);

-- =========================================================
-- 2. 학생 계정 로그인 & 달란트 (보안이 필요한 RPC 함수)
-- =========================================================

-- 이름+PIN이 맞으면 익명 인증된 현재 세션(auth.uid())을 그 학생 행에 연결합니다.
-- 클라이언트는 이 함수만 호출하면 되고, pin_hash는 절대 클라이언트로 내려가지 않습니다.
create or replace function claim_student_login(student_name text, pin text)
returns students
language plpgsql
security definer
set search_path = public
as $$
declare
  matched students;
begin
  select * into matched
  from students
  where name = student_name
    and pin_hash = crypt(pin, pin_hash)
  limit 1;

  if matched.id is null then
    raise exception '이름 또는 PIN이 올바르지 않아요';
  end if;

  update students set auth_user_id = auth.uid() where id = matched.id
  returning * into matched;

  return matched;
end;
$$;

-- 달란트는 항상 이 함수로만 더하고 빼서, talent_transactions에 사용 내역이 남도록 합니다.
create or replace function add_talent_points(target_student_id uuid, delta int, reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into talent_transactions (student_id, amount, reason)
  values (target_student_id, delta, reason);

  update students set talent_points = talent_points + delta where id = target_student_id;
end;
$$;

create table talent_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  amount int not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 3. 주간 QT 템플릿 & 완료 기록
-- teacherTemplateData.ts(MOCK_WEEKLY_TEMPLATE), qtData.ts(TODAY_QT)에 대응합니다.
-- =========================================================

create table weekly_qt_templates (
  id uuid primary key default gen_random_uuid(),
  week_start_date date not null,
  weekday text not null check (weekday in ('mon', 'tue', 'wed', 'thu', 'fri')),
  reference text not null,
  verse text not null,
  teacher_message text not null,
  audio_url text,
  is_voice_generated boolean not null default false,
  is_published boolean not null default false,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_start_date, weekday)
);

create trigger weekly_qt_templates_set_updated_at
  before update on weekly_qt_templates
  for each row execute function set_updated_at();

-- 학생의 QT 완료 + 한 줄 나눔. 하루(템플릿) 당 한 번만 완료할 수 있습니다.
-- monthlyCalendarData.ts의 만나 스티커 달력은 이 테이블을 날짜별로 집계해서 그립니다
-- (스티커 전용 테이블을 따로 두지 않고, 완료 기록 자체가 스티커입니다).
create table qt_completions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  template_id uuid not null references weekly_qt_templates(id) on delete cascade,
  reflection text not null,
  completed_at timestamptz not null default now(),
  unique (student_id, template_id)
);

-- =========================================================
-- 4. 2단계 WWJD 퀴즈
-- wwjdQuizData.ts에 대응합니다.
-- =========================================================

create table wwjd_quizzes (
  id uuid primary key default gen_random_uuid(),
  week_start_date date not null,
  stage1_question text not null,
  stage1_options jsonb not null,
  stage1_correct_index int not null,
  stage2_question text not null,
  stage2_options jsonb not null,
  stage2_correct_index int not null,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now()
);

create table wwjd_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  quiz_id uuid not null references wwjd_quizzes(id) on delete cascade,
  stage1_correct boolean not null,
  stage2_correct boolean not null,
  completed_at timestamptz not null default now(),
  unique (student_id, quiz_id)
);

-- =========================================================
-- 5. 감사 보물상자 & 추천 영상
-- gratitudeData.ts(MOCK_GRATITUDE_POSTS, MOCK_VIDEOS)에 대응합니다.
-- =========================================================

create table gratitude_posts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  photo_url text,
  title text not null,
  created_at timestamptz not null default now()
);

create table gratitude_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references gratitude_posts(id) on delete cascade,
  reactor_student_id uuid not null references students(id) on delete cascade,
  reaction_key text not null check (reaction_key in ('pray', 'amen', 'great')),
  created_at timestamptz not null default now(),
  unique (post_id, reactor_student_id, reaction_key)
);

create table recommended_videos (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('dance', 'bible')),
  title text not null,
  duration_label text not null,
  youtube_url text not null,
  thumbnail_emoji text not null,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now()
);

-- =========================================================
-- 6. 알림장 & 캘린더
-- src/data/noticeCalendar.ts(MOCK_NOTICES, MOCK_CALENDAR_EVENTS)에 대응합니다.
-- 학생·부모님 화면이 같은 테이블을 함께 읽습니다.
-- =========================================================

create table notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean not null default false,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now()
);

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  emoji text not null,
  title text not null,
  detail text not null,
  event_date date not null,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now()
);

-- =========================================================
-- 7. 한 줄 상태메시지 & 마을 게시판 반응
-- StatusMessageCard.tsx, statusFeedData.ts에 대응합니다.
-- =========================================================

create table status_messages (
  student_id uuid primary key references students(id) on delete cascade,
  message text not null,
  updated_at timestamptz not null default now()
);

create trigger status_messages_set_updated_at
  before update on status_messages
  for each row execute function set_updated_at();

create table status_reactions (
  id uuid primary key default gen_random_uuid(),
  status_student_id uuid not null references status_messages(student_id) on delete cascade,
  reactor_student_id uuid not null references students(id) on delete cascade,
  reaction_key text not null check (reaction_key in ('pray', 'amen', 'great')),
  created_at timestamptz not null default now(),
  unique (status_student_id, reactor_student_id)
);

-- =========================================================
-- 8. 비밀 마니또
-- manitoData.ts(MY_MANITO_BUDDY, MOCK_RECEIVED_PRAYERS)에 대응합니다.
-- =========================================================

-- 매주 누가 누구의 마니또인지 배정합니다. giver만 자신의 배정을 알 수 있고,
-- receiver는 이 테이블을 직접 조회할 권한이 없습니다 (RLS에서 select 정책 자체를 주지 않음).
create table manito_assignments (
  id uuid primary key default gen_random_uuid(),
  giver_student_id uuid not null references students(id) on delete cascade,
  receiver_student_id uuid not null references students(id) on delete cascade,
  week_start_date date not null,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now(),
  unique (giver_student_id, week_start_date),
  check (giver_student_id <> receiver_student_id)
);

-- 받는 사람은 발신자를 알 수 없도록, 이 테이블에는 assignment_id 대신
-- receiver_student_id만 직접 저장해 RLS가 giver 정보를 아예 노출하지 않게 합니다.
create table manito_prayers (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references manito_assignments(id) on delete cascade,
  receiver_student_id uuid not null references students(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 9. 1:1 하늘빛 마음 톡
-- mindTalkData.ts, teacherMindTalkData.ts에 대응합니다.
-- =========================================================

create table mind_talk_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  sender text not null check (sender in ('teacher', 'student')),
  text text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 10. AI 안전 모니터링 (1차 필터에 걸린 게시글 검수함)
-- teacherSafetyData.ts에 대응합니다.
-- =========================================================

create table flagged_posts (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('qt', 'gratitude', 'status', 'manito', 'mind_talk')),
  source_id uuid,
  student_id uuid not null references students(id) on delete cascade,
  content text not null,
  flagged_word text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'blocked')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references teachers(id),
  reviewed_at timestamptz
);

-- =========================================================
-- 11. 전신갑주 상점 & 티어 강화
-- armorShopData.ts(ARMOR_ITEMS, ARMOR_TIERS)에 대응합니다.
-- =========================================================

create table armor_catalog (
  id text primary key, -- 'helmet', 'shield' 등 armorShopData.ts와 동일한 문자열 id
  emoji text not null,
  name text not null,
  price int not null,
  description text not null,
  color_hex text not null
);

create table student_armor (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  armor_id text not null references armor_catalog(id),
  tier text not null default 'basic' check (tier in ('basic', 'silver', 'gold', 'light')),
  is_equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  unique (student_id, armor_id)
);

-- =========================================================
-- 12. 가정 실천 미션 도장 (부모님 승인)
-- parentData.ts(MOCK_HOME_MISSIONS)에 대응합니다.
-- =========================================================

create table home_mission_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  emoji text not null,
  title text not null,
  child_note text not null,
  submitted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  approved_by uuid references parents(id),
  approved_at timestamptz
);

-- =========================================================
-- 13. Row Level Security
-- =========================================================

alter table teachers enable row level security;
alter table students enable row level security;
alter table parents enable row level security;
alter table parent_child_links enable row level security;
alter table talent_transactions enable row level security;
alter table weekly_qt_templates enable row level security;
alter table qt_completions enable row level security;
alter table wwjd_quizzes enable row level security;
alter table wwjd_quiz_attempts enable row level security;
alter table gratitude_posts enable row level security;
alter table gratitude_reactions enable row level security;
alter table recommended_videos enable row level security;
alter table notices enable row level security;
alter table calendar_events enable row level security;
alter table status_messages enable row level security;
alter table status_reactions enable row level security;
alter table manito_assignments enable row level security;
alter table manito_prayers enable row level security;
alter table mind_talk_messages enable row level security;
alter table flagged_posts enable row level security;
alter table armor_catalog enable row level security;
alter table student_armor enable row level security;
alter table home_mission_submissions enable row level security;

-- 계정
create policy "teachers_self_select" on teachers for select using (id = auth.uid());
create policy "teachers_self_update" on teachers for update using (id = auth.uid());

create policy "students_readable_by_owner_teacher_linked_parent" on students for select
  using (auth_user_id = auth.uid() or is_teacher() or is_linked_parent_of(id));
create policy "students_insert_by_teacher" on students for insert with check (is_teacher());
create policy "students_update_by_owner_or_teacher" on students for update
  using (auth_user_id = auth.uid() or is_teacher());

create policy "parents_self_select" on parents for select using (id = auth.uid());
create policy "parents_self_upsert" on parents for insert with check (id = auth.uid());
create policy "parents_self_update" on parents for update using (id = auth.uid());

create policy "parent_child_links_visible_to_parties" on parent_child_links for select
  using (parent_id = auth.uid() or is_teacher());
create policy "parent_child_links_insert_by_parent" on parent_child_links for insert
  with check (parent_id = auth.uid());

create policy "talent_transactions_visible_to_owner_teacher_parent" on talent_transactions for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));

-- QT 템플릿: 전체 학생·부모는 게시된 것만, 선생님은 전체(초안 포함)
create policy "weekly_qt_templates_read_published" on weekly_qt_templates for select
  using (is_published or is_teacher());
create policy "weekly_qt_templates_write_by_teacher" on weekly_qt_templates for all
  using (is_teacher()) with check (is_teacher());

create policy "qt_completions_own_or_teacher_or_parent" on qt_completions for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));
create policy "qt_completions_insert_own" on qt_completions for insert
  with check (student_id = current_student_id());

-- WWJD 퀴즈
create policy "wwjd_quizzes_read_all" on wwjd_quizzes for select using (true);
create policy "wwjd_quizzes_write_by_teacher" on wwjd_quizzes for all
  using (is_teacher()) with check (is_teacher());
create policy "wwjd_quiz_attempts_own_or_teacher" on wwjd_quiz_attempts for select
  using (student_id = current_student_id() or is_teacher());
create policy "wwjd_quiz_attempts_insert_own" on wwjd_quiz_attempts for insert
  with check (student_id = current_student_id());

-- 감사 보물상자: 12명 전체 공동체 공개이므로 로그인한 학생/선생님이면 모두 열람 가능
create policy "gratitude_posts_read_all_authenticated" on gratitude_posts for select using (true);
create policy "gratitude_posts_insert_own" on gratitude_posts for insert
  with check (student_id = current_student_id());
create policy "gratitude_reactions_read_all" on gratitude_reactions for select using (true);
create policy "gratitude_reactions_insert_own" on gratitude_reactions for insert
  with check (reactor_student_id = current_student_id());

create policy "recommended_videos_read_all" on recommended_videos for select using (true);
create policy "recommended_videos_write_by_teacher" on recommended_videos for all
  using (is_teacher()) with check (is_teacher());

-- 알림장 & 캘린더: 전체 공개 읽기, 작성은 선생님만
create policy "notices_read_all" on notices for select using (true);
create policy "notices_write_by_teacher" on notices for all
  using (is_teacher()) with check (is_teacher());
create policy "calendar_events_read_all" on calendar_events for select using (true);
create policy "calendar_events_write_by_teacher" on calendar_events for all
  using (is_teacher()) with check (is_teacher());

-- 상태메시지: 12명 전체 공개, 본인만 수정
create policy "status_messages_read_all" on status_messages for select using (true);
create policy "status_messages_upsert_own" on status_messages for insert
  with check (student_id = current_student_id());
create policy "status_messages_update_own" on status_messages for update
  using (student_id = current_student_id());
create policy "status_reactions_read_all" on status_reactions for select using (true);
create policy "status_reactions_insert_own" on status_reactions for insert
  with check (reactor_student_id = current_student_id());

-- 마니또: giver는 자신이 보낸 배정만, receiver는 배정 테이블에 접근 불가(발신자 비밀 보장)
create policy "manito_assignments_visible_to_giver_or_teacher" on manito_assignments for select
  using (giver_student_id = current_student_id() or is_teacher());
create policy "manito_assignments_write_by_teacher" on manito_assignments for all
  using (is_teacher()) with check (is_teacher());
-- 받은 편지함은 receiver_student_id로만 걸러 보이므로 누가 보냈는지는 절대 알 수 없습니다.
create policy "manito_prayers_visible_to_receiver_or_teacher" on manito_prayers for select
  using (receiver_student_id = current_student_id() or is_teacher());
create policy "manito_prayers_insert_by_assigned_giver" on manito_prayers for insert
  with check (
    exists (
      select 1 from manito_assignments a
      where a.id = assignment_id and a.giver_student_id = current_student_id()
    )
  );

-- 마음 톡: 본인과 선생님만
create policy "mind_talk_messages_own_or_teacher" on mind_talk_messages for select
  using (student_id = current_student_id() or is_teacher());
create policy "mind_talk_messages_insert_own_or_teacher" on mind_talk_messages for insert
  with check (
    (sender = 'student' and student_id = current_student_id())
    or (sender = 'teacher' and is_teacher())
  );

-- 안전 모니터링: 선생님 전용
create policy "flagged_posts_teacher_only" on flagged_posts for all
  using (is_teacher()) with check (is_teacher());

-- 전신갑주
create policy "armor_catalog_read_all" on armor_catalog for select using (true);
create policy "armor_catalog_write_by_teacher" on armor_catalog for all
  using (is_teacher()) with check (is_teacher());
create policy "student_armor_own_or_teacher_or_parent" on student_armor for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));
create policy "student_armor_write_own" on student_armor for all
  using (student_id = current_student_id()) with check (student_id = current_student_id());

-- 가정 실천 미션: 본인 학생, 담당 선생님, 연동된 부모님만
create policy "home_mission_submissions_visible" on home_mission_submissions for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));
create policy "home_mission_submissions_insert_own" on home_mission_submissions for insert
  with check (student_id = current_student_id());
create policy "home_mission_submissions_approve_by_parent" on home_mission_submissions for update
  using (is_linked_parent_of(student_id));
