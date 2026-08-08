import { useRouter } from 'expo-router';

import StudentQtScreen from '@/screens/student/QtScreen';

/** 화면 컴포넌트가 라우터에 의존하지 않도록 뒤로 가기 동작만 연결합니다. */
export default function QtRoute() {
  const router = useRouter();
  return <StudentQtScreen onBack={() => router.back()} />;
}
