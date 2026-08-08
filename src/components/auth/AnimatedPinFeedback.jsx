import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { loginStyles as styles } from '@/screens/auth/loginStyles';

const PIN_LENGTH = 4;

/** PIN이 입력될 때 해당 칸의 별이 통통 튀어 오르는 피드백을 보여 줍니다. */
export default function AnimatedPinFeedback({ pinLength }) {
  // 네 개의 칸이 서로 독립적으로 움직일 수 있도록 애니메이션 값을 각각 만듭니다.
  const [scales] = useState(() =>
    Array.from({ length: PIN_LENGTH }, () => new Animated.Value(1)),
  );
  const previousLength = useRef(0);

  useEffect(() => {
    // 숫자가 추가된 경우에만 새로 채워진 별을 작게 시작해 통통 튀게 합니다.
    if (pinLength > previousLength.current) {
      const newStar = scales[pinLength - 1];
      newStar.setValue(0.35);
      Animated.spring(newStar, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }).start();
    }
    previousLength.current = pinLength;
  }, [pinLength, scales]);

  return (
    <View style={styles.pinFeedback} accessibilityLabel={`PIN ${pinLength}자리 입력됨`}>
      {scales.map((scale, index) => {
        const isFilled = index < pinLength;
        return (
          <View key={index} style={[styles.pinSlot, isFilled && styles.pinSlotFilled]}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <Text style={[styles.pinSymbol, isFilled && styles.pinSymbolFilled]}>
                {isFilled ? '⭐' : '•'}
              </Text>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
}
