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
import { MOCK_CHILD_LINK_CODE } from '@/data/mockParent';
import { parentLoginStyles as styles } from './parentLoginStyles';

/** 부모님이 휴대폰 번호와 자녀 연동 코드로 들어가는 Mock 로그인 화면입니다. */
export default function ParentLoginScreen({ onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkCode, setLinkCode] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isReady = phoneNumber.trim().length >= 9 && linkCode.trim().length > 0;

  // 현재는 Supabase 대신 고정 연동 코드를 비교하고, 성공하면 부모가 전달한 이동 함수를 실행합니다.
  const handleLogin = async () => {
    if (!isReady || isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      if (linkCode.trim() !== MOCK_CHILD_LINK_CODE) {
        Alert.alert('연동 코드를 다시 확인해 주세요 🔐', '테스트 연동 코드는 123456이에요.');
        setLinkCode('');
        return;
      }
      onLoginSuccess();
    } catch (error) {
      console.warn('부모님 Mock 로그인 중 오류가 발생했습니다.', error);
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
            <Text style={styles.eyebrow}>PARENT</Text>
            <Text style={styles.title}>부모님, 안녕하세요 🏡</Text>
            <Text style={styles.subtitle}>휴대폰 번호와 자녀 연동 코드로 들어가요</Text>

            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              accessibilityLabel="휴대폰 번호"
              keyboardType="phone-pad"
              onChangeText={setPhoneNumber}
              placeholder="010-0000-0000"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              value={phoneNumber}
            />

            <Text style={styles.label}>자녀 연동 코드</Text>
            <TextInput
              accessibilityLabel="자녀 연동 코드"
              autoCapitalize="none"
              onChangeText={setLinkCode}
              onSubmitEditing={handleLogin}
              placeholder="선생님께 받은 6자리 코드"
              placeholderTextColor={COLORS.textSecondary}
              returnKeyType="done"
              style={styles.input}
              value={linkCode}
            />
            <View style={styles.helperPill}>
              <Text style={styles.helper}>연습용 연동 코드 · 123456</Text>
            </View>

            <AppButton
              disabled={!isReady || isLoggingIn}
              label={isLoggingIn ? '문을 여는 중...' : '자녀 소식 보러 가기'}
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
