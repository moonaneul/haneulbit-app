import { Pressable, Text, View } from 'react-native';

import GlassCard from '@/components/ui/GlassCard';
import type { StudentMission } from './homeData';
import { homeStyles as styles } from './homeStyles';

interface MissionGridProps {
  missions: StudentMission[];
  onMissionPress: (mission: StudentMission) => void;
}

/** 오늘 할 수 있는 네 가지 핵심 미션을 2열 유리 카드로 보여 줍니다. */
export default function MissionGrid({ missions, onMissionPress }: MissionGridProps) {
  return (
    <View>
      <View style={styles.missionHeader}>
        <Text style={styles.sectionTitle}>오늘의 하늘빛 미션</Text>
      </View>
      <View style={styles.missionGrid}>
        {missions.map((mission) => (
          <Pressable
            accessibilityLabel={`${mission.title}, ${mission.description}`}
            accessibilityRole="button"
            key={mission.id}
            onPress={() => onMissionPress(mission)}
            style={({ pressed }) => [styles.missionCard, pressed && styles.missionPressed]}>
            {/* 카드 자체는 유리로 두고, 미션별 색은 이모지 배경에만 남겨 풍경을 가리지 않습니다. */}
            <GlassCard style={styles.missionCardInner}>
              <View style={[styles.missionEmojiCircle, { backgroundColor: mission.color }]}>
                <Text style={styles.missionEmoji}>{mission.emoji}</Text>
              </View>
              <Text style={styles.missionTitle}>{mission.title}</Text>
              <Text style={styles.missionDescription}>{mission.description}</Text>
              <Text style={styles.missionArrow}>→</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
