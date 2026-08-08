// SDK 56+의 Expo 번들러와 같은 React Navigation 인스턴스를 사용합니다.
import { DefaultTheme, NavigationContainer } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/theme';
import StudentNavigator from '@/navigation/StudentNavigator';

// React Navigation의 기본 동작은 유지하면서 앱 디자인 시스템의 파스텔 색상을 적용합니다.
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.primarySoft,
    primary: COLORS.primary,
    text: COLORS.textPrimary,
    border: COLORS.disabled,
  },
};

/** 앱 최상위에서 안전 영역과 네비게이션 상태를 한 번만 제공합니다. */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="dark" />
        <StudentNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
