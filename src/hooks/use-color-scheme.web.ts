import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// hydration 여부는 구독할 외부 이벤트가 없으므로 빈 구독 해제 함수를 반환합니다.
const subscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  // 서버 렌더링 중에는 false, 브라우저가 연결된 뒤에는 true를 반환합니다.
  // Effect 안에서 즉시 setState를 호출하지 않아 불필요한 추가 렌더링도 방지합니다.
  const hasHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
