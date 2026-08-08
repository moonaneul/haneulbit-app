import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { MOCK_FRIEND_QT_POSTS, REACTION_OPTIONS, type ReactionKey } from './qtData';
import { qtStyles as styles } from './qtStyles';

interface QtFriendFeedProps {
  isUnlocked: boolean;
}

/** 내 나눔 등록 여부에 따라 잠금 카드 또는 친구들의 QT 피드를 보여 줍니다. */
export function QtFriendFeed({ isUnlocked }: QtFriendFeedProps) {
  // 친구마다 마지막으로 고른 응원 스티커 한 개를 기억합니다.
  const [reactions, setReactions] = useState<Record<string, ReactionKey>>({});

  if (!isUnlocked) {
    return (
      <View style={[styles.card, styles.lockedCard]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockedText}>내 큐티를 등록하면 친구들의 나눔을 볼 수 있어요!</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.feedTitle}>🔓 친구들의 오늘 큐티</Text>
      {MOCK_FRIEND_QT_POSTS.map((post) => (
        <View key={post.id} style={[styles.card, styles.friendCard]}>
          <Text style={styles.friendName}>{post.name}</Text>
          <Text style={styles.friendReflection}>{post.reflection}</Text>
          <View style={styles.reactionRow}>
            {REACTION_OPTIONS.map((option) => {
              const isSelected = reactions[post.id] === option.key;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() =>
                    setReactions((current) => ({ ...current, [post.id]: option.key }))
                  }
                  style={({ pressed }) => [
                    styles.reactionButton,
                    isSelected && styles.reactionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.reactionText, isSelected && styles.reactionTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {reactions[post.id] && (
            <Text style={styles.reactionFeedback}>응원 스티커를 보냈어요! ✨</Text>
          )}
        </View>
      ))}
    </View>
  );
}
