import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { MOCK_VIDEOS, type RecommendedVideo, type VideoCategory } from '@/data/videos';
import { teacherContentManageStyles as styles } from './teacherContentManageStyles';

const CATEGORIES: { key: VideoCategory; label: string; color: string }[] = [
  { key: 'dance', label: '🕺 율동', color: '#FFF2ED' },
  { key: 'bible', label: '📖 성경 이야기', color: '#EAF4DE' },
];

const emptyDraft = { category: 'dance' as VideoCategory, title: '', duration: '', thumbnailEmoji: '🎬', youtubeUrl: '' };

/** 선생님이 어린이 율동/성경 이야기 유튜브 영상을 등록·삭제하는 관리 화면입니다. */
export default function TeacherVideoManageScreen() {
  const [videos, setVideos] = useState<RecommendedVideo[]>(MOCK_VIDEOS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const canSubmit = draft.title.trim().length > 0 && draft.youtubeUrl.trim().length > 0 && draft.duration.trim().length > 0;

  const openModal = () => {
    setDraft(emptyDraft);
    setIsModalVisible(true);
  };

  /** 카테고리에 맞는 배경색을 자동으로 붙여서 새 추천 영상을 목록에 추가합니다. */
  const handleRegister = () => {
    try {
      if (!canSubmit) return;
      const categoryInfo = CATEGORIES.find((category) => category.key === draft.category);
      const newVideo: RecommendedVideo = {
        id: `video-${Date.now()}`,
        category: draft.category,
        title: draft.title.trim(),
        duration: draft.duration.trim(),
        thumbnailEmoji: draft.thumbnailEmoji.trim() || '🎬',
        thumbnailColor: categoryInfo?.color ?? '#FFF2ED',
        youtubeUrl: draft.youtubeUrl.trim(),
      };
      setVideos((current) => [newVideo, ...current]);
      setIsModalVisible(false);
      Alert.alert('영상을 등록했어요 🎬', '아이들이 감사 보물상자에서 바로 볼 수 있어요.');
    } catch (error) {
      console.warn('추천 영상을 등록하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const handleDelete = (video: RecommendedVideo) => {
    try {
      setVideos((current) => current.filter((item) => item.id !== video.id));
    } catch (error) {
      console.warn('추천 영상을 삭제하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>영상 등록 관리 🎬</Text>
            <Text style={styles.caption}>아이들이 볼 율동이나 성경 이야기 영상을 골라 주세요.</Text>
          </View>

          <Pressable accessibilityLabel="새 영상 등록하기" accessibilityRole="button" onPress={openModal} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Text style={styles.addButtonText}>+ 새 영상 등록하기</Text>
          </Pressable>

          {videos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <View style={[styles.videoThumb, { backgroundColor: video.thumbnailColor }]}>
                <Text style={styles.videoThumbEmoji}>{video.thumbnailEmoji}</Text>
              </View>
              <View style={styles.videoBody}>
                <View style={styles.videoCategoryBadge}>
                  <Text style={styles.videoCategoryText}>{video.category === 'dance' ? '🕺 율동' : '📖 성경 이야기'}</Text>
                </View>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoDuration}>⏱ {video.duration}</Text>
              </View>
              <Pressable accessibilityLabel={`${video.title} 삭제하기`} accessibilityRole="button" onPress={() => handleDelete(video)} style={({ pressed }) => [styles.videoDeleteButton, pressed && styles.pressed]}>
                <Text style={styles.videoDeleteIcon}>🗑️</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setIsModalVisible(false)} transparent visible={isModalVisible}>
        <View style={styles.modalBackdrop}>
          <ScrollView style={styles.modalCard}>
            <Text style={styles.modalTitle}>새 영상 등록하기</Text>

            <Text style={styles.modalLabel}>카테고리</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((category) => {
                const isActive = draft.category === category.key;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    key={category.key}
                    onPress={() => setDraft((current) => ({ ...current, category: category.key }))}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}>
                    <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>{category.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.modalLabel}>영상 제목</Text>
            <TextInput accessibilityLabel="영상 제목" onChangeText={(text) => setDraft((current) => ({ ...current, title: text }))} placeholder="예: 여리고성 이야기" placeholderTextColor="#96918A" style={styles.input} value={draft.title} />

            <Text style={styles.modalLabel}>유튜브 링크</Text>
            <TextInput accessibilityLabel="유튜브 링크" autoCapitalize="none" keyboardType="url" onChangeText={(text) => setDraft((current) => ({ ...current, youtubeUrl: text }))} placeholder="https://www.youtube.com/watch?v=..." placeholderTextColor="#96918A" style={styles.input} value={draft.youtubeUrl} />

            <Text style={styles.modalLabel}>재생 시간</Text>
            <TextInput accessibilityLabel="재생 시간" onChangeText={(text) => setDraft((current) => ({ ...current, duration: text }))} placeholder="예: 3:20" placeholderTextColor="#96918A" style={styles.input} value={draft.duration} />

            <Text style={styles.modalLabel}>썸네일 이모지</Text>
            <TextInput accessibilityLabel="썸네일 이모지" maxLength={2} onChangeText={(text) => setDraft((current) => ({ ...current, thumbnailEmoji: text }))} placeholder="🎬" placeholderTextColor="#96918A" style={styles.input} value={draft.thumbnailEmoji} />

            <View style={styles.modalButtonRow}>
              <Pressable accessibilityRole="button" onPress={() => setIsModalVisible(false)} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={!canSubmit} onPress={handleRegister} style={({ pressed }) => [styles.submitButton, !canSubmit && styles.submitButtonDisabled, pressed && styles.pressed]}>
                <Text style={styles.submitButtonText}>등록하기</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
