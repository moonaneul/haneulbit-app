import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { ITEM_TO_SLOT, type EquippedArmor } from '@/components/character/characterParts';
import { ARMOR_TIERS, type ArmorItem, type ArmorTierKey } from '@/screens/student/armorShopData';

/** 구매한 아이템 ID → 현재 티어 (구매하는 순간 'basic'을 받습니다) */
type OwnedTiers = Partial<Record<string, ArmorTierKey>>;

interface ArmorContextValue {
  talents: number;
  ownedTiers: OwnedTiers;
  equippedIds: string[];
  /** 홈 화면 캐릭터에 그대로 넘길 수 있는 착용 상태입니다. */
  equippedArmor: EquippedArmor;
  /** 착용 중인 갑주 중 가장 높은 티어 (아우라·레벨 표시에 씁니다) */
  topTier?: ArmorTierKey;
  buy: (item: ArmorItem) => 'ok' | 'not-enough' | 'already';
  upgrade: (item: ArmorItem) => 'ok' | 'not-enough' | 'max' | 'not-owned';
  toggleEquip: (item: ArmorItem) => 'equipped' | 'unequipped';
}

const ArmorContext = createContext<ArmorContextValue | null>(null);

interface ArmorProviderProps {
  children: ReactNode;
  /** Supabase 연결 전까지 쓰는 시작 달란트입니다. */
  initialTalents?: number;
}

/**
 * 달란트와 전신갑주 보유/착용 상태를 학생 화면 전체가 함께 쓰도록 보관합니다.
 * 상점에서 사고 강화한 결과가 홈 화면 캐릭터에 바로 반영되게 하는 것이 목적입니다.
 */
export function ArmorProvider({ children, initialTalents = 150 }: ArmorProviderProps) {
  const [talents, setTalents] = useState(initialTalents);
  const [ownedTiers, setOwnedTiers] = useState<OwnedTiers>({});
  const [equippedIds, setEquippedIds] = useState<string[]>([]);

  const buy = useCallback((item: ArmorItem) => {
    if (ownedTiers[item.id]) return 'already' as const;
    if (talents < item.price) return 'not-enough' as const;
    setTalents((current) => current - item.price);
    setOwnedTiers((current) => ({ ...current, [item.id]: 'basic' }));
    return 'ok' as const;
  }, [ownedTiers, talents]);

  const upgrade = useCallback((item: ArmorItem) => {
    const currentTier = ownedTiers[item.id];
    if (!currentTier) return 'not-owned' as const;
    const nextTier = ARMOR_TIERS[ARMOR_TIERS.findIndex((tier) => tier.key === currentTier) + 1];
    if (!nextTier) return 'max' as const;
    if (talents < nextTier.upgradeCost) return 'not-enough' as const;
    setTalents((current) => current - nextTier.upgradeCost);
    setOwnedTiers((current) => ({ ...current, [item.id]: nextTier.key }));
    return 'ok' as const;
  }, [ownedTiers, talents]);

  const toggleEquip = useCallback((item: ArmorItem) => {
    const isEquipped = equippedIds.includes(item.id);
    setEquippedIds((current) => (isEquipped
      ? current.filter((id) => id !== item.id)
      : [...current, item.id]));
    return isEquipped ? ('unequipped' as const) : ('equipped' as const);
  }, [equippedIds]);

  // 착용한 아이템 ID를 캐릭터가 이해하는 '부위 → 티어' 형태로 바꿔 줍니다.
  const equippedArmor = useMemo<EquippedArmor>(() => {
    const result: EquippedArmor = {};
    equippedIds.forEach((id) => {
      const slot = ITEM_TO_SLOT[id];
      const tier = ownedTiers[id];
      if (slot && tier) result[slot] = tier;
    });
    return result;
  }, [equippedIds, ownedTiers]);

  const topTier = useMemo(() => {
    const tiers = Object.values(equippedArmor);
    if (tiers.length === 0) return undefined;
    // ARMOR_TIERS 순서가 곧 등급 순서라, 인덱스가 가장 큰 것이 최고 티어입니다.
    return tiers.reduce((best, tier) => (
      ARMOR_TIERS.findIndex((t) => t.key === tier) > ARMOR_TIERS.findIndex((t) => t.key === best) ? tier : best
    ));
  }, [equippedArmor]);

  const value = useMemo<ArmorContextValue>(
    () => ({ talents, ownedTiers, equippedIds, equippedArmor, topTier, buy, upgrade, toggleEquip }),
    [talents, ownedTiers, equippedIds, equippedArmor, topTier, buy, upgrade, toggleEquip],
  );

  return <ArmorContext.Provider value={value}>{children}</ArmorContext.Provider>;
}

/** 학생 화면에서 달란트·갑주 상태를 꺼내 쓰는 훅입니다. */
export function useArmor() {
  const context = useContext(ArmorContext);
  if (!context) throw new Error('useArmor는 ArmorProvider 안에서만 쓸 수 있어요.');
  return context;
}
