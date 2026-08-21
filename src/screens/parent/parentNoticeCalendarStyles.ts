import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, MaxContentWidth, SHADOWS } from '@/constants/theme';

export const parentNoticeCalendarStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  content: { width: '100%', maxWidth: MaxContentWidth },
  header: { marginBottom: 18 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900' },
  caption: { marginTop: 5, color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 20, padding: 5, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.surfaceMuted },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: BORDER_RADIUS.badge },
  tabButtonActive: { ...SHADOWS.soft, backgroundColor: COLORS.cardBackground },
  tabText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '800' },
  tabTextActive: { color: COLORS.primary },
  list: { gap: 12 },
  noticeCard: { ...SHADOWS.soft, padding: 18, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  noticeCardPinned: { borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  pinnedBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primary, marginBottom: 8 },
  pinnedBadgeText: { color: COLORS.textOnPrimary, fontSize: 11, fontWeight: '900' },
  noticeTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '900' },
  noticeDate: { marginTop: 4, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  noticeContent: { marginTop: 12, color: COLORS.textPrimary, fontSize: 14, lineHeight: 22, fontWeight: '600' },
  eventCard: { ...SHADOWS.soft, flexDirection: 'row', padding: 16, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.accentSoft },
  eventEmojiCircle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground },
  eventEmoji: { fontSize: 22 },
  eventBody: { flex: 1, marginLeft: 13 },
  eventDate: { color: COLORS.accent, fontSize: 12, fontWeight: '900' },
  eventTitle: { marginTop: 4, color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  eventDetail: { marginTop: 6, color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
});
