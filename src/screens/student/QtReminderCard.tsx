import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import GlassCard from '@/components/ui/GlassCard';
import {
  DEFAULT_REMINDER_TIME,
  cancelDailyQtReminder,
  isDailyQtReminderOn,
  isReminderSupported,
  scheduleDailyQtReminder,
} from '@/lib/qtReminder';
import { monthlyCalendarStyles as styles } from './monthlyCalendarStyles';

/** 아이가 고르기 쉽도록 저녁 시간대만 몇 개 골라 뒀습니다. */
const TIME_OPTIONS = [
  { hour: 17, minute: 0, label: '오후 5시' },
  { hour: 19, minute: 0, label: '오후 7시' },
  { hour: 20, minute: 0, label: '오후 8시' },
  { hour: 21, minute: 0, label: '오후 9시' },
];

/** 매일 같은 시간에 QT를 떠올리도록 알림을 켜고 끄는 카드입니다. */
export default function QtReminderCard() {
  const [isOn, setIsOn] = useState(false);
  const [time, setTime] = useState(DEFAULT_REMINDER_TIME);

  // 앱을 다시 켰을 때도 지금 알림이 켜져 있는지 그대로 보여 줍니다.
  useEffect(() => {
    isDailyQtReminderOn().then(setIsOn).catch(() => setIsOn(false));
  }, []);

  const applyReminder = async (hour: number, minute: number) => {
    const ok = await scheduleDailyQtReminder(hour, minute);
    if (!ok) {
      Alert.alert('알림을 켜지 못했어요', '휴대폰 설정에서 알림을 허용해 주세요 🌸');
      return false;
    }
    return true;
  };

  const handleToggle = async () => {
    try {
      if (isOn) {
        await cancelDailyQtReminder();
        setIsOn(false);
        return;
      }
      if (await applyReminder(time.hour, time.minute)) setIsOn(true);
    } catch (error) {
      console.warn('QT 알림을 바꾸는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const handlePickTime = async (option: (typeof TIME_OPTIONS)[number]) => {
    try {
      setTime({ hour: option.hour, minute: option.minute });
      // 이미 켜 둔 상태라면 새 시간으로 곧바로 다시 예약합니다.
      if (isOn) await applyReminder(option.hour, option.minute);
    } catch (error) {
      console.warn('알림 시간을 바꾸는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <GlassCard style={styles.reminderCard}>
      <View style={styles.reminderTopRow}>
        <View style={styles.reminderCopy}>
          <Text style={styles.reminderTitle}>매일 알림 받기 🔔</Text>
          <Text style={styles.reminderCaption}>
            {isReminderSupported
              ? '정한 시간에 오늘의 말씀을 알려줄게!'
              : '휴대폰에서 앱을 열면 알림을 켤 수 있어요.'}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="매일 QT 알림"
          accessibilityRole="switch"
          accessibilityState={{ checked: isOn, disabled: !isReminderSupported }}
          disabled={!isReminderSupported}
          onPress={handleToggle}
          style={[
            styles.reminderSwitch,
            isOn && styles.reminderSwitchOn,
            !isReminderSupported && styles.reminderSwitchDisabled,
          ]}>
          <View style={[styles.reminderKnob, isOn && styles.reminderKnobOn]} />
        </Pressable>
      </View>

      {isReminderSupported && (
        <View style={styles.reminderTimeRow}>
          {TIME_OPTIONS.map((option) => {
            const isSelected = time.hour === option.hour;
            return (
              <Pressable
                accessibilityLabel={`알림 시간 ${option.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={option.label}
                onPress={() => handlePickTime(option)}
                style={[styles.reminderTimeChip, isSelected && styles.reminderTimeChipOn]}>
                <Text style={[styles.reminderTimeText, isSelected && styles.reminderTimeTextOn]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </GlassCard>
  );
}
