import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, MaxContentWidth, SHADOWS } from '@/constants/theme';

export const parentMissionStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  content: { width: '100%', maxWidth: MaxContentWidth },
  header: { marginBottom: 18 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900' },
  caption: { marginTop: 5, color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  missionCard: { ...SHADOWS.soft, marginBottom: 12, padding: 18, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  missionHeader: { flexDirection: 'row', alignItems: 'center' },
  missionEmojiCircle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft },
  missionEmoji: { fontSize: 22 },
  missionBody: { flex: 1, marginLeft: 13 },
  missionTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  missionSubmittedAt: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
  childNoteBox: { marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: COLORS.surfaceMuted },
  childNoteText: { color: COLORS.textPrimary, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  approveButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 14, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.primary },
  approveButtonText: { color: COLORS.textOnPrimary, fontSize: 14, fontWeight: '900' },
  stampBadge: { alignSelf: 'flex-start', marginTop: 14, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BORDER_RADIUS.badge, backgroundColor: '#E3F3E1' },
  stampBadgeText: { color: COLORS.success, fontSize: 13, fontWeight: '900' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
});
