import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import AppButton from '@/components/ui/AppButton';
import GlassCard from '@/components/ui/GlassCard';
import Toast from '@/components/ui/Toast';
import { COLORS } from '@/constants/theme';
import { MOCK_TEACHER_PASSWORD } from '@/data/mockTeacher';
import { isTeacherApiReady, loginTeacher } from '@/lib/teacherApi';
import { teacherLoginStyles as styles } from './teacherLoginStyles';

/** 선생님이 관리자 계정으로 들어가는 로그인 화면입니다. */
export default function TeacherLoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [toast, setToast] = useState(null);
  const hideToast = useCallback(() => setToast(null), []);

  // 서버에 연결돼 있으면 이메일도 있어야 로그인할 수 있습니다.
  const isReady = password.length > 0 && (!isTeacherApiReady || email.trim().length > 0);

  const handleLogin = async () => {
    if (!isReady || isLoggingIn) return;

    try {
      setIsLoggingIn(true);

      // .env가 비어 있으면 예전처럼 고정 비밀번호로 화면 흐름만 확인합니다.
      if (!isTeacherApiReady) {
        if (password !== MOCK_TEACHER_PASSWORD) {
          setToast({ message: '연습용 비밀번호는 hanulbit이에요 🔐', tone: 'warn' });
          setPassword('');
          return;
        }
        onLoginSuccess();
        return;
      }

      const result = await loginTeacher(email.trim(), password);
      if (!result.ok) {
        setToast({
          message: result.reason === 'NOT_TEACHER'
            ? '선생님 계정이 아니에요. 관리자에게 문의해 주세요.'
            : '이메일이나 비밀번호가 맞지 않아요 🔐',
          tone: 'warn',
        });
        setPassword('');
        return;
      }
      onLoginSuccess();
    } catch (error) {
      console.warn('선생님 로그인 중 오류가 발생했습니다.', error);
      setToast({ message: '잠깐 연결이 안 됐어요. 다시 시도해 주세요 🌸', tone: 'warn' });
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
          <GlassCard style={styles.card}>
            <Text style={styles.eyebrow}>TEACHER ADMIN</Text>
            <Text style={styles.title}>선생님, 안녕하세요 ✝️</Text>

            {isTeacherApiReady && (
              <>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                  accessibilityLabel="선생님 이메일"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="선생님 이메일을 입력하세요"
                  placeholderTextColor={COLORS.textSecondary}
                  style={styles.input}
                  value={email}
                />
              </>
            )}

            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              accessibilityLabel="관리자 비밀번호"
              autoCapitalize="none"
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              returnKeyType="done"
              secureTextEntry
              style={styles.input}
              value={password}
            />
            {!isTeacherApiReady && (
              <View style={styles.helperPill}>
                <Text style={styles.helper}>연습용 비밀번호 · hanulbit</Text>
              </View>
            )}

            <AppButton
              disabled={!isReady || isLoggingIn}
              label={isLoggingIn ? '문을 여는 중...' : '대시보드로 들어가기'}
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
