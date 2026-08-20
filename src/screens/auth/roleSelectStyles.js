import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, SHADOWS } from '@/constants/theme';

export const roleSelectStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, alignItems: 'center', padding: 24, paddingBottom: 48 },
  header: { width: '100%', maxWidth: 440, alignItems: 'flex-start', marginTop: 10, marginBottom: 22 },
  brandBadge: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft, marginBottom: 16 },
  brandBadgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '900' },
  title: { color: COLORS.textPrimary, fontSize: 30, lineHeight: 38, fontWeight: '900', letterSpacing: -1.2 },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22, fontWeight: '600', marginTop: 6 },
  heroImage: { width: '100%', maxWidth: 440, aspectRatio: 1.55, borderRadius: 32, marginBottom: 20, backgroundColor: COLORS.secondary },
  roleList: { width: '100%', maxWidth: 440, gap: 14 },
  roleCard: { ...SHADOWS.soft, flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: BORDER_RADIUS.card, backgroundColor: COLORS.cardBackground },
  roleCardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  roleEmoji: { fontSize: 34, marginRight: 16 },
  roleCopy: { flex: 1 },
  roleTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '900' },
  roleDescription: { marginTop: 4, color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  roleArrow: { color: COLORS.textSecondary, fontSize: 22, fontWeight: '900' },
});
