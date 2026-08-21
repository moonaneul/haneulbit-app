import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_HOME_MISSIONS, type HomeMission } from './parentData';
import { parentMissionStyles as styles } from './parentMissionStyles';

/** 자녀가 가정에서 실천한 미션을 확인하고 부모님이 도장을 승인하는 화면입니다. */
export default function ParentMissionApprovalScreen() {
  const [missions, setMissions] = useState<HomeMission[]>(MOCK_HOME_MISSIONS);

  /** 승인한 미션만 상태를 바꿔서 도장 배지로 보여 줍니다. */
  const handleApprove = (mission: HomeMission) => {
    try {
      setMissions((current) => current.map((item) => (item.id === mission.id ? { ...item, status: 'approved' } : item)));
      Alert.alert('도장 쾅! 승인했어요 ✅', `${mission.title} 실천을 확인했어요.`);
    } catch (error) {
      console.warn('가정 미션을 승인하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>가정 실천 미션 도장 ✅</Text>
            <Text style={styles.caption}>집에서 실천한 미션을 확인하고 도장을 눌러 주세요.</Text>
          </View>

          {missions.map((mission) => (
            <View key={mission.id} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <View style={styles.missionEmojiCircle}><Text style={styles.missionEmoji}>{mission.emoji}</Text></View>
                <View style={styles.missionBody}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionSubmittedAt}>{mission.submittedAt} 제출</Text>
                </View>
              </View>
              <View style={styles.childNoteBox}>
                <Text style={styles.childNoteText}>{mission.childNote}</Text>
              </View>
              {mission.status === 'pending' ? (
                <Pressable
                  accessibilityLabel={`${mission.title} 도장 승인하기`}
                  accessibilityRole="button"
                  onPress={() => handleApprove(mission)}
                  style={({ pressed }) => [styles.approveButton, pressed && styles.pressed]}>
                  <Text style={styles.approveButtonText}>도장 승인하기 ✅</Text>
                </Pressable>
              ) : (
                <View style={styles.stampBadge}><Text style={styles.stampBadgeText}>✅ 도장 승인 완료</Text></View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
