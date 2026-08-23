import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { BORDER_RADIUS, COLORS, GLASS, SHADOWS } from '@/constants/theme';

interface GlassCardProps extends ViewProps {
  children: ReactNode;
  /** strong=글자가 많은 카드, soft=배경 풍경을 더 비추는 카드 */
  tone?: 'default' | 'strong' | 'soft';
  style?: ViewStyle | ViewStyle[];
}

/** 하늘빛 풍경 위에 유리처럼 떠 있는 공용 카드입니다. */
export default function GlassCard({ children, tone = 'default', style, ...viewProps }: GlassCardProps) {
  return (
    <View {...viewProps} style={[styles.card, styles[tone], style]}>
      {children}
    </View>
  );
}

// 앱의 다른 카드들과 완전히 같은 재질로 보이도록 COLORS.cardBackground를 그대로 씁니다.
const styles = StyleSheet.create({
  card: {
    ...SHADOWS.soft,
    borderRadius: BORDER_RADIUS.card,
    backgroundColor: COLORS.cardBackground,
  },
  default: {},
  strong: { backgroundColor: GLASS.surfaceStrong },
  soft: { backgroundColor: GLASS.surfaceSoft },
});
