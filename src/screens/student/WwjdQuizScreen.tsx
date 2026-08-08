import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TODAY_WWJD_QUIZ, type QuizChoice } from './wwjdQuizData';
import { wwjdQuizStyles as styles } from './wwjdQuizStyles';

interface WwjdQuizScreenProps {
  initialTalents?: number;
  onBack?: () => void;
}

type QuizStep = 1 | 2;

/** 학생이 행동과 말씀을 차례로 연결하며 배우는 2단계 WWJD 퀴즈 화면입니다. */
export default function WwjdQuizScreen({ initialTalents = 150, onBack }: WwjdQuizScreenProps) {
  // 현재 단계, 획득 점수, 힌트와 최종 보상 팝업을 각각 관리합니다.
  const [step, setStep] = useState<QuizStep>(1);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState('');
  const [isRewardVisible, setIsRewardVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [rewardScale] = useState(() => new Animated.Value(0));
  const nextStepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 화면을 벗어날 때 예약된 단계 이동을 취소해 안전하게 정리합니다.
  useEffect(() => () => {
    if (nextStepTimer.current) clearTimeout(nextStepTimer.current);
  }, []);

  /** 오답은 감점하지 않고, 정답일 때만 10점을 더해 다음 흐름을 엽니다. */
  const handleChoice = (choice: QuizChoice) => {
    try {
      if (isLocked || isRewardVisible) return;
      if (!choice.isCorrect) {
        setHint('아쉬워요! 말씀을 다시 읽어볼까요? 🌸');
        return;
      }

      setHint('');
      setScore((current) => current + 10);
      if (step === 1) {
        setIsLocked(true);
        nextStepTimer.current = setTimeout(() => {
          setStep(2);
          setIsLocked(false);
        }, 850);
        return;
      }

      setIsRewardVisible(true);
      Animated.spring(rewardScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
    } catch (error) {
      console.warn('WWJD 퀴즈 답안을 처리하는 중 오류가 발생했습니다.', error);
      setHint('잠시 후 다시 시도해 주세요 🌸');
    }
  };

  const choices = step === 1 ? TODAY_WWJD_QUIZ.situationChoices : TODAY_WWJD_QUIZ.verseChoices;
  const question = step === 1 ? TODAY_WWJD_QUIZ.situation : TODAY_WWJD_QUIZ.versePrompt;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            {onBack ? (
              <Pressable accessibilityRole="button" onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <Text style={styles.backText}>← 돌아가기</Text>
              </Pressable>
            ) : <View />}
            <View style={styles.scoreBadge}><Text style={styles.scoreText}>⭐ {score}점 · 🪙 {initialTalents + score}</Text></View>
          </View>

          <Text style={styles.title}>예수님이라면 어떻게 하실까? 🚦</Text>
          <View accessibilityLabel={`퀴즈 ${step}단계 중 2단계`} style={styles.progressRow}>
            <View style={[styles.progressBar, styles.progressActive]} />
            <View style={[styles.progressBar, step === 2 && styles.progressActive]} />
          </View>

          <Text style={styles.stepLabel}>{step}단계 · {step === 1 ? '상황 속 선택' : '말씀 짝꿍 찾기'}</Text>
          <View style={styles.card}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.guide}>{step === 1 ? '예수님의 마음을 생각하며 골라 보아요.' : '상황과 어울리는 말씀 카드를 찾아보아요.'}</Text>
            <View style={styles.choices}>
              {choices.map((choice) => (
                <Pressable
                  accessibilityRole="button"
                  disabled={isLocked}
                  key={choice.id}
                  onPress={() => handleChoice(choice)}
                  style={({ pressed }) => [styles.choice, pressed && styles.pressed]}>
                  <Text style={styles.choiceText}>{choice.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {isLocked && <View style={styles.reward}><Text style={styles.rewardText}>+10 달란트 🪙</Text></View>}
          {!!hint && <View accessibilityLiveRegion="polite" style={styles.hint}><Text style={styles.hintText}>{hint}</Text></View>}
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setIsRewardVisible(false)} transparent visible={isRewardVisible}>
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: rewardScale }] }]}>
            <Text style={styles.shield}>{TODAY_WWJD_QUIZ.completion.emoji}</Text>
            <Text style={styles.modalTitle}>{TODAY_WWJD_QUIZ.completion.title}</Text>
            <Text style={styles.modalBody}>{TODAY_WWJD_QUIZ.completion.message}</Text>
            <Pressable accessibilityRole="button" onPress={onBack ?? (() => setIsRewardVisible(false))} style={({ pressed }) => [styles.completeButton, pressed && styles.pressed]}>
              <Text style={styles.completeText}>완료하고 돌아가기</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
