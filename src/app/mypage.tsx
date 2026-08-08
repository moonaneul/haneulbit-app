import { useLocalSearchParams } from 'expo-router';

import StudentHomeScreen from '@/screens/student/HomeScreen';

/** 라우트 파라미터의 학생 이름을 실제 마이페이지 화면에 전달합니다. */
export default function MyPageScreen() {
  const { studentName } = useLocalSearchParams<{ studentName?: string }>();

  return <StudentHomeScreen studentName={studentName} />;
}
