import { View } from 'react-native';

import { BORDER_RADIUS, COLORS, SHADOWS } from '@/constants/theme';

/** 모든 화면의 카드가 같은 배경, 곡률, 그림자를 사용하도록 만든 공통 표면입니다. */
export default function Surface({ children, style, ...viewProps }) {
  return (
    <View
      {...viewProps}
      style={[
        {
          backgroundColor: COLORS.cardBackground,
          borderRadius: BORDER_RADIUS.card,
          ...SHADOWS.soft,
        },
        style,
      ]}>
      {children}
    </View>
  );
}
