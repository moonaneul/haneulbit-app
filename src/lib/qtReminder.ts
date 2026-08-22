import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 앱이 켜져 있을 때도 알림이 배너로 보이게 합니다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** 알림을 다시 예약할 때 기존 것을 지우기 위해 붙이는 표시입니다. */
const REMINDER_TAG = 'daily-qt-reminder';

/** 아이들이 매일 같은 시간에 QT를 떠올리도록 기본값을 저녁 8시로 둡니다. */
export const DEFAULT_REMINDER_TIME = { hour: 20, minute: 0 };

/** 알림은 실제 기기에서만 동작합니다 (웹은 expo-notifications가 지원하지 않아요). */
export const isReminderSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/** 알림 권한을 확인하고, 아직 묻지 않았다면 한 번 요청합니다. */
export async function ensureReminderPermission() {
  if (!isReminderSupported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/**
 * 매일 같은 시간에 한 번 울리는 QT 알림을 예약합니다.
 * 중복 예약을 막기 위해 기존 알림을 모두 지운 뒤 새로 겁니다.
 */
export async function scheduleDailyQtReminder(hour: number, minute: number) {
  if (!isReminderSupported) return false;
  const granted = await ensureReminderPermission();
  if (!granted) return false;

  await cancelDailyQtReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_TAG,
    content: {
      title: '오늘의 말씀이 기다리고 있어요 🕊️',
      body: '3분이면 충분해요. 지금 만나러 갈까요?',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  return true;
}

/** 예약해 둔 QT 알림을 끕니다. */
export async function cancelDailyQtReminder() {
  if (!isReminderSupported) return;
  await Notifications.cancelScheduledNotificationAsync(REMINDER_TAG).catch(() => {
    // 예약된 알림이 없으면 무시합니다.
  });
}

/** 지금 알림이 켜져 있는지(예약돼 있는지) 확인합니다. */
export async function isDailyQtReminderOn() {
  if (!isReminderSupported) return false;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((item) => item.identifier === REMINDER_TAG);
}
