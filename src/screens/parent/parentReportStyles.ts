import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, MaxContentWidth, SHADOWS } from '@/constants/theme';

export const parentReportStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  content: { width: '100%', maxWidth: MaxContentWidth },
  header: { marginBottom: 18 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900' },
  caption: { marginTop: 5, color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  summaryCard: { ...SHADOWS.soft, padding: 22, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.primarySoft, marginBottom: 22 },
  summaryLabel: { color: COLORS.primary, fontSize: 12, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 8 },
  summaryRate: { color: COLORS.textPrimary, fontSize: 34, fontWeight: '900' },
  summaryRateUnit: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '900' },
  summaryDetail: { marginTop: 4, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 12, overflow: 'hidden', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.cardBackground, marginTop: 14 },
  progressFill: { height: '100%', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primary },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 19, fontWeight: '900' },
  sectionCaption: { marginTop: 5, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  reflectionCard: { ...SHADOWS.soft, marginBottom: 12, padding: 16, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  reflectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reflectionReference: { color: COLORS.accent, fontSize: 13, fontWeight: '900' },
  reflectionDate: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  reflectionText: { marginTop: 10, color: COLORS.textPrimary, fontSize: 15, lineHeight: 22, fontWeight: '700' },
});
