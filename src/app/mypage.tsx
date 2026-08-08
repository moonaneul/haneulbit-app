import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Mock 로그인이 성공했는지 바로 확인할 수 있는 임시 학생 마이페이지입니다. */
export default function MyPageScreen() {
  const { studentName } = useLocalSearchParams<{ studentName?: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.avatar}>🛡️</Text>
        <Text style={styles.title}>{studentName || '하늘빛 친구'}의 마이페이지</Text>
        <Text style={styles.message}>Mock 로그인에 성공했어요! 🎉</Text>
        <Text style={styles.caption}>다음 단계에서 아바타와 전신갑주를 채워 주세요.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#EAF8FF' },
  card: { width: '100%', maxWidth: 440, alignItems: 'center', padding: 32, borderRadius: 30, backgroundColor: '#FFFDF8' },
  avatar: { fontSize: 82, marginBottom: 18 },
  title: { color: '#51496E', fontSize: 26, fontWeight: '900', textAlign: 'center' },
  message: { color: '#F07598', fontSize: 19, fontWeight: '800', marginTop: 14 },
  caption: { color: '#777087', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 10 },
});
