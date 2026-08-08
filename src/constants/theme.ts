// 🎨 [매일 만나 하늘빛] 전체 앱 공통 디자인 테마 시스템

import { Platform } from "react-native";

export const COLORS = {
  // 메인 배경 및 카드 색상
  background: "#FFFEFC", // 노란 기를 줄인 밝고 따뜻한 웜 화이트
  cardBackground: "#FFFFFF", // 깨끗한 하얀색 카드
  surfaceMuted: "#F7F5F1", // 입력창과 키패드에 쓰는 웜 뉴트럴

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

export const SHADOWS = {
  // 스티커처럼 살짝 떠 있는 듯한 입체 소프트 그림자
  soft: {
    shadowColor: "#695D50",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3, // 안드로이드용 그림자
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

// 각 속성에 fallback을 두어 어떤 플랫폼에서도 Fonts 자체나 mono가 undefined가 되지 않습니다.
export const Fonts = {
  sans:
    Platform.select({ ios: "system-ui", web: "var(--font-display)" }) ??
    "normal",
  serif:
    Platform.select({ ios: "ui-serif", web: "var(--font-serif)" }) ?? "serif",
  rounded:
    Platform.select({ ios: "ui-rounded", web: "var(--font-rounded)" }) ??
    "normal",
  mono:
    Platform.select({ ios: "ui-monospace", web: "var(--font-mono)" }) ??
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
