import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SkyScene from '@/components/scene/SkyScene';
import GlassCard from '@/components/ui/GlassCard';
import { roleSelectStyles as styles } from './roleSelectStyles';

const ROLES = [
  { id: 'student', emoji: '🐣', title: '학생이에요', description: '오늘의 말씀이랑 퀴즈 만나러 가요' },
  { id: 'teacher', emoji: '✝️', title: '선생님이에요', description: '우리 반 아이들 살펴볼게요' },
  { id: 'parent', emoji: '🏡', title: '부모님이에요', description: '우리 아이가 얼마나 자랐는지 볼래요' },
];

/** 앱을 처음 열었을 때 학생·선생님·부모님 중 누구로 들어갈지 고르는 화면입니다. */
export default function RoleSelectScreen({ onSelectRole }) {
  return (
    <SkyScene>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>하루 3분, 마음이 쑥쑥</Text>
            </View>
            <Text style={styles.title}>어서 오세요!</Text>
            <Text style={styles.subtitle}>누구로 들어갈까요?</Text>
          </View>

          <View style={styles.roleList}>
            {ROLES.map((role) => (
              <Pressable
                accessibilityLabel={`${role.title}, ${role.description}`}
                accessibilityRole="button"
                key={role.id}
                onPress={() => onSelectRole(role.id)}
                style={({ pressed }) => [pressed && styles.roleCardPressed]}>
                <GlassCard style={styles.roleCard}>
                  <Text style={styles.roleEmoji}>{role.emoji}</Text>
                  <View style={styles.roleCopy}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                  <Text style={styles.roleArrow}>›</Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SkyScene>
  );
}
