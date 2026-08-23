import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SkyScene from '@/components/scene/SkyScene';
import GlassCard from '@/components/ui/GlassCard';
import Toast, { type ToastTone } from '@/components/ui/Toast';
import PinChangeModal from './PinChangeModal';
import QtReminderCard from './QtReminderCard';
import { settingsStyles as styles } from './settingsStyles';

interface SettingsScreenProps {
  studentName?: string;
}

/** 아이가 자기 계정과 알림을 스스로 관리하는 설정 화면입니다. */
export default function SettingsScreen({ studentName }: SettingsScreenProps) {
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  return (
    <SkyScene>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Toast message={toast?.message ?? null} onHide={hideToast} tone={toast?.tone} />

            <View style={styles.header}>
              <Text style={styles.title}>설정 ⚙️</Text>
              <Text style={styles.caption}>내 계정과 알림을 정할 수 있어요.</Text>
            </View>

            {studentName && (
              <View style={styles.nameBadge}>
                <Text style={styles.nameText}>{studentName}</Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>내 계정</Text>
            <Pressable
              accessibilityHint="숫자 네 자리 비밀번호를 새로 정할 수 있어요"
              accessibilityLabel="내 비밀번호 바꾸기"
              accessibilityRole="button"
              onPress={() => setIsPinModalVisible(true)}
              style={({ pressed }) => [pressed && styles.rowPressed]}>
              <GlassCard style={styles.row}>
                <Text style={styles.rowEmoji}>🔐</Text>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>내 비밀번호 바꾸기</Text>
                  <Text style={styles.rowDescription}>나만 아는 번호로 정해 봐</Text>
                </View>
                <Text style={styles.rowArrow}>›</Text>
              </GlassCard>
            </Pressable>

            <Text style={styles.sectionLabel}>알림</Text>
            <QtReminderCard />
          </View>
        </ScrollView>
      </SafeAreaView>

      <PinChangeModal
        onChanged={() => setToast({ message: '비밀번호를 바꿨어요! 다음부터 새 번호로 들어와 🔐', tone: 'success' })}
        onClose={() => setIsPinModalVisible(false)}
        visible={isPinModalVisible}
      />
    </SkyScene>
  );
}
