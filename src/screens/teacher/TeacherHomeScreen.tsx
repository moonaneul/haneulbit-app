import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import {
  MOCK_STUDENT_STATUSES,
  TEACHER_SHORTCUTS,
  type TeacherShortcut,
  type TeacherStudentStatus,
} from './teacherHomeData';
import { teacherHomeStyles as styles } from './teacherHomeStyles';

interface TeacherHomeScreenProps {
  onShortcutPress?: (shortcut: TeacherShortcut) => void;
  onSendNudge?: (student: TeacherStudentStatus) => void;
}

/** 선생님이 12명 아이들의 오늘 영적 활동을 한눈에 관리하는 메인 화면입니다. */
export default function TeacherHomeScreen({ onShortcutPress, onSendNudge }: TeacherHomeScreenProps) {
  // 선택한 미참여 학생의 카드 안에 독려 알림 버튼을 펼치기 위한 상태입니다.
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // 학생 데이터가 바뀌어도 오늘 QT 참여 인원이 자동으로 다시 계산됩니다.
  const qtCount = useMemo(
    () => MOCK_STUDENT_STATUSES.filter((student) => student.didQt).length,
    [],
  );

  /** 아직 QT 또는 퀴즈를 완료하지 않은 학생 카드만 독려 대상으로 선택합니다. */
  const handleStudentPress = (student: TeacherStudentStatus) => {
    if (student.didQt && student.didQuiz) return;
    setSelectedStudentId((current) => (current === student.id ? null : student.id));
  };

  /** 실제 푸시 연동 전에도 버튼 동작을 확인할 수 있도록 안내창을 표시합니다. */
  const handleNudgePress = (student: TeacherStudentStatus) => {
    try {
      if (onSendNudge) onSendNudge(student);
      else Alert.alert('독려 알림을 보냈어요 🔔', `${student.name} 어린이에게 따뜻한 응원 메시지를 전했어요!`);
      setSelectedStudentId(null);
    } catch (error) {
      console.warn('독려 푸시 알림을 보내는 중 오류가 발생했습니다.', error);
      Alert.alert('알림을 보내지 못했어요', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 상위 네비게이터가 준비되지 않은 경우에는 임시 안내창으로 숏컷을 테스트합니다. */
  const handleShortcutPress = (shortcut: TeacherShortcut, title: string) => {
    try {
      if (onShortcutPress) onShortcutPress(shortcut);
      else Alert.alert(title, '관리 화면을 준비하고 있어요 🌸');
    } catch (error) {
      console.warn('관리 화면으로 이동하는 중 오류가 발생했습니다.', error);
      Alert.alert('화면을 열지 못했어요', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.summaryCard}>
            <Text style={styles.eyebrow}>TEACHER ADMIN</Text>
            <Text style={styles.title}>하늘빛기쁨 초등부{`\n`}관리자 대시보드 ✝️</Text>
            <View style={styles.participationRow}>
              <Text style={styles.participationText}>오늘 큐티 참여: {qtCount}/12명 🌸</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(qtCount / 12) * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>핵심 관리 기능</Text>
            <Text style={styles.sectionCaption}>자주 쓰는 선생님 메뉴를 빠르게 열어 보세요.</Text>
          </View>
          <View style={styles.shortcutList}>
            {TEACHER_SHORTCUTS.map((item) => (
              <Pressable
                accessibilityLabel={`${item.title}, ${item.description}`}
                accessibilityRole="button"
                key={item.id}
                onPress={() => handleShortcutPress(item.id, item.title)}
                style={({ pressed }) => [styles.shortcut, { backgroundColor: item.color }, pressed && styles.shortcutPressed]}>
                <Text style={styles.shortcutEmoji}>{item.emoji}</Text>
                <View style={styles.shortcutCopy}>
                  <Text style={styles.shortcutTitle}>{item.title}</Text>
                  <Text style={styles.shortcutDescription}>{item.description}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>아이들 영적 현황 🌱</Text>
            <Text style={styles.sectionCaption}>미완료 카드를 누르면 바로 따뜻한 독려 알림을 보낼 수 있어요.</Text>
          </View>
          <View style={styles.studentList}>
            {MOCK_STUDENT_STATUSES.map((student) => {
              const isSelected = selectedStudentId === student.id;
              const isComplete = student.didQt && student.didQuiz;
              return (
                <Pressable
                  accessibilityHint={isComplete ? '오늘 활동을 모두 완료했습니다' : '누르면 독려 알림 버튼이 열립니다'}
                  accessibilityLabel={`${student.name}, QT ${student.didQt ? '완료' : '미완료'}, 퀴즈 ${student.didQuiz ? '완료' : '미완료'}`}
                  accessibilityRole="button"
                  key={student.id}
                  onPress={() => handleStudentPress(student)}
                  style={({ pressed }) => [styles.studentCard, isSelected && styles.studentCardSelected, pressed && !isComplete && styles.studentCardPressed]}>
                  <View style={styles.studentMainRow}>
                    <View style={styles.avatarCircle}><Text style={styles.avatar}>{student.avatar}</Text></View>
                    <View style={styles.studentInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <View style={styles.streakBadge}><Text style={styles.streakText}>🔥 {student.streakDays}일 연속</Text></View>
                      </View>
                      <View style={styles.activityRow}>
                        <Text style={styles.activityText}>QT {student.didQt ? '✅' : '❌'}</Text>
                        <Text style={styles.activityText}>퀴즈 {student.didQuiz ? '✅' : '❌'}</Text>
                      </View>
                    </View>
                    <Text style={styles.talent}>🪙 {student.talentPoints}</Text>
                  </View>
                  {isSelected && (
                    <Pressable
                      accessibilityLabel={`${student.name} 어린이에게 독려 푸시 알림 보내기`}
                      accessibilityRole="button"
                      onPress={() => handleNudgePress(student)}
                      style={({ pressed }) => [styles.nudgeButton, pressed && styles.nudgeButtonPressed]}>
                      <Text style={styles.nudgeButtonText}>원클릭 독려 푸시 알림 보내기 🔔</Text>
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SkyScene>
  );
}
