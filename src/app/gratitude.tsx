import { useRouter } from 'expo-router';

import GratitudeScreen from '@/screens/student/GratitudeScreen';

export default function GratitudeRoute() {
  const router = useRouter();
  return <GratitudeScreen onBack={() => router.back()} />;
}
