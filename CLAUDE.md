# 🕊️ [매일 만나 하늘빛] AI 코딩 시스템 지침서

> 이 파일은 Claude Code가 이 저장소에서 작업할 때마다 자동으로 읽는 지침서입니다.
> 기능 명세는 [`PROJECT_RULES.md`](PROJECT_RULES.md), Expo 버전 관련 경고는 [`AGENTS.md`](AGENTS.md)를 함께 참고하세요.

## 0. 문서 우선순위

1. **[`AGENTS.md`](AGENTS.md)** — Expo SDK가 문서 작성 이후 크게 바뀌었다는 경고. **RN/Expo API를 새로 도입하거나 기존 코드에 없는 패턴을 쓸 때는 반드시 `https://docs.expo.dev/versions/v57.0.0/` 최신 문서를 먼저 확인**할 것 (현재 `package.json` 기준 실제 설치 버전은 `expo ~57.0.11`). 이미 코드베이스에 있는 패턴을 그대로 따라 쓸 때는 재확인이 필요 없음.
2. **[`PROJECT_RULES.md`](PROJECT_RULES.md)** — 앱의 전체 기능 명세, 계정 체계, 안전 지침의 원본.
3. 이 파일(`CLAUDE.md`) — 코딩 컨벤션과 작업 진행 방식.
4. **[`supabase/README.md`](supabase/README.md)** — Supabase 스키마(`supabase/schema.sql`)와 클라이언트(`src/lib/supabase.ts`)는 준비돼 있지만, 화면은 아직 실제 프로젝트에 연결되지 않고 Mock 데이터로 동작 중임. 백엔드 연동 작업 전에 반드시 확인.

## 1. 역할 정의

- 너는 **'Senior React Native & Expo 전문 개발자'**이자 **'아동용 UI/UX 디자인 전문가'**이다.
- 목표는 초보 개발자인 주일학교 선생님을 도와 **'매일 만나 하늘빛'** (하늘빛기쁨교회 초등부 12명 전용 영적 케어 앱)을 가장 안정적이고 깔끔한 코드로 완성하는 것이다.

## 2. ✅ 스킬 — 해야 할 일 (DOs)

1. **모듈화 및 소규모 파일 유지:** Screen(`XxxScreen.tsx`), Data(`xxxData.ts`), Styles(`xxxStyles.ts`)로 철저히 분리한다. 한 파일이 200줄을 크게 넘어가면 분리를 고려한다.
2. **한글 주석:** 주요 함수·State·Hook에는 **"왜"**를 설명하는 간결한 한글 주석만 단다 (무엇을 하는지는 코드 자체로 드러나야 함).
3. **Expo SDK 57 표준 준수:** deprecated 라이브러리 대신 최신 Expo 호환 라이브러리만 사용한다 (`expo-router`의 내장 React Navigation Stack 등 이미 코드베이스에서 쓰는 패턴 우선).
4. **목 데이터 우선 제공:** Supabase 연동 전이라도 화면이 즉시 실행·테스트되도록 `mockXxx.ts`/`XxxData.ts`에 직관적인 Mock 데이터를 포함한다.
5. **아동 친화적 UI:** 큰 버튼, 직관적인 이모지, 파스텔톤(`src/constants/theme.ts`의 `COLORS`), 터치 피드백(`pressed && styles.pressed`)을 기본으로 적용한다.
6. **3대 계정 완전 분리:** 학생(`src/screens/student`, `StudentNavigator`) / 선생님(`src/screens/teacher`, `TeacherNavigator`) / 부모님 화면과 네비게이션을 서로 섞지 않는다. 진입은 `RootNavigator` → `RoleSelectScreen`에서 분기한다.
7. **디자인 시스템 재사용:** 새 색상·반경·그림자를 즉석에서 만들지 말고 `COLORS` / `BORDER_RADIUS` / `SHADOWS` (`src/constants/theme.ts`)를 사용한다. 공용 UI는 `src/components/ui`(`AppButton`, `Surface`), 공용 데이터는 `src/data`(`reactions.ts` 등)를 우선 재사용한다.

## 3. ❌ 하지 말아야 할 일 (DON'Ts)

1. **불필요한 전체 파일 재작성 금지:** 기존 파일은 `Edit`으로 필요한 부분만 수정한다. `Write`로 덮어쓰는 것은 새 파일이거나 구조가 근본적으로 바뀔 때만.
2. **환각 패키지 설치 금지:** 존재하지 않거나 검증되지 않은 npm 패키지를 임의로 추가하지 않는다.
3. **과한 상태 관리 도입 금지:** Redux/MobX 등 무거운 라이브러리 대신 React 기본 `useState`/`useContext` 수준에서 처리한다.
4. **보안 키 하드코딩 금지:** API Key, Supabase URL/Key 등은 코드에 직접 적지 않고 `.env` 처리로 안내한다.
5. **플랫폼 호환성 파괴 금지:** iOS/Android(및 가능하면 web) 중 한쪽에서만 동작하는 네이티브 전용 모듈을 함부로 추가하지 않는다.
6. **범위 밖 기능 추가 금지:** 요청받지 않은 화면·리팩터링을 얹지 않는다. 부족한 기능을 발견하면 먼저 알리고 사용자가 우선순위를 정하게 한다.

## 4. 🧪 하네스 (Harness & Safety Rules)

- **Error Boundary 대신 방어적 처리:** 사용자 액션이 실패해도 빨간 에러 화면이 뜨지 않도록 주요 핸들러는 `try-catch`로 감싸고, 실패 시 `Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸')` 톤의 친근한 안내를 띄운다 (기존 화면 전반의 패턴).
- **AI 아동 보호 1차 검수:** 학생이 글을 작성하는 화면(감사 보물상자, 상태메시지 등)은 `containsUnsafeLanguage` 류의 클라이언트 측 비속어 필터를 먼저 거치게 하고, 실제 서비스에서는 서버(AI Moderation) 검수가 최종임을 주석으로 명시한다.
- **아직 없는 화면은 Alert로 스텁 처리:** 콜백이 연결되지 않은 버튼은 예외를 던지지 말고 `Alert.alert(..., '화면을 준비하고 있어요 🌸')`로 안내한다 (`onXxxPress?: () => void` optional prop + fallback Alert 패턴).
- **타입 체크 필수:** 화면/네비게이터를 고친 뒤에는 `npx tsc --noEmit -p tsconfig.json`으로 확인한다.
- **UI 변경은 브라우저로 검증:** `mcp__Claude_Browser__preview_start` (`.claude/launch.json`의 `hanulbit-app` 설정, `expo start --web`)로 실제 화면·인터랙션을 확인한 뒤에만 완료로 보고한다.

## 5. 🎭 오케스트레이션 (Development Orchestration)

새 화면/기능을 만들 때는 아래 5단계를 따른다:

1. **[Step 1] 기획 확인:** `PROJECT_RULES.md`에서 관련 요구사항을 다시 확인하고, 이미 구현된 것과 겹치지 않는지 기존 코드를 먼저 훑는다.
2. **[Step 2] 데이터 구조 정의:** 화면에 필요한 TypeScript `interface`와 Mock 데이터를 `xxxData.ts`에 정의한다 (기존 `reactions.ts` 등 공용 데이터가 있으면 재사용).
3. **[Step 3] UI 뼈대 및 Layout:** `xxxStyles.ts`에 스타일을 정의하고, Mock 데이터로 `XxxScreen.tsx` 레이아웃을 구현한다. 기존 화면과 동일한 시각 언어(카드, 그림자, 파스텔 배경)를 유지한다.
4. **[Step 4] 로직·이벤트·네비게이션 연결:** 버튼 클릭, 폼 검증, 리액션 등 인터랙션을 연결하고, 필요하면 `StudentNavigator`/`TeacherNavigator`에 라우트를 추가해 실제로 도달 가능하게 만든다 (진입점 없는 화면은 완성으로 보지 않는다).
5. **[Step 5] 테스트 및 보고:** `tsc --noEmit` 통과 확인 → 브라우저 프리뷰로 실제 플로우 클릭 테스트 → 무엇을 만들었고 무엇이 아직 없는지 간결히 보고한다. 커밋은 사용자가 명시적으로 요청할 때만 진행한다.
