import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { homeStyles as styles } from './homeStyles';

interface AvatarCardProps {
  isTalking: boolean;
  onPress: () => void;
  onShopPress: () => void;
}

/** 전신갑주를 입은 학생 아바타와 터치 말풍선을 보여 줍니다. */
export default function AvatarCard({ isTalking, onPress, onShopPress }: AvatarCardProps) {
  // 말풍선이 나타날 때 통통 튀는 크기 효과에 사용하는 값입니다.
  const [bubbleScale] = useState(() => new Animated.Value(0.85));

  useEffect(() => {
    if (!isTalking) return;
    bubbleScale.setValue(0.85);
    Animated.spring(bubbleScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [bubbleScale, isTalking]);

  return (
    <View style={styles.avatarCard}>
      <View style={styles.avatarHeading}>
        <View>
          <Text style={styles.eyebrow}>나의 믿음 용사</Text>
          <Text style={styles.avatarTitle}>빛의 전신갑주</Text>
        </View>
        <View style={styles.levelBadge}><Text style={styles.levelText}>LEVEL 3</Text></View>
      </View>

      {isTalking && (
        <Animated.View style={[styles.speechBubble, { transform: [{ scale: bubbleScale }] }] }>
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
        <View style={styles.aura}>
          <Text style={styles.helmet}>✨🪖✨</Text>
          <Text style={styles.character}>🧒🏻</Text>
          <Text style={styles.armor}>🛡️ 🗡️</Text>
          <Text style={styles.boots}>🥾　🥾</Text>
        </View>
      </Pressable>
      <Text style={styles.tapGuide}>캐릭터를 톡 눌러 봐!</Text>
      <Pressable
        accessibilityHint="달란트로 전신갑주를 구매하고 착용할 수 있습니다"
        accessibilityLabel="달란트 상점 가기"
        accessibilityRole="button"
        onPress={onShopPress}
        style={({ pressed }) => [styles.shopButton, pressed && styles.avatarPressed]}>
        <Text style={styles.shopButtonText}>달란트 상점 가기 🛡️</Text>
      </Pressable>
    </View>
  );
}
