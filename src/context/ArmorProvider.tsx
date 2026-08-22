import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ITEM_TO_SLOT, type EquippedArmor } from '@/components/character/characterParts';
import {
  buyArmorOnServer,
  earnTalentsOnServer,
  fetchArmorState,
  isArmorApiReady,
  toggleEquipOnServer,
  upgradeArmorOnServer,
  type ArmorState,
} from '@/lib/armorApi';
import { STORE_KEYS, loadJson, saveJson } from '@/lib/localStore';
import { ARMOR_TIERS, type ArmorItem, type ArmorTierKey } from '@/screens/student/armorShopData';

/** 구매한 아이템 ID → 현재 티어 (구매하는 순간 'basic'을 받습니다) */
type OwnedTiers = Partial<Record<string, ArmorTierKey>>;

export type BuyResult = 'ok' | 'not-enough' | 'already' | 'error';
export type UpgradeResult = 'ok' | 'not-enough' | 'max' | 'not-owned' | 'error';
export type EquipResult = 'equipped' | 'unequipped' | 'error';

interface ArmorContextValue {
  talents: number;
  ownedTiers: OwnedTiers;
  equippedIds: string[];
  /** 홈 화면 캐릭터에 그대로 넘길 수 있는 착용 상태입니다. */
  equippedArmor: EquippedArmor;
  /** 착용 중인 갑주 중 가장 높은 티어 (아우라·레벨 표시에 씁니다) */
  topTier?: ArmorTierKey;
  /** 서버에서 처음 상태를 받아오기 전인지 알려 줍니다. */
  isReady: boolean;
  /** 다른 화면(QT 완료 등)에서 달란트가 바뀌었을 때 다시 읽어 옵니다. */
  refresh: () => Promise<void>;
  earn: (amount: number, reason?: string) => Promise<void>;
  buy: (item: ArmorItem) => Promise<BuyResult>;
  upgrade: (item: ArmorItem) => Promise<UpgradeResult>;
  toggleEquip: (item: ArmorItem) => Promise<EquipResult>;
}

const ArmorContext = createContext<ArmorContextValue | null>(null);

interface ArmorProviderProps {
  children: ReactNode;
  /** Supabase 연결 전에 화면을 확인할 때 쓰는 시작 달란트입니다. */
  initialTalents?: number;
}

/** 서버가 준 상태를 화면이 쓰는 두 가지 모양으로 나눠 담습니다. */
function splitServerState(state: ArmorState) {
  const tiers: OwnedTiers = {};
  const equipped: string[] = [];
  state.armor.forEach((row) => {
    tiers[row.armorId] = row.tier;
    if (row.isEquipped) equipped.push(row.armorId);
  });
  return { talents: state.talents, tiers, equipped };
}

/**
 * 달란트와 전신갑주 상태를 학생 화면 전체가 함께 씁니다.
 *
 * Supabase가 연결돼 있으면 서버가 원본을 들고 있습니다. 가격 확인과 차감을 전부
 * 서버 함수가 하므로 앱을 고쳐도 공짜로 살 수 없고, 선생님도 아이별 달란트를 볼 수 있습니다.
 * 아직 .env를 채우기 전이라면 예전처럼 기기(AsyncStorage)에 저장해 화면만 확인합니다.
 */
export function ArmorProvider({ children, initialTalents = 150 }: ArmorProviderProps) {
  const [talents, setTalents] = useState(initialTalents);
  const [ownedTiers, setOwnedTiers] = useState<OwnedTiers>({});
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const applyServerState = useCallback((state: ArmorState) => {
    const next = splitServerState(state);
    setTalents(next.talents);
    setOwnedTiers(next.tiers);
    setEquippedIds(next.equipped);
  }, []);

  useEffect(() => {
    if (isArmorApiReady) {
      fetchArmorState()
        .then(applyServerState)
        .catch((error) => console.warn('달란트·갑주 상태를 불러오지 못했습니다.', error))
        .finally(() => setIsReady(true));
      return;
    }
    // 연결 전에는 기기에 저장해 둔 값을 씁니다.
    loadJson<{ talents: number; ownedTiers: OwnedTiers; equippedIds: string[] } | null>(
      STORE_KEYS.armor,
      null,
    ).then((saved) => {
      if (saved && typeof saved.talents === 'number') {
        setTalents(saved.talents);
        setOwnedTiers(saved.ownedTiers ?? {});
        setEquippedIds(saved.equippedIds ?? []);
      }
      setIsReady(true);
    });
  }, [applyServerState]);

  useEffect(() => {
    // 서버가 원본을 들고 있을 때는 기기에 따로 저장하지 않습니다 (두 곳이 어긋나면 더 헷갈립니다).
    if (isArmorApiReady || !isReady) return;
    saveJson(STORE_KEYS.armor, { talents, ownedTiers, equippedIds });
  }, [isReady, talents, ownedTiers, equippedIds]);

  const refresh = useCallback(async () => {
    if (!isArmorApiReady) return;
    try {
      applyServerState(await fetchArmorState());
    } catch (error) {
      console.warn('달란트·갑주 상태를 새로 읽지 못했습니다.', error);
    }
  }, [applyServerState]);

  const earn = useCallback(async (amount: number, reason = '미션 완료') => {
    if (!isArmorApiReady) {
      setTalents((current) => current + amount);
      return;
    }
    try {
      applyServerState(await earnTalentsOnServer(amount, reason));
    } catch (error) {
      console.warn('달란트를 적립하지 못했습니다.', error);
    }
  }, [applyServerState]);

  const buy = useCallback(async (item: ArmorItem): Promise<BuyResult> => {
    if (!isArmorApiReady) {
      if (ownedTiers[item.id]) return 'already';
      if (talents < item.price) return 'not-enough';
      setTalents((current) => current - item.price);
      setOwnedTiers((current) => ({ ...current, [item.id]: 'basic' }));
      return 'ok';
    }
    try {
      applyServerState(await buyArmorOnServer(item.id));
      return 'ok';
    } catch (error) {
      const code = (error as Error).message;
      if (code === 'NOT_ENOUGH') return 'not-enough';
      if (code === 'ALREADY_OWNED') return 'already';
      console.warn('갑주를 구매하지 못했습니다.', error);
      return 'error';
    }
  }, [applyServerState, ownedTiers, talents]);

  const upgrade = useCallback(async (item: ArmorItem): Promise<UpgradeResult> => {
    if (!isArmorApiReady) {
      const currentTier = ownedTiers[item.id];
      if (!currentTier) return 'not-owned';
      const nextTier = ARMOR_TIERS[ARMOR_TIERS.findIndex((tier) => tier.key === currentTier) + 1];
      if (!nextTier) return 'max';
      if (talents < nextTier.upgradeCost) return 'not-enough';
      setTalents((current) => current - nextTier.upgradeCost);
      setOwnedTiers((current) => ({ ...current, [item.id]: nextTier.key }));
      return 'ok';
    }
    try {
      applyServerState(await upgradeArmorOnServer(item.id));
      return 'ok';
    } catch (error) {
      const code = (error as Error).message;
      if (code === 'NOT_ENOUGH') return 'not-enough';
      if (code === 'MAX_TIER') return 'max';
      if (code === 'NOT_OWNED') return 'not-owned';
      console.warn('갑주를 강화하지 못했습니다.', error);
      return 'error';
    }
  }, [applyServerState, ownedTiers, talents]);

  const toggleEquip = useCallback(async (item: ArmorItem): Promise<EquipResult> => {
    const wasEquipped = equippedIds.includes(item.id);
    if (!isArmorApiReady) {
      setEquippedIds((current) => (wasEquipped
        ? current.filter((id) => id !== item.id)
        : [...current, item.id]));
      return wasEquipped ? 'unequipped' : 'equipped';
    }
    try {
      applyServerState(await toggleEquipOnServer(item.id));
      return wasEquipped ? 'unequipped' : 'equipped';
    } catch (error) {
      console.warn('갑주 착용 상태를 바꾸지 못했습니다.', error);
      return 'error';
    }
  }, [applyServerState, equippedIds]);

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
    () => ({ talents, ownedTiers, equippedIds, equippedArmor, topTier, isReady, refresh, earn, buy, upgrade, toggleEquip }),
    [talents, ownedTiers, equippedIds, equippedArmor, topTier, isReady, refresh, earn, buy, upgrade, toggleEquip],
  );

  return <ArmorContext.Provider value={value}>{children}</ArmorContext.Provider>;
}

/** 학생 화면에서 달란트·갑주 상태를 꺼내 쓰는 훅입니다. */
export function useArmor() {
  const context = useContext(ArmorContext);
  if (!context) throw new Error('useArmor는 ArmorProvider 안에서만 쓸 수 있어요.');
  return context;
}
