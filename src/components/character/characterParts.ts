// 🧍 하늘빛 캐릭터의 부위별 좌표(앵커)와 색을 한곳에서 관리합니다.
// 갑주 조각은 전부 이 앵커를 기준으로 그려지므로, 어떤 조합을 착용해도 몸에 정확히 붙습니다.
// 나중에 3D로 렌더링한 이미지로 교체하더라도 이 좌표계만 지키면 그대로 갈아 끼울 수 있습니다.

/** 캐릭터를 그리는 기준 좌표계 (이 안에서만 위치를 계산합니다) */
export const CANVAS = { width: 200, height: 260 };

/** 각 갑주가 붙는 고정 위치입니다. */
export const ANCHORS = {
  head: { x: 100, y: 76, r: 40 },
  body: { x: 100, y: 156, w: 66, h: 74 },
  waist: { x: 100, y: 186 },
  leftHand: { x: 52, y: 176 },
  rightHand: { x: 148, y: 176 },
  feet: { x: 100, y: 232 },
} as const;

/** 캐릭터 기본 몸 색상 (갑주를 하나도 안 입었을 때의 모습) */
export const BODY_PALETTE = {
  skin: '#F6D3B4',
  skinShade: '#E8BE9B',
  hair: '#3B2E2A',
  hairShine: '#5A473F',
  tunic: '#FBF6EC', // 성경 시대 느낌의 크림색 옷
  tunicShade: '#E8DFCF',
  outline: '#4A3B33',
};

export type ArmorTierKey = 'basic' | 'silver' | 'gold' | 'light';

/** 티어가 올라갈수록 금속이 밝아지고, 마지막 단계에서는 빛나는 아우라가 더해집니다. */
export const TIER_METAL: Record<ArmorTierKey, { base: string; light: string; dark: string; glow?: string }> = {
  basic: { base: '#AEB6C0', light: '#CFD6DE', dark: '#8A939F' },
  silver: { base: '#CBD4DF', light: '#F0F4F8', dark: '#9DA8B6' },
  gold: { base: '#EFC257', light: '#FCE9A8', dark: '#C9973A' },
  light: { base: '#FFE59B', light: '#FFFBE8', dark: '#E9BE63', glow: '#FFF3C4' },
};

/** 상점 아이템 id와 캐릭터의 어느 부위에 붙는지를 연결합니다. */
export type ArmorSlot = 'helmet' | 'breastplate' | 'belt' | 'shoes' | 'shield' | 'sword' | 'staff' | 'sling' | 'costume';

export const ITEM_TO_SLOT: Record<string, ArmorSlot> = {
  helmet: 'helmet',
  breastplate: 'breastplate',
  belt: 'belt',
  shoes: 'shoes',
  shield: 'shield',
  sword: 'sword',
  staff: 'staff',
  sling: 'sling',
  'christmas-costume': 'costume',
};

/** 화면에서 넘겨주는 착용 상태 (부위별 티어, 없으면 미착용) */
export type EquippedArmor = Partial<Record<ArmorSlot, ArmorTierKey>>;
