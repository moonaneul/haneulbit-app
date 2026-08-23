import { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { containsUnsafeLanguage, type MindTalkMessage, type StudentTalkThread } from './teacherMindTalkData';
import { teacherMindTalkStyles as styles } from './teacherMindTalkStyles';

interface TeacherMindTalkThreadScreenProps {
  thread: StudentTalkThread;
}

/** 선생님이 한 학생과 나눈 대화를 보고 텍스트/음성으로 답장하는 화면입니다. */
export default function TeacherMindTalkThreadScreen({ thread }: TeacherMindTalkThreadScreenProps) {
  const [messages, setMessages] = useState<MindTalkMessage[]>(thread.messages);
  const [draft, setDraft] = useState('');
  const [isSafetyModalVisible, setIsSafetyModalVisible] = useState(false);
  const listRef = useRef<FlatList<MindTalkMessage>>(null);
  const canSend = draft.trim().length > 0;

  /** 선생님 답장도 같은 1차 안전 필터를 거친 뒤 대화에 즉시 추가합니다. */
  const handleSend = () => {
    try {
      const text = draft.trim();
      if (!text) return;
      if (containsUnsafeLanguage(text)) {
        setIsSafetyModalVisible(true);
        return;
      }
      const sentAt = new Intl.DateTimeFormat('ko-KR', {
        hour: 'numeric', minute: '2-digit', hour12: true,
      }).format(new Date());
      setMessages((current) => [...current, {
        id: `teacher-${Date.now()}`, sender: 'teacher', text, time: sentAt,
      }]);
      setDraft('');
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } catch (error) {
      console.warn('선생님 마음 톡 답장을 보내는 중 오류가 발생했습니다.', error);
      Alert.alert('메시지를 보내지 못했어요', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** AI 음성 답장은 아직 연결 전이라 준비 중 안내로 대체합니다. */
  const handleVoicePress = () => {
    try {
      Alert.alert('음성으로 칭찬하기 🎤', 'AI 음성 답장 기능을 준비하고 있어요 🌸');
    } catch (error) {
      console.warn('음성 답장을 여는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const renderMessage = ({ item }: { item: MindTalkMessage }) => {
    const isTeacher = item.sender === 'teacher';
    return (
      <View style={[styles.messageRow, isTeacher && styles.teacherRow]}>
        <Text style={styles.senderLabel}>{isTeacher ? '나(선생님)' : thread.studentName}</Text>
        <View style={[styles.bubble, isTeacher && styles.teacherBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SkyScene showHills={false}>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.threadContent}>
          <View style={styles.threadHeader}>
            <View style={styles.threadHeaderAvatar}><Text style={styles.avatar}>{thread.studentAvatar}</Text></View>
            <Text style={styles.threadHeaderName}>{thread.studentName}</Text>
          </View>

          <FlatList ref={listRef} contentContainerStyle={styles.listContent} data={messages} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" renderItem={renderMessage} showsVerticalScrollIndicator={false} />

          <View style={styles.composer}>
            <Pressable accessibilityLabel="음성으로 칭찬하기" accessibilityRole="button" onPress={handleVoicePress} style={({ pressed }) => [styles.voiceButton, pressed && styles.pressed]}>
              <Text style={styles.voiceIcon}>🎤</Text>
            </Pressable>
            <TextInput accessibilityLabel="학생에게 보낼 답장" maxLength={300} multiline onChangeText={setDraft} placeholder="따뜻한 말로 답장해 주세요..." placeholderTextColor="#96918A" style={styles.input} value={draft} />
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: !canSend }} disabled={!canSend} onPress={handleSend} style={({ pressed }) => [styles.sendButton, !canSend && styles.sendDisabled, pressed && styles.pressed]}>
              <Text style={styles.sendText}>전송 🕊️</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal animationType="fade" onRequestClose={() => setIsSafetyModalVisible(false)} transparent visible={isSafetyModalVisible}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <Text style={styles.modalEmoji}>🌸</Text><Text style={styles.modalTitle}>예쁜 말로 바꿔볼까요?</Text>
          <Text style={styles.modalBody}>아이에게 상처가 될 수 있는 표현이 보여요. 따뜻한 말로 다시 적어 주세요.</Text>
          <Pressable accessibilityRole="button" onPress={() => setIsSafetyModalVisible(false)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}><Text style={styles.sendText}>다시 예쁘게 적기</Text></Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
