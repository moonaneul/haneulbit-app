import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/theme';
import { MOCK_LINKED_CHILD } from './parentData';
import { parentHomeStyles as styles } from './parentHomeStyles';

export type ParentMenuKey = 'report' | 'notice' | 'mission';

const PARENT_MENU: { key: ParentMenuKey; emoji: string; title: string; description: string; color: string }[] = [
  { key: 'report', emoji: '🌱', title: '영적 자람 리포트', description: '이번 달 QT 이행률과 성찰 기록을 확인해요', color: COLORS.accentSoft },
  { key: 'notice', emoji: '📖', title: '알림장 & 캘린더', description: '선생님 공지사항과 초등부 일정을 확인해요', color: '#FFF8E4' },
  { key: 'mission', emoji: '✅', title: '가정 실천 미션 도장', description: '집에서 실천한 미션을 확인하고 승인해요', color: COLORS.primarySoft },
];

interface ParentHomeScreenProps {
  onMenuPress?: (key: ParentMenuKey) => void;
}

/** 부모님이 로그인한 뒤 자녀 요약과 세 가지 메뉴를 만나는 메인 화면입니다. */
export default function ParentHomeScreen({ onMenuPress }: ParentHomeScreenProps) {
  /** 네비게이터 연결 전에도 메뉴 터치 동작을 확인할 수 있도록 안내창으로 대신합니다. */
  const handleMenuPress = (key: ParentMenuKey, title: string) => {
    try {
      if (onMenuPress) {
        onMenuPress(key);
        return;
      }
      Alert.alert(title, '화면을 준비하고 있어요 🌸');
    } catch (error) {
      console.warn('부모님 메뉴로 이동하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.childCard}>
            <View style={styles.avatarCircle}><Text style={styles.avatar}>{MOCK_LINKED_CHILD.avatar}</Text></View>
            <View style={styles.childBody}>
              <Text style={styles.eyebrow}>연동된 자녀</Text>
              <Text style={styles.childName}>{MOCK_LINKED_CHILD.name}</Text>
              <Text style={styles.childGrade}>{MOCK_LINKED_CHILD.grade}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>부모님 메뉴 🏡</Text>
            <Text style={styles.sectionCaption}>자녀의 신앙 성장을 함께 살펴보아요.</Text>
          </View>

          <View style={styles.menuList}>
            {PARENT_MENU.map((item) => (
              <Pressable
                accessibilityLabel={`${item.title}, ${item.description}`}
                accessibilityRole="button"
                key={item.key}
                onPress={() => handleMenuPress(item.key, item.title)}
                style={({ pressed }) => [styles.menuCard, { backgroundColor: item.color }, pressed && styles.menuPressed]}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <View style={styles.menuCopy}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
