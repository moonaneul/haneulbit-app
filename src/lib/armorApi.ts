import { isSupabaseConfigured, supabase } from './supabase';

/**
 * 달란트와 갑주는 선생님도 봐야 하는 값이라 기기가 아니라 서버가 들고 있습니다.
 * 가격 확인과 차감을 전부 서버 함수가 처리하므로, 앱을 고쳐도 공짜로 살 수 없습니다.
 */

export interface ArmorRow {
  armorId: string;
  tier: 'basic' | 'silver' | 'gold' | 'light';
  isEquipped: boolean;
}

export interface ArmorState {
  talents: number;
  armor: ArmorRow[];
}

/** 서버 함수가 알려 주는 실패 사유입니다. */
export type ArmorFailure = 'NOT_ENOUGH' | 'ALREADY_OWNED' | 'NOT_OWNED' | 'MAX_TIER' | 'UNKNOWN';

export const isArmorApiReady = isSupabaseConfigured;

function toFailure(message?: string): ArmorFailure {
  const known: ArmorFailure[] = ['NOT_ENOUGH', 'ALREADY_OWNED', 'NOT_OWNED', 'MAX_TIER'];
  return known.find((code) => message?.includes(code)) ?? 'UNKNOWN';
}

async function call(fn: string, args?: Record<string, unknown>) {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(toFailure(error.message));
  return data as ArmorState;
}

export const fetchArmorState = () => call('get_my_armor_state');
export const buyArmorOnServer = (armorId: string) => call('buy_armor', { p_armor_id: armorId });
export const upgradeArmorOnServer = (armorId: string) => call('upgrade_armor', { p_armor_id: armorId });
export const toggleEquipOnServer = (armorId: string) => call('toggle_equip_armor', { p_armor_id: armorId });
export const earnTalentsOnServer = (amount: number, reason: string) =>
  call('earn_talents', { p_amount: amount, p_reason: reason });
