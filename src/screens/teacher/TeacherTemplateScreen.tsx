import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { MOCK_WEEKLY_TEMPLATE, WEEKDAYS, type DailyTemplateDraft, type Weekday } from './teacherTemplateData';
import { teacherTemplateStyles as styles } from './teacherTemplateStyles';

/** 선생님이 요일별 3분 QT 템플릿을 작성하고 AI 음성과 함께 게시하는 화면입니다. */
export default function TeacherTemplateScreen() {
  const [weeklyTemplate, setWeeklyTemplate] = useState(MOCK_WEEKLY_TEMPLATE);
  const [selectedDay, setSelectedDay] = useState<Weekday>('mon');

  const draft = weeklyTemplate[selectedDay];
  const canPublish = draft.reference.trim().length > 0 && draft.verse.trim().length > 0 && draft.teacherMessage.trim().length > 0;

  /** 선택된 요일의 초안 한 필드만 바꿔서 저장합니다. */
  const updateDraft = (field: keyof DailyTemplateDraft, value: string) => {
    setWeeklyTemplate((current) => ({
      ...current,
      [selectedDay]: { ...current[selectedDay], [field]: value, isPublished: false, isVoiceGenerated: field === 'reference' || field === 'verse' ? false : current[selectedDay].isVoiceGenerated },
    }));
  };

  /** 말씀 구절이 채워졌는지 확인한 뒤 AI 음성을 생성한 것처럼 표시합니다. */
  const handleGenerateVoice = () => {
    try {
      if (!draft.reference.trim() || !draft.verse.trim()) {
        Alert.alert('말씀을 먼저 적어 주세요', '성경 구절과 본문을 입력하면 AI 음성을 만들 수 있어요 🎵');
        return;
      }
      setWeeklyTemplate((current) => ({ ...current, [selectedDay]: { ...current[selectedDay], isVoiceGenerated: true } }));
      Alert.alert('AI 음성이 만들어졌어요! 🎵', '아이들이 다정한 목소리로 말씀을 들을 수 있어요.');
    } catch (error) {
      console.warn('AI 음성을 생성하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 필수 항목이 채워진 요일만 학생 화면에 게시된 것으로 표시합니다. */
  const handlePublish = () => {
    try {
      if (!canPublish) {
        Alert.alert('아직 다 작성되지 않았어요', '성경 구절, 본문, 격려 메시지를 모두 입력해 주세요 🌸');
        return;
      }
      setWeeklyTemplate((current) => ({ ...current, [selectedDay]: { ...current[selectedDay], isPublished: true } }));
      const dayLabel = WEEKDAYS.find((day) => day.key === selectedDay)?.label;
      Alert.alert(`${dayLabel}요일 QT를 게시했어요! 📖`, '학생들이 오늘의 말씀을 바로 만날 수 있어요.');
    } catch (error) {
      console.warn('QT 템플릿을 게시하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>주간 템플릿 등록 📝</Text>
              <Text style={styles.caption}>요일마다 말씀을 적어 두면 아이들이 그날 읽어요.</Text>
            </View>

            <View style={styles.dayRow}>
              {WEEKDAYS.map((day) => {
                const isActive = selectedDay === day.key;
                return (
                  <Pressable
                    accessibilityLabel={`${day.label}요일, ${weeklyTemplate[day.key].isPublished ? '게시됨' : '작성 중'}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    key={day.key}
                    onPress={() => setSelectedDay(day.key)}
                    style={[styles.dayTab, isActive && styles.dayTabActive]}>
                    <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>{day.label}</Text>
                    <View style={[styles.dayStatusDot, weeklyTemplate[day.key].isPublished && styles.dayStatusDotPublished]} />
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>말씀 내용</Text>
              <Text style={styles.sectionGuide}>아이들이 오늘 읽을 말씀을 적어 주세요.</Text>

              <Text style={styles.label}>성경 구절</Text>
              <TextInput
                accessibilityLabel="성경 구절"
                onChangeText={(text) => updateDraft('reference', text)}
                placeholder="예: 빌립보서 4장 13절"
                placeholderTextColor="#96918A"
                style={styles.input}
                value={draft.reference}
              />

              <Text style={styles.label}>말씀 본문</Text>
              <TextInput
                accessibilityLabel="말씀 본문"
                multiline
                onChangeText={(text) => updateDraft('verse', text)}
                placeholder="본문 내용을 입력해 주세요"
                placeholderTextColor="#96918A"
                style={[styles.input, styles.textArea]}
                value={draft.verse}
              />

              <Text style={styles.label}>선생님 격려 메시지</Text>
              <TextInput
                accessibilityLabel="선생님 격려 메시지"
                multiline
                onChangeText={(text) => updateDraft('teacherMessage', text)}
                placeholder="아이들에게 전할 따뜻한 한마디를 적어 주세요"
                placeholderTextColor="#96918A"
                style={[styles.input, styles.textArea]}
                value={draft.teacherMessage}
              />

              <View style={styles.voiceRow}>
                <Pressable
                  accessibilityLabel={draft.isVoiceGenerated ? 'AI 음성 생성 완료' : 'AI 음성 생성하기'}
                  accessibilityRole="button"
                  onPress={handleGenerateVoice}
                  style={({ pressed }) => [styles.voiceButton, draft.isVoiceGenerated && styles.voiceButtonDone, pressed && styles.pressed]}>
                  <Text style={styles.voiceButtonText}>{draft.isVoiceGenerated ? '🎵 AI 음성 완료' : '🎙️ AI 음성 생성하기'}</Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityLabel={draft.isPublished ? '게시 완료됨' : '이번 주 템플릿 게시하기'}
                accessibilityRole="button"
                disabled={!canPublish}
                onPress={handlePublish}
                style={({ pressed }) => [
                  styles.publishButton,
                  !canPublish && styles.publishDisabled,
                  draft.isPublished && styles.publishButtonDone,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.publishText}>{draft.isPublished ? '✅ 게시 완료' : '이번 주 템플릿 게시하기'}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </SkyScene>
  );
}
