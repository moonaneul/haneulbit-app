import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { ARMOR_ITEMS, ARMOR_TIERS, type ArmorItem, type ArmorTierKey } from './armorShopData';
import { armorShopStyles as styles } from './armorShopStyles';

interface ArmorShopScreenProps {
  initialTalents?: number;
}

/** 받침 유무를 확인해 아이템 이름 뒤에 자연스러운 '을/를'을 붙입니다. */
const withObjectParticle = (name: string) => {
  const lastCharacter = name.charCodeAt(name.length - 1);
  const hasFinalConsonant = lastCharacter >= 0xac00 && lastCharacter <= 0xd7a3
    && (lastCharacter - 0xac00) % 28 !== 0;
  return `${name}${hasFinalConsonant ? '을' : '를'}`;
};

/** 달란트로 전신갑주를 사고 캐릭터에 착용해 보는 학생용 Mock 상점입니다. */
export default function ArmorShopScreen({ initialTalents = 150 }: ArmorShopScreenProps) {
  // 실제 DB 연결 전에는 달란트와 구매 목록을 현재 화면에서만 관리합니다.
  const [talents, setTalents] = useState(initialTalents);
  // 구매한 아이템 ID를 키로, 현재 티어를 값으로 보관합니다 (구매 = 'basic' 티어 획득).
  const [itemTiers, setItemTiers] = useState<Partial<Record<string, ArmorTierKey>>>({});
  // 여러 갑주를 함께 착용할 수 있도록 착용 중인 아이템 ID를 배열로 보관합니다.
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [effectItem, setEffectItem] = useState<ArmorItem | null>(null);
  const [upgradeEffect, setUpgradeEffect] = useState<{ item: ArmorItem; tier: (typeof ARMOR_TIERS)[number] } | null>(null);

  /** 가격을 확인한 뒤 달란트를 차감하고 기본 티어로 구매 완료 상태로 바꿉니다. */
  const handlePurchase = (item: ArmorItem) => {
    try {
      if (itemTiers[item.id]) return;
      if (talents < item.price) {
        Alert.alert('달란트가 조금 부족해요!', '큐티와 퀴즈로 달란트를 모아볼까요? 🌸');
        return;
      }

      setTalents((current) => current - item.price);
      setItemTiers((current) => ({ ...current, [item.id]: 'basic' }));
    } catch (error) {
      console.warn('전신갑주를 구매하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 구매한 갑주를 토글하고, 새로 착용할 때 축하 이펙트 모달을 엽니다. */
  const handleEquip = (item: ArmorItem) => {
    try {
      const isEquipped = equippedIds.includes(item.id);
      setEquippedIds((current) => isEquipped
        ? current.filter((id) => id !== item.id)
        : [...current, item.id]);
      setEffectItem(isEquipped ? null : item);
    } catch (error) {
      console.warn('전신갑주 착용 상태를 바꾸는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 다음 티어의 강화 비용을 차감하고, 기본 -> 실버 -> 골드 -> 빛의 용사 순으로 올려줍니다. */
  const handleUpgrade = (item: ArmorItem) => {
    try {
      const currentTier = itemTiers[item.id];
      if (!currentTier) return;
      const currentIndex = ARMOR_TIERS.findIndex((tier) => tier.key === currentTier);
      const nextTier = ARMOR_TIERS[currentIndex + 1];
      if (!nextTier) return;
      if (talents < nextTier.upgradeCost) {
        Alert.alert('달란트가 조금 부족해요!', '큐티와 퀴즈로 달란트를 모아볼까요? 🌸');
        return;
      }

      setTalents((current) => current - nextTier.upgradeCost);
      setItemTiers((current) => ({ ...current, [item.id]: nextTier.key }));
      setUpgradeEffect({ item, tier: nextTier });
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
          <View style={styles.profileBar}>
            <Text style={styles.title}>달란트 상점 &amp; 전신갑주 🛡️</Text>
            <View style={styles.talentBadge}>
              <Text accessibilityLiveRegion="polite" style={styles.talentText}>내 달란트: 🪙 {talents} pt</Text>
            </View>
          </View>

          <View style={[styles.heroCard, hasAuraEquipped && styles.heroCardAura]}>
            <Text style={styles.heroLabel}>나의 믿음 용사</Text>
            <Text accessibilityLabel="전신갑주 캐릭터" style={styles.character}>{hasAuraEquipped ? '✨🧒🏻✨' : '🧒🏻'}</Text>
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
                      <Text style={[styles.buttonText, isPurchased && styles.buttonTextSmall]}>
                        {isPurchased ? (isEquipped ? '착용 중 🟢' : '착용하기') : `구매 (🪙 ${item.price}pt)`}
                      </Text>
                    </Pressable>
                    {nextTier && (
                      <Pressable
                        accessibilityLabel={`${item.name} ${nextTier.label} 티어로 강화하기`}
                        accessibilityRole="button"
                        onPress={() => handleUpgrade(item)}
                        style={({ pressed }) => [styles.actionButton, styles.upgradeButton, pressed && styles.pressed]}>
                        <Text style={[styles.buttonText, styles.buttonTextSmall]}>강화 (🪙 {nextTier.upgradeCost}pt)</Text>
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
