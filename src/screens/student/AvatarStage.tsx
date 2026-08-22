import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import HaneulCharacter from '@/components/character/HaneulCharacter';
import { SCENE } from '@/constants/theme';
import { MOCK_EQUIPPED_ARMOR } from './homeData';
import { homeStyles as styles } from './homeStyles';

interface AvatarStageProps {
  isTalking: boolean;
  onPress: () => void;
}

/**
 * 카드 안이 아니라 하늘빛 풍경의 언덕 위에 직접 서 있는 캐릭터입니다.
 * 배경과 캐릭터가 하나의 장면으로 보이도록 카드 배경 없이 그림자만 깔아 둡니다.
 */
export default function AvatarStage({ isTalking, onPress }: AvatarStageProps) {
  // 말풍선이 나타날 때 통통 튀는 크기 효과에 사용하는 값입니다.
  const [bubbleScale] = useState(() => new Animated.Value(0.85));
  // 캐릭터가 살아 있는 느낌이 나도록 아주 천천히 위아래로 움직입니다.
  const [floatOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!isTalking) return;
    bubbleScale.setValue(0.85);
    Animated.spring(bubbleScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [bubbleScale, isTalking]);

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(floatOffset, { toValue: -6, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatOffset, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    breathe.start();
    return () => breathe.stop();
  }, [floatOffset]);

  return (
    <View style={styles.stage}>
      <View style={styles.levelPill}><Text style={styles.levelText}>빛의 전신갑주 · LEVEL 3</Text></View>

      {isTalking && (
        <Animated.View style={[styles.speechBubble, { transform: [{ scale: bubbleScale }] }]}>
          <Text style={styles.speechText}>오늘도 말씀 읽을 준비 됐어? 🌸</Text>
          <View style={styles.speechTail} />
        </Animated.View>
      )}

      <Pressable
        accessibilityHint="누르면 아바타의 응원 말풍선이 나타납니다"
        accessibilityLabel="하나님의 전신갑주를 입은 내 아바타"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarPressed]}>
        {/* 캐릭터가 땅을 밟고 서 있도록 발밑에 둔덕을 깔되,
            양옆이 뚝 끊기지 않게 넓은 타원으로 그려 배경 언덕과 자연스럽게 이어지게 합니다. */}
        <Svg height={210} pointerEvents="none" style={styles.stageGround} width={560}>
          <Defs>
            <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFF6D2" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#FFF6D2" stopOpacity="0" />
            </RadialGradient>
            {/* 가장자리를 투명하게 흘려 둔덕이 하늘 배경에 스며들게 합니다. */}
            <RadialGradient id="mound" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={SCENE.hillNear} stopOpacity="1" />
              <Stop offset="0.6" stopColor={SCENE.hillNear} stopOpacity="0.95" />
              <Stop offset="1" stopColor={SCENE.hillNear} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="280" cy="92" rx="120" ry="98" fill="url(#halo)" />
          <Ellipse cx="280" cy="178" rx="250" ry="30" fill="url(#mound)" />
          <Ellipse cx="280" cy="176" rx="56" ry="9" fill={SCENE.hillShade} opacity={0.3} />
        </Svg>

        <Animated.View style={{ alignItems: 'center', transform: [{ translateY: floatOffset }] }}>
          <HaneulCharacter equipped={MOCK_EQUIPPED_ARMOR} size={168} />
        </Animated.View>
      </Pressable>

      <Text style={styles.tapGuide}>캐릭터를 톡 눌러 봐!</Text>
    </View>
  );
}
