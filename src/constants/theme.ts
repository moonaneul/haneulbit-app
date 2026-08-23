// 🎨 [매일 만나 하늘빛] 전체 앱 공통 디자인 테마 시스템

import { Platform } from "react-native";

export const COLORS = {
  // 메인 배경 및 카드 색상
  background: "#FFFEFC", // 노란 기를 줄인 밝고 따뜻한 웜 화이트
  // 앱 전체가 하늘빛 풍경 위에 놓이므로, 카드는 배경이 살짝 비치는 유리처럼 만듭니다.
  cardBackground: "rgba(255, 255, 255, 0.82)",
  // 카드 안쪽의 입력창·칩은 흰색을 덧칠하면 카드와 구분이 안 되므로 살짝 눌린 톤을 씁니다.
  surfaceMuted: "rgba(62, 90, 107, 0.07)",
  // 어두운 배경 위에 뜨는 모달처럼 뒤가 비치면 안 되는 표면입니다.
  surfaceOpaque: "#FFFFFF",

  // 주 포인트 색상 (파스텔 톤)
  primary: "#F47F68", // 눈부시지 않은 소프트 코랄 (주요 행동 버튼)
  primarySoft: "#FFF2ED", // 선택 카드와 PIN 피드백 배경
  secondary: "#FFBD24", // 햇살 같은 사프란 옐로 (대표 일러스트)
  accent: "#9BC8C1", // 차갑지 않은 세이지 블루 (3분 QT)
  accentSoft: "#EFF7F4", // 안내 영역에 쓰는 옅은 미스트 민트
  mint: "#B8D59B", // 차분한 리프 그린 (퀴즈/성장)
  pink: "#F3B8B2", // 부드러운 피치 핑크 (마음톡)

  // 텍스트 색상
  textPrimary: "#292A2D", // 선명한 웜 차콜
  textSecondary: "#96918A", // 부드러운 설명용 회색
  textOnPrimary: "#FFFFFF", // 포인트 버튼 위 텍스트
  disabled: "#ECE9E4", // 비활성 버튼

  // 상태 색상
  success: "#66BB6A",
  warning: "#FFA726",
};

// 목록 안에서 여러 번 반복되는 버튼용 색 조합입니다.
// 진한 단색을 아홉 번 쌓으면 화면이 시끄러워지고, 흰 글자는 대비가 낮아 잘 안 보입니다.
// 연한 배경 + 진한 같은 계열 글자로 두면 조용하면서 글자도 또렷합니다.
export const SOFT_BUTTON = {
  buy: { bg: "#FBD5CB", ink: "#A03C25" },
  equip: { bg: "#DCEBE8", ink: "#2E6660" },
  equipped: { bg: "#D9EBD3", ink: "#2F6B36" },
  upgrade: { bg: "#FFE7B8", ink: "#8A5A05" },
};

// 🌤️ 화면 전체를 채우는 '하늘빛 풍경' 색상
// 카드를 흰 배경에 나열하는 대신, 앱 전체가 하나의 하늘 풍경 위에 놓이도록 합니다.
export const SCENE = {
  // 위에서 아래로 이어지는 아침 하늘 그라데이션
  sky: ["#A7CDEC", "#C6E0F1", "#EAF1F0", "#FDF0E4"] as const,
  skyLocations: [0, 0.32, 0.62, 1] as const,
  cloud: "rgba(255, 255, 255, 0.72)",
  hillFar: "#CADEC2", // 멀리 있는 옅은 언덕
  hillNear: "#B2D19E", // 캐릭터가 서 있는 가까운 언덕
  hillShade: "#A3C68F", // 언덕의 그림자 결
};

// 풍경 위에 유리처럼 얹히는 반투명 표면
export const GLASS = {
  surface: "rgba(255, 255, 255, 0.78)", // 기본 유리 카드
  surfaceStrong: "rgba(255, 255, 255, 0.92)", // 글자가 많아 또렷해야 하는 카드
  surfaceSoft: "rgba(255, 255, 255, 0.55)", // 배경을 더 비추는 옅은 표면
  border: "rgba(255, 255, 255, 0.9)", // 유리 가장자리 하이라이트
  borderSoft: "rgba(255, 255, 255, 0.6)",
};

export const SHADOWS = {
  // 하늘빛 풍경 위에 얹히므로 그림자도 따뜻한 갈색 대신 서늘한 하늘색 계열을 씁니다.
  soft: {
    shadowColor: "#3E5A6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 3, // 안드로이드용 그림자
  },
  // 풍경 위에 떠 있는 유리 카드용 그림자 (조금 더 넓고 옅게)
  float: {
    shadowColor: "#3E5A6B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 5,
  },
};

export const BORDER_RADIUS = {
  card: 24, // 카드 모서리 곡률 (동글동글)
  button: 24, // 버튼 모서리 곡률
  badge: 999, // 알약 모양 뱃지
};

// 기존 Expo 템플릿의 테마 Hook이 새 디자인 토큰을 그대로 사용하도록 연결합니다.
export const Colors = {
  light: {
    text: COLORS.textPrimary,
    background: COLORS.background,
    backgroundElement: COLORS.surfaceMuted,
    backgroundSelected: COLORS.primarySoft,
    textSecondary: COLORS.textSecondary,
  },
  dark: {
    text: COLORS.textPrimary,
    background: COLORS.background,
    backgroundElement: COLORS.surfaceMuted,
    backgroundSelected: COLORS.primarySoft,
    textSecondary: COLORS.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// 앱 전체가 쓰는 글꼴입니다.
//
// display: 제목 전용으로 앱에 번들한 둥근 한글 폰트(Jua)입니다.
//   굵기가 하나뿐이므로 이 글꼴을 쓰는 곳에는 fontWeight를 주지 않습니다.
// sans: 본문 전용. 한글 폰트는 글자 수가 많아 굵기 하나당 6MB나 되기 때문에,
//   본문까지 번들하면 앱이 20MB 넘게 무거워집니다. 각 플랫폼이 기본으로 가진
//   한글 폰트가 가독성도 좋고 굵기도 전부 지원해서 그대로 씁니다.
export const Fonts = {
  display: "Jua_400Regular",
  sans:
    Platform.select({
      ios: "Apple SD Gothic Neo",
      android: "sans-serif",
      web: "'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
    }) ?? "normal",
  mono:
    Platform.select({ ios: "ui-monospace", android: "monospace" }) ??
    "monospace",
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
