// Expo SDK 57에 내장된 React Navigation Stack 구현과 타입을 함께 사용합니다.
import {
  createStackNavigator,
  type StackScreenProps,
} from 'expo-router/build/react-navigation/stack';

import { COLORS, SCENE } from '@/constants/theme';
import TeacherLoginScreen from '@/screens/auth/TeacherLoginScreen';
import { MOCK_TALK_THREADS } from '@/screens/teacher/teacherMindTalkData';
import TeacherHomeScreen from '@/screens/teacher/TeacherHomeScreen';
import type { TeacherShortcut } from '@/screens/teacher/teacherHomeData';
import TeacherMindTalkListScreen from '@/screens/teacher/TeacherMindTalkListScreen';
import TeacherMindTalkThreadScreen from '@/screens/teacher/TeacherMindTalkThreadScreen';
import TeacherNoticeCalendarManageScreen from '@/screens/teacher/TeacherNoticeCalendarManageScreen';
import TeacherSafetyMonitorScreen from '@/screens/teacher/TeacherSafetyMonitorScreen';
import TeacherStudentManageScreen from '@/screens/teacher/TeacherStudentManageScreen';
import TeacherTemplateScreen from '@/screens/teacher/TeacherTemplateScreen';
import TeacherVideoManageScreen from '@/screens/teacher/TeacherVideoManageScreen';

/** 선생님용 Stack 화면과 화면별 파라미터를 한곳에서 관리합니다. */
export type TeacherStackParamList = {
  TeacherLogin: undefined;
  TeacherHome: undefined;
  TeacherStudentManage: undefined;
  TeacherTemplate: undefined;
  TeacherNoticeCalendarManage: undefined;
  TeacherVideoManage: undefined;
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
      students: 'TeacherStudentManage',
      template: 'TeacherTemplate',
      noticeCalendar: 'TeacherNoticeCalendarManage',
      video: 'TeacherVideoManage',
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
        cardStyle: { backgroundColor: SCENE.sky[0] },
        headerBackTitle: '뒤로',
        headerStyle: { backgroundColor: SCENE.sky[0], elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
        headerTintColor: COLORS.textPrimary,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen component={TeacherLoginRoute} name="TeacherLogin" options={{ headerShown: false }} />
      <Stack.Screen component={TeacherHomeRoute} name="TeacherHome" options={{ headerShown: false }} />
      <Stack.Screen component={TeacherStudentManageScreen} name="TeacherStudentManage" options={{ title: '' }} />
      <Stack.Screen component={TeacherTemplateScreen} name="TeacherTemplate" options={{ title: '' }} />
      <Stack.Screen component={TeacherNoticeCalendarManageScreen} name="TeacherNoticeCalendarManage" options={{ title: '' }} />
      <Stack.Screen component={TeacherVideoManageScreen} name="TeacherVideoManage" options={{ title: '' }} />
      <Stack.Screen component={TeacherMindTalkListRoute} name="TeacherMindTalkList" options={{ title: '' }} />
      <Stack.Screen component={TeacherMindTalkThreadRoute} name="TeacherMindTalkThread" options={{ title: '' }} />
      <Stack.Screen component={TeacherSafetyMonitorScreen} name="TeacherSafetyMonitor" options={{ title: '' }} />
    </Stack.Navigator>
  );
}
