import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, MaxContentWidth, SHADOWS } from '@/constants/theme';

export const parentHomeStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  content: { width: '100%', maxWidth: MaxContentWidth },
  childCard: { ...SHADOWS.soft, flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.primarySoft, marginBottom: 24 },
  avatarCircle: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground },
  avatar: { fontSize: 30 },
  childBody: { flex: 1, marginLeft: 16 },
  eyebrow: { color: COLORS.primary, fontSize: 11, fontWeight: '900' },
  childName: { marginTop: 3, color: COLORS.textPrimary, fontSize: 21, fontWeight: '900' },
  childGrade: { marginTop: 3, color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 21, fontWeight: '900' },
  sectionCaption: { marginTop: 5, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  menuList: { gap: 12 },
  menuCard: { ...SHADOWS.soft, minHeight: 82, flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: BORDER_RADIUS.card },
  menuPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  menuEmoji: { fontSize: 28, marginRight: 15 },
  menuCopy: { flex: 1 },
  menuTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '900' },
  menuDescription: { marginTop: 4, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  menuArrow: { color: COLORS.textSecondary, fontSize: 22, fontWeight: '900' },
});
