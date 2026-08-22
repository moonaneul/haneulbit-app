import { useEffect, useMemo, useState } from 'react';
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
import { useArmor } from '@/context/ArmorProvider';

import { QtFriendFeed } from './QtFriendFeed';
import { containsUnsafeLanguage, TODAY_QT } from './qtData';
import { qtStyles as styles } from './qtStyles';

interface QtScreenProps {
  onBack?: () => void;
}

/** 학생이 오늘의 말씀을 듣고 한 줄 묵상을 남기는 3분 QT 화면입니다. */
export default function QtScreen({ onBack }: QtScreenProps) {
  const { earn } = useArmor();
  // TTS 패키지 연결 전에도 재생 UI를 시험할 수 있는 Mock 오디오 상태입니다.
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // 작성 중인 나눔과 입력창 강조 여부를 각각 관리합니다.
  const [reflection, setReflection] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  // 등록 여부가 친구 피드의 잠금 상태를 결정합니다.
  const [submittedReflection, setSubmittedReflection] = useState<string | null>(null);
  const [isSafetyModalVisible, setIsSafetyModalVisible] = useState(false);

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

  const progress = `${(elapsedSeconds / TODAY_QT.mockDurationSeconds) * 100}%` as `${number}%`;
  const trimmedReflection = reflection.trim();

  const handleSubmit = () => {
    try {
      if (!trimmedReflection) {
        Alert.alert('한 줄 나눔을 기다리고 있어요', '오늘 느낀 점을 짧게라도 적어 보아요 🌱');
        return;
      }
      if (containsUnsafeLanguage(trimmedReflection)) {
        setIsSafetyModalVisible(true);
        return;
      }
      setSubmittedReflection(trimmedReflection);
      earn(10); // 나눔을 등록하면 +10 달란트
    } catch (error) {
      console.warn('QT 나눔 등록 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
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

            <View style={[styles.card, styles.verseCard]}>
              <Text style={styles.sectionLabel}>오늘의 요절</Text>
              <Text style={styles.reference}>{TODAY_QT.reference}</Text>
              <Text style={styles.verse}>“{TODAY_QT.verse}”</Text>
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

            <View style={[styles.card, styles.teacherCard]}>
              <Text style={styles.sectionTitle}>💌 선생님의 1분 한 줄 메시지</Text>
              <Text style={styles.teacherMessage}>{TODAY_QT.teacherMessage}</Text>
            </View>

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

            <QtFriendFeed isUnlocked={Boolean(submittedReflection)} />
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
