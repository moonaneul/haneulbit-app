import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { SCENE } from '@/constants/theme';

interface SkySceneProps {
  children: ReactNode;
  /** 언덕을 숨기고 하늘만 쓰고 싶은 화면(목록형 등)에서 false로 둡니다. */
  showHills?: boolean;
}

/**
 * 앱의 모든 화면이 놓이는 '하늘빛 풍경' 배경입니다.
 * 카드를 흰 바탕에 나열하는 대신, 하나의 풍경 위에 UI가 얹히도록 만들어
 * 화면 전환에도 같은 세계 안에 있는 느낌을 유지합니다.
 */
export default function SkyScene({ children, showHills = true }: SkySceneProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={SCENE.sky}
        locations={SCENE.skyLocations}
        style={StyleSheet.absoluteFill}
      />

      {/* 하늘에 옅게 떠 있는 구름 */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Ellipse cx="18%" cy="12%" rx="16%" ry="4%" fill={SCENE.cloud} opacity={0.75} />
        <Ellipse cx="26%" cy="14%" rx="11%" ry="3%" fill={SCENE.cloud} opacity={0.6} />
        <Ellipse cx="82%" cy="22%" rx="18%" ry="4.5%" fill={SCENE.cloud} opacity={0.6} />
        <Ellipse cx="70%" cy="7%" rx="12%" ry="3%" fill={SCENE.cloud} opacity={0.45} />
      </Svg>

      {/* 화면 아래쪽에 완만하게 깔리는 언덕 */}
      {showHills && (
        <Svg
          height="34%"
          pointerEvents="none"
          preserveAspectRatio="none"
          style={styles.hills}
          viewBox="0 0 100 40"
          width="100%">
          <Path d="M0 18 Q 22 6 46 15 T 100 10 L100 40 L0 40 Z" fill={SCENE.hillFar} opacity={0.75} />
          <Path d="M0 26 Q 30 14 58 24 T 100 20 L100 40 L0 40 Z" fill={SCENE.hillNear} />
          <Path d="M0 34 Q 26 28 52 33 T 100 31 L100 40 L0 40 Z" fill={SCENE.hillShade} opacity={0.55} />
        </Svg>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hills: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
