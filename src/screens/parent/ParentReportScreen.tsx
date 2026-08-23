import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { MOCK_LINKED_CHILD, MOCK_MONTHLY_REPORT } from './parentData';
import { parentReportStyles as styles } from './parentReportStyles';

/** 자녀의 이번 달 QT 이행률과 한 줄 성찰 기록을 보여 주는 월간 영적 자람 리포트입니다. */
export default function ParentReportScreen() {
  const achievementRate = useMemo(
    () => Math.round((MOCK_MONTHLY_REPORT.completedDays / MOCK_MONTHLY_REPORT.totalDaysSoFar) * 100),
    [],
  );

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{MOCK_LINKED_CHILD.name}의 영적 자람 리포트 🌱</Text>
            <Text style={styles.caption}>이번 달에 얼마나 꾸준히 했는지 볼 수 있어요.</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{MOCK_MONTHLY_REPORT.month}월 QT 이행률</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRate}>{achievementRate}</Text>
              <Text style={styles.summaryRateUnit}>%</Text>
            </View>
            <Text style={styles.summaryDetail}>
              지난 {MOCK_MONTHLY_REPORT.totalDaysSoFar}일 중 {MOCK_MONTHLY_REPORT.completedDays}일 완료했어요
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(achievementRate, 100)}%` }]} />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 성찰 기록 ✍️</Text>
            <Text style={styles.sectionCaption}>말씀을 읽고 아이가 직접 쓴 이야기예요.</Text>
          </View>
          {MOCK_MONTHLY_REPORT.reflections.map((reflection) => (
            <View key={reflection.id} style={styles.reflectionCard}>
              <View style={styles.reflectionHeader}>
                <Text style={styles.reflectionReference}>{reflection.reference}</Text>
                <Text style={styles.reflectionDate}>{reflection.date}</Text>
              </View>
              <Text style={styles.reflectionText}>{reflection.reflection}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </SkyScene>
  );
}
