import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_CALENDAR_EVENTS, MOCK_NOTICES, type CalendarEvent, type NoticePost } from '@/data/noticeCalendar';
import { teacherContentManageStyles as styles } from './teacherContentManageStyles';

type Tab = 'notice' | 'calendar';

const TABS: { key: Tab; label: string }[] = [
  { key: 'notice', label: '📋 알림장' },
  { key: 'calendar', label: '📅 캘린더' },
];

const EVENT_EMOJI_OPTIONS = ['🙏', '🎉', '📖', '🎂', '🎄', '⛪', '🎭', '🌟'];

const emptyNoticeDraft = { title: '', content: '', isPinned: false };
const emptyEventDraft = { emoji: EVENT_EMOJI_OPTIONS[0], title: '', date: '', detail: '' };

/** 선생님이 알림장과 초등부 캘린더 일정을 작성·수정·삭제하는 관리 화면입니다. */
export default function TeacherNoticeCalendarManageScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('notice');
  const [notices, setNotices] = useState<NoticePost[]>(MOCK_NOTICES);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);

  const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeDraft, setNoticeDraft] = useState(emptyNoticeDraft);

  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventDraft, setEventDraft] = useState(emptyEventDraft);

  const todayLabel = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());

  // 공지사항 -----------------------------------------------------------

  const openCreateNotice = () => {
    setEditingNoticeId(null);
    setNoticeDraft(emptyNoticeDraft);
    setIsNoticeModalVisible(true);
  };

  const openEditNotice = (notice: NoticePost) => {
    setEditingNoticeId(notice.id);
    setNoticeDraft({ title: notice.title, content: notice.content, isPinned: Boolean(notice.isPinned) });
    setIsNoticeModalVisible(true);
  };

  /** 작성 중이면 새 공지를 목록 맨 위에 추가하고, 수정 중이면 기존 항목만 바꿉니다. */
  const handleSaveNotice = () => {
    try {
      if (!noticeDraft.title.trim() || !noticeDraft.content.trim()) return;
      if (editingNoticeId) {
        setNotices((current) => current.map((item) => (item.id === editingNoticeId
          ? { ...item, title: noticeDraft.title.trim(), content: noticeDraft.content.trim(), isPinned: noticeDraft.isPinned }
          : item)));
      } else {
        setNotices((current) => [
          { id: `notice-${Date.now()}`, title: noticeDraft.title.trim(), content: noticeDraft.content.trim(), date: todayLabel, isPinned: noticeDraft.isPinned },
          ...current,
        ]);
      }
      setIsNoticeModalVisible(false);
      Alert.alert(editingNoticeId ? '공지사항을 수정했어요 ✏️' : '공지사항을 올렸어요 📋', '학생과 부모님 화면에 바로 나타나요.');
    } catch (error) {
      console.warn('공지사항을 저장하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const handleDeleteNotice = (notice: NoticePost) => {
    try {
      setNotices((current) => current.filter((item) => item.id !== notice.id));
    } catch (error) {
      console.warn('공지사항을 삭제하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  // 캘린더 일정 -----------------------------------------------------------

  const openCreateEvent = () => {
    setEditingEventId(null);
    setEventDraft(emptyEventDraft);
    setIsEventModalVisible(true);
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEventId(event.id);
    setEventDraft({ emoji: event.emoji, title: event.title, date: event.date, detail: event.detail });
    setIsEventModalVisible(true);
  };

  const handleSaveEvent = () => {
    try {
      if (!eventDraft.title.trim() || !eventDraft.date.trim() || !eventDraft.detail.trim()) return;
      if (editingEventId) {
        setEvents((current) => current.map((item) => (item.id === editingEventId
          ? { ...item, emoji: eventDraft.emoji, title: eventDraft.title.trim(), date: eventDraft.date.trim(), detail: eventDraft.detail.trim() }
          : item)));
      } else {
        setEvents((current) => [
          ...current,
          { id: `event-${Date.now()}`, emoji: eventDraft.emoji, title: eventDraft.title.trim(), date: eventDraft.date.trim(), detail: eventDraft.detail.trim() },
        ]);
      }
      setIsEventModalVisible(false);
      Alert.alert(editingEventId ? '일정을 수정했어요 ✏️' : '일정을 등록했어요 📅', '초등부 캘린더에 바로 나타나요.');
    } catch (error) {
      console.warn('캘린더 일정을 저장하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    try {
      setEvents((current) => current.filter((item) => item.id !== event.id));
    } catch (error) {
      console.warn('캘린더 일정을 삭제하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const canSaveNotice = noticeDraft.title.trim().length > 0 && noticeDraft.content.trim().length > 0;
  const canSaveEvent = eventDraft.title.trim().length > 0 && eventDraft.date.trim().length > 0 && eventDraft.detail.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>알림장 & 캘린더 관리 📖</Text>
            <Text style={styles.caption}>공지사항과 초등부 일정을 작성·수정·삭제해요.</Text>
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
            <>
              <Pressable accessibilityLabel="새 공지사항 작성하기" accessibilityRole="button" onPress={openCreateNotice} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <Text style={styles.addButtonText}>+ 새 공지사항 작성하기</Text>
              </Pressable>
              <View style={styles.list}>
                {notices.map((notice) => (
                  <View key={notice.id} style={[styles.itemCard, notice.isPinned && styles.itemCardPinned]}>
                    {notice.isPinned && <View style={styles.pinnedBadge}><Text style={styles.pinnedBadgeText}>📌 고정 공지</Text></View>}
                    <Text style={styles.itemTitle}>{notice.title}</Text>
                    <Text style={styles.itemDate}>{notice.date}</Text>
                    <Text style={styles.itemContent}>{notice.content}</Text>
                    <View style={styles.itemActionRow}>
                      <Pressable accessibilityLabel={`${notice.title} 수정하기`} accessibilityRole="button" onPress={() => openEditNotice(notice)} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                        <Text style={styles.actionButtonText}>수정</Text>
                      </Pressable>
                      <Pressable accessibilityLabel={`${notice.title} 삭제하기`} accessibilityRole="button" onPress={() => handleDeleteNotice(notice)} style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.pressed]}>
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>삭제</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Pressable accessibilityLabel="새 캘린더 일정 등록하기" accessibilityRole="button" onPress={openCreateEvent} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <Text style={styles.addButtonText}>+ 새 일정 등록하기</Text>
              </Pressable>
              <View style={styles.list}>
                {events.map((event) => (
                  <View key={event.id} style={styles.itemCard}>
                    <View style={styles.itemHeaderRow}>
                      <View style={styles.itemEmojiCircle}><Text style={styles.itemEmoji}>{event.emoji}</Text></View>
                      <View style={styles.itemBody}>
                        <Text style={styles.itemTitle}>{event.title}</Text>
                        <Text style={styles.itemDate}>{event.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.itemContent}>{event.detail}</Text>
                    <View style={styles.itemActionRow}>
                      <Pressable accessibilityLabel={`${event.title} 수정하기`} accessibilityRole="button" onPress={() => openEditEvent(event)} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                        <Text style={styles.actionButtonText}>수정</Text>
                      </Pressable>
                      <Pressable accessibilityLabel={`${event.title} 삭제하기`} accessibilityRole="button" onPress={() => handleDeleteEvent(event)} style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.pressed]}>
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>삭제</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setIsNoticeModalVisible(false)} transparent visible={isNoticeModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <ScrollView style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingNoticeId ? '공지사항 수정하기' : '새 공지사항 작성하기'}</Text>

            <Text style={styles.modalLabel}>제목</Text>
            <TextInput accessibilityLabel="공지 제목" onChangeText={(text) => setNoticeDraft((current) => ({ ...current, title: text }))} placeholder="예: 이번 주 준비물 안내" placeholderTextColor="#96918A" style={styles.input} value={noticeDraft.title} />

            <Text style={styles.modalLabel}>내용</Text>
            <TextInput accessibilityLabel="공지 내용" multiline onChangeText={(text) => setNoticeDraft((current) => ({ ...current, content: text }))} placeholder="아이들과 부모님께 전할 내용을 적어 주세요" placeholderTextColor="#96918A" style={[styles.input, styles.textArea]} value={noticeDraft.content} />

            <View style={styles.pinToggleRow}>
              <Text style={styles.pinToggleLabel}>📌 고정 공지로 표시</Text>
              <Pressable
                accessibilityLabel="고정 공지 여부"
                accessibilityRole="switch"
                accessibilityState={{ checked: noticeDraft.isPinned }}
                onPress={() => setNoticeDraft((current) => ({ ...current, isPinned: !current.isPinned }))}
                style={[styles.pinToggleSwitch, noticeDraft.isPinned && styles.pinToggleSwitchOn]}>
                <View style={[styles.pinToggleKnob, noticeDraft.isPinned && styles.pinToggleKnobOn]} />
              </Pressable>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable accessibilityRole="button" onPress={() => setIsNoticeModalVisible(false)} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={!canSaveNotice} onPress={handleSaveNotice} style={({ pressed }) => [styles.submitButton, !canSaveNotice && styles.submitButtonDisabled, pressed && styles.pressed]}>
                <Text style={styles.submitButtonText}>{editingNoticeId ? '수정하기' : '게시하기'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setIsEventModalVisible(false)} transparent visible={isEventModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <ScrollView style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingEventId ? '일정 수정하기' : '새 일정 등록하기'}</Text>

            <Text style={styles.modalLabel}>아이콘</Text>
            <View style={styles.emojiRow}>
              {EVENT_EMOJI_OPTIONS.map((emojiOption) => {
                const isSelected = eventDraft.emoji === emojiOption;
                return (
                  <Pressable
                    accessibilityLabel={`아이콘 ${emojiOption}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={emojiOption}
                    onPress={() => setEventDraft((current) => ({ ...current, emoji: emojiOption }))}
                    style={[styles.emojiOption, isSelected && styles.emojiOptionSelected]}>
                    <Text style={styles.emojiOptionText}>{emojiOption}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.modalLabel}>제목</Text>
            <TextInput accessibilityLabel="일정 제목" onChangeText={(text) => setEventDraft((current) => ({ ...current, title: text }))} placeholder="예: 성탄 발표회 리허설" placeholderTextColor="#96918A" style={styles.input} value={eventDraft.title} />

            <Text style={styles.modalLabel}>날짜</Text>
            <TextInput accessibilityLabel="일정 날짜" onChangeText={(text) => setEventDraft((current) => ({ ...current, date: text }))} placeholder="예: 12월 21일 (일)" placeholderTextColor="#96918A" style={styles.input} value={eventDraft.date} />

            <Text style={styles.modalLabel}>상세 안내</Text>
            <TextInput accessibilityLabel="일정 상세 안내" multiline onChangeText={(text) => setEventDraft((current) => ({ ...current, detail: text }))} placeholder="시간, 장소 등을 적어 주세요" placeholderTextColor="#96918A" style={[styles.input, styles.textArea]} value={eventDraft.detail} />

            <View style={styles.modalButtonRow}>
              <Pressable accessibilityRole="button" onPress={() => setIsEventModalVisible(false)} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={!canSaveEvent} onPress={handleSaveEvent} style={({ pressed }) => [styles.submitButton, !canSaveEvent && styles.submitButtonDisabled, pressed && styles.pressed]}>
                <Text style={styles.submitButtonText}>{editingEventId ? '수정하기' : '등록하기'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
