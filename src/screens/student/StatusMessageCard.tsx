import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BORDER_RADIUS, COLORS, SHADOWS } from '@/constants/theme';

interface StatusMessageCardProps {
  message: string;
  onSave: (message: string) => void;
}

const MAX_MESSAGE_LENGTH = 40;
// 실제 AI가 연결되기 전, 입력 안전 흐름을 시험하기 위한 Mock 금칙어 목록입니다.
const MOCK_BLOCKED_WORDS = ['바보', '멍청', '죽어', '꺼져', '싫어'];

/** 학생의 신앙 다짐이나 기도제목을 보여 주고 수정하는 카드입니다. */
export default function StatusMessageCard({ message, onSave }: StatusMessageCardProps) {
  // 모달 표시 여부, 작성 중인 문장, 검수 안내를 각각 간단한 상태로 관리합니다.
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draft, setDraft] = useState(message);
  const [guide, setGuide] = useState('');

  const openEditor = () => {
    setDraft(message);
    setGuide('');
    setIsModalVisible(true);
  };

  const closeEditor = () => setIsModalVisible(false);

  // 저장 버튼을 누르면 Mock AI 검수를 통과한 문장만 화면에 반영합니다.
  const handleSave = () => {
    try {
      const cleanedMessage = draft.trim();
      if (!cleanedMessage) {
        setGuide('한 줄 다짐이나 기도제목을 적어 주세요 🕊️');
        return;
      }
      const hasBlockedWord = MOCK_BLOCKED_WORDS.some((word) => cleanedMessage.includes(word));
      if (hasBlockedWord) {
        setGuide('예쁜 말로 바꿔볼까요? 🌸');
        Alert.alert('우리의 말을 예쁘게 가꿔요', '예쁜 말로 바꿔볼까요? 🌸');
        return;
      }
      onSave(cleanedMessage);
      closeEditor();
    } catch (error) {
      console.warn('상태메시지를 검수하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <>
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}><Text style={styles.statusIconText}>🕊️</Text></View>
        <View style={styles.statusContent}>
          <Text style={styles.statusLabel}>나의 한 줄 다짐</Text>
          <Text numberOfLines={2} style={styles.statusMessage}>{message}</Text>
        </View>
        <Pressable
          accessibilityLabel="상태메시지 수정"
          accessibilityRole="button"
          hitSlop={8}
          onPress={openEditor}
          style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
          <Text style={styles.editIcon}>✏️</Text>
        </Pressable>
      </View>

      <Modal animationType="fade" onRequestClose={closeEditor} transparent visible={isModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🌱</Text>
            <Text style={styles.modalTitle}>오늘의 마음을 들려줘!</Text>
            <Text style={styles.modalCaption}>신앙 다짐이나 기도제목을 한 줄로 적어 봐요.</Text>
            <TextInput
              accessibilityLabel="한 줄 상태메시지 입력"
              autoFocus
              maxLength={MAX_MESSAGE_LENGTH}
              multiline
              onChangeText={(text) => { setDraft(text); setGuide(''); }}
              placeholder="예: 오늘도 말씀으로 승리하자!"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              value={draft}
            />
            <View style={styles.inputMeta}>
              <Text style={styles.guide}>{guide}</Text>
              <Text style={styles.counter}>{draft.length}/{MAX_MESSAGE_LENGTH}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Pressable onPress={closeEditor} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelText}>취소</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
                <Text style={styles.saveText}>저장하기</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  statusCard: { ...SHADOWS.soft, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 15, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.primarySoft },
  statusIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground },
  statusIconText: { fontSize: 21 },
  statusContent: { flex: 1 },
  statusLabel: { color: COLORS.primary, fontSize: 11, fontWeight: '900' },
  statusMessage: { color: COLORS.textPrimary, fontSize: 15, lineHeight: 21, fontWeight: '800', marginTop: 3 },
  editButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground },
  editIcon: { fontSize: 18 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(41, 42, 45, 0.35)' },
  modalCard: { ...SHADOWS.soft, width: '100%', maxWidth: 420, alignItems: 'center', padding: 24, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  modalEmoji: { fontSize: 38 },
  modalTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900', marginTop: 8 },
  modalCaption: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600', textAlign: 'center', marginTop: 6 },
  input: { width: '100%', minHeight: 88, marginTop: 20, padding: 16, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.surfaceMuted, color: COLORS.textPrimary, fontSize: 16, lineHeight: 23, fontWeight: '700', textAlignVertical: 'top' },
  inputMeta: { width: '100%', minHeight: 27, flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 7 },
  guide: { flex: 1, color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  counter: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
  buttonRow: { width: '100%', flexDirection: 'row', gap: 10, marginTop: 10 },
  cancelButton: { flex: 1, alignItems: 'center', paddingVertical: 15, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.surfaceMuted },
  cancelText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '900' },
  saveButton: { flex: 1.35, alignItems: 'center', paddingVertical: 15, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.primary },
  saveText: { color: COLORS.textOnPrimary, fontSize: 15, fontWeight: '900' },
});
