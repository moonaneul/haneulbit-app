import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, SHADOWS, Spacing } from '@/constants/theme';

export const pinChangeStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(41, 42, 45, 0.38)',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceOpaque,
    borderRadius: BORDER_RADIUS.card,
    padding: Spacing.five,
    gap: Spacing.two,
    ...SHADOWS.soft,
  },
  stepBadge: {
    color: COLORS.primary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 21,
    textAlign: 'center',
  },
  hint: {
    color: COLORS.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: Spacing.one,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: { opacity: 0.7 },
});
