import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ARMOR_ITEMS, type ArmorItem } from './armorShopData';
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
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  // 여러 갑주를 함께 착용할 수 있도록 착용 중인 아이템 ID를 배열로 보관합니다.
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [effectItem, setEffectItem] = useState<ArmorItem | null>(null);

  /** 가격을 확인한 뒤 달란트를 차감하고 구매 완료 상태로 바꿉니다. */
  const handlePurchase = (item: ArmorItem) => {
    try {
      if (purchasedIds.includes(item.id)) return;
      if (talents < item.price) {
        Alert.alert('달란트가 조금 부족해요!', '큐티와 퀴즈로 달란트를 모아볼까요? 🌸');
        return;
      }

      setTalents((current) => current - item.price);
      setPurchasedIds((current) => [...current, item.id]);
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

  const equippedItems = ARMOR_ITEMS.filter((item) => equippedIds.includes(item.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileBar}>
            <Text style={styles.title}>달란트 상점 &amp; 전신갑주 🛡️</Text>
            <View style={styles.talentBadge}>
              <Text accessibilityLiveRegion="polite" style={styles.talentText}>내 달란트: 🪙 {talents} pt</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>나의 믿음 용사</Text>
            <Text accessibilityLabel="전신갑주 캐릭터" style={styles.character}>🧒🏻</Text>
            <View style={styles.equippedRow}>
              {equippedItems.length === 0
                ? <Text style={styles.emptyText}>갑주를 착용하면 여기에 나타나요 ✨</Text>
                : equippedItems.map((item) => (
                  <View key={item.id} style={styles.equippedChip}>
                    <Text style={styles.equippedText}>{item.emoji} {item.name}</Text>
                  </View>
                ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>하나님의 전신갑주</Text>
          <View style={styles.grid}>
            {ARMOR_ITEMS.map((item) => {
              const isPurchased = purchasedIds.includes(item.id);
              const isEquipped = equippedIds.includes(item.id);
              return (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: item.color }]}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  {item.id === 'sling' && (
                    <View style={styles.bonusBadge}><Text style={styles.bonusText}>특별 보너스 아이템</Text></View>
                  )}
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Pressable
                    accessibilityLabel={`${item.name} ${isPurchased ? (isEquipped ? '착용 해제' : '착용하기') : '구매하기'}`}
                    accessibilityRole="button"
                    onPress={() => isPurchased ? handleEquip(item) : handlePurchase(item)}
                    style={({ pressed }) => [styles.actionButton, isPurchased && styles.equipButton, isEquipped && styles.equippedButton, pressed && styles.pressed]}>
                    <Text style={styles.buttonText}>
                      {isPurchased ? (isEquipped ? '착용 중 🟢' : '착용하기') : `구매하기 (🪙 ${item.price}pt)`}
                    </Text>
                  </Pressable>
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
    </SafeAreaView>
  );
}
