import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';
import {
  fetchTeacherWeeklyQt,
  isTeacherApiReady,
  publishTeacherQtTemplate,
  saveTeacherQtTemplate,
} from '@/lib/teacherApi';

import {
  EMPTY_WEEKLY_TEMPLATE,
  MOCK_WEEKLY_TEMPLATE,
  WEEKDAYS,
  type DailyTemplateDraft,
  type Weekday,
} from './teacherTemplateData';
import { teacherTemplateStyles as styles } from './teacherTemplateStyles';

function freshEmptyTemplate() {
  return Object.fromEntries(
    Object.entries(EMPTY_WEEKLY_TEMPLATE).map(([key, value]) => [key, { ...value }]),
  ) as Record<Weekday, DailyTemplateDraft>;
}

/** 선생님이 요일별 3분 QT 템플릿을 작성하고 게시하는 화면입니다. */
export default function TeacherTemplateScreen() {
  const [weeklyTemplate, setWeeklyTemplate] = useState<Record<Weekday, DailyTemplateDraft>>(
    isTeacherApiReady ? freshEmptyTemplate() : MOCK_WEEKLY_TEMPLATE,
  );
  const [selectedDay, setSelectedDay] = useState<Weekday>('mon');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isTeacherApiReady) return;
    fetchTeacherWeeklyQt()
      .then((rows) => {
        const next = freshEmptyTemplate();
        rows.forEach((row) => {
          next[row.weekday] = {
            reference: row.reference,
            verse: row.verse,
            teacherMessage: row.teacherMessage,
            isVoiceGenerated: row.isVoiceGenerated,
            isPublished: row.isPublished,
          };
        });
        setWeeklyTemplate(next);
      })
      .catch((error) => {
        console.warn('QT 템플릿을 불러오지 못했습니다.', error);
        Alert.alert('QT 템플릿을 불러오지 못했어요', '잠시 후 다시 시도해 주세요.');
      });
  }, []);

  const draft = weeklyTemplate[selectedDay];
  const canPublish = draft.reference.trim().length > 0
    && draft.verse.trim().length > 0
    && draft.teacherMessage.trim().length > 0;

  const updateDraft = (field: keyof DailyTemplateDraft, value: string) => {
    setWeeklyTemplate((current) => ({
      ...current,
      [selectedDay]: {
        ...current[selectedDay],
        [field]: value,
        isPublished: false,
        isVoiceGenerated:
          field === 'reference' || field === 'verse'
            ? false
            : current[selectedDay].isVoiceGenerated,
      },
    }));
  };

  const applyServerDraft = (day: Weekday, saved: DailyTemplateDraft) => {
    setWeeklyTemplate((current) => ({ ...current, [day]: saved }));
  };

  const handleSaveDraft = async () => {
    if (!isTeacherApiReady) {
      Alert.alert('초안을 저장했어요', 'Supabase 연결 전에는 이 화면 안에서만 유지됩니다.');
      return;
    }

    try {
      setIsSaving(true);
      const saved = await saveTeacherQtTemplate(selectedDay, draft);
      applyServerDraft(selectedDay, {
        reference: saved.reference,
        verse: saved.verse,
        teacherMessage: saved.teacherMessage,
        isVoiceGenerated: saved.isVoiceGenerated,
        isPublished: saved.isPublished,
      });
      Alert.alert('초안을 저장했어요 💾', '아직 학생에게는 공개되지 않았어요.');
    } catch (error) {
      console.warn('QT 템플릿 초안 저장 중 오류가 발생했습니다.', error);
      Alert.alert('초안을 저장하지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  /** TTS는 Milestone 6 범위라 지금은 실제 생성하지 않습니다. */
  const handleGenerateVoice = () => {
    Alert.alert('AI 음성은 아직 연결 전이에요', 'QT 본문 저장·게시 흐름을 먼저 실제화하고 있어요.');
  };

  const handlePublish = async () => {
    if (!canPublish) {
      Alert.alert('아직 다 작성되지 않았어요', '성경 구절, 본문, 격려 메시지를 모두 입력해 주세요.');
      return;
    }

    try {
      setIsSaving(true);

      if (!isTeacherApiReady) {
        setWeeklyTemplate((current) => ({
          ...current,
          [selectedDay]: { ...current[selectedDay], isPublished: true },
        }));
      } else {
        await saveTeacherQtTemplate(selectedDay, draft);
        const published = await publishTeacherQtTemplate(selectedDay);
        applyServerDraft(selectedDay, {
          reference: published.reference,
          verse: published.verse,
          teacherMessage: published.teacherMessage,
          isVoiceGenerated: published.isVoiceGenerated,
          isPublished: published.isPublished,
        });
      }

      const dayLabel = WEEKDAYS.find((day) => day.key === selectedDay)?.label;
      Alert.alert(`${dayLabel}요일 QT를 게시했어요! 📖`, '학생 화면에서 이 주의 해당 요일 QT를 읽을 수 있어요.');
    } catch (error) {
      console.warn('QT 템플릿을 게시하는 중 오류가 발생했습니다.', error);
      Alert.alert('QT를 게시하지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
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
                <Text style={styles.caption}>초안은 저장해도 학생에게 보이지 않고, 게시한 요일만 공개돼요.</Text>
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
                    accessibilityLabel="AI 음성 기능 준비 중"
                    accessibilityRole="button"
                    onPress={handleGenerateVoice}
                    style={({ pressed }) => [styles.voiceButton, pressed && styles.pressed]}>
                    <Text style={styles.voiceButtonText}>🎙️ AI 음성은 다음 단계에서 연결</Text>
                  </Pressable>
                </View>

                <Pressable
                  accessibilityLabel="QT 초안 저장"
                  accessibilityRole="button"
                  disabled={isSaving}
                  onPress={handleSaveDraft}
                  style={({ pressed }) => [styles.voiceButton, isSaving && styles.publishDisabled, pressed && styles.pressed]}>
                  <Text style={styles.voiceButtonText}>{isSaving ? '저장 중...' : '💾 초안 저장'}</Text>
                </Pressable>

                <Pressable
                  accessibilityLabel={draft.isPublished ? '게시 완료됨' : '이번 주 템플릿 게시하기'}
                  accessibilityRole="button"
                  disabled={!canPublish || isSaving}
                  onPress={handlePublish}
                  style={({ pressed }) => [
                    styles.publishButton,
                    (!canPublish || isSaving) && styles.publishDisabled,
                    draft.isPublished && styles.publishButtonDone,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.publishText}>
                    {draft.isPublished ? '✅ 게시 완료' : '이번 주 템플릿 게시하기'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SkyScene>
  );
}
