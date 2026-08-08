import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AvatarCard from './AvatarCard';
import { MOCK_STUDENT, STUDENT_MISSIONS, type StudentMission } from './homeData';
import { homeStyles as styles } from './homeStyles';
import MissionGrid from './MissionGrid';
import StatusMessageCard from './StatusMessageCard';

interface HomeScreenProps {
  studentName?: string;
  onMissionPress?: (mission: StudentMission) => void;
}

/** 학생이 로그인한 뒤 처음 만나는 메인 마이페이지 화면입니다. */
export default function HomeScreen({ studentName, onMissionPress }: HomeScreenProps) {
  // 로그인에서 받은 이름이 있으면 Mock 기본 이름 대신 사용합니다.
  const student = { ...MOCK_STUDENT, name: studentName?.trim() || MOCK_STUDENT.name };
  // 아바타를 누를 때 응원 말풍선을 열고 닫는 상태입니다.
  const [isAvatarTalking, setIsAvatarTalking] = useState(true);
  // DB 연결 전에는 수정한 한 줄 상태메시지를 현재 앱 세션 동안 보관합니다.
  const [statusMessage, setStatusMessage] = useState('오늘도 말씀으로 승리하자! 🕊️');

  // 아직 실제 화면이 없는 미션은 친근한 안내창으로 터치 동작을 확인합니다.
  const handleMissionPress = (mission: StudentMission) => {
    try {
      // 네비게이터가 전달한 콜백이 있으면 미션에 맞는 Stack 화면으로 이동합니다.
      if (onMissionPress && ['qt', 'wwjd', 'gratitude', 'talk'].includes(mission.id)) {
        onMissionPress(mission);
        return;
      }
      Alert.alert(`${mission.emoji} ${mission.title}`, '곧 신나는 미션이 열려요! 조금만 기다려 주세요 🌸');
    } catch (error) {
      console.warn('미션 안내를 여는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileBar}>
            <View style={styles.profileIdentity}>
              <View style={styles.profileAvatar}><Text style={styles.profileInitial}>{student.name[0]}</Text></View>
              <View>
                <Text style={styles.greeting}>샬롬, 반가워요!</Text>
                <Text style={styles.studentName}>{student.name}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBadge}><Text style={styles.statText}>🔥 {student.streakDays}일</Text></View>
              <View style={styles.statBadge}><Text style={styles.statText}>🪙 {student.talentPoints}pt</Text></View>
            </View>
          </View>

          <StatusMessageCard message={statusMessage} onSave={setStatusMessage} />

          <AvatarCard isTalking={isAvatarTalking} onPress={() => setIsAvatarTalking((current) => !current)} />
          <MissionGrid missions={STUDENT_MISSIONS} onMissionPress={handleMissionPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
