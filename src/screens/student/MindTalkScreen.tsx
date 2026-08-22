import { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { containsUnsafeLanguage, MOCK_MIND_TALK_MESSAGES, type MindTalkMessage } from './mindTalkData';
import { mindTalkStyles as styles } from './mindTalkStyles';

interface MindTalkScreenProps { onBack?: () => void }

/** 학생과 선생님만 볼 수 있는 따뜻한 1:1 마음 나눔 화면입니다. */
export default function MindTalkScreen({ onBack }: MindTalkScreenProps) {
  const [messages, setMessages] = useState<MindTalkMessage[]>(MOCK_MIND_TALK_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isSafetyModalVisible, setIsSafetyModalVisible] = useState(false);
  const listRef = useRef<FlatList<MindTalkMessage>>(null);
  const canSend = draft.trim().length > 0;

  /** 빈 글과 부적절한 표현을 확인한 뒤 새 메시지를 피드에 즉시 추가합니다. */
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
        id: `student-${Date.now()}`, sender: 'student', text, time: sentAt,
      }]);
      setDraft('');
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } catch (error) {
      console.warn('마음 톡을 보내는 중 오류가 발생했습니다.', error);
      Alert.alert('메시지를 보내지 못했어요', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 보낸 사람에 따라 말풍선의 위치와 파스텔 색상을 다르게 보여 줍니다. */
  const renderMessage = ({ item }: { item: MindTalkMessage }) => {
    const isStudent = item.sender === 'student';
    return (
      <View style={[styles.messageRow, isStudent && styles.studentRow]}>
        <Text style={styles.senderLabel}>{isStudent ? '나' : '선생님 🌷'}</Text>
        <View style={[styles.bubble, isStudent && styles.studentBubble]}>
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
        <View style={styles.content}>
          <View style={styles.header}>
            {onBack && <Pressable accessibilityRole="button" onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><Text style={styles.backText}>← 돌아가기</Text></Pressable>}
            <Text style={styles.title}>선생님과 1:1 하늘빛 마음 톡 💬</Text>
            <View style={styles.statusCard}><View style={styles.statusDot} /><Text style={styles.statusText}>선생님이 늘 기도하고 계셔요 🙏</Text></View>
          </View>

          <FlatList ref={listRef} contentContainerStyle={styles.listContent} data={messages} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" renderItem={renderMessage} showsVerticalScrollIndicator={false} />

          <View style={styles.composer}>
            <TextInput accessibilityLabel="선생님께 보낼 마음 톡" maxLength={300} multiline onChangeText={setDraft} placeholder="선생님께 마음이나 기도제목을 나눠요..." placeholderTextColor="#96918A" style={styles.input} value={draft} />
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: !canSend }} disabled={!canSend} onPress={handleSend} style={({ pressed }) => [styles.sendButton, !canSend && styles.sendDisabled, pressed && styles.pressed]}><Text style={styles.sendText}>전송 🕊️</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal animationType="fade" onRequestClose={() => setIsSafetyModalVisible(false)} transparent visible={isSafetyModalVisible}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <Text style={styles.modalEmoji}>🌸</Text><Text style={styles.modalTitle}>예쁜 말로 바꿔볼까요?</Text>
          <Text style={styles.modalBody}>마음이 더 잘 전해지도록 속상한 표현을 따뜻한 말로 바꿔 적어 보아요. 선생님이 천천히 기다리고 계세요.</Text>
          <Pressable accessibilityRole="button" onPress={() => setIsSafetyModalVisible(false)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}><Text style={styles.sendText}>다시 예쁘게 적기</Text></Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
