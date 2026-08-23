import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, MaxContentWidth, SHADOWS } from '@/constants/theme';

export const parentReportStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  content: { width: '100%', maxWidth: MaxContentWidth },
  header: { marginBottom: 18 },
  title: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 22 },
  caption: { fontFamily: Fonts.sans, marginTop: 5, color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  summaryCard: { ...SHADOWS.soft, padding: 22, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.primarySoft, marginBottom: 22 },
  summaryLabel: { fontFamily: Fonts.sans, color: COLORS.primary, fontSize: 12, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 8 },
  summaryRate: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 34 },
  summaryRateUnit: { fontFamily: Fonts.sans, color: COLORS.textPrimary, fontSize: 17, fontWeight: '900' },
  summaryDetail: { fontFamily: Fonts.sans, marginTop: 4, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 12, overflow: 'hidden', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground, marginTop: 14 },
  progressFill: { height: '100%', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primary },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 19 },
  sectionCaption: { fontFamily: Fonts.sans, marginTop: 5, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  reflectionCard: { ...SHADOWS.soft, marginBottom: 12, padding: 16, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  reflectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reflectionReference: { fontFamily: Fonts.sans, color: COLORS.accent, fontSize: 13, fontWeight: '900' },
  reflectionDate: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  reflectionText: { fontFamily: Fonts.sans, marginTop: 10, color: COLORS.textPrimary, fontSize: 15, lineHeight: 22, fontWeight: '700' },
});
