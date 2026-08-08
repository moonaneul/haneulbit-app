import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { containsUnsafeLanguage, MOCK_GRATITUDE_POSTS, REACTION_OPTIONS, type ReactionKey } from './gratitudeData';
import { gratitudeStyles as styles } from './gratitudeStyles';

interface GratitudeScreenProps { onBack?: () => void }

/** 오늘의 감사 사진을 기록하고 친구에게 정해진 응원을 보내는 화면입니다. */
export default function GratitudeScreen({ onBack }: GratitudeScreenProps) {
  // 사진 패키지를 연결하기 전에도 선택 흐름을 확인할 수 있도록 예시 사진을 바꿉니다.
  const [photo, setPhoto] = useState({ emoji: '☀️', caption: '오늘의 감사 순간' });
  const [title, setTitle] = useState('');
  const [isSafetyModalVisible, setIsSafetyModalVisible] = useState(false);
  // 게시물별 반응 수와 내가 누른 반응을 분리해 중복 증가를 막습니다.
  const [reactionCounts, setReactionCounts] = useState(() =>
    Object.fromEntries(MOCK_GRATITUDE_POSTS.map((post) => [post.id, post.reactions])),
  );
  const [myReactions, setMyReactions] = useState<Record<string, ReactionKey[]>>({});

  const todayLabel = useMemo(() => new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  }).format(new Date()), []);
  const canSave = title.trim().length > 0;

  /** 카메라·앨범 권한 연결 전 사용하는 안전한 Mock 사진 선택 동작입니다. */
  const handlePhotoChoice = (source: 'camera' | 'album') => {
    try {
      setPhoto(source === 'camera'
        ? { emoji: '🌼', caption: '방금 촬영한 꽃 사진 (Mock)' }
        : { emoji: '🍕', caption: '앨범에서 고른 점심 사진 (Mock)' });
    } catch (error) {
      console.warn('감사 사진을 선택하는 중 오류가 발생했습니다.', error);
      Alert.alert('사진을 열지 못했어요', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 빈 글과 부적절한 표현을 확인한 뒤 감사 기록을 저장합니다. */
  const handleSave = () => {
    try {
      if (!canSave) return;
      if (containsUnsafeLanguage(title)) {
        setIsSafetyModalVisible(true);
        return;
      }
      Alert.alert('보물상자에 쏙! 🎁', '감사 기록을 저장하고 +10 달란트를 받았어요 🪙');
      setTitle('');
    } catch (error) {
      console.warn('감사 기록을 저장하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 한 게시물의 같은 스티커는 한 번만 누를 수 있고, 누르면 즉시 수량을 올립니다. */
  const handleReaction = (postId: string, key: ReactionKey) => {
    if (myReactions[postId]?.includes(key)) return;
    setReactionCounts((current) => ({
      ...current,
      [postId]: { ...current[postId], [key]: current[postId][key] + 1 },
    }));
    setMyReactions((current) => ({ ...current, [postId]: [...(current[postId] ?? []), key] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {onBack && <Pressable accessibilityRole="button" onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><Text style={styles.backText}>← 돌아가기</Text></Pressable>}
            <View style={styles.header}><Text style={styles.title}>오늘의 감사 보물상자 📸</Text><Text style={styles.date}>{todayLabel}</Text></View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>오늘 감사했던 순간을 담아요</Text>
              <Text style={styles.sectionGuide}>작고 소중한 순간도 하나님께 드리는 멋진 감사예요.</Text>
              <View accessibilityLabel={photo.caption} style={styles.photoPreview}><Text style={styles.photoEmoji}>{photo.emoji}</Text><Text style={styles.photoCaption}>{photo.caption}</Text></View>
              <View style={styles.photoButtons}>
                <Pressable accessibilityRole="button" onPress={() => handlePhotoChoice('camera')} style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}><Text style={styles.photoButtonText}>📷 사진 촬영</Text></Pressable>
                <Pressable accessibilityRole="button" onPress={() => handlePhotoChoice('album')} style={({ pressed }) => [styles.photoButton, styles.photoButtonAlt, pressed && styles.pressed]}><Text style={styles.photoButtonText}>🖼️ 앨범 선택</Text></Pressable>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>무엇이 감사했나요?</Text>
              <TextInput accessibilityLabel="한 줄 감사 제목" maxLength={80} onChangeText={setTitle} onSubmitEditing={handleSave} placeholder="오늘 맛있는 점심을 먹어서 감사해요! 🍕" placeholderTextColor="#96918A" returnKeyType="done" style={styles.input} value={title} />
              <Text style={styles.safeHint}>🌸 친구의 마음도 기뻐지는 예쁜 말로 적어 보아요. {title.length}/80</Text>
              <Pressable accessibilityRole="button" disabled={!canSave} onPress={handleSave} style={({ pressed }) => [styles.saveButton, !canSave && styles.saveDisabled, pressed && styles.pressed]}><Text style={styles.saveText}>보물상자에 저장하기 (+10 달란트 🪙)</Text></Pressable>
            </View>

            <View style={styles.feedHeader}><Text style={styles.sectionTitle}>친구들의 감사 보물 ✨</Text><Text style={styles.sectionGuide}>따뜻한 응원 스티커를 선물해 보아요.</Text></View>
            {MOCK_GRATITUDE_POSTS.map((post) => (
              <View key={post.id} style={styles.feedCard}>
                <View style={[styles.feedPhoto, { backgroundColor: post.photoColor }]}><Text style={styles.feedEmoji}>{post.photoEmoji}</Text></View>
                <View style={styles.feedBody}>
                  <View style={styles.friendRow}><Text style={styles.avatar}>{post.avatar}</Text><Text style={styles.friendName}>{post.name}</Text></View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={styles.reactionRow}>{REACTION_OPTIONS.map((reaction) => {
                    const selected = myReactions[post.id]?.includes(reaction.key);
                    return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={reaction.key} onPress={() => handleReaction(post.id, reaction.key)} style={({ pressed }) => [styles.reactionButton, selected && styles.reactionSelected, pressed && styles.pressed]}><Text style={styles.reactionText}>{reaction.label} {reactionCounts[post.id][reaction.key]}</Text></Pressable>;
                  })}</View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" onRequestClose={() => setIsSafetyModalVisible(false)} transparent visible={isSafetyModalVisible}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <Text style={styles.modalEmoji}>🌸</Text><Text style={styles.modalTitle}>예쁜 말로 바꿔볼까요?</Text>
          <Text style={styles.modalBody}>친구의 마음을 아프게 할 수 있는 표현이 보여요. 감사한 마음이 잘 전해지도록 따뜻한 말로 다시 적어 주세요.</Text>
          <Pressable accessibilityRole="button" onPress={() => setIsSafetyModalVisible(false)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}><Text style={styles.saveText}>다시 예쁘게 적기</Text></Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}
