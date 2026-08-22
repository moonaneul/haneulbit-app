// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';
import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, Fonts, SCENE, SHADOWS } from '@/constants/theme';
import { ArmorProvider } from '@/context/ArmorProvider';
import LoginScreen from '@/screens/auth/LoginScreen';
import ArmorShopScreen from '@/screens/student/ArmorShopScreen';
import GratitudeScreen from '@/screens/student/GratitudeScreen';
import HomeScreen from '@/screens/student/HomeScreen';
import type { StudentMission } from '@/screens/student/homeData';
import ManitoScreen from '@/screens/student/ManitoScreen';
import MindTalkScreen from '@/screens/student/MindTalkScreen';
import MonthlyCalendarScreen from '@/screens/student/MonthlyCalendarScreen';
import NoticeCalendarScreen from '@/screens/student/NoticeCalendarScreen';
import QtScreen from '@/screens/student/QtScreen';
import StatusFeedScreen from '@/screens/student/StatusFeedScreen';
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
  StatusFeed: { myName: string; myMessage: string };
  NoticeCalendar: undefined;
  MonthlyCalendar: undefined;
  Manito: undefined;
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
      onManitoPress={() => navigation.navigate('Manito')}
      onMonthlyCalendarPress={() => navigation.navigate('MonthlyCalendar')}
      onNoticeCalendarPress={() => navigation.navigate('NoticeCalendar')}
      onStatusFeedPress={(myName, myMessage) => navigation.navigate('StatusFeed', { myName, myMessage })}
      studentName={route.params?.studentName}
    />
  );
}

/** Stack 라우트 파라미터를 화면이 기대하는 props 형태로 그대로 전달합니다. */
function StatusFeedRoute({ route }: StackScreenProps<StudentStackParamList, 'StatusFeed'>) {
  return <StatusFeedScreen myMessage={route.params.myMessage} myName={route.params.myName} />;
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
    <ArmorProvider>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        cardStyle: { backgroundColor: SCENE.sky[0] },
        headerBackTitle: '뒤로',
        headerStyle: { backgroundColor: SCENE.sky[0], elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
        headerTintColor: COLORS.textPrimary,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      }}>
      <Stack.Screen component={LoginRoute} name="Login" options={{ headerShown: false }} />
      {/* 홈은 하늘빛 풍경이 화면 끝까지 채워지도록 헤더를 숨깁니다. */}
      <Stack.Screen component={HomeRoute} name="Home" options={{ headerShown: false }} />
      <Stack.Screen component={QtScreen} name="Qt" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '오늘의 3분 QT 📖' })} />
      <Stack.Screen component={WwjdQuizScreen} name="WwjdQuiz" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: 'WWJD 퀴즈 🚦' })} />
      <Stack.Screen component={GratitudeScreen} name="Gratitude" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '감사 보물상자 🎁' })} />
      <Stack.Screen component={MindTalkScreen} name="MindTalk" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '하늘빛 마음 톡 💬' })} />
      <Stack.Screen component={ArmorShopScreen} name="ArmorShop" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '달란트 상점 🛡️' })} />
      <Stack.Screen component={StatusFeedRoute} name="StatusFeed" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '마음 게시판 🌍' })} />
      <Stack.Screen component={NoticeCalendarScreen} name="NoticeCalendar" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '알림장 & 캘린더 📖' })} />
      <Stack.Screen component={MonthlyCalendarScreen} name="MonthlyCalendar" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '만나 스티커 달력 🍞' })} />
      <Stack.Screen component={ManitoScreen} name="Manito" options={({ navigation }) => ({ headerLeft: () => <HomeHeaderButton goHome={() => navigation.navigate('Home')} />, title: '비밀 마니또 🤫' })} />
    </Stack.Navigator>
    </ArmorProvider>
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
  headerButtonText: { color: COLORS.primary, fontFamily: Fonts.display, fontSize: 14 },
  headerTitle: { color: COLORS.textPrimary, fontFamily: Fonts.display, fontSize: 17 },
});
