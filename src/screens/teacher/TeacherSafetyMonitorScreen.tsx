import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { MOCK_FLAGGED_POSTS, SOURCE_LABELS, type FlaggedPost, type FlaggedStatus } from './teacherSafetyData';
import { teacherSafetyStyles as styles } from './teacherSafetyStyles';

type FilterTab = 'pending' | 'done';

/** AI가 1차로 감지한 학생 게시글을 선생님이 최종 승인/차단하는 검수함입니다. */
export default function TeacherSafetyMonitorScreen() {
  const [posts, setPosts] = useState<FlaggedPost[]>(MOCK_FLAGGED_POSTS);
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');

  const pendingCount = posts.filter((post) => post.status === 'pending').length;
  const visiblePosts = posts.filter((post) => (activeTab === 'pending' ? post.status === 'pending' : post.status !== 'pending'));

  /** 선생님이 승인하거나 차단하면 해당 게시글의 검수 상태만 바꿉니다. */
  const handleDecision = (post: FlaggedPost, decision: FlaggedStatus) => {
    try {
      setPosts((current) => current.map((item) => (item.id === post.id ? { ...item, status: decision } : item)));
      Alert.alert(
        decision === 'approved' ? '게시를 승인했어요 ✅' : '게시를 차단했어요 🚫',
        `${post.studentName} 어린이의 글이 ${decision === 'approved' ? '그대로 공개돼요' : '더 이상 보이지 않아요'}.`,
      );
    } catch (error) {
      console.warn('검수 결정을 처리하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>AI 안전 모니터링 🚨</Text>
            <Text style={styles.caption}>AI가 먼저 걸러낸 글이에요. 선생님이 마지막으로 봐 주세요.</Text>
          </View>

          <View style={styles.tabRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === 'pending' }}
              onPress={() => setActiveTab('pending')}
              style={[styles.tabButton, activeTab === 'pending' && styles.tabButtonActive]}>
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>검수 대기 ({pendingCount})</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === 'done' }}
              onPress={() => setActiveTab('done')}
              style={[styles.tabButton, activeTab === 'done' && styles.tabButtonActive]}>
              <Text style={[styles.tabText, activeTab === 'done' && styles.tabTextActive]}>처리 완료</Text>
            </Pressable>
          </View>

          {visiblePosts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {activeTab === 'pending' ? '검수할 글이 없어요, 좋아요! 🌸' : '아직 처리한 글이 없어요.'}
              </Text>
            </View>
          )}

          {visiblePosts.map((post) => (
            <View key={post.id} style={[styles.postCard, post.status === 'blocked' && styles.postCardBlocked]}>
              <View style={styles.postHeader}>
                <View style={styles.avatarCircle}><Text style={styles.avatar}>{post.studentAvatar}</Text></View>
                <View style={styles.postIdentity}>
                  <Text style={styles.studentName}>{post.studentName}</Text>
                  <Text style={styles.sourceBadge}>{SOURCE_LABELS[post.source]}</Text>
                </View>
                <Text style={styles.flaggedAt}>{post.flaggedAt}</Text>
              </View>

              <View style={styles.contentBox}>
                <Text style={styles.contentText}>{post.content}</Text>
              </View>
              <View style={styles.flaggedWordChip}>
                <Text style={styles.flaggedWordText}>🚩 감지된 표현: {post.flaggedWord}</Text>
              </View>

              {post.status === 'pending' ? (
                <View style={styles.actionRow}>
                  <Pressable
                    accessibilityLabel={`${post.studentName} 글 승인하기`}
                    accessibilityRole="button"
                    onPress={() => handleDecision(post, 'approved')}
                    style={({ pressed }) => [styles.actionButton, styles.approveButton, pressed && styles.pressed]}>
                    <Text style={styles.actionButtonText}>승인하기 ✅</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`${post.studentName} 글 차단하기`}
                    accessibilityRole="button"
                    onPress={() => handleDecision(post, 'blocked')}
                    style={({ pressed }) => [styles.actionButton, styles.blockButton, pressed && styles.pressed]}>
                    <Text style={styles.actionButtonText}>차단하기 🚫</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={[styles.statusBadge, post.status === 'approved' ? styles.statusBadgeApproved : styles.statusBadgeBlocked]}>
                  <Text style={[styles.statusBadgeText, post.status === 'approved' ? styles.statusBadgeTextApproved : styles.statusBadgeTextBlocked]}>
                    {post.status === 'approved' ? '✅ 승인 완료' : '🚫 차단 완료'}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </SkyScene>
  );
}
