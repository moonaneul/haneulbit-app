import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import AnimatedPinFeedback from '@/components/auth/AnimatedPinFeedback';
import PinKeypad from '@/components/auth/PinKeypad';
import { changeMyPin, verifyMyPin } from '@/lib/studentAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { pinChangeStyles as styles } from './pinChangeStyles';

/** 세 단계를 차례로 물어봅니다. 한 번에 네 자리씩만 누르면 되도록 나눴습니다. */
const STEPS = [
  { key: 'current', title: '지금 비밀번호를 눌러 줘', hint: '기억이 안 나면 선생님께 말씀드려요' },
  { key: 'next', title: '새 비밀번호를 정해 볼까?', hint: '숫자 네 자리로 만들어요' },
  { key: 'confirm', title: '한 번 더 눌러 줘', hint: '같은 번호인지 확인할게요' },
] as const;

interface PinChangeModalProps {
  visible: boolean;
  onClose: () => void;
  /** 바꾸기에 성공했을 때 부모 화면이 안내를 띄우도록 알려 줍니다. */
  onChanged: () => void;
}

/** 아이가 마이페이지에서 자기 비밀번호를 바꾸는 창입니다. */
export default function PinChangeModal({ visible, onClose, onChanged }: PinChangeModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [pin, setPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [nextPin, setNextPin] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const step = STEPS[stepIndex];

  /** 안내 문구는 남겨 둡니다. 처음으로 돌리면서 문구까지 지우면 왜 돌아왔는지 알 수 없습니다. */
  const resetSteps = () => {
    setStepIndex(0);
    setPin('');
    setCurrentPin('');
    setNextPin('');
  };

  const closeAndReset = () => {
    resetSteps();
    setMessage(null);
    onClose();
  };

  /** 네 자리가 다 채워졌을 때만 다음 단계로 넘어갑니다. */
  const handleComplete = async (filled: string) => {
    setMessage(null);

    if (step.key === 'current') {
      // 여기서 바로 확인해야, 새 번호를 두 번 입력한 뒤에 틀렸다는 걸 알게 되지 않습니다.
      if (isSupabaseConfigured) {
        try {
          setIsSaving(true);
          if (!(await verifyMyPin(filled))) {
            setMessage('지금 비밀번호가 맞지 않아요. 다시 눌러 볼까요? 🔐');
            setPin('');
            return;
          }
        } catch (error) {
          console.warn('비밀번호를 확인하는 중 오류가 발생했습니다.', error);
          setMessage('잠깐 연결이 안 됐어요. 다시 해 볼까요? 🌸');
          setPin('');
          return;
        } finally {
          setIsSaving(false);
        }
      }
      setCurrentPin(filled);
      setPin('');
      setStepIndex(1);
      return;
    }

    if (step.key === 'next') {
      setNextPin(filled);
      setPin('');
      setStepIndex(2);
      return;
    }

    if (filled !== nextPin) {
      setMessage('두 번호가 서로 달라요. 새 비밀번호부터 다시 정해 볼까요?');
      setPin('');
      setNextPin('');
      setStepIndex(1);
      return;
    }

    // .env를 채우기 전에는 화면 흐름만 확인합니다.
    if (!isSupabaseConfigured) {
      closeAndReset();
      onChanged();
      return;
    }

    try {
      setIsSaving(true);
      const result = await changeMyPin(currentPin, nextPin);
      if (result.ok) {
        closeAndReset();
        onChanged();
        return;
      }
      if (result.reason === 'WRONG_CURRENT') {
        resetSteps();
        setMessage('지금 비밀번호가 맞지 않아요. 처음부터 다시 해 볼까요? 🔐');
        return;
      }
      setMessage('비밀번호를 바꾸지 못했어요. 잠시 후 다시 해 볼까요? 🌸');
      setPin('');
    } catch (error) {
      console.warn('비밀번호를 바꾸는 중 오류가 발생했습니다.', error);
      setMessage('잠깐 연결이 안 됐어요. 다시 해 볼까요? 🌸');
      setPin('');
    } finally {
      setIsSaving(false);
    }
  };

  // setPin 업데이터 안에서 다음 단계를 처리하면 초기화한 값이 다시 덮어써집니다.
  // 아이가 한 번에 한 번씩 누르므로 지금 값을 그대로 읽어 써도 안전합니다.
  const handleNumberPress = (number: string) => {
    if (isSaving || pin.length >= 4) return;
    const next = pin + number;
    setPin(next);
    if (next.length === 4) handleComplete(next);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={closeAndReset}>
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.card}>
          <Text style={styles.stepBadge}>{stepIndex + 1} / 3</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.hint}>{message ?? step.hint}</Text>

          <AnimatedPinFeedback pinLength={pin.length} />
          <PinKeypad
            disabled={isSaving}
            onDelete={() => setPin((current) => current.slice(0, -1))}
            onNumberPress={handleNumberPress}
          />

          <Pressable
            accessibilityRole="button"
            onPress={closeAndReset}
            style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
            <Text style={styles.cancelText}>그만할래요</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
