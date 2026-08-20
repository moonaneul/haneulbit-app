// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';

import RoleSelectScreen from '@/screens/auth/RoleSelectScreen';
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';

/** 학생/선생님 계정 흐름을 감싸는 앱의 최상위 Stack입니다. */
export type RootStackParamList = {
  RoleSelect: undefined;
  StudentApp: undefined;
  TeacherApp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/** 역할을 고르면 학생 또는 선생님 Stack으로 진입합니다. */
function RoleSelectRoute({ navigation }: StackScreenProps<RootStackParamList, 'RoleSelect'>) {
  return (
    <RoleSelectScreen
      onSelectRole={(role: 'student' | 'teacher') =>
        navigation.navigate(role === 'teacher' ? 'TeacherApp' : 'StudentApp')
      }
    />
  );
}

/** 역할 선택 화면 아래에 학생용, 선생님용 Stack을 각각 중첩 화면으로 연결합니다. */
export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="RoleSelect" screenOptions={{ headerShown: false }}>
      <Stack.Screen component={RoleSelectRoute} name="RoleSelect" />
      <Stack.Screen component={StudentNavigator} name="StudentApp" />
      <Stack.Screen component={TeacherNavigator} name="TeacherApp" />
    </Stack.Navigator>
  );
}
