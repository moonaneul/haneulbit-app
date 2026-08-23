import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Supabase 연결 전까지 아이의 진행 상황을 기기에 저장해 두는 얇은 래퍼입니다.
 * 앱을 껐다 켜도 달란트와 갑주가 그대로 남아 있어야 실제로 써 볼 수 있기 때문입니다.
 */

/** 나중에 Supabase로 옮길 때 한 번에 지울 수 있도록 접두어를 붙여 둡니다. */
const PREFIX = 'hanulbit:';

export const STORE_KEYS = {
  armor: `${PREFIX}student-armor`,
  statusMessage: `${PREFIX}student-status-message`,
} as const;

/** 저장된 값을 읽어 옵니다. 값이 없거나 형식이 깨졌으면 조용히 기본값을 씁니다. */
export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`저장된 값을 읽지 못했습니다: ${key}`, error);
    return fallback;
  }
}

/** 저장에 실패해도 화면이 멈추면 안 되므로 경고만 남기고 넘어갑니다. */
export async function saveJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`값을 저장하지 못했습니다: ${key}`, error);
  }
}
