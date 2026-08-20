// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';

import { COLORS } from '@/constants/theme';
import TeacherLoginScreen from '@/screens/auth/TeacherLoginScreen';
import TeacherHomeScreen from '@/screens/teacher/TeacherHomeScreen';

/** 선생님용 Stack 화면과 화면별 파라미터를 한곳에서 관리합니다. */
export type TeacherStackParamList = {
  TeacherLogin: undefined;
  TeacherHome: undefined;
};

const Stack = createStackNavigator<TeacherStackParamList>();

/** 로그인 성공 시 뒤로 가기로 로그인 화면이 다시 나타나지 않도록 대시보드로 교체합니다. */
function TeacherLoginRoute({ navigation }: StackScreenProps<TeacherStackParamList, 'TeacherLogin'>) {
  return <TeacherLoginScreen onLoginSuccess={() => navigation.replace('TeacherHome')} />;
}

/** 선생님 로그인부터 12명 통합 대시보드로 이어지는 관리자 Stack 흐름입니다. */
export default function TeacherNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TeacherLogin"
      screenOptions={{
        cardStyle: { backgroundColor: COLORS.background },
        headerBackTitle: '뒤로',
        headerStyle: { backgroundColor: COLORS.primarySoft },
        headerTintColor: COLORS.textPrimary,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen component={TeacherLoginRoute} name="TeacherLogin" options={{ headerShown: false }} />
      <Stack.Screen component={TeacherHomeScreen} name="TeacherHome" options={{ headerLeft: () => null, title: '선생님 대시보드 ✝️' }} />
    </Stack.Navigator>
  );
}
