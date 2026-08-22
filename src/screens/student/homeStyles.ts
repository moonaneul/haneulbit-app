import { StyleSheet } from 'react-native';

import { BORDER_RADIUS, COLORS, Fonts, GLASS, SHADOWS } from '@/constants/theme';

export const homeStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },
  content: { width: '100%', maxWidth: 520 },

  // 상단 프로필 — 인사말·이름·배지를 유리 카드 하나로 묶어 통일감을 줍니다.
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 16 },
  headerAvatar: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft },
  headerAvatarText: { fontFamily: Fonts.sans, color: COLORS.primary, fontSize: 20, fontWeight: '900' },
  headerIdentity: { flex: 1, marginLeft: 12 },
  greeting: { fontFamily: Fonts.display, color: COLORS.textSecondary, fontSize: 11 },
  studentName: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 19, marginTop: 2, letterSpacing: -0.4 },
  statsRow: { flexDirection: 'row', gap: 6 },
  statBadge: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.surfaceMuted },
  statBadgePressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  statText: { fontFamily: Fonts.sans, color: COLORS.textPrimary, fontSize: 12, fontWeight: '800' },

  // 캐릭터가 풍경 안에 서 있는 무대 (카드 배경 없음)
  stage: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  levelPill: { paddingHorizontal: 13, paddingVertical: 6, borderWidth: 1, borderColor: GLASS.borderSoft, borderRadius: BORDER_RADIUS.badge, backgroundColor: GLASS.surfaceSoft },
  levelText: { fontFamily: Fonts.display, color: '#3E5A6B', fontSize: 11 },
  speechBubble: { ...SHADOWS.float, maxWidth: 260, marginTop: 14, paddingHorizontal: 17, paddingVertical: 13, borderWidth: 1, borderColor: GLASS.border, borderRadius: BORDER_RADIUS.card, backgroundColor: GLASS.surfaceStrong },
  speechText: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  speechTail: { position: 'absolute', bottom: -7, alignSelf: 'center', width: 14, height: 14, transform: [{ rotate: '45deg' }], borderRightWidth: 1, borderBottomWidth: 1, borderColor: GLASS.border, backgroundColor: GLASS.surfaceStrong },
  avatarButton: { width: 320, height: 210, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  avatarPressed: { transform: [{ scale: 0.96 }] },
  // 둔덕 SVG가 캐릭터 영역(320)보다 넓어서, 가운데 정렬되도록 왼쪽으로 당겨 둡니다.
  stageGround: { position: 'absolute', top: 0, left: -120 },
  helmet: { fontFamily: Fonts.sans, fontSize: 28, lineHeight: 32 },
  character: { fontFamily: Fonts.sans, fontSize: 64, lineHeight: 70, marginTop: -6 },
  armor: { fontFamily: Fonts.sans, fontSize: 40, lineHeight: 44, marginTop: -10 },
  boots: { fontFamily: Fonts.sans, fontSize: 24, lineHeight: 28, marginTop: -6 },
  tapGuide: { fontFamily: Fonts.sans, marginTop: 2, color: '#4A6072', fontSize: 12, fontWeight: '800' },
  shopButton: { ...SHADOWS.float, minHeight: 50, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', marginTop: 16, borderRadius: BORDER_RADIUS.button, backgroundColor: COLORS.primary },
  shopButtonText: { fontFamily: Fonts.display, color: COLORS.textOnPrimary, fontSize: 16 },

  // 한 줄 다짐 (유리 카드)
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, padding: 15 },
  statusIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.primarySoft },
  statusIconText: { fontFamily: Fonts.sans, fontSize: 21 },
  statusContent: { flex: 1 },
  statusLabel: { fontFamily: Fonts.sans, color: COLORS.primary, fontSize: 11, fontWeight: '900' },
  statusMessage: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 15, lineHeight: 21, marginTop: 3 },
  statusEditButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge, backgroundColor: COLORS.surfaceMuted },
  statusEditIcon: { fontFamily: Fonts.sans, fontSize: 18 },
  feedLink: { ...SHADOWS.float, alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: GLASS.border, borderRadius: BORDER_RADIUS.badge, backgroundColor: GLASS.surface },
  feedLinkText: { fontFamily: Fonts.sans, color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },

  // 오늘의 미션
  missionHeader: { marginTop: 28, marginBottom: 14 },
  sectionTitle: { fontFamily: Fonts.display, color: '#22333F', fontSize: 21 },
  sectionCaption: { fontFamily: Fonts.sans, color: '#4A6072', fontSize: 13, fontWeight: '700', marginTop: 5 },
  missionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  missionCard: { width: '48%' },
  missionCardInner: { minHeight: 168, padding: 17 },
  missionPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  missionEmojiCircle: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.badge },
  missionEmoji: { fontFamily: Fonts.sans, fontSize: 24 },
  missionTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 15, lineHeight: 21, marginTop: 12 },
  missionDescription: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 11, lineHeight: 16, fontWeight: '700', marginTop: 3, paddingRight: 16 },
  missionArrow: { fontFamily: Fonts.sans, position: 'absolute', right: 16, bottom: 14, color: COLORS.textPrimary, fontSize: 19, fontWeight: '900' },

  // 하단 바로가기 배너
  noticeBanner: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 16 },
  noticeBannerPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  noticeBannerEmoji: { fontFamily: Fonts.sans, fontSize: 26, marginRight: 13 },
  noticeBannerCopy: { flex: 1 },
  noticeBannerTitle: { fontFamily: Fonts.display, color: COLORS.textPrimary, fontSize: 15 },
  noticeBannerDescription: { fontFamily: Fonts.sans, marginTop: 3, color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  noticeBannerArrow: { fontFamily: Fonts.sans, color: COLORS.textSecondary, fontSize: 20, fontWeight: '900' },
});
