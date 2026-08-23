/** 상점에서 판매하는 전신갑주 아이템의 데이터 모양입니다. */
export interface ArmorItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
  description: string;
  color: string;
  // 'bonus' = 성경 인물 특별 아이템, 'seasonal' = 절기 한정판 코스튬
  tag?: 'bonus' | 'seasonal';
}

/** 기본 -> 실버 -> 골드 -> 빛의 용사 순으로 강화되는 갑주 티어입니다. */
export const ARMOR_TIERS = [
  { key: 'basic', label: '기본', badge: '', upgradeCost: 0 },
  { key: 'silver', label: '실버', badge: '🥈', upgradeCost: 30 },
  { key: 'gold', label: '골드', badge: '🥇', upgradeCost: 60 },
  { key: 'light', label: '빛의 용사', badge: '✨', upgradeCost: 100 },
] as const;

export type ArmorTierKey = (typeof ARMOR_TIERS)[number]['key'];

/** Supabase 연동 전에도 구매 흐름을 확인할 수 있는 상점 Mock 데이터입니다. */
export const ARMOR_ITEMS: ArmorItem[] = [
  { id: 'helmet', emoji: '🪖', name: '구원의 투구', price: 50, description: '구원의 기쁨으로 생각을 지켜요.', color: '#FFF2C9' },
  { id: 'shield', emoji: '🛡️', name: '믿음의 방패', price: 50, description: '어려움 앞에서도 믿음을 꼭 붙들어요.', color: '#EAF5F3' },
  { id: 'sword', emoji: '🗡️', name: '성령의 검', price: 60, description: '하나님의 말씀으로 용기를 내요.', color: '#EEEAFB' },
  { id: 'shoes', emoji: '👟', name: '평안의 신발', price: 40, description: '기쁜 소식을 전하러 힘차게 걸어요.', color: '#EAF4DE' },
  { id: 'belt', emoji: '🎗️', name: '진리의 띠', price: 30, description: '언제나 정직하고 진실하게 말해요.', color: '#FFF0EA' },
  { id: 'breastplate', emoji: '🦺', name: '의의 호신경', price: 40, description: '예수님의 바른 마음으로 행동해요.', color: '#FCE9EA' },
  { id: 'sling', emoji: '🪨', name: '다윗의 물맷돌', price: 80, description: '작아도 하나님을 믿고 도전해요.', color: '#F2EEE9', tag: 'bonus' },
  { id: 'staff', emoji: '🦯', name: '모세의 지팡이', price: 90, description: '홍해를 가르듯, 어떤 어려움도 하나님과 함께 헤쳐 나가요.', color: '#EAF0F6', tag: 'bonus' },
  { id: 'christmas-costume', emoji: '🎄', name: '성탄절 한정판 코스튬', price: 100, description: '아기 예수님의 탄생을 기억하며 온 마을에 기쁜 소식을 전해요.', color: '#E9F5EC', tag: 'seasonal' },
];
