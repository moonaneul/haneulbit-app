// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';

import { COLORS } from '@/constants/theme';
import TeacherLoginScreen from '@/screens/auth/TeacherLoginScreen';
import { MOCK_TALK_THREADS } from '@/screens/teacher/teacherMindTalkData';
import TeacherHomeScreen from '@/screens/teacher/TeacherHomeScreen';
import type { TeacherShortcut } from '@/screens/teacher/teacherHomeData';
import TeacherMindTalkListScreen from '@/screens/teacher/TeacherMindTalkListScreen';
import TeacherMindTalkThreadScreen from '@/screens/teacher/TeacherMindTalkThreadScreen';
import TeacherSafetyMonitorScreen from '@/screens/teacher/TeacherSafetyMonitorScreen';
import TeacherTemplateScreen from '@/screens/teacher/TeacherTemplateScreen';

/** 선생님용 Stack 화면과 화면별 파라미터를 한곳에서 관리합니다. */
export type TeacherStackParamList = {
  TeacherLogin: undefined;
  TeacherHome: undefined;
  TeacherTemplate: undefined;
  TeacherMindTalkList: undefined;
  TeacherMindTalkThread: { threadId: string };
  TeacherSafetyMonitor: undefined;
};

const Stack = createStackNavigator<TeacherStackParamList>();

/** 로그인 성공 시 뒤로 가기로 로그인 화면이 다시 나타나지 않도록 대시보드로 교체합니다. */
function TeacherLoginRoute({ navigation }: StackScreenProps<TeacherStackParamList, 'TeacherLogin'>) {
  return <TeacherLoginScreen onLoginSuccess={() => navigation.replace('TeacherHome')} />;
}

/** 대시보드의 세 가지 관리 기능 숏컷을 각 Stack 화면으로 연결합니다. */
function TeacherHomeRoute({ navigation }: StackScreenProps<TeacherStackParamList, 'TeacherHome'>) {
  const handleShortcutPress = (shortcut: TeacherShortcut) => {
    const shortcutRoutes = {
      template: 'TeacherTemplate',
      mindTalk: 'TeacherMindTalkList',
      safety: 'TeacherSafetyMonitor',
    } as const;
    navigation.navigate(shortcutRoutes[shortcut]);
  };

  return <TeacherHomeScreen onShortcutPress={handleShortcutPress} />;
}

/** 목록에서 고른 학생 대화방으로 이동합니다. */
function TeacherMindTalkListRoute({ navigation }: StackScreenProps<TeacherStackParamList, 'TeacherMindTalkList'>) {
  return (
    <TeacherMindTalkListScreen
      onThreadPress={(thread) => navigation.navigate('TeacherMindTalkThread', { threadId: thread.id })}
    />
  );
}

/** Stack 파라미터의 학생 ID로 Mock 대화 목록에서 해당 스레드를 찾아 전달합니다. */
function TeacherMindTalkThreadRoute({ route }: StackScreenProps<TeacherStackParamList, 'TeacherMindTalkThread'>) {
  const thread = MOCK_TALK_THREADS.find((item) => item.id === route.params.threadId) ?? MOCK_TALK_THREADS[0];
  return <TeacherMindTalkThreadScreen thread={thread} />;
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
      <Stack.Screen component={TeacherHomeRoute} name="TeacherHome" options={{ headerLeft: () => null, title: '선생님 대시보드 ✝️' }} />
      <Stack.Screen component={TeacherTemplateScreen} name="TeacherTemplate" options={{ title: '주간 템플릿 등록 📝' }} />
      <Stack.Screen component={TeacherMindTalkListRoute} name="TeacherMindTalkList" options={{ title: '1:1 마음 톡 💬' }} />
      <Stack.Screen component={TeacherMindTalkThreadRoute} name="TeacherMindTalkThread" options={{ title: '학생과의 대화' }} />
      <Stack.Screen component={TeacherSafetyMonitorScreen} name="TeacherSafetyMonitor" options={{ title: 'AI 안전 모니터링 🚨' }} />
    </Stack.Navigator>
  );
}
