import { useState } from 'react';
import {
  Alert,
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
import { COLORS } from '@/constants/theme';
import { MOCK_TEACHER_PASSWORD } from '@/data/mockTeacher';
import { teacherLoginStyles as styles } from './teacherLoginStyles';

/** 선생님이 관리자 마스터 계정으로 들어가는 Mock 로그인 화면입니다. */
export default function TeacherLoginScreen({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isReady = password.length > 0;

  // 현재는 Supabase 대신 고정 비밀번호를 비교하고, 성공하면 부모가 전달한 이동 함수를 실행합니다.
  const handleLogin = async () => {
    if (!isReady || isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      if (password !== MOCK_TEACHER_PASSWORD) {
        Alert.alert('비밀번호를 다시 확인해 주세요 🔐', '테스트 비밀번호는 hanulbit이에요.');
        setPassword('');
        return;
      }
      onLoginSuccess();
    } catch (error) {
      console.warn('선생님 Mock 로그인 중 오류가 발생했습니다.', error);
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
          <GlassCard style={styles.card}>
            <Text style={styles.eyebrow}>TEACHER ADMIN</Text>
            <Text style={styles.title}>선생님, 안녕하세요 ✝️</Text>
            <Text style={styles.subtitle}>관리자 비밀번호를 입력하고 대시보드로 들어가요</Text>

            <Text style={styles.label}>관리자 비밀번호</Text>
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
            <View style={styles.helperPill}>
              <Text style={styles.helper}>연습용 비밀번호 · hanulbit</Text>
            </View>

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
