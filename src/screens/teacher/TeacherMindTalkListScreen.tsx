import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { MOCK_TALK_THREADS, type StudentTalkThread } from './teacherMindTalkData';
import { teacherMindTalkStyles as styles } from './teacherMindTalkStyles';

interface TeacherMindTalkListScreenProps {
  onThreadPress?: (thread: StudentTalkThread) => void;
}

/** 학생들이 보낸 1:1 마음 톡 대화를 한눈에 모아 보는 선생님용 목록입니다. */
export default function TeacherMindTalkListScreen({ onThreadPress }: TeacherMindTalkListScreenProps) {
  // 안 읽은 대화가 위로 오도록 정렬해 선생님이 먼저 확인할 수 있게 합니다.
  const sortedThreads = [...MOCK_TALK_THREADS].sort((a, b) => Number(b.hasUnread) - Number(a.hasUnread));

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>1:1 마음 톡 목록 💬</Text>
            <Text style={styles.caption}>아이들이 조용히 건넨 이야기예요. 따뜻하게 답해 주세요.</Text>
          </View>

          <View style={styles.threadList}>
            {sortedThreads.map((thread) => (
              <Pressable
                accessibilityLabel={`${thread.studentName}, ${thread.hasUnread ? '읽지 않은 메시지 있음' : '읽음'}, ${thread.lastMessage}`}
                accessibilityRole="button"
                key={thread.id}
                onPress={() => onThreadPress?.(thread)}
                style={({ pressed }) => [styles.threadCard, pressed && styles.pressed]}>
                <View style={styles.avatarCircle}><Text style={styles.avatar}>{thread.studentAvatar}</Text></View>
                <View style={styles.threadBody}>
                  <View style={styles.nameRow}>
                    <Text style={styles.studentName}>{thread.studentName}</Text>
                    {thread.hasUnread && <View style={styles.unreadDot} />}
                  </View>
                  <Text numberOfLines={1} style={styles.lastMessage}>{thread.lastMessage}</Text>
                </View>
                <Text style={styles.threadTime}>{thread.lastMessageTime}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SkyScene>
  );
}
