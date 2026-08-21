import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MONTHLY_CALENDAR_INFO, MOCK_MONTHLY_STICKERS, WEEKDAY_LABELS } from './monthlyCalendarData';
import { monthlyCalendarStyles as styles } from './monthlyCalendarStyles';

/** 매일 미션을 완료하면 만나 스티커가 쌓이는 월간 달력 화면입니다. */
export default function MonthlyCalendarScreen() {
  // 이번 달 진행 상황이 바뀌지 않는 한 다시 계산할 필요가 없어 useMemo로 감쌉니다.
  const { completedCount, achievementRate } = useMemo(() => {
    const completed = MOCK_MONTHLY_STICKERS.filter((record) => record.completed).length;
    // 매월 1일에 리셋되는 달성률은 "이번 달 지나간 날짜" 기준으로 계산합니다 (달란트는 별개로 계속 쌓임).
    const rate = MONTHLY_CALENDAR_INFO.today > 0
      ? Math.round((completed / MONTHLY_CALENDAR_INFO.today) * 100)
      : 0;
    return { completedCount: completed, achievementRate: rate };
  }, []);

  // 1일 앞에 빈 칸을 채워야 요일 줄이 맞아요.
  const leadingBlanks = Array.from({ length: MONTHLY_CALENDAR_INFO.firstWeekday }, (_, index) => index);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>만나 스티커 달력 🍞</Text>
            <Text style={styles.caption}>매일 미션을 완료하면 만나 스티커가 쌓여요!</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>이번 달 달성률</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRate}>{achievementRate}</Text>
              <Text style={styles.summaryRateUnit}>%</Text>
            </View>
            <Text style={styles.summaryDetail}>
              {MONTHLY_CALENDAR_INFO.month}월 {MONTHLY_CALENDAR_INFO.today}일까지 {completedCount}일 완료
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(achievementRate, 100)}%` }]} />
            </View>
            <Text style={styles.resetNote}>
              🌱 달성률은 매월 1일에 새로 시작해요. 지금까지 모은 달란트는 그대로 유지돼요!
            </Text>
          </View>

          <View style={styles.calendarCard}>
            <Text style={styles.monthLabel}>{MONTHLY_CALENDAR_INFO.year}년 {MONTHLY_CALENDAR_INFO.month}월</Text>
            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label) => (
                <View key={label} style={styles.weekdayCell}><Text style={styles.weekdayText}>{label}</Text></View>
              ))}
            </View>
            <View style={styles.dayGrid}>
              {leadingBlanks.map((blankIndex) => (
                <View key={`blank-${blankIndex}`} style={styles.dayCell} />
              ))}
              {MOCK_MONTHLY_STICKERS.map((record) => (
                <View key={record.day} style={styles.dayCell}>
                  <View
                    accessibilityLabel={`${record.day}일, ${record.completed ? '만나 스티커 완료' : record.isFuture ? '아직 오지 않은 날' : '미완료'}`}
                    style={[
                      styles.dayCellInner,
                      record.completed && styles.dayCellCompleted,
                      record.isToday && styles.dayCellToday,
                    ]}>
                    {record.completed
                      ? <Text style={styles.stickerEmoji}>🍞</Text>
                      : <Text style={[styles.dayNumber, record.isFuture && styles.dayNumberFuture]}>{record.day}</Text>}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><Text style={styles.legendEmoji}>🍞</Text><Text style={styles.legendText}>완료</Text></View>
              <View style={styles.legendItem}>
                <View style={[styles.dayCellInner, styles.dayCellToday, { width: 16, height: 16 }]} />
                <Text style={styles.legendText}>오늘</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
