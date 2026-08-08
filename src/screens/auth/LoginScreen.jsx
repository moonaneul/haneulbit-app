import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AnimatedPinFeedback from '@/components/auth/AnimatedPinFeedback';
import PinKeypad from '@/components/auth/PinKeypad';
import { MOCK_LOGIN_PIN, MOCK_STUDENTS } from '@/data/mockStudents';
import { loginStyles as styles } from './loginStyles';

/** 학생이 앱에서 가장 먼저 만나는 Mock 로그인 화면입니다. */
export default function LoginScreen({ onLoginSuccess }) {
  // 선택한 학생 ID와 직접 입력할 수 있는 이름을 각각 저장합니다.
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  // PIN은 최대 네 자리의 문자열로 관리해야 맨 앞의 0도 안전하게 보존됩니다.
  const [pin, setPin] = useState('');
  // 로그인 처리 중 버튼을 여러 번 누르는 것을 막는 상태입니다.
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isReady = studentName.trim().length > 0 && pin.length === 4;

  // 학생 카드를 누르면 해당 이름을 입력창에도 보여 줍니다.
  const handleSelectStudent = (student) => {
    setSelectedStudentId(student.id);
    setStudentName(student.name);
  };

  // 숫자 버튼을 누를 때 PIN이 네 자리를 넘지 않도록 제한합니다.
  const handleNumberPress = (number) => {
    setPin((currentPin) => (currentPin.length < 4 ? currentPin + number : currentPin));
  };

  // 지우기 버튼은 가장 마지막에 입력한 숫자 한 자리만 삭제합니다.
  const handleDelete = () => setPin((currentPin) => currentPin.slice(0, -1));

  // 현재는 Supabase 대신 0000을 비교하고, 성공하면 부모가 전달한 이동 함수를 실행합니다.
  const handleLogin = async () => {
    if (!isReady || isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      if (pin !== MOCK_LOGIN_PIN) {
        Alert.alert('PIN을 다시 확인해요 🔐', '테스트 PIN은 0000이에요. 다시 눌러 볼까요?');
        setPin('');
        return;
      }
      onLoginSuccess({ id: selectedStudentId || 'student-manual', name: studentName.trim() });
    } catch (error) {
      console.warn('Mock 로그인 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.peachBubble} />
          <View style={styles.blueBubble} />
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>HANEULBIT KIDS</Text>
            </View>
            <View style={styles.logoSticker}>
              <Text style={styles.logo}>🕊️</Text>
            </View>
            <Text style={styles.title}>매일 만나 하늘빛</Text>
            <Text style={styles.subtitle}>오늘도 신나는 이야기가 기다리고 있어요</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}><Text style={styles.stepText}>1</Text></View>
              <View>
                <Text style={styles.sectionTitle}>누구와 함께할까요?</Text>
                <Text style={styles.sectionCaption}>내 캐릭터를 골라 주세요</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.studentRow}>
              {MOCK_STUDENTS.map((student) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedStudentId === student.id }}
                  key={student.id}
                  onPress={() => handleSelectStudent(student)}
                  style={({ pressed }) => [
                    styles.studentButton,
                    selectedStudentId === student.id && styles.studentButtonSelected,
                    pressed && styles.studentPressed,
                  ]}>
                  <View style={styles.characterBubble}>
                    <Text style={styles.studentEmoji}>{student.emoji}</Text>
                  </View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  {selectedStudentId === student.id && <Text style={styles.selectedCheck}>✓</Text>}
                </Pressable>
              ))}
            </ScrollView>

            <TextInput
              accessibilityLabel="학생 이름 또는 아이디"
              autoCapitalize="none"
              maxLength={20}
              onChangeText={(text) => { setStudentName(text); setSelectedStudentId(''); }}
              placeholder="내 이름이나 아이디 직접 입력하기"
              placeholderTextColor="#AAA39A"
              style={styles.input}
              value={studentName}
            />

            <View style={[styles.sectionHeader, styles.pinHeader]}>
              <View style={[styles.stepBadge, styles.stepBadgeBlue]}><Text style={styles.stepText}>2</Text></View>
              <View>
                <Text style={styles.sectionTitle}>비밀 번호를 알려 주세요</Text>
                <Text style={styles.sectionCaption}>PIN 숫자 4자리를 눌러요</Text>
              </View>
            </View>
            <AnimatedPinFeedback pinLength={pin.length} />
            <PinKeypad disabled={isLoggingIn} onDelete={handleDelete} onNumberPress={handleNumberPress} />
            <View style={styles.helperPill}><Text style={styles.helper}>연습용 PIN · 0000</Text></View>

            <Pressable
              accessibilityRole="button"
              disabled={!isReady || isLoggingIn}
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton, isReady && styles.loginButtonReady,
                pressed && styles.loginButtonPressed, (!isReady || isLoggingIn) && styles.loginButtonDisabled,
              ]}>
              <Text style={styles.loginText}>{isLoggingIn ? '문을 여는 중...' : '하늘빛 마을로 출발'}</Text>
              {!isLoggingIn && <Text style={styles.loginArrow}>→</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
