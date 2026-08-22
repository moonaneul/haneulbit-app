import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, SHADOWS, Spacing } from '@/constants/theme';

export type ToastTone = 'info' | 'warn' | 'success';

interface ToastProps {
  /** null이면 아무것도 보여 주지 않습니다. */
  message: string | null;
  tone?: ToastTone;
  onHide: () => void;
}

const TONE_STYLE: Record<ToastTone, { bg: string; ink: string }> = {
  info: { bg: '#E4EEF6', ink: '#31556E' },
  warn: { bg: '#FFE7B8', ink: '#8A5A05' },
  success: { bg: '#D9EBD3', ink: '#2F6B36' },
};

/**
 * 화면 위쪽에 잠깐 떴다 사라지는 안내입니다.
 * Alert.alert()은 웹에서 아무 동작도 하지 않아, 어느 기기에서든 보이도록 화면 안에 그립니다.
 */
export default function Toast({ message, tone = 'info', onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (!message) return undefined;

    opacity.setValue(0);
    slide.setValue(-12);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();

    // 아이가 읽을 시간을 주되, 다음 동작을 가리지 않도록 곧 사라집니다.
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(onHide);
    }, 2600);

    return () => clearTimeout(timer);
  }, [message, onHide, opacity, slide]);

  if (!message) return null;
  const palette = TONE_STYLE[tone];

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrapper, { opacity, transform: [{ translateY: slide }] }]}>
      <View style={[styles.bubble, { backgroundColor: palette.bg }]}>
        <Text accessibilityLiveRegion="polite" style={[styles.text, { color: palette.ink }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = {
  wrapper: { alignItems: 'center', paddingHorizontal: Spacing.three } as const,
  bubble: {
    maxWidth: 420,
    borderRadius: BORDER_RADIUS.card,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    ...SHADOWS.soft,
  } as const,
  text: { fontFamily: Fonts.sans, fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 20 } as const,
};
