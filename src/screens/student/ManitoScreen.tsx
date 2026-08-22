import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { containsUnsafeLanguage } from '@/data/contentSafety';
import { MOCK_RECEIVED_PRAYERS, MY_MANITO_BUDDY } from './manitoData';
import { manitoStyles as styles } from './manitoStyles';

const MAX_PRAYER_LENGTH = 60;

/** 이번 주 배정된 비밀 마니또에게 익명으로 한 줄 기도를 배달하는 화면입니다. */
export default function ManitoScreen() {
  const [draft, setDraft] = useState('');
  const [guide, setGuide] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const canSend = draft.trim().length > 0;

  /** 안전 필터를 통과한 한 줄 기도만 배달 완료 모달로 이어집니다. */
  const handleSend = () => {
    try {
      const cleaned = draft.trim();
      if (!cleaned) return;
      if (containsUnsafeLanguage(cleaned)) {
        setGuide('예쁜 말로 바꿔볼까요? 🌸');
        Alert.alert('우리의 말을 예쁘게 가꿔요', '예쁜 말로 바꿔볼까요? 🌸');
        return;
      }
      setIsSuccessVisible(true);
      setDraft('');
      setGuide('');
    } catch (error) {
      console.warn('마니또 기도를 배달하는 중 오류가 발생했습니다.', error);
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
              <Text style={styles.title}>비밀 마니또 기도 배달 🤫</Text>
              <Text style={styles.caption}>누구인지 비밀! 이번 주엔 이 친구를 위해 기도해 줘.</Text>
            </View>

            <View style={styles.buddyCard}>
              <Text style={styles.buddyLabel}>이번 주 나의 마니또</Text>
              <View style={styles.buddyAvatarCircle}><Text style={styles.buddyAvatar}>{MY_MANITO_BUDDY.avatar}</Text></View>
              <Text style={styles.buddyName}>{MY_MANITO_BUDDY.name}</Text>
              <Text style={styles.secretNote}>
                🤫 아무에게도 말하지 말고, {MY_MANITO_BUDDY.name} 친구를 위해 몰래 기도해 주세요!
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>한 줄 기도 편지 쓰기</Text>
              <Text style={styles.sectionGuide}>이름은 안 알려져. 마음만 살짝 전해질 거야.</Text>
              <TextInput
                accessibilityLabel="마니또에게 보낼 한 줄 기도"
                maxLength={MAX_PRAYER_LENGTH}
                multiline
                onChangeText={(text) => { setDraft(text); setGuide(''); }}
                placeholder="예: 네가 오늘도 행복한 하루를 보내길 기도할게!"
                placeholderTextColor="#96918A"
                style={styles.input}
                value={draft}
              />
              <View style={styles.inputFooter}>
                <Text style={styles.safeHint}>{guide || '🌸 친구의 마음이 따뜻해지는 말로 적어 보아요.'}</Text>
                <Text style={styles.counter}>{draft.length}/{MAX_PRAYER_LENGTH}</Text>
              </View>
              <Pressable
                accessibilityLabel="마니또에게 익명으로 기도 배달하기"
                accessibilityRole="button"
                disabled={!canSend}
                onPress={handleSend}
                style={({ pressed }) => [styles.sendButton, !canSend && styles.sendDisabled, pressed && styles.pressed]}>
                <Text style={styles.sendText}>몰래 기도 배달하기 🕊️</Text>
              </Pressable>
            </View>

            <View style={styles.inboxHeader}>
              <Text style={styles.sectionTitle}>나에게 온 비밀 기도 편지함 💌</Text>
              <Text style={styles.sectionGuide}>누군가 너를 위해 조용히 기도하고 있어.</Text>
            </View>
            {MOCK_RECEIVED_PRAYERS.map((prayer) => (
              <View key={prayer.id} style={styles.prayerCard}>
                <View style={styles.prayerRow}>
                  <Text style={styles.prayerSender}>👻 익명의 마니또가</Text>
                  <Text style={styles.prayerTime}>· {prayer.receivedAt}</Text>
                </View>
                <Text style={styles.prayerMessage}>{prayer.message}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" onRequestClose={() => setIsSuccessVisible(false)} transparent visible={isSuccessVisible}>
        <View style={styles.modalBackdrop}>
          <View accessibilityLiveRegion="polite" style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🕊️✨</Text>
            <Text style={styles.modalTitle}>기도가 몰래 배달됐어요!</Text>
            <Text style={styles.modalBody}>{MY_MANITO_BUDDY.name} 친구는 누가 보냈는지 모르지만{'\n'}분명 마음이 따뜻해질 거예요 🌸</Text>
            <Pressable accessibilityRole="button" onPress={() => setIsSuccessVisible(false)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
              <Text style={styles.sendText}>좋아요</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
