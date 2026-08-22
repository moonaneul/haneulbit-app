import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, GLASS } from '@/constants/theme';

export const roleSelectStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  header: { width: '100%', maxWidth: 440, alignItems: 'center' },
  brandBadge: { paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: GLASS.borderSoft, borderRadius: BORDER_RADIUS.badge, backgroundColor: GLASS.surfaceSoft },
  brandBadgeText: { fontFamily: Fonts.display, color: '#3E5A6B', fontSize: 12 },
  title: { fontFamily: Fonts.display, marginTop: 18, color: '#22333F', fontSize: 32, lineHeight: 40, letterSpacing: -1.2 },
  subtitle: { fontFamily: Fonts.sans, marginTop: 8, color: '#4A6072', fontSize: 15, lineHeight: 22, fontWeight: '700' },
  roleList: { width: '100%', maxWidth: 440, gap: 12, marginTop: 28 },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  roleCardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  roleEmoji: { fontFamily: Fonts.sans, fontSize: 30, marginRight: 15 },
  roleCopy: { flex: 1 },
  roleTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 17 },
  roleDescription: { fontFamily: Fonts.sans, marginTop: 3, color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  roleArrow: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 22, fontWeight: '900' },
});
