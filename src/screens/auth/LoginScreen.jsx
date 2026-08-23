import { useCallback, useEffect, useState } from 'react';
import {
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
import Toast from '@/components/ui/Toast';
import { COLORS } from '@/constants/theme';
import { MOCK_LOGIN_PIN, MOCK_STUDENTS } from '@/data/mockStudents';
import { isSupabaseConfigured } from '@/lib/supabase';
import { fetchStudentNames, loginStudent } from '@/lib/studentAuth';
import { loginStyles as styles } from './loginStyles';

/** 학생이 앱에서 가장 먼저 만나는 로그인 화면입니다. */
export default function LoginScreen({ onLoginSuccess }) {
  // 선택한 학생 ID와 직접 입력할 수 있는 이름을 각각 저장합니다.
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  // PIN은 최대 네 자리의 문자열로 관리해야 맨 앞의 0도 안전하게 보존됩니다.
  const [pin, setPin] = useState('');
  // 로그인 처리 중 버튼을 여러 번 누르는 것을 막는 상태입니다.
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Alert.alert()은 웹에서 아무것도 띄우지 않아, 안내는 화면 안 토스트로 보여 줍니다.
  const [toast, setToast] = useState(null);
  const hideToast = useCallback(() => setToast(null), []);
  // Supabase에 등록된 우리 반 아이들. 아직 연결 전이면 Mock 목록을 그대로 씁니다.
  const [students, setStudents] = useState(MOCK_STUDENTS);

  useEffect(() => {
    fetchStudentNames()
      .then((rows) => {
        if (rows) setStudents(rows);
      })
      .catch((error) => {
        // Mock 이름을 그대로 두면 실제와 달라 더 헷갈리므로 목록을 비우고,
        // 이름을 직접 입력해서 로그인할 수 있게 남겨 둡니다.
        setStudents([]);
        console.warn(
          '학생 명단을 불러오지 못했습니다. Supabase 대시보드에서 익명 로그인(Anonymous sign-ins)이 켜져 있는지 확인해 주세요.',
          error,
        );
      });
  }, []);

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

  // PIN 확인은 서버(claim_student_login)에서만 하고, 앱은 결과만 받습니다.
  // .env가 아직 비어 있으면 예전처럼 0000으로 확인해 화면 흐름을 볼 수 있게 둡니다.
  const handleLogin = async () => {
    if (!isReady || isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      const name = studentName.trim();

      if (!isSupabaseConfigured) {
        if (pin !== MOCK_LOGIN_PIN) {
          setToast({ message: '연습용 비밀번호는 0000이에요. 다시 눌러 볼까요? 🔐', tone: 'warn' });
          setPin('');
          return;
        }
        onLoginSuccess({ id: selectedStudentId || 'student-manual', name });
        return;
      }

      const student = await loginStudent(name, pin);
      if (!student) {
        setToast({
          message: '비밀번호가 맞지 않아요. 다시 눌러 볼까요? 기억이 안 나면 선생님께 말씀드려요 🔐',
          tone: 'warn',
        });
        setPin('');
        return;
      }
      onLoginSuccess({ id: student.id, name: student.name });
    } catch (error) {
      console.warn('로그인 중 오류가 발생했습니다.', error);
      setToast({ message: '잠깐 연결이 안 됐어요. 다시 눌러 볼까요? 🌸', tone: 'warn' });
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
          <Toast message={toast?.message ?? null} onHide={hideToast} tone={toast?.tone} />
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
              {students.map((student) => (
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
            {!isSupabaseConfigured && (
              <View style={styles.helperPill}><Text style={styles.helper}>연습용 PIN · 0000</Text></View>
            )}

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
