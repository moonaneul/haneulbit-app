# Supabase 연동 가이드

이 폴더는 실제 Supabase 프로젝트를 만들 때 필요한 파일을 모아 둔 곳이에요.
아직 화면 코드는 Mock 데이터(각 `xxxData.ts`)로 동작하고 있고, 이 스키마와는
연결되어 있지 않아요. 아래 순서대로 진행하면 실제 연동을 시작할 수 있어요.

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com)에서 무료 계정을 만들고 새 프로젝트를 생성해요.
2. 프로젝트가 만들어지면 왼쪽 메뉴의 **Connect** 버튼을 눌러 **Project URL**과
   **anon public key**를 복사해 둬요.

## 2. 스키마 적용하기

1. Supabase 대시보드 왼쪽 메뉴에서 **SQL Editor**를 열어요.
2. 이 폴더의 [`schema.sql`](schema.sql) 파일 내용을 전체 복사해서 붙여넣고 실행해요.
   - 학생/선생님/부모님 계정, QT·퀴즈·감사·마니또·마음톡·전신갑주·안전 모니터링 등
     지금까지 만든 모든 화면의 Mock 데이터에 대응하는 테이블이 한 번에 만들어져요.
   - 표 하나하나가 어떤 화면의 Mock 데이터(`xxxData.ts`)와 짝인지 파일 안 주석에 적어 뒀어요.
3. 이어서 [`seed.sql`](seed.sql)도 실행해요. 계정이 없어도 채울 수 있는
   전신갑주 상점 목록(`armor_catalog`)을 미리 넣어 둬요.

## 3. 앱에 연결 정보 넣기

1. 프로젝트 루트의 `.env.example`을 복사해서 `.env` 파일을 만들어요.
2. `.env` 안의 두 값을 1번에서 복사해 둔 Project URL / anon key로 바꿔요.
3. `.env`는 `.gitignore`에 이미 등록돼 있어서 커밋되지 않아요 — 안심하고 실제 값을 넣어도 돼요.

이 세 단계까지 마치면 `src/lib/supabase.ts`의 클라이언트가 실제 프로젝트에 연결돼요.
(단, 아직 각 화면이 Mock 데이터 대신 이 클라이언트를 쓰도록 바꾸는 작업은 다음 단계예요.)

## 4. 로그인 방식 참고

- **학생**: 이메일이 없으므로 Supabase Auth의 "익명 로그인"으로 세션만 먼저 만들고,
  `claim_student_login(이름, PIN)` 함수를 호출해 해당 학생 행에 연결해요.
- **선생님**: Supabase Auth 이메일/비밀번호 로그인 후 `teachers` 테이블에 프로필을 만들어요.
- **부모님**: Supabase Auth 휴대폰 번호 OTP 로그인 후, 선생님이 알려준 연동 코드로
  `parent_child_links`에 자녀를 연결해요.

세 방식 모두 `schema.sql`의 헬퍼 함수와 RLS 정책에 이미 반영돼 있어요.

## 다음 단계 (아직 안 한 일)

- 각 화면의 `xxxData.ts` Mock 배열을 `supabase.from('테이블명')` 조회로 교체하기
- 로그인 화면들을 `supabase.auth`와 `claim_student_login` 등 RPC 호출로 교체하기
- AI TTS 음성 생성, AI 비속어 검수를 실제 Edge Function/외부 API로 교체하기
