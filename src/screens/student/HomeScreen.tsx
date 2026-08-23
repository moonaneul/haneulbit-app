import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';
import GlassCard from '@/components/ui/GlassCard';
import Toast, { type ToastTone } from '@/components/ui/Toast';
import { useArmor } from '@/context/ArmorProvider';
import { STORE_KEYS, loadJson, saveJson } from '@/lib/localStore';
import { fetchQtSummary, isQtApiReady } from '@/lib/qtApi';
import AvatarStage from './AvatarStage';
import { MOCK_STUDENT, STUDENT_MISSIONS, type StudentMission } from './homeData';
import { homeStyles as styles } from './homeStyles';
import MissionGrid from './MissionGrid';
import StatusMessageCard from './StatusMessageCard';

/** 아직 한 줄 다짐을 써 본 적 없는 아이에게 보여 줄 예시 문장입니다. */
const DEFAULT_STATUS_MESSAGE = '오늘도 말씀으로 승리하자! 🕊️';

interface HomeScreenProps {
  studentName?: string;
  onMissionPress?: (mission: StudentMission) => void;
  onArmorShopPress?: () => void;
  onStatusFeedPress?: (myName: string, myMessage: string) => void;
  onNoticeCalendarPress?: () => void;
  onMonthlyCalendarPress?: () => void;
  onManitoPress?: () => void;
  onSettingsPress?: () => void;
}

/** 학생이 로그인한 뒤 처음 만나는 메인 마이페이지 화면입니다. */
export default function HomeScreen({ studentName, onMissionPress, onArmorShopPress, onStatusFeedPress, onNoticeCalendarPress, onMonthlyCalendarPress, onManitoPress, onSettingsPress }: HomeScreenProps) {
  // 달란트는 상점과 같은 값을 봐야 해서 ArmorProvider에서 가져옵니다.
  const { talents } = useArmor();
  // 로그인에서 받은 이름이 있으면 Mock 기본 이름 대신 사용합니다.
  const student = { ...MOCK_STUDENT, name: studentName?.trim() || MOCK_STUDENT.name };
  // 아바타를 누를 때 응원 말풍선을 열고 닫는 상태입니다.
  const [isAvatarTalking, setIsAvatarTalking] = useState(true);
  const [statusMessage, setStatusMessage] = useState(DEFAULT_STATUS_MESSAGE);
  // 연속 출석은 QT 완료 기록에서 계산돼 서버가 알려 줍니다.
  const [streakDays, setStreakDays] = useState(MOCK_STUDENT.streakDays);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!isQtApiReady) return;
    fetchQtSummary()
      .then((summary) => setStreakDays(summary.streakDays))
      .catch((error) => console.warn('연속 출석을 불러오지 못했습니다.', error));
  }, []);

  // 어제 쓴 다짐이 그대로 남아 있어야 아이가 이어서 쓰는 느낌을 받습니다.
  useEffect(() => {
    loadJson(STORE_KEYS.statusMessage, DEFAULT_STATUS_MESSAGE).then(setStatusMessage);
  }, []);

  const handleSaveStatusMessage = (next: string) => {
    setStatusMessage(next);
    saveJson(STORE_KEYS.statusMessage, next);
  };

  /** 콜백이 아직 연결되지 않은 메뉴는 친근한 안내창으로 대신 알려 줍니다. */
  const openOrNotice = (handler: (() => void) | undefined, title: string, failMessage: string) => {
    try {
      if (handler) {
        handler();
        return;
      }
      Alert.alert(title, '화면을 준비하고 있어요 🌸');
    } catch (error) {
      console.warn(failMessage, error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const handleArmorShopPress = () => openOrNotice(onArmorShopPress, '달란트 상점', '달란트 상점으로 이동하는 중 오류가 발생했습니다.');
  const handleNoticeCalendarPress = () => openOrNotice(onNoticeCalendarPress, '알림장 & 캘린더', '알림장 & 캘린더로 이동하는 중 오류가 발생했습니다.');
  const handleMonthlyCalendarPress = () => openOrNotice(onMonthlyCalendarPress, '만나 스티커 달력', '만나 스티커 달력으로 이동하는 중 오류가 발생했습니다.');
  const handleManitoPress = () => openOrNotice(onManitoPress, '비밀 마니또', '비밀 마니또로 이동하는 중 오류가 발생했습니다.');
  const handleSettingsPress = () => openOrNotice(onSettingsPress, '설정', '설정 화면으로 이동하는 중 오류가 발생했습니다.');
  const handleStatusFeedPress = () =>
    openOrNotice(
      onStatusFeedPress && (() => onStatusFeedPress(student.name, statusMessage)),
      '마을 게시판',
      '마을 게시판으로 이동하는 중 오류가 발생했습니다.',
    );

  // 아직 실제 화면이 없는 미션은 친근한 안내창으로 터치 동작을 확인합니다.
  const handleMissionPress = (mission: StudentMission) => {
    try {
      // 네비게이터가 전달한 콜백이 있으면 미션에 맞는 Stack 화면으로 이동합니다.
      if (onMissionPress && ['qt', 'wwjd', 'gratitude', 'talk'].includes(mission.id)) {
        onMissionPress(mission);
        return;
      }
      Alert.alert(`${mission.emoji} ${mission.title}`, '곧 신나는 미션이 열려요! 조금만 기다려 주세요 🌸');
    } catch (error) {
      console.warn('미션 안내를 여는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SkyScene>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Toast message={toast?.message ?? null} onHide={hideToast} tone={toast?.tone} />
            <GlassCard style={styles.header}>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>{student.name[0]}</Text>
              </View>
              <View style={styles.headerIdentity}>
                <Text style={styles.greeting}>샬롬, 반가워요!</Text>
                <Text style={styles.studentName}>{student.name}</Text>
              </View>
              <View style={styles.statsRow}>
                <Pressable
                  accessibilityHint="누르면 만나 스티커가 쌓이는 월간 달력으로 이동합니다"
                  accessibilityLabel={`연속 ${streakDays}일 출석, 만나 스티커 달력 가기`}
                  accessibilityRole="button"
                  onPress={handleMonthlyCalendarPress}
                  style={({ pressed }) => [styles.statBadge, pressed && styles.statBadgePressed]}>
                  <Text style={styles.statText}>🔥 {streakDays}일</Text>
                </Pressable>
                <Pressable
                  accessibilityHint="누르면 전신갑주를 구매할 수 있는 상점으로 이동합니다"
                  accessibilityLabel={`내 달란트 ${talents}포인트, 달란트 상점 가기`}
                  accessibilityRole="button"
                  onPress={handleArmorShopPress}
                  style={({ pressed }) => [styles.statBadge, pressed && styles.statBadgePressed]}>
                  <Text style={styles.statText}>🪙 {talents}pt</Text>
                </Pressable>
              </View>
            </GlassCard>

            <AvatarStage isTalking={isAvatarTalking} onPress={() => setIsAvatarTalking((current) => !current)} />

            <Pressable
              accessibilityHint="달란트로 전신갑주를 구매하고 착용할 수 있습니다"
              accessibilityLabel="달란트 상점 가기"
              accessibilityRole="button"
              onPress={handleArmorShopPress}
              style={({ pressed }) => [styles.shopButton, pressed && styles.avatarPressed]}>
              <Text style={styles.shopButtonText}>달란트 상점 가기 🛡️</Text>
            </Pressable>

            <StatusMessageCard message={statusMessage} onSave={handleSaveStatusMessage} onViewFeed={handleStatusFeedPress} />

            <MissionGrid missions={STUDENT_MISSIONS} onMissionPress={handleMissionPress} />

            <Pressable
              accessibilityLabel="알림장 & 캘린더, 선생님 공지사항과 초등부 일정 확인하기"
              accessibilityRole="button"
              onPress={handleNoticeCalendarPress}
              style={({ pressed }) => [pressed && styles.noticeBannerPressed]}>
              <GlassCard style={styles.noticeBanner}>
                <Text style={styles.noticeBannerEmoji}>📋</Text>
                <View style={styles.noticeBannerCopy}>
                  <Text style={styles.noticeBannerTitle}>알림장 & 캘린더</Text>
                  <Text style={styles.noticeBannerDescription}>선생님이 알려주신 소식 보러 가기</Text>
                </View>
                <Text style={styles.noticeBannerArrow}>›</Text>
              </GlassCard>
            </Pressable>

            <Pressable
              accessibilityLabel="비밀 마니또, 이번 주 마니또에게 몰래 기도 배달하기"
              accessibilityRole="button"
              onPress={handleManitoPress}
              style={({ pressed }) => [pressed && styles.noticeBannerPressed]}>
              <GlassCard style={styles.noticeBanner}>
                <Text style={styles.noticeBannerEmoji}>🤫</Text>
                <View style={styles.noticeBannerCopy}>
                  <Text style={styles.noticeBannerTitle}>비밀 마니또</Text>
                  <Text style={styles.noticeBannerDescription}>내 마니또한테 몰래 기도 보내기</Text>
                </View>
                <Text style={styles.noticeBannerArrow}>›</Text>
              </GlassCard>
            </Pressable>

            <Pressable
              accessibilityLabel="설정, 비밀번호와 알림 정하기"
              accessibilityRole="button"
              onPress={handleSettingsPress}
              style={({ pressed }) => [pressed && styles.noticeBannerPressed]}>
              <GlassCard style={styles.noticeBanner}>
                <Text style={styles.noticeBannerEmoji}>⚙️</Text>
                <View style={styles.noticeBannerCopy}>
                  <Text style={styles.noticeBannerTitle}>설정</Text>
                  <Text style={styles.noticeBannerDescription}>비밀번호와 알림을 정할 수 있어</Text>
                </View>
                <Text style={styles.noticeBannerArrow}>›</Text>
              </GlassCard>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

    </SkyScene>
  );
}
