import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

export const settingsStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.six },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  header: { gap: 6, marginBottom: Spacing.one },
  title: { color: COLORS.textPrimary, fontFamily: Fonts.display, fontSize: 26 },
  caption: { color: COLORS.textSecondary, fontFamily: Fonts.sans, fontSize: 14, fontWeight: '600' },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    marginTop: Spacing.two,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  rowEmoji: { fontFamily: Fonts.sans, fontSize: 26 },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { color: COLORS.textPrimary, fontFamily: Fonts.sans, fontSize: 16, fontWeight: '800' },
  rowDescription: { color: COLORS.textSecondary, fontFamily: Fonts.sans, fontSize: 13, fontWeight: '600' },
  rowArrow: { color: COLORS.textSecondary, fontFamily: Fonts.sans, fontSize: 22, fontWeight: '800' },
  rowPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  nameBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    borderRadius: BORDER_RADIUS.badge,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
  },
  nameText: { color: COLORS.primary, fontFamily: Fonts.display, fontSize: 16 },
});
