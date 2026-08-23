import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { REACTION_OPTIONS, type ReactionKey } from '@/data/reactions';
import { MOCK_COMMUNITY_STATUS_POSTS } from './statusFeedData';
import { statusFeedStyles as styles } from './statusFeedStyles';

interface StatusFeedScreenProps {
  myName: string;
  myMessage: string;
}

/** 12명 전체 공동체에 공개되는 한 줄 상태메시지 게시판입니다. */
export default function StatusFeedScreen({ myName, myMessage }: StatusFeedScreenProps) {
  // 친구마다 마지막으로 고른 응원 스티커 한 개를 기억합니다.
  const [reactions, setReactions] = useState<Record<string, ReactionKey>>({});

  const handleReactionPress = (postId: string, reactionKey: ReactionKey) => {
    setReactions((current) => ({ ...current, [postId]: reactionKey }));
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>우리 마을 마음 게시판 🌍</Text>
            <Text style={styles.caption}>
              친구 다짐에 스티커로 마음을 전해 줘!
            </Text>
          </View>

          <View style={styles.myCard}>
            <View style={styles.meBadge}><Text style={styles.meBadgeText}>나의 다짐</Text></View>
            <Text style={styles.postName}>{myName}</Text>
            <Text style={styles.postMessage}>{myMessage}</Text>
          </View>

          <View style={styles.postList}>
            {MOCK_COMMUNITY_STATUS_POSTS.map((post) => {
              const selectedReaction = reactions[post.id];
              return (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.avatarCircle}><Text style={styles.avatar}>{post.avatar}</Text></View>
                    <View style={styles.postIdentity}>
                      <Text style={styles.postName}>{post.name}</Text>
                    </View>
                  </View>
                  <Text style={styles.postMessage}>{post.message}</Text>
                  <View style={styles.reactionRow}>
                    {REACTION_OPTIONS.map((option) => {
                      const isSelected = selectedReaction === option.key;
                      return (
                        <Pressable
                          accessibilityLabel={`${post.name}에게 ${option.label} 스티커 보내기`}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                          key={option.key}
                          onPress={() => handleReactionPress(post.id, option.key)}
                          style={({ pressed }) => [
                            styles.reactionButton,
                            isSelected && styles.reactionSelected,
                            pressed && styles.reactionPressed,
                          ]}>
                          <Text style={[styles.reactionText, isSelected && styles.reactionTextSelected]}>
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {selectedReaction && (
                    <Text style={styles.reactionFeedback}>응원 스티커를 보냈어요! ✨</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SkyScene>
  );
}
