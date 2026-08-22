// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';

import { COLORS, SCENE } from '@/constants/theme';
import ParentLoginScreen from '@/screens/auth/ParentLoginScreen';
import ParentHomeScreen, { type ParentMenuKey } from '@/screens/parent/ParentHomeScreen';
import ParentMissionApprovalScreen from '@/screens/parent/ParentMissionApprovalScreen';
import ParentNoticeCalendarScreen from '@/screens/parent/ParentNoticeCalendarScreen';
import ParentReportScreen from '@/screens/parent/ParentReportScreen';

/** 부모님용 Stack 화면과 화면별 파라미터를 한곳에서 관리합니다. */
export type ParentStackParamList = {
  ParentLogin: undefined;
  ParentHome: undefined;
  ParentReport: undefined;
  ParentNoticeCalendar: undefined;
  ParentMissionApproval: undefined;
};

const Stack = createStackNavigator<ParentStackParamList>();

/** 로그인 성공 시 뒤로 가기로 로그인 화면이 다시 나타나지 않도록 홈으로 교체합니다. */
function ParentLoginRoute({ navigation }: StackScreenProps<ParentStackParamList, 'ParentLogin'>) {
  return <ParentLoginScreen onLoginSuccess={() => navigation.replace('ParentHome')} />;
}

/** 세 가지 부모님 메뉴를 각 Stack 화면으로 연결합니다. */
function ParentHomeRoute({ navigation }: StackScreenProps<ParentStackParamList, 'ParentHome'>) {
  const handleMenuPress = (key: ParentMenuKey) => {
    const menuRoutes = {
      report: 'ParentReport',
      notice: 'ParentNoticeCalendar',
      mission: 'ParentMissionApproval',
    } as const;
    navigation.navigate(menuRoutes[key]);
  };

  return <ParentHomeScreen onMenuPress={handleMenuPress} />;
}

/** 자녀 연동부터 리포트·알림장·가정 미션 확인까지 이어지는 부모님 Stack 흐름입니다. */
export default function ParentNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ParentLogin"
      screenOptions={{
        cardStyle: { backgroundColor: SCENE.sky[0] },
        headerBackTitle: '뒤로',
        headerStyle: { backgroundColor: SCENE.sky[0], elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
        headerTintColor: COLORS.textPrimary,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen component={ParentLoginRoute} name="ParentLogin" options={{ headerShown: false }} />
      <Stack.Screen component={ParentHomeRoute} name="ParentHome" options={{ headerLeft: () => null, title: '부모님 홈 🏡' }} />
      <Stack.Screen component={ParentReportScreen} name="ParentReport" options={{ title: '영적 자람 리포트 🌱' }} />
      <Stack.Screen component={ParentNoticeCalendarScreen} name="ParentNoticeCalendar" options={{ title: '알림장 & 캘린더 📖' }} />
      <Stack.Screen component={ParentMissionApprovalScreen} name="ParentMissionApproval" options={{ title: '가정 실천 미션 도장 ✅' }} />
    </Stack.Navigator>
  );
}
