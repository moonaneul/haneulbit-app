// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';
import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, Fonts, SHADOWS } from '@/constants/theme';
import LoginScreen from '@/screens/auth/LoginScreen';
import ArmorShopScreen from '@/screens/student/ArmorShopScreen';
import GratitudeScreen from '@/screens/student/GratitudeScreen';
import HomeScreen from '@/screens/student/HomeScreen';
import type { StudentMission } from '@/screens/student/homeData';
import MindTalkScreen from '@/screens/student/MindTalkScreen';
import QtScreen from '@/screens/student/QtScreen';
import WwjdQuizScreen from '@/screens/student/WwjdQuizScreen';

/** 모든 학생용 Stack 화면과 화면별 파라미터를 한곳에서 관리합니다. */
export type StudentStackParamList = {
  Login: undefined;
  // 이름 없이 직접 Home으로 돌아오는 헤더 동작도 허용합니다.
  Home: { studentName?: string } | undefined;
  Qt: undefined;
  WwjdQuiz: undefined;
  Gratitude: undefined;
  MindTalk: undefined;
  ArmorShop: undefined;
};

const Stack = createStackNavigator<StudentStackParamList>();

/** 로그인 성공 시 뒤로 가기로 로그인 화면이 다시 나타나지 않도록 Home으로 교체합니다. */
function LoginRoute({ navigation }: StackScreenProps<StudentStackParamList, 'Login'>) {
  return (
    <LoginScreen
      onLoginSuccess={(student: { id: string; name: string }) =>
        navigation.replace('Home', { studentName: student.name })
      }
    />
  );
}

/** 홈의 네 가지 미션 ID를 타입이 보장된 Stack 화면 이름으로 연결합니다. */
function HomeRoute({ navigation, route }: StackScreenProps<StudentStackParamList, 'Home'>) {
  const handleMissionPress = (mission: StudentMission) => {
    const missionRoutes = {
      qt: 'Qt',
      wwjd: 'WwjdQuiz',
      gratitude: 'Gratitude',
      talk: 'MindTalk',
    } as const;
    const destination = missionRoutes[mission.id as keyof typeof missionRoutes];
    if (destination) navigation.navigate(destination);
  };

  return (
    <HomeScreen
      onArmorShopPress={() => navigation.navigate('ArmorShop')}
      onMissionPress={handleMissionPress}
      studentName={route.params?.studentName}
    />
  );
}

/** 기능 화면의 헤더에서 언제든 마이페이지로 돌아갈 수 있는 큰 홈 버튼입니다. */
function HomeHeaderButton({ goHome }: { goHome: () => void }) {
  return (
    <Pressable
      accessibilityLabel="마이페이지로 돌아가기"
      accessibilityRole="button"
      hitSlop={8}
      onPress={goHome}
      style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}>
      <Text style={styles.headerButtonText}>🏠 홈으로</Text>
    </Pressable>
  );
}

/** 로그인부터 각 학생 미션까지 이어지는 앱의 단일 Stack 흐름입니다. */
export default function StudentNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        cardStyle: { backgroundColor: COLORS.background },
        headerBackTitle: '뒤로',
        headerStyle: { backgroundColor: COLORS.primarySoft },
        headerTintColor: COLORS.textPrimary,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      }}>
      <Stack.Screen component={LoginRoute} name="Login" options={{ headerShown: false }} />
      <Stack.Screen
        component={HomeRoute}
        name="Home"
        options={{ headerLeft: () => null, title: '나의 하늘빛 마을 🌤️' }}
      />
      <Stack.Screen component={QtScreen} name="Qt" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '오늘의 3분 QT 📖' })} />
      <Stack.Screen component={WwjdQuizScreen} name="WwjdQuiz" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: 'WWJD 퀴즈 🚦' })} />
      <Stack.Screen component={GratitudeScreen} name="Gratitude" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '감사 보물상자 🎁' })} />
      <Stack.Screen component={MindTalkScreen} name="MindTalk" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '하늘빛 마음 톡 💬' })} />
      <Stack.Screen component={ArmorShopScreen} name="ArmorShop" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '달란트 상점 🛡️' })} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    ...SHADOWS.soft,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 999,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  headerButtonText: { color: COLORS.primary, fontFamily: Fonts.rounded, fontSize: 14, fontWeight: '800' },
  headerTitle: { color: COLORS.textPrimary, fontFamily: Fonts.rounded, fontSize: 17, fontWeight: '800' },
});
