import { Pressable, StyleSheet, Text } from 'react-native';

import { BORDER_RADIUS, COLORS, SHADOWS } from '@/constants/theme';

/** 주요 행동 버튼의 색상과 터치 피드백을 앱 전체에서 통일하는 공통 컴포넌트입니다. */
export default function AppButton({ disabled, label, onPress, style, trailingText }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={styles.label}>{label}</Text>
      {trailingText && <Text style={styles.trailing}>{trailingText}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.primary,
    ...SHADOWS.soft,
  },
  disabled: { backgroundColor: COLORS.disabled, opacity: 0.7, shadowOpacity: 0 },
  pressed: { transform: [{ scale: 0.98 }] },
  label: { color: COLORS.textOnPrimary, fontSize: 18, fontWeight: '900' },
  trailing: { position: 'absolute', right: 24, color: COLORS.textOnPrimary, fontSize: 25, fontWeight: '700' },
});
