import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';
import Toast, { type ToastTone } from '@/components/ui/Toast';
import { useArmor } from '@/context/ArmorProvider';
import {
  fetchQtFriendFeed,
  fetchTodayQt,
  isQtApiReady,
  submitQtReflection,
  type FriendQtPost,
  type TodayQt,
} from '@/lib/qtApi';

import { QtFriendFeed } from './QtFriendFeed';
import { containsUnsafeLanguage, MOCK_FRIEND_QT_POSTS, TODAY_QT } from './qtData';
import { qtStyles as styles } from './qtStyles';

interface QtScreenProps {
  onBack?: () => void;
}

/** 학생이 오늘의 말씀을 듣고 한 줄 묵상을 남기는 3분 QT 화면입니다. */
export default function QtScreen({ onBack }: QtScreenProps) {
  const { refresh } = useArmor();
  // 서버에서 받아온 오늘의 QT. 연결 전에는 Mock 말씀으로 화면을 확인합니다.
  const [todayQt, setTodayQt] = useState<TodayQt | null>(
    isQtApiReady ? null : { isRestDay: false, template: null, myReflection: null },
  );
  const [friendPosts, setFriendPosts] = useState<FriendQtPost[]>([]);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const hideToast = useCallback(() => setToast(null), []);
  // TTS 패키지 연결 전에도 재생 UI를 시험할 수 있는 Mock 오디오 상태입니다.
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // 작성 중인 나눔과 입력창 강조 여부를 각각 관리합니다.
  const [reflection, setReflection] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  // 등록 여부가 친구 피드의 잠금 상태를 결정합니다.
  const [submittedReflection, setSubmittedReflection] = useState<string | null>(null);
  const [isSafetyModalVisible, setIsSafetyModalVisible] = useState(false);

  useEffect(() => {
    if (!isQtApiReady) return;
    fetchTodayQt()
      .then((data) => {
        setTodayQt(data);
        // 이미 나눔을 남겼다면 친구 피드가 열려 있어야 합니다.
        if (data.myReflection) {
          setSubmittedReflection(data.myReflection);
          fetchQtFriendFeed().then(setFriendPosts).catch(() => setFriendPosts([]));
        }
      })
      .catch((error) => console.warn('오늘의 QT를 불러오지 못했습니다.', error));
  }, []);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date()),
    [],
  );

  // 1초마다 진행도를 올리고 끝나면 처음 상태로 돌려놓습니다.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setElapsedSeconds((current) => {
        if (current + 1 >= TODAY_QT.mockDurationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // 서버에 연결돼 있으면 그 말씀을, 아니면 Mock을 보여 줍니다.
  const content = todayQt?.template ?? (isQtApiReady ? null : TODAY_QT);
  const isRestDay = todayQt?.isRestDay ?? false;
  const progress = `${(elapsedSeconds / TODAY_QT.mockDurationSeconds) * 100}%` as `${number}%`;
  const trimmedReflection = reflection.trim();

  /** 서버가 알려 준 실패 사유를 아이가 알아들을 말로 바꿉니다. */
  const failureMessage = (code: string) => {
    if (code === 'ALREADY_DONE') return '오늘 나눔은 이미 등록했어요 🌸';
    if (code === 'NO_QT_TODAY') return '오늘은 QT가 없는 날이에요 🌸';
    if (code === 'EMPTY_REFLECTION') return '오늘 느낀 점을 짧게라도 적어 보아요 🌱';
    return '잠깐 연결이 안 됐어요. 다시 눌러 볼까요? 🌸';
  };

  const handleSubmit = async () => {
    try {
      if (!trimmedReflection) {
        setToast({ message: '오늘 느낀 점을 짧게라도 적어 보아요 🌱', tone: 'info' });
        return;
      }
      // 서버(AI Moderation)가 최종 검수이고, 여기서는 1차로만 걸러 냅니다.
      if (containsUnsafeLanguage(trimmedReflection)) {
        setIsSafetyModalVisible(true);
        return;
      }

      if (!isQtApiReady) {
        setSubmittedReflection(trimmedReflection);
        setFriendPosts(MOCK_FRIEND_QT_POSTS);
        return;
      }

      await submitQtReflection(trimmedReflection);
      setSubmittedReflection(trimmedReflection);
      // 달란트가 서버에서 올랐으니 홈·상점이 보는 값도 다시 읽어 옵니다.
      await refresh();
      setFriendPosts(await fetchQtFriendFeed());
    } catch (error) {
      const code = (error as Error).message;
      console.warn('QT 나눔 등록 중 오류가 발생했습니다.', error);
      setToast({ message: failureMessage(code), tone: 'warn' });
    }
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Toast message={toast?.message ?? null} onHide={hideToast} tone={toast?.tone} />
            {onBack && (
              <Pressable
                accessibilityLabel="마이페이지로 돌아가기"
                accessibilityRole="button"
                onPress={onBack}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <Text style={styles.backText}>← 돌아가기</Text>
              </Pressable>
            )}

            <View style={styles.header}>
              <Text style={styles.title}>오늘의 3분 Daily QT 📖</Text>
              <Text style={styles.date}>{todayLabel}</Text>
            </View>

            {isRestDay && (
              <View style={[styles.card, styles.teacherCard]}>
                <Text style={styles.sectionTitle}>오늘은 쉬어 가는 날 🌿</Text>
                <Text style={styles.teacherMessage}>
                  QT는 월요일부터 금요일까지 있어요. 푹 쉬고 월요일에 만나요!
                </Text>
              </View>
            )}

            {!isRestDay && !content && (
              <View style={[styles.card, styles.teacherCard]}>
                <Text style={styles.sectionTitle}>말씀을 가져오는 중이에요 🌸</Text>
                <Text style={styles.teacherMessage}>
                  아직 오늘 말씀이 올라오지 않았다면 선생님께 알려 주세요.
                </Text>
              </View>
            )}

            {content && (
            <View style={[styles.card, styles.verseCard]}>
              <Text style={styles.sectionLabel}>오늘의 요절</Text>
              <Text style={styles.reference}>{content.reference}</Text>
              <Text style={styles.verse}>“{content.verse}”</Text>
              <View style={styles.audioRow}>
                <Pressable
                  accessibilityLabel={isPlaying ? '말씀 음성 일시정지' : '말씀 음성 재생'}
                  accessibilityRole="button"
                  onPress={() => setIsPlaying((current) => !current)}
                  style={({ pressed }) => [styles.audioButton, pressed && styles.pressed]}>
                  <Text style={styles.audioButtonText}>{isPlaying ? '⏸ 잠시 멈춤' : '▶ AI 음성 듣기'}</Text>
                </Pressable>
                <View accessibilityRole="progressbar" style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: progress }]} />
                </View>
              </View>
              <Text style={styles.audioHint}>친근한 AI 선생님 목소리 · 약 24초 (Mock)</Text>
            </View>
            )}

            {content && (
            <View style={[styles.card, styles.teacherCard]}>
              <Text style={styles.sectionTitle}>💌 선생님의 1분 한 줄 메시지</Text>
              <Text style={styles.teacherMessage}>{content.teacherMessage}</Text>
            </View>
            )}

            {content && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>✏️ 오늘의 한 줄 나눔</Text>
              {submittedReflection ? (
                <View style={styles.completedBox}>
                  <Text style={styles.rewardText}>🎉 +10 달란트 획득!</Text>
                  <Text style={styles.myReflection}>{submittedReflection}</Text>
                </View>
              ) : (
                <>
                  <TextInput
                    accessibilityLabel="오늘 말씀에서 느낀 점"
                    maxLength={150}
                    multiline
                    onBlur={() => setIsFocused(false)}
                    onChangeText={setReflection}
                    onFocus={() => setIsFocused(true)}
                    placeholder="오늘 말씀에서 느낀 점을 적어보아요!"
                    placeholderTextColor="#96918A"
                    style={[styles.input, isFocused && styles.inputFocused]}
                    value={reflection}
                  />
                  <View style={styles.inputFooter}>
                    <Text style={styles.safeHint}>🌸 서로를 아끼는 따뜻한 말을 사용해요.</Text>
                    <Text style={styles.counter}>{reflection.length}/150</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    disabled={!trimmedReflection}
                    onPress={handleSubmit}
                    style={({ pressed }) => [styles.submitButton, !trimmedReflection && styles.submitDisabled, pressed && styles.pressed]}>
                    <Text style={[styles.submitText, !trimmedReflection && styles.submitTextDisabled]}>
                      나눔 등록하기 (+10 달란트 🪙)
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
            )}

            {content && <QtFriendFeed isUnlocked={Boolean(submittedReflection)} posts={friendPosts} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent visible={isSafetyModalVisible} onRequestClose={() => setIsSafetyModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🌸</Text>
            <Text style={styles.modalTitle}>예쁜 말로 바꿔볼까요? 🌸</Text>
            <Text style={styles.modalMessage}>친구의 마음을 아프게 할 수 있는 표현이 보여요. 따뜻한 말로 다시 적어 주세요.</Text>
            <Pressable accessibilityRole="button" onPress={() => setIsSafetyModalVisible(false)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
              <Text style={styles.modalButtonText}>다시 적어볼게요</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
