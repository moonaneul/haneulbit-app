import { useRouter } from 'expo-router';

import MindTalkScreen from '@/screens/student/MindTalkScreen';

export default function MindTalkRoute() {
  const router = useRouter();

  return <MindTalkScreen onBack={() => router.back()} />;
}
