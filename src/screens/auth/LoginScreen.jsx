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
import SkyScene from '@/components/scene/SkyScene';
import AppButton from '@/components/ui/AppButton';
import GlassCard from '@/components/ui/GlassCard';
import { COLORS } from '@/constants/theme';
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
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>매일 3분, 마음이 쑥쑥</Text>
            </View>
            <Text style={styles.title}>오늘도 만나서 반가워!</Text>
            <Text style={styles.subtitle}>예수님과 오늘도 함께 걸어가요</Text>
          </View>

          <GlassCard style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>나는 누구일까요?</Text>
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
                  <Text style={styles.studentInitial}>{student.name.slice(0, 1)}</Text>
                  <Text style={styles.studentName}>{student.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <TextInput
              accessibilityLabel="학생 이름 또는 아이디"
              autoCapitalize="none"
              maxLength={20}
              onChangeText={(text) => { setStudentName(text); setSelectedStudentId(''); }}
              placeholder="내 이름이나 아이디 직접 입력하기"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              value={studentName}
            />

            <View style={[styles.sectionHeader, styles.pinHeader]}>
              <Text style={styles.sectionTitle}>비밀 번호 4자리</Text>
            </View>
            <AnimatedPinFeedback pinLength={pin.length} />
            <PinKeypad disabled={isLoggingIn} onDelete={handleDelete} onNumberPress={handleNumberPress} />
            <View style={styles.helperPill}><Text style={styles.helper}>연습용 PIN · 0000</Text></View>

            <AppButton
              disabled={!isReady || isLoggingIn}
              label={isLoggingIn ? '문을 여는 중...' : '하늘빛 마을로 출발'}
              onPress={handleLogin}
              style={styles.loginButton}
              trailingText={isLoggingIn ? undefined : '→'}
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </SkyScene>
  );
}
