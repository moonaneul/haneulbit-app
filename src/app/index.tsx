import { useRouter } from 'expo-router';

import LoginScreen from '@/screens/auth/LoginScreen';

export default function HomeScreen() {
  const router = useRouter();

  // 로그인 화면은 UI에만 집중하고, 실제 경로 이동은 라우트 파일에서 담당합니다.
  const handleLoginSuccess = (student: { id: string; name: string }) => {
    router.replace({ pathname: '/mypage', params: { studentName: student.name } });
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
