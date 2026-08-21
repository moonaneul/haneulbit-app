import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS } from '@/constants/theme';

export const parentLoginStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 440, padding: 24, borderRadius: 32 },
  eyebrow: { color: COLORS.primary, fontSize: 12, fontWeight: '900' },
  title: { marginTop: 6, color: COLORS.textPrimary, fontSize: 24, lineHeight: 32, fontWeight: '900' },
  subtitle: { marginTop: 6, color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  label: { marginTop: 22, marginBottom: 10, color: COLORS.textPrimary, fontSize: 14, fontWeight: '800' },
  input: { width: '100%', height: 58, paddingHorizontal: 18, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.surfaceMuted, color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  helperPill: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 7, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft },
  helper: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
  loginButton: { width: '100%', marginTop: 26 },
});
