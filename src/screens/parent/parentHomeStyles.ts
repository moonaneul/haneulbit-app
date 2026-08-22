import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, MaxContentWidth, SHADOWS } from '@/constants/theme';

export const parentHomeStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 48 },
  content: { width: '100%', maxWidth: MaxContentWidth },
  childCard: { ...SHADOWS.soft, flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.primarySoft, marginBottom: 24 },
  avatarCircle: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground },
  avatar: { fontFamily: Fonts.sans, fontSize: 30 },
  childBody: { flex: 1, marginLeft: 16 },
  eyebrow: { fontFamily: Fonts.sans, color: COLORS.primary, fontSize: 11, fontWeight: '900' },
  childName: { fontFamily: Fonts.display, marginTop: 3, color: COLORS.textPrimary, fontSize: 21 },
  childGrade: { fontFamily: Fonts.sans, marginTop: 3, color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 21 },
  sectionCaption: { fontFamily: Fonts.sans, marginTop: 5, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  menuList: { gap: 12 },
  menuCard: { ...SHADOWS.soft, minHeight: 82, flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: BORDER_RADIUS.card },
  menuPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  menuEmoji: { fontFamily: Fonts.sans, fontSize: 28, marginRight: 15 },
  menuCopy: { flex: 1 },
  menuTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 16 },
  menuDescription: { fontFamily: Fonts.sans, marginTop: 4, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  menuArrow: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 22, fontWeight: '900' },
});
