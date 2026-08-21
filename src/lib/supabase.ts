// Supabase 클라이언트를 앱 전체에서 하나만 만들어 재사용합니다.
// URL/anon key는 .env(EXPO_PUBLIC_ 접두사)로 관리하며 코드에 직접 적지 않습니다.
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// 아직 .env를 설정하지 않은 개발 초기 단계에서도 앱이 바로 터지지 않도록,
// 값이 비어 있으면 화면단에서 "아직 연결 전"임을 알아챌 수 있는 형태로만 안내합니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase 환경변수(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)가 설정되지 않았어요. ' +
      '.env.example을 참고해 .env 파일을 만들어 주세요. 지금은 Mock 데이터로만 화면이 동작해요.',
  );
}

/** 앱 전역에서 재사용하는 단일 Supabase 클라이언트입니다. */
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // 네이티브 앱에는 URL 기반 세션 감지가 필요 없습니다.
    detectSessionInUrl: false,
  },
});

// 앱이 백그라운드로 갈 때 토큰 자동 갱신을 멈추고, 다시 돌아오면 재개합니다.
// (Supabase 공식 React Native 가이드에서 권장하는 표준 패턴입니다.)
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

/** .env 설정 여부를 화면에서 쉽게 확인할 수 있도록 노출합니다. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
