import { Image } from 'expo-image';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { roleSelectStyles as styles } from './roleSelectStyles';

const ROLES = [
  { id: 'student', emoji: '🐣', title: '학생이에요', description: '오늘의 3분 QT와 퀴즈를 만나요' },
  { id: 'teacher', emoji: '✝️', title: '선생님이에요', description: '우리 반 아이들을 살펴볼게요' },
  { id: 'parent', emoji: '🏡', title: '부모님이에요', description: '자녀의 영적 자람을 확인해요' },
];

/** 앱을 처음 열었을 때 학생·선생님·부모님 중 누구로 들어갈지 고르는 화면입니다. */
export default function RoleSelectScreen({ onSelectRole }) {
  const handlePress = (roleId) => {
    // 부모님 화면은 아직 준비되지 않아 안내창만 보여 줍니다.
    if (roleId === 'parent') {
      Alert.alert('부모님 화면 준비 중이에요 🌸', '조금만 기다려 주시면 곧 만나요!');
      return;
    }
    onSelectRole(roleId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>매일 3분, 마음이 쑥쑥</Text>
          </View>
          <Text style={styles.title}>어서 오세요!</Text>
          <Text style={styles.subtitle}>누구로 하늘빛 마을에 들어갈까요?</Text>
        </View>

        <Image
          accessibilityLabel="예수님이 두 아이의 손을 잡고 햇살 길을 함께 걷는 그림"
          contentFit="cover"
          source={require('@/assets/images/login-hero-jesus.png')}
          style={styles.heroImage}
        />

        <View style={styles.roleList}>
          {ROLES.map((role) => (
            <Pressable
              accessibilityLabel={`${role.title}, ${role.description}`}
              accessibilityRole="button"
              key={role.id}
              onPress={() => handlePress(role.id)}
              style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}>
              <Text style={styles.roleEmoji}>{role.emoji}</Text>
              <View style={styles.roleCopy}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              <Text style={styles.roleArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
