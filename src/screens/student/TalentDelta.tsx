import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { Fonts } from '@/constants/theme';

interface TalentDeltaProps {
  /** 차감이면 음수, 적립이면 양수. null이면 표시하지 않습니다. */
  amount: number | null;
  onDone: () => void;
}

/**
 * 달란트가 얼마나 줄었는지 숫자로 잠깐 띄웁니다.
 * 배지의 숫자만 바뀌면 아이가 얼마를 썼는지 알아채기 어렵기 때문입니다.
 */
export default function TalentDelta({ amount, onDone }: TalentDeltaProps) {
  const rise = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (amount === null) return undefined;

    rise.setValue(0);
    fade.setValue(1);
    Animated.parallel([
      Animated.timing(rise, { toValue: -26, duration: 900, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(onDone);

    return undefined;
  }, [amount, fade, onDone, rise]);

  if (amount === null) return null;

  return (
    <Animated.Text
      style={{
        color: amount < 0 ? '#A03C25' : '#2F6B36',
        fontFamily: Fonts.display,
        fontSize: 18,
        opacity: fade,
        transform: [{ translateY: rise }],
      }}>
      {amount < 0 ? '' : '+'}{amount}pt
    </Animated.Text>
  );
}
