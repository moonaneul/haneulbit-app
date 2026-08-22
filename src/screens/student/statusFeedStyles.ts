import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, SHADOWS } from '@/constants/theme';

export const statusFeedStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  content: { width: '100%', maxWidth: 520 },
  header: { marginBottom: 18 },
  title: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 22 },
  caption: { fontFamily: Fonts.sans, marginTop: 5, color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  myCard: { ...SHADOWS.soft, marginBottom: 16, padding: 18, borderWidth: 2, borderColor: COLORS.primary, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.primarySoft },
  postList: { gap: 12 },
  postCard: { ...SHADOWS.soft, padding: 16, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  postHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.accentSoft },
  avatar: { fontFamily: Fonts.sans, fontSize: 22 },
  postIdentity: { flex: 1, marginLeft: 12 },
  meBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primary, marginBottom: 6 },
  meBadgeText: { fontFamily: Fonts.sans, color: COLORS.textOnPrimary, fontSize: 11, fontWeight: '900' },
  postName: { fontFamily: Fonts.sans, color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  postMessage: { fontFamily: Fonts.sans, marginTop: 10, color: COLORS.textPrimary, fontSize: 15, lineHeight: 22, fontWeight: '700' },
  reactionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 14 },
  reactionButton: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 11, borderWidth: 1, borderColor: COLORS.disabled, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.surfaceMuted },
  reactionSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  reactionPressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  reactionText: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
  reactionTextSelected: { color: COLORS.primary },
  reactionFeedback: { fontFamily: Fonts.sans, marginTop: 10, color: COLORS.success, fontSize: 12, fontWeight: '800' },
});
