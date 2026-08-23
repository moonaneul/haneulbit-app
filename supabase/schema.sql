-- 🕊️ [매일 만나 하늘빛] Supabase 데이터베이스 스키마
--
-- 사용법: Supabase 대시보드 → SQL Editor에 이 파일 전체를 붙여넣고 실행하세요.
-- 여러 번 실행해도 안전합니다 (이미 있는 표는 그대로 두고 넘어갑니다).
-- 이 파일은 지금까지 앱 화면들이 쓰던 Mock 데이터(각 화면의 xxxData.ts)를
-- 그대로 옮겨 담을 수 있는 실제 테이블 구조입니다. 화면을 Supabase에 연결할 때
-- 테이블 하나당 어떤 Mock 데이터 파일이 대응하는지 각 섹션 주석에 적어 두었습니다.
--
-- 인증 전략 (PROJECT_RULES.md 3장 기준):
--   - 선생님: Supabase Auth 이메일/비밀번호 로그인 → teachers 테이블에 프로필 연결
--   - 학생: 이메일이 없으므로 Supabase Auth "익명 로그인"으로 세션을 만든 뒤,
--           claim_student_login() 함수로 이름+PIN을 검증해 그 학생 행에 연결합니다.
--   - 부모님: Supabase Auth 휴대폰 번호 OTP 로그인 → 자녀 연동 코드로 parent_child_links 생성.

-- Supabase에는 pgcrypto가 extensions 스키마에 이미 깔려 있습니다.
-- 아래 함수들이 crypt()를 찾을 수 있도록 search_path에 extensions를 함께 넣어 둡니다.
create extension if not exists pgcrypto;

-- =========================================================
-- 0. 표가 없어도 만들 수 있는 공용 함수
--    (아래 헬퍼 함수들은 참조할 표가 먼저 있어야 해서 1번 뒤로 옮겼습니다)
-- =========================================================

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
create table if not exists teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '선생님',
  church_name text not null default '하늘빛기쁨교회',
  created_at timestamptz not null default now()
);

-- 학생 계정. teacherHomeData.ts의 MOCK_STUDENT_STATUSES, homeData.ts의 MOCK_STUDENT에 대응합니다.
-- auth_user_id는 처음엔 비어 있다가, claim_student_login()으로 첫 로그인할 때 채워집니다.
create table if not exists students (
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

-- 이름으로 로그인하므로 같은 이름이 두 명 있으면 누구인지 가릴 수 없습니다.
-- 이미 만들어진 표에도 걸리도록 표 정의가 아니라 별도 인덱스로 둡니다.
create unique index if not exists students_name_key on students (name);

-- 부모님 계정. auth.users의 id를 PK로 씁니다 (휴대폰 번호 OTP 로그인).
create table if not exists parents (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone_number text,
  created_at timestamptz not null default now()
);

-- 부모님과 자녀를 잇는 연동 코드/관계. parentData.ts의 MOCK_LINKED_CHILD, mockParent.js에 대응합니다.
create table if not exists parent_child_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references parents(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  link_code text not null,
  linked_at timestamptz not null default now(),
  unique (parent_id, student_id)
);

-- =========================================================
-- 1-1. 계정 표를 참조하는 헬퍼 함수 (RLS 정책에서 반복 사용)
-- language sql 함수는 만들 때 참조하는 표가 이미 있어야 해서 여기에 둡니다.
-- =========================================================

-- 현재 로그인한 사용자가 선생님인지 확인합니다.
create or replace function is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (select 1 from teachers where id = auth.uid());
$$;

-- 현재 로그인한 학생 계정(익명 인증 후 연결된 학생 행)의 student id를 돌려줍니다.
create or replace function current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public, extensions
as $$
  select id from students where auth_user_id = auth.uid();
$$;

-- 현재 로그인한 부모님 계정이 특정 학생과 연동돼 있는지 확인합니다.
create or replace function is_linked_parent_of(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from parent_child_links
    where parent_id = auth.uid() and student_id = target_student_id
  );
$$;


-- =========================================================
-- 2. 학생 계정 로그인 & 달란트 (보안이 필요한 RPC 함수)
-- =========================================================

-- 이름+PIN이 맞으면 익명 인증된 현재 세션(auth.uid())을 그 학생 행에 연결합니다.
-- 클라이언트는 이 함수만 호출하면 되고, pin_hash는 절대 클라이언트로 내려가지 않습니다.
create or replace function claim_student_login(student_name text, pin text)
returns students
language plpgsql
security definer
set search_path = public, extensions
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

-- 로그인 화면에 보여 줄 아이들 목록입니다.
-- students 표는 RLS 때문에 로그인 전에는 읽을 수 없어서, 이 함수로만 꺼내 씁니다.
-- 이름과 이모지만 돌려주고 pin_hash·달란트 같은 값은 절대 나가지 않습니다.
create or replace function list_student_names()
returns table (id uuid, name text, avatar_emoji text)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select s.id, s.name, s.avatar_emoji from students s order by s.name;
$$;

-- 익명 로그인이라도 세션이 있어야 부를 수 있게 막아 둡니다.
-- 함수는 기본적으로 public에 실행 권한이 열려 있어서, anon만 지워서는 막히지 않습니다.
revoke execute on function list_student_names() from public;
grant execute on function list_student_names() to authenticated;

-- 예전 버전은 void를 돌려줬습니다. create or replace로는 반환 타입을 바꿀 수 없어서 먼저 지웁니다.
drop function if exists add_talent_points(uuid, int, text);

-- 달란트는 항상 이 함수로만 더하고 빼서, talent_transactions에 사용 내역이 남도록 합니다.
-- security definer라 RLS를 지나치므로, 누가 부를 수 있는지 함수 안에서 직접 확인합니다.
create or replace function add_talent_points(target_student_id uuid, delta int, reason text)
returns int
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_total int;
begin
  -- 아이가 남의 달란트를 건드리거나 마음대로 올리지 못하도록 선생님만 쓸 수 있습니다.
  if not is_teacher() then
    raise exception '선생님만 달란트를 직접 조정할 수 있어요';
  end if;

  insert into talent_transactions (student_id, amount, reason)
  values (target_student_id, delta, reason);

  update students set talent_points = talent_points + delta
  where id = target_student_id
  returning talent_points into new_total;

  return new_total;
end;
$$;

create table if not exists talent_transactions (
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

create table if not exists weekly_qt_templates (
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

drop trigger if exists weekly_qt_templates_set_updated_at on weekly_qt_templates;
create trigger weekly_qt_templates_set_updated_at
  before update on weekly_qt_templates
  for each row execute function set_updated_at();

-- 학생의 QT 완료 + 한 줄 나눔. 하루(템플릿) 당 한 번만 완료할 수 있습니다.
-- monthlyCalendarData.ts의 만나 스티커 달력은 이 테이블을 날짜별로 집계해서 그립니다
-- (스티커 전용 테이블을 따로 두지 않고, 완료 기록 자체가 스티커입니다).
create table if not exists qt_completions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  template_id uuid not null references weekly_qt_templates(id) on delete cascade,
  reflection text not null,
  completed_at timestamptz not null default now(),
  unique (student_id, template_id)
);

-- =========================================================
-- 3-1. QT 조회·완료 (달란트 지급까지 서버가 함께 처리)
-- =========================================================

-- 주어진 날짜에 읽을 QT 템플릿을 찾습니다.
-- 날짜 계산을 따로 떼어 두면 어떤 날짜로도 확인할 수 있고, 아래 함수들이 같은 규칙을 씁니다.
-- 주중(월~금)만 QT가 있고 주말에는 아무것도 돌려주지 않습니다.
create or replace function qt_template_for(p_date date)
returns weekly_qt_templates
language sql
stable
security definer
set search_path = public, extensions
as $$
  select * from weekly_qt_templates
  where week_start_date = date_trunc('week', p_date)::date
    and weekday = trim(lower(to_char(p_date, 'dy')))
    and weekday not in ('sat', 'sun')
    and is_published
  limit 1;
$$;

-- 오늘 읽을 QT입니다. 주말이면 쉬는 날로 알려 줍니다.
create or replace function get_today_qt()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
  found_template weekly_qt_templates;
  my_reflection text;
begin
  if extract(isodow from current_date) > 5 then
    return jsonb_build_object('isRestDay', true, 'template', null);
  end if;

  found_template := qt_template_for(current_date);
  if found_template.id is null then
    return jsonb_build_object('isRestDay', false, 'template', null);
  end if;

  select reflection into my_reflection
  from qt_completions
  where student_id = me and template_id = found_template.id;

  return jsonb_build_object(
    'isRestDay', false,
    'template', jsonb_build_object(
      'id', found_template.id,
      'reference', found_template.reference,
      'verse', found_template.verse,
      'teacherMessage', found_template.teacher_message,
      'audioUrl', found_template.audio_url
    ),
    'myReflection', my_reflection
  );
end;
$$;

-- 한 아이의 연속 출석 일수입니다.
-- 선생님 대시보드도 같은 규칙을 써야 해서 학생 단위 함수로 빼 두었습니다.
create or replace function qt_streak_for(p_student uuid)
returns int
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  cursor_date date;
  streak int := 0;
begin
  if p_student is null then return 0; end if;

  -- 오늘 아직 안 했더라도 어제까지의 연속 기록은 살려 둡니다.
  cursor_date := current_date;
  if not exists (
    select 1 from qt_completions where student_id = p_student and completed_at::date = cursor_date
  ) then
    cursor_date := cursor_date - 1;
  end if;

  -- 주말은 QT가 없으므로 건너뛰고, 주중에 빠진 날이 나오면 거기서 멈춥니다.
  while cursor_date > current_date - 400 loop
    if extract(isodow from cursor_date) <= 5 then
      exit when not exists (
        select 1 from qt_completions where student_id = p_student and completed_at::date = cursor_date
      );
      streak := streak + 1;
    end if;
    cursor_date := cursor_date - 1;
  end loop;

  return streak;
end;
$$;

-- 내 연속 출석과 이번 달 완료 날짜입니다.
-- 스티커 달력은 별도 표 없이 이 완료 기록을 날짜별로 세서 그립니다.
create or replace function get_my_qt_summary(p_month date default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
  target_month date := coalesce(p_month, date_trunc('month', current_date)::date);
begin
  return jsonb_build_object(
    'streakDays', qt_streak_for(me),
    'completedDates', coalesce((
      select jsonb_agg(distinct to_char(completed_at::date, 'YYYY-MM-DD'))
      from qt_completions
      where student_id = me
        and date_trunc('month', completed_at) = date_trunc('month', target_month)
    ), '[]'::jsonb)
  );
end;
$$;

-- 나눔을 등록하고 달란트를 지급합니다.
-- 완료 기록과 달란트를 같은 함수에서 처리해야, 앱이 "다 했다"고만 말해도
-- 서버가 오늘 QT가 실제로 있는지, 이미 받지 않았는지 확인할 수 있습니다.
create or replace function complete_qt(p_reflection text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
  today_template uuid;
  reward int := 10;
  new_talents int;
begin
  if me is null then raise exception '로그인이 필요해요'; end if;
  if p_reflection is null or length(trim(p_reflection)) = 0 then raise exception 'EMPTY_REFLECTION'; end if;

  select id into today_template from qt_template_for(current_date);
  if today_template is null then raise exception 'NO_QT_TODAY'; end if;

  if exists (select 1 from qt_completions where student_id = me and template_id = today_template) then
    raise exception 'ALREADY_DONE';
  end if;

  insert into qt_completions (student_id, template_id, reflection)
  values (me, today_template, trim(p_reflection));

  insert into talent_transactions (student_id, amount, reason)
  values (me, reward, '3분 QT 나눔');
  update students set talent_points = talent_points + reward
  where id = me returning talent_points into new_talents;

  return jsonb_build_object('talents', new_talents, 'summary', get_my_qt_summary());
end;
$$;

-- 친구들의 오늘 나눔입니다. 내가 먼저 써야 볼 수 있게 서버에서 막습니다.
create or replace function get_qt_friend_feed()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
  today_template uuid;
begin
  select id into today_template from qt_template_for(current_date);
  if today_template is null then return '[]'::jsonb; end if;

  if not exists (select 1 from qt_completions where student_id = me and template_id = today_template) then
    return '[]'::jsonb;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object('id', c.id, 'name', s.name, 'reflection', c.reflection)
                     order by c.completed_at)
    from qt_completions c
    join students s on s.id = c.student_id
    where c.template_id = today_template and c.student_id <> me
  ), '[]'::jsonb);
end;
$$;

-- =========================================================
-- 4. 2단계 WWJD 퀴즈
-- wwjdQuizData.ts에 대응합니다.
-- =========================================================

create table if not exists wwjd_quizzes (
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

create table if not exists wwjd_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  quiz_id uuid not null references wwjd_quizzes(id) on delete cascade,
  stage1_correct boolean not null,
  stage2_correct boolean not null,
  completed_at timestamptz not null default now(),
  unique (student_id, quiz_id)
);

-- =========================================================
-- 4-1. 선생님 대시보드
-- =========================================================

-- 새 학생 계정을 만듭니다. 초기 PIN은 명세대로 0000입니다.
-- PIN 해시는 서버에서만 만들 수 있으므로 앱이 직접 insert하지 않고 이 함수를 씁니다.
create or replace function create_student(p_name text, p_avatar text default '🧒')
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_student students;
begin
  if not is_teacher() then raise exception 'NOT_TEACHER'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'EMPTY_NAME'; end if;

  -- 이름으로 로그인하므로 같은 이름이 두 명 있으면 안 됩니다.
  if exists (select 1 from students where name = trim(p_name)) then
    raise exception 'DUPLICATE_NAME';
  end if;

  insert into students (name, avatar_emoji, pin_hash, created_by)
  values (trim(p_name), coalesce(p_avatar, '🧒'), crypt('0000', gen_salt('bf')), auth.uid())
  returning * into new_student;

  return jsonb_build_object(
    'id', new_student.id,
    'name', new_student.name,
    'avatar', new_student.avatar_emoji,
    'createdAt', new_student.created_at
  );
end;
$$;

-- 아이가 PIN을 잊었을 때 0000으로 되돌립니다.
create or replace function reset_student_pin(p_student uuid)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not is_teacher() then raise exception 'NOT_TEACHER'; end if;

  update students set pin_hash = crypt('0000', gen_salt('bf')) where id = p_student;
  if not found then raise exception 'NOT_FOUND'; end if;
end;
$$;

-- 우리 반 12명의 오늘 현황을 한 번에 돌려줍니다.
-- 아이마다 따로 조회하면 12번 오가야 해서 한 덩어리로 만듭니다.
create or replace function get_teacher_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  today_template uuid;
  this_week_quiz uuid;
begin
  if not is_teacher() then raise exception 'NOT_TEACHER'; end if;

  select id into today_template from qt_template_for(current_date);
  select id into this_week_quiz from wwjd_quizzes
   where week_start_date = date_trunc('week', current_date)::date limit 1;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', s.id,
        'name', s.name,
        'avatar', s.avatar_emoji,
        'talentPoints', s.talent_points,
        'streakDays', qt_streak_for(s.id),
        'didQt', exists (
          select 1 from qt_completions c
          where c.student_id = s.id and c.template_id = today_template
        ),
        'didQuiz', exists (
          select 1 from wwjd_quiz_attempts a
          where a.student_id = s.id and a.quiz_id = this_week_quiz
        )
      ) order by s.name
    )
    from students s
  ), '[]'::jsonb);
end;
$$;

-- =========================================================
-- 5. 감사 보물상자 & 추천 영상
-- gratitudeData.ts(MOCK_GRATITUDE_POSTS, MOCK_VIDEOS)에 대응합니다.
-- =========================================================

create table if not exists gratitude_posts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  photo_url text,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists gratitude_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references gratitude_posts(id) on delete cascade,
  reactor_student_id uuid not null references students(id) on delete cascade,
  reaction_key text not null check (reaction_key in ('pray', 'amen', 'great')),
  created_at timestamptz not null default now(),
  unique (post_id, reactor_student_id, reaction_key)
);

create table if not exists recommended_videos (
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

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean not null default false,
  created_by uuid references teachers(id),
  created_at timestamptz not null default now()
);

create table if not exists calendar_events (
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

create table if not exists status_messages (
  student_id uuid primary key references students(id) on delete cascade,
  message text not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists status_messages_set_updated_at on status_messages;
create trigger status_messages_set_updated_at
  before update on status_messages
  for each row execute function set_updated_at();

create table if not exists status_reactions (
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
create table if not exists manito_assignments (
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
create table if not exists manito_prayers (
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

create table if not exists mind_talk_messages (
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

create table if not exists flagged_posts (
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

create table if not exists armor_catalog (
  id text primary key, -- 'helmet', 'shield' 등 armorShopData.ts와 동일한 문자열 id
  emoji text not null,
  name text not null,
  price int not null,
  description text not null,
  color_hex text not null,
  -- 'bonus' = 성경 인물 특별 아이템, 'seasonal' = 절기 한정판 코스튬, null = 기본 6종
  tag text check (tag in ('bonus', 'seasonal'))
);

create table if not exists student_armor (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  armor_id text not null references armor_catalog(id),
  tier text not null default 'basic' check (tier in ('basic', 'silver', 'gold', 'light')),
  is_equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  unique (student_id, armor_id)
);

-- 티어별 강화 비용. armorShopData.ts의 ARMOR_TIERS와 같은 값입니다.
-- 가격을 서버가 들고 있어야 앱을 고쳐도 공짜로 강화할 수 없습니다.
create table if not exists armor_tier_costs (
  tier text primary key check (tier in ('basic', 'silver', 'gold', 'light')),
  order_index int not null unique,
  upgrade_cost int not null
);
alter table armor_tier_costs enable row level security;
drop policy if exists "armor_tier_costs_read_all" on armor_tier_costs;
create policy "armor_tier_costs_read_all" on armor_tier_costs for select using (true);

-- 지금 로그인한 아이의 달란트와 갑주 상태를 한 번에 돌려줍니다.
-- 화면이 이 한 덩어리만 받아 쓰면 되므로 요청이 여러 번 오가지 않습니다.
create or replace function get_my_armor_state()
returns jsonb
language sql
stable
security definer
set search_path = public, extensions
as $$
  select jsonb_build_object(
    'talents', coalesce((select talent_points from students where id = current_student_id()), 0),
    'armor', coalesce((
      select jsonb_agg(jsonb_build_object('armorId', armor_id, 'tier', tier, 'isEquipped', is_equipped))
      from student_armor where student_id = current_student_id()
    ), '[]'::jsonb)
  );
$$;

-- 갑주 구매. 가격 확인과 달란트 차감을 서버가 한 번에 처리해,
-- 앱을 고쳐도 돈을 안 내고 살 수 없게 합니다.
create or replace function buy_armor(p_armor_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
  item_price int;
  my_talents int;
begin
  if me is null then raise exception '로그인이 필요해요'; end if;

  select price into item_price from armor_catalog where id = p_armor_id;
  if item_price is null then raise exception '없는 갑주예요'; end if;

  if exists (select 1 from student_armor where student_id = me and armor_id = p_armor_id) then
    raise exception 'ALREADY_OWNED';
  end if;

  select talent_points into my_talents from students where id = me;
  if my_talents < item_price then raise exception 'NOT_ENOUGH'; end if;

  insert into talent_transactions (student_id, amount, reason)
  values (me, -item_price, '갑주 구매: ' || p_armor_id);
  update students set talent_points = talent_points - item_price where id = me;
  insert into student_armor (student_id, armor_id) values (me, p_armor_id);

  return get_my_armor_state();
end;
$$;

-- 다음 티어로 강화. 비용도 서버가 armor_tier_costs에서 읽습니다.
create or replace function upgrade_armor(p_armor_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
  current_tier text;
  next_tier text;
  cost int;
  my_talents int;
begin
  if me is null then raise exception '로그인이 필요해요'; end if;

  select tier into current_tier from student_armor where student_id = me and armor_id = p_armor_id;
  if current_tier is null then raise exception 'NOT_OWNED'; end if;

  select t.tier, t.upgrade_cost into next_tier, cost
  from armor_tier_costs t
  where t.order_index = (select order_index + 1 from armor_tier_costs where tier = current_tier);
  if next_tier is null then raise exception 'MAX_TIER'; end if;

  select talent_points into my_talents from students where id = me;
  if my_talents < cost then raise exception 'NOT_ENOUGH'; end if;

  insert into talent_transactions (student_id, amount, reason)
  values (me, -cost, '갑주 강화: ' || p_armor_id || ' -> ' || next_tier);
  update students set talent_points = talent_points - cost where id = me;
  update student_armor set tier = next_tier where student_id = me and armor_id = p_armor_id;

  return get_my_armor_state();
end;
$$;

-- QT·퀴즈·감사 기록을 마쳤을 때 아이 스스로 받는 달란트입니다.
-- 지금은 앱이 "다 했다"고 알려 주는 구조라, 한 번에 받을 수 있는 양을 서버가 제한합니다.
-- QT 완료 기록 자체가 서버로 옮겨지면 그때 완료 여부까지 서버가 확인하게 바꿔야 합니다.
create or replace function earn_talents(p_amount int, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
begin
  if me is null then raise exception '로그인이 필요해요'; end if;
  if p_amount is null or p_amount < 1 or p_amount > 50 then
    raise exception 'INVALID_AMOUNT';
  end if;

  insert into talent_transactions (student_id, amount, reason)
  values (me, p_amount, p_reason);
  update students set talent_points = talent_points + p_amount where id = me;

  return get_my_armor_state();
end;
$$;

-- 착용/해제는 달란트가 오가지 않으므로 상태만 뒤집습니다.
create or replace function toggle_equip_armor(p_armor_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  me uuid := current_student_id();
begin
  if me is null then raise exception '로그인이 필요해요'; end if;

  update student_armor set is_equipped = not is_equipped
  where student_id = me and armor_id = p_armor_id;
  if not found then raise exception 'NOT_OWNED'; end if;

  return get_my_armor_state();
end;
$$;

-- =========================================================
-- 12. 가정 실천 미션 도장 (부모님 승인)
-- parentData.ts(MOCK_HOME_MISSIONS)에 대응합니다.
-- =========================================================

create table if not exists home_mission_submissions (
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
drop policy if exists "teachers_self_select" on teachers;
create policy "teachers_self_select" on teachers for select using (id = auth.uid());
drop policy if exists "teachers_self_update" on teachers;
create policy "teachers_self_update" on teachers for update using (id = auth.uid());

drop policy if exists "students_readable_by_owner_teacher_linked_parent" on students;
create policy "students_readable_by_owner_teacher_linked_parent" on students for select
  using (auth_user_id = auth.uid() or is_teacher() or is_linked_parent_of(id));
drop policy if exists "students_insert_by_teacher" on students;
create policy "students_insert_by_teacher" on students for insert with check (is_teacher());
drop policy if exists "students_update_by_owner_or_teacher" on students;
create policy "students_update_by_owner_or_teacher" on students for update
  using (auth_user_id = auth.uid() or is_teacher());

drop policy if exists "parents_self_select" on parents;
create policy "parents_self_select" on parents for select using (id = auth.uid());
drop policy if exists "parents_self_upsert" on parents;
create policy "parents_self_upsert" on parents for insert with check (id = auth.uid());
drop policy if exists "parents_self_update" on parents;
create policy "parents_self_update" on parents for update using (id = auth.uid());

drop policy if exists "parent_child_links_visible_to_parties" on parent_child_links;
create policy "parent_child_links_visible_to_parties" on parent_child_links for select
  using (parent_id = auth.uid() or is_teacher());
drop policy if exists "parent_child_links_insert_by_parent" on parent_child_links;
create policy "parent_child_links_insert_by_parent" on parent_child_links for insert
  with check (parent_id = auth.uid());

drop policy if exists "talent_transactions_visible_to_owner_teacher_parent" on talent_transactions;
create policy "talent_transactions_visible_to_owner_teacher_parent" on talent_transactions for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));

-- QT 템플릿: 전체 학생·부모는 게시된 것만, 선생님은 전체(초안 포함)
drop policy if exists "weekly_qt_templates_read_published" on weekly_qt_templates;
create policy "weekly_qt_templates_read_published" on weekly_qt_templates for select
  using (is_published or is_teacher());
drop policy if exists "weekly_qt_templates_write_by_teacher" on weekly_qt_templates;
create policy "weekly_qt_templates_write_by_teacher" on weekly_qt_templates for all
  using (is_teacher()) with check (is_teacher());

drop policy if exists "qt_completions_own_or_teacher_or_parent" on qt_completions;
create policy "qt_completions_own_or_teacher_or_parent" on qt_completions for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));
drop policy if exists "qt_completions_insert_own" on qt_completions;
create policy "qt_completions_insert_own" on qt_completions for insert
  with check (student_id = current_student_id());

-- WWJD 퀴즈
drop policy if exists "wwjd_quizzes_read_all" on wwjd_quizzes;
create policy "wwjd_quizzes_read_all" on wwjd_quizzes for select using (true);
drop policy if exists "wwjd_quizzes_write_by_teacher" on wwjd_quizzes;
create policy "wwjd_quizzes_write_by_teacher" on wwjd_quizzes for all
  using (is_teacher()) with check (is_teacher());
drop policy if exists "wwjd_quiz_attempts_own_or_teacher" on wwjd_quiz_attempts;
create policy "wwjd_quiz_attempts_own_or_teacher" on wwjd_quiz_attempts for select
  using (student_id = current_student_id() or is_teacher());
drop policy if exists "wwjd_quiz_attempts_insert_own" on wwjd_quiz_attempts;
create policy "wwjd_quiz_attempts_insert_own" on wwjd_quiz_attempts for insert
  with check (student_id = current_student_id());

-- 감사 보물상자: 12명 전체 공동체 공개이므로 로그인한 학생/선생님이면 모두 열람 가능
drop policy if exists "gratitude_posts_read_all_authenticated" on gratitude_posts;
create policy "gratitude_posts_read_all_authenticated" on gratitude_posts for select using (true);
drop policy if exists "gratitude_posts_insert_own" on gratitude_posts;
create policy "gratitude_posts_insert_own" on gratitude_posts for insert
  with check (student_id = current_student_id());
drop policy if exists "gratitude_reactions_read_all" on gratitude_reactions;
create policy "gratitude_reactions_read_all" on gratitude_reactions for select using (true);
drop policy if exists "gratitude_reactions_insert_own" on gratitude_reactions;
create policy "gratitude_reactions_insert_own" on gratitude_reactions for insert
  with check (reactor_student_id = current_student_id());

drop policy if exists "recommended_videos_read_all" on recommended_videos;
create policy "recommended_videos_read_all" on recommended_videos for select using (true);
drop policy if exists "recommended_videos_write_by_teacher" on recommended_videos;
create policy "recommended_videos_write_by_teacher" on recommended_videos for all
  using (is_teacher()) with check (is_teacher());

-- 알림장 & 캘린더: 전체 공개 읽기, 작성은 선생님만
drop policy if exists "notices_read_all" on notices;
create policy "notices_read_all" on notices for select using (true);
drop policy if exists "notices_write_by_teacher" on notices;
create policy "notices_write_by_teacher" on notices for all
  using (is_teacher()) with check (is_teacher());
drop policy if exists "calendar_events_read_all" on calendar_events;
create policy "calendar_events_read_all" on calendar_events for select using (true);
drop policy if exists "calendar_events_write_by_teacher" on calendar_events;
create policy "calendar_events_write_by_teacher" on calendar_events for all
  using (is_teacher()) with check (is_teacher());

-- 상태메시지: 12명 전체 공개, 본인만 수정
drop policy if exists "status_messages_read_all" on status_messages;
create policy "status_messages_read_all" on status_messages for select using (true);
drop policy if exists "status_messages_upsert_own" on status_messages;
create policy "status_messages_upsert_own" on status_messages for insert
  with check (student_id = current_student_id());
drop policy if exists "status_messages_update_own" on status_messages;
create policy "status_messages_update_own" on status_messages for update
  using (student_id = current_student_id());
drop policy if exists "status_reactions_read_all" on status_reactions;
create policy "status_reactions_read_all" on status_reactions for select using (true);
drop policy if exists "status_reactions_insert_own" on status_reactions;
create policy "status_reactions_insert_own" on status_reactions for insert
  with check (reactor_student_id = current_student_id());

-- 마니또: giver는 자신이 보낸 배정만, receiver는 배정 테이블에 접근 불가(발신자 비밀 보장)
drop policy if exists "manito_assignments_visible_to_giver_or_teacher" on manito_assignments;
create policy "manito_assignments_visible_to_giver_or_teacher" on manito_assignments for select
  using (giver_student_id = current_student_id() or is_teacher());
drop policy if exists "manito_assignments_write_by_teacher" on manito_assignments;
create policy "manito_assignments_write_by_teacher" on manito_assignments for all
  using (is_teacher()) with check (is_teacher());
-- 받은 편지함은 receiver_student_id로만 걸러 보이므로 누가 보냈는지는 절대 알 수 없습니다.
drop policy if exists "manito_prayers_visible_to_receiver_or_teacher" on manito_prayers;
create policy "manito_prayers_visible_to_receiver_or_teacher" on manito_prayers for select
  using (receiver_student_id = current_student_id() or is_teacher());
drop policy if exists "manito_prayers_insert_by_assigned_giver" on manito_prayers;
create policy "manito_prayers_insert_by_assigned_giver" on manito_prayers for insert
  with check (
    exists (
      select 1 from manito_assignments a
      where a.id = assignment_id and a.giver_student_id = current_student_id()
    )
  );

-- 마음 톡: 본인과 선생님만
drop policy if exists "mind_talk_messages_own_or_teacher" on mind_talk_messages;
create policy "mind_talk_messages_own_or_teacher" on mind_talk_messages for select
  using (student_id = current_student_id() or is_teacher());
drop policy if exists "mind_talk_messages_insert_own_or_teacher" on mind_talk_messages;
create policy "mind_talk_messages_insert_own_or_teacher" on mind_talk_messages for insert
  with check (
    (sender = 'student' and student_id = current_student_id())
    or (sender = 'teacher' and is_teacher())
  );

-- 안전 모니터링: 선생님 전용
drop policy if exists "flagged_posts_teacher_only" on flagged_posts;
create policy "flagged_posts_teacher_only" on flagged_posts for all
  using (is_teacher()) with check (is_teacher());

-- 전신갑주
drop policy if exists "armor_catalog_read_all" on armor_catalog;
create policy "armor_catalog_read_all" on armor_catalog for select using (true);
drop policy if exists "armor_catalog_write_by_teacher" on armor_catalog;
create policy "armor_catalog_write_by_teacher" on armor_catalog for all
  using (is_teacher()) with check (is_teacher());
drop policy if exists "student_armor_own_or_teacher_or_parent" on student_armor;
create policy "student_armor_own_or_teacher_or_parent" on student_armor for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));
drop policy if exists "student_armor_write_own" on student_armor;
create policy "student_armor_write_own" on student_armor for all
  using (student_id = current_student_id()) with check (student_id = current_student_id());

-- 가정 실천 미션: 본인 학생, 담당 선생님, 연동된 부모님만
drop policy if exists "home_mission_submissions_visible" on home_mission_submissions;
create policy "home_mission_submissions_visible" on home_mission_submissions for select
  using (student_id = current_student_id() or is_teacher() or is_linked_parent_of(student_id));
drop policy if exists "home_mission_submissions_insert_own" on home_mission_submissions;
create policy "home_mission_submissions_insert_own" on home_mission_submissions for insert
  with check (student_id = current_student_id());
drop policy if exists "home_mission_submissions_approve_by_parent" on home_mission_submissions;
create policy "home_mission_submissions_approve_by_parent" on home_mission_submissions for update
  using (is_linked_parent_of(student_id));
