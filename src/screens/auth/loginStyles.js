import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts } from '@/constants/theme';

export const loginStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', padding: 24, paddingBottom: 48 },
  header: { width: '100%', maxWidth: 440, alignItems: 'flex-start', marginTop: 10, marginBottom: 22 },
  brandBadge: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft, marginBottom: 16 },
  brandBadgeText: { fontFamily: Fonts.display, color: COLORS.primary, fontSize: 12 },
  title: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 30, lineHeight: 38, letterSpacing: -1.2 },
  subtitle: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 15, lineHeight: 22, fontWeight: '600', marginTop: 6 },
  card: { width: '100%', maxWidth: 440, padding: 22, borderRadius: BORDER_RADIUS.card },
  sectionHeader: { alignSelf: 'stretch', marginBottom: 16 },
  sectionTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 19, letterSpacing: -0.4 },
  sectionCaption: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginTop: 4 },
  // 큰 사각 버튼이 카드 안에서 튀어 보여, 알약 모양 칩으로 낮췄습니다.
  studentRow: { gap: 8, paddingBottom: 14, paddingHorizontal: 2 },
  studentButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8, paddingRight: 15, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.surfaceMuted },
  studentButtonSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  studentPressed: { transform: [{ scale: 0.96 }] },
  studentInitial: { fontFamily: Fonts.sans, width: 30, height: 30, textAlign: 'center', textAlignVertical: 'center', color: COLORS.primary, fontSize: 16, lineHeight: 30, fontWeight: '900', borderRadius: 15, backgroundColor: COLORS.surfaceOpaque, overflow: 'hidden' },
  studentName: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 14 },
  input: { fontFamily: Fonts.sans, width: '100%', height: 58, paddingHorizontal: 18, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.surfaceMuted, color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 28 },
  pinHeader: { marginBottom: 14 },
  pinFeedback: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 18 },
  pinSlot: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: COLORS.surfaceMuted },
  pinSlotFilled: { backgroundColor: COLORS.primarySoft },
  pinSymbol: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 25, fontWeight: '900', lineHeight: 30 },
  pinSymbolFilled: { fontFamily: Fonts.sans, fontSize: 22 },
  helperPill: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft, marginTop: 16 },
  helper: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
  loginButton: { width: '100%', marginTop: 22 },
});
