import { useRouter } from 'expo-router';

import WwjdQuizScreen from '@/screens/student/WwjdQuizScreen';

/** 화면 컴포넌트는 UI에 집중하고, 실제 뒤로 가기는 라우트에서 연결합니다. */
export default function WwjdQuizRoute() {
  const router = useRouter();
  return <WwjdQuizScreen onBack={() => router.back()} />;
}
