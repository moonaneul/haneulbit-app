import { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HaneulCharacter from '@/components/character/HaneulCharacter';
import SkyScene from '@/components/scene/SkyScene';
import Toast, { type ToastTone } from '@/components/ui/Toast';
import { useArmor } from '@/context/ArmorProvider';

import { ARMOR_ITEMS, ARMOR_TIERS, type ArmorItem } from './armorShopData';
import { armorShopStyles as styles } from './armorShopStyles';
import TalentDelta from './TalentDelta';

/** 받침 유무를 확인해 아이템 이름 뒤에 자연스러운 '을/를'을 붙입니다. */
const withObjectParticle = (name: string) => {
  const lastCharacter = name.charCodeAt(name.length - 1);
  const hasFinalConsonant = lastCharacter >= 0xac00 && lastCharacter <= 0xd7a3
    && (lastCharacter - 0xac00) % 28 !== 0;
  return `${name}${hasFinalConsonant ? '을' : '를'}`;
};

/** 달란트로 전신갑주를 사고 캐릭터에 착용해 보는 학생용 상점입니다. */
export default function ArmorShopScreen() {
  // 달란트와 보유·착용 상태는 홈 화면 캐릭터와 함께 써야 해서 ArmorProvider가 들고 있습니다.
  const { talents, ownedTiers: itemTiers, equippedIds, equippedArmor, buy, upgrade, toggleEquip } = useArmor();
  const [effectItem, setEffectItem] = useState<ArmorItem | null>(null);
  const [upgradeEffect, setUpgradeEffect] = useState<{ item: ArmorItem; tier: (typeof ARMOR_TIERS)[number] } | null>(null);
  // Alert.alert()은 웹에서 아무것도 띄우지 않아, 안내는 화면 안 토스트로 보여 줍니다.
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  // 방금 얼마가 빠져나갔는지 숫자로 띄워 주는 값입니다.
  const [spent, setSpent] = useState<number | null>(null);

  const hideToast = useCallback(() => setToast(null), []);
  const clearSpent = useCallback(() => setSpent(null), []);

  /** 달란트가 얼마나 모자란지 알려 주면 아이가 얼마를 더 모아야 할지 알 수 있습니다. */
  const showNotEnough = (price: number) => {
    setToast({
      message: `달란트가 ${price - talents}pt 더 필요해요. QT하고 퀴즈 풀면 금방 모아요 🌸`,
      tone: 'warn',
    });
  };

  /** 가격을 확인한 뒤 달란트를 차감하고 기본 티어로 구매 완료 상태로 바꿉니다. */
  const handlePurchase = async (item: ArmorItem) => {
    try {
      const result = await buy(item);
      if (result === 'not-enough') {
        showNotEnough(item.price);
        return;
      }
      if (result === 'error') {
        setToast({ message: '잠깐 연결이 안 됐어요. 다시 눌러 볼까요? 🌸', tone: 'warn' });
        return;
      }
      if (result === 'ok') {
        setSpent(-item.price);
        setToast({ message: `${withObjectParticle(item.name)} 샀어요! 🪙 ${item.price}pt 썼어요`, tone: 'success' });
      }
    } catch (error) {
      console.warn('전신갑주를 구매하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 구매한 갑주를 토글하고, 새로 착용할 때 축하 이펙트 모달을 엽니다. */
  const handleEquip = async (item: ArmorItem) => {
    try {
      setEffectItem((await toggleEquip(item)) === 'equipped' ? item : null);
    } catch (error) {
      console.warn('전신갑주 착용 상태를 바꾸는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 다음 티어의 강화 비용을 차감하고, 기본 -> 실버 -> 골드 -> 빛의 용사 순으로 올려줍니다. */
  const handleUpgrade = async (item: ArmorItem) => {
    try {
      const currentTier = itemTiers[item.id];
      const nextTier = currentTier
        ? ARMOR_TIERS[ARMOR_TIERS.findIndex((tier) => tier.key === currentTier) + 1]
        : undefined;
      const result = await upgrade(item);
      if (result === 'not-enough') {
        if (nextTier) showNotEnough(nextTier.upgradeCost);
        return;
      }
      if (result === 'error') {
        setToast({ message: '잠깐 연결이 안 됐어요. 다시 눌러 볼까요? 🌸', tone: 'warn' });
        return;
      }
      if (result === 'ok' && nextTier) {
        setSpent(-nextTier.upgradeCost);
        setUpgradeEffect({ item, tier: nextTier });
      }
    } catch (error) {
      console.warn('전신갑주를 강화하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const equippedItems = ARMOR_ITEMS.filter((item) => equippedIds.includes(item.id));
  // 착용 중인 갑주 하나라도 '빛의 용사' 티어면 대표 캐릭터 주변에 아우라 이펙트를 보여 줍니다.
  const hasAuraEquipped = equippedItems.some((item) => itemTiers[item.id] === 'light');

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Toast message={toast?.message ?? null} onHide={hideToast} tone={toast?.tone} />
          <View style={styles.profileBar}>
            <Text style={styles.title}>달란트 상점 &amp; 전신갑주 🛡️</Text>
            <View style={styles.talentRow}>
              <View style={styles.talentBadge}>
                <Text accessibilityLiveRegion="polite" style={styles.talentText}>내 달란트: 🪙 {talents} pt</Text>
              </View>
              <TalentDelta amount={spent} onDone={clearSpent} />
            </View>
          </View>

          <View style={[styles.heroCard, hasAuraEquipped && styles.heroCardAura]}>
            <Text style={styles.heroLabel}>나의 믿음 용사</Text>
            {/* 홈 화면과 같은 캐릭터를 써서, 지금 산 갑주가 어떻게 보이는지 바로 확인할 수 있습니다. */}
            <HaneulCharacter equipped={equippedArmor} size={150} />
            <View style={styles.equippedRow}>
              {equippedItems.length === 0
                ? <Text style={styles.emptyText}>갑주를 착용하면 여기에 나타나요 ✨</Text>
                : equippedItems.map((item) => {
                  const tier = ARMOR_TIERS.find((candidate) => candidate.key === itemTiers[item.id]);
                  return (
                    <View key={item.id} style={styles.equippedChip}>
                      <Text style={styles.equippedText}>{item.emoji} {item.name}{tier?.badge ? ` ${tier.badge}` : ''}</Text>
                    </View>
                  );
                })}
            </View>
          </View>

          <Text style={styles.sectionTitle}>하나님의 전신갑주</Text>
          <View style={styles.grid}>
            {ARMOR_ITEMS.map((item) => {
              const currentTierKey = itemTiers[item.id];
              const isPurchased = Boolean(currentTierKey);
              const isEquipped = equippedIds.includes(item.id);
              const currentTierIndex = ARMOR_TIERS.findIndex((tier) => tier.key === currentTierKey);
              const currentTier = ARMOR_TIERS[currentTierIndex];
              const nextTier = isPurchased ? ARMOR_TIERS[currentTierIndex + 1] : undefined;
              const isMaxTier = isPurchased && !nextTier;
              return (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: item.color }, isMaxTier && styles.itemCardMaxTier]}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  {item.tag && (
                    <View style={[styles.bonusBadge, item.tag === 'seasonal' && styles.seasonalBadge]}>
                      <Text style={styles.bonusText}>{item.tag === 'seasonal' ? '🎉 절기 한정판' : '⭐ 특별 보너스 아이템'}</Text>
                    </View>
                  )}
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  {isPurchased && (
                    <View style={styles.tierBadge}>
                      <Text style={styles.tierBadgeText}>{currentTier.badge ? `${currentTier.badge} ` : ''}{currentTier.label} 티어</Text>
                    </View>
                  )}
                  <View style={styles.actionRow}>
                    <Pressable
                      accessibilityLabel={`${item.name} ${isPurchased ? (isEquipped ? '착용 해제' : '착용하기') : '구매하기'}`}
                      accessibilityRole="button"
                      onPress={() => isPurchased ? handleEquip(item) : handlePurchase(item)}
                      style={({ pressed }) => [styles.actionButton, isPurchased && styles.equipButton, isEquipped && styles.equippedButton, pressed && styles.pressed]}>
                      <Text style={[styles.buttonText, isPurchased && styles.equipText, isEquipped && styles.equippedButtonText, isPurchased && styles.buttonTextSmall]}>
                        {isPurchased ? (isEquipped ? '착용 중 🟢' : '착용하기') : `구매 (🪙 ${item.price}pt)`}
                      </Text>
                    </Pressable>
                    {nextTier && (
                      <Pressable
                        accessibilityLabel={`${item.name} ${nextTier.label} 티어로 강화하기`}
                        accessibilityRole="button"
                        onPress={() => handleUpgrade(item)}
                        style={({ pressed }) => [styles.actionButton, styles.upgradeButton, pressed && styles.pressed]}>
                        <Text style={[styles.buttonText, styles.upgradeText, styles.buttonTextSmall]}>강화 (🪙 {nextTier.upgradeCost}pt)</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setEffectItem(null)} transparent visible={effectItem !== null}>
        <View style={styles.modalBackdrop}>
          <View accessibilityLiveRegion="polite" style={styles.modalCard}>
            <Text style={styles.modalEmoji}>{effectItem?.emoji} ✨</Text>
            <Text style={styles.modalTitle}>{effectItem ? withObjectParticle(effectItem.name) : ''} 착용했어요! {effectItem?.emoji}</Text>
            <Pressable accessibilityRole="button" onPress={() => setEffectItem(null)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>멋진 모습 확인하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setUpgradeEffect(null)} transparent visible={upgradeEffect !== null}>
        <View style={styles.modalBackdrop}>
          <View accessibilityLiveRegion="polite" style={styles.modalCard}>
            <Text style={styles.modalEmoji}>{upgradeEffect?.item.emoji} {upgradeEffect?.tier.badge}</Text>
            <Text style={styles.modalTitle}>
              {upgradeEffect ? withObjectParticle(upgradeEffect.item.name) : ''} {upgradeEffect?.tier.label} 티어로{'\n'}강화했어요! {upgradeEffect?.tier.badge}
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setUpgradeEffect(null)} style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>멋진 모습 확인하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
