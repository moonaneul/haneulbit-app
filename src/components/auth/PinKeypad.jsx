import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BORDER_RADIUS, COLORS } from '@/constants/theme';

const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * 아이가 작은 키보드를 사용하지 않고 큰 버튼으로 PIN을 입력하도록 돕는 숫자판입니다.
 * 입력과 지우기 동작은 부모 화면에서 전달받아 한 곳에서 상태를 관리합니다.
 */
export default function PinKeypad({ disabled, onDelete, onNumberPress }) {
  return (
    <View style={styles.keypad} accessibilityLabel="PIN 번호 입력판">
      {NUMBER_KEYS.map((number) => (
        <NumberButton
          key={number}
          disabled={disabled}
          label={number}
          onPress={() => onNumberPress(number)}
        />
      ))}
      <View style={styles.keyPlaceholder} />
      <NumberButton disabled={disabled} label="0" onPress={() => onNumberPress('0')} />
      <NumberButton
        accessibilityLabel="마지막 번호 지우기"
        disabled={disabled}
        label="⌫"
        onPress={onDelete}
      />
    </View>
  );
}

function NumberButton({ accessibilityLabel, disabled, label, onPress }) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? `${label}번`}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed, disabled && styles.disabled]}>
      <Text style={styles.keyText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keypad: {
    width: 276,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  key: {
    width: 76,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.button,
    backgroundColor: COLORS.surfaceMuted,
  },
  keyPressed: { transform: [{ scale: 0.94 }], backgroundColor: COLORS.primarySoft },
  disabled: { opacity: 0.45 },
  keyText: { color: COLORS.textPrimary, fontSize: 23, fontWeight: '800' },
  keyPlaceholder: { width: 76, height: 60 },
});
