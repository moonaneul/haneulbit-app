import { Pressable, Text, View } from 'react-native';

import type { StudentMission } from './homeData';
import { homeStyles as styles } from './homeStyles';

interface MissionGridProps {
  missions: StudentMission[];
  onMissionPress: (mission: StudentMission) => void;
}

/** 오늘 할 수 있는 네 가지 핵심 미션을 2열 카드로 보여 줍니다. */
export default function MissionGrid({ missions, onMissionPress }: MissionGridProps) {
  return (
    <View>
      <View style={styles.missionHeader}>
        <Text style={styles.sectionTitle}>오늘의 하늘빛 미션</Text>
        <Text style={styles.sectionCaption}>하나씩 즐겁게 시작해 봐요!</Text>
      </View>
      <View style={styles.missionGrid}>
        {missions.map((mission) => (
          <Pressable
            accessibilityLabel={`${mission.title}, ${mission.description}`}
            accessibilityRole="button"
            key={mission.id}
            onPress={() => onMissionPress(mission)}
            style={({ pressed }) => [
              styles.missionCard,
              { backgroundColor: mission.color },
              pressed && styles.missionPressed,
            ]}>
            <View style={styles.missionEmojiCircle}><Text style={styles.missionEmoji}>{mission.emoji}</Text></View>
            <Text style={styles.missionTitle}>{mission.title}</Text>
            <Text style={styles.missionDescription}>{mission.description}</Text>
            <Text style={styles.missionArrow}>→</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
