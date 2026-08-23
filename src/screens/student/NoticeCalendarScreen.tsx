import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { MOCK_CALENDAR_EVENTS, MOCK_NOTICES } from './noticeCalendarData';
import { noticeCalendarStyles as styles } from './noticeCalendarStyles';

type Tab = 'notice' | 'calendar';

const TABS: { key: Tab; label: string }[] = [
  { key: 'notice', label: '📋 알림장' },
  { key: 'calendar', label: '📅 캘린더' },
];

/** 선생님이 작성한 공지사항과 초등부 일정을 함께 조회하는 화면입니다. */
export default function NoticeCalendarScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('notice');

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>알림장 & 캘린더 📖</Text>
            <Text style={styles.caption}>선생님이 알려주신 소식이야!</Text>
          </View>

          <View style={styles.tabRow}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}>
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'notice' ? (
            <View style={styles.list}>
              {MOCK_NOTICES.map((notice) => (
                <View key={notice.id} style={[styles.noticeCard, notice.isPinned && styles.noticeCardPinned]}>
                  {notice.isPinned && (
                    <View style={styles.pinnedBadge}><Text style={styles.pinnedBadgeText}>📌 고정 공지</Text></View>
                  )}
                  <Text style={styles.noticeTitle}>{notice.title}</Text>
                  <Text style={styles.noticeDate}>{notice.date}</Text>
                  <Text style={styles.noticeContent}>{notice.content}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              {MOCK_CALENDAR_EVENTS.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventEmojiCircle}><Text style={styles.eventEmoji}>{event.emoji}</Text></View>
                  <View style={styles.eventBody}>
                    <Text style={styles.eventDate}>{event.date}</Text>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDetail}>{event.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </SkyScene>
  );
}
