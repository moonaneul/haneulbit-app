// SDK 56+의 Expo 번들러와 같은 React Navigation 인스턴스를 사용합니다.
import { Jua_400Regular, useFonts } from '@expo-google-fonts/jua';
import { DefaultTheme, NavigationContainer } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLORS, SCENE } from '@/constants/theme';
import RootNavigator from '@/navigation/RootNavigator';

// 글꼴을 다 읽기 전에 화면이 번쩍 바뀌지 않도록 스플래시를 붙잡아 둡니다.
SplashScreen.preventAutoHideAsync();

// React Navigation의 기본 동작은 유지하면서 앱 디자인 시스템의 파스텔 색상을 적용합니다.
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: SCENE.sky[0],
    card: SCENE.sky[0],
    primary: COLORS.primary,
    text: COLORS.textPrimary,
    border: COLORS.disabled,
  },
};

/** 앱 최상위에서 글꼴, 안전 영역, 네비게이션 상태를 한 번만 준비합니다. */
export default function App() {
  // 제목용 둥근 한글 폰트만 번들해서 읽습니다. (본문은 플랫폼 기본 한글 폰트를 씁니다)
  const [fontsLoaded, fontError] = useFonts({ Jua_400Regular });

  useEffect(() => {
    // 글꼴을 못 읽어도 앱이 멈추지 않도록, 실패한 경우에도 스플래시를 걷어 냅니다.
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
