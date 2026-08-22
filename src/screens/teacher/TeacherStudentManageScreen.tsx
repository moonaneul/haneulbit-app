import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkyScene from '@/components/scene/SkyScene';

import { AVATAR_OPTIONS, DEFAULT_STUDENT_PIN, MOCK_MANAGED_STUDENTS, type ManagedStudent } from './teacherStudentManageData';
import { teacherStudentManageStyles as styles } from './teacherStudentManageStyles';

/** 선생님이 학생 12명을 사전 등록하고 PIN을 초기화하는 계정 관리 화면입니다. */
export default function TeacherStudentManageScreen() {
  const [students, setStudents] = useState<ManagedStudent[]>(MOCK_MANAGED_STUDENTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [avatarDraft, setAvatarDraft] = useState(AVATAR_OPTIONS[0]);
  const canSubmit = nameDraft.trim().length > 0;

  const openModal = () => {
    setNameDraft('');
    setAvatarDraft(AVATAR_OPTIONS[0]);
    setIsModalVisible(true);
  };

  /** 이름과 아바타만 받아 초기 PIN 0000으로 새 학생 계정을 만듭니다. */
  const handleRegister = () => {
    try {
      const trimmedName = nameDraft.trim();
      if (!trimmedName) return;
      const newStudent: ManagedStudent = {
        id: `student-new-${Date.now()}`,
        name: trimmedName,
        avatar: avatarDraft,
        registeredAt: '방금 등록',
      };
      setStudents((current) => [newStudent, ...current]);
      setIsModalVisible(false);
      Alert.alert('학생 계정을 만들었어요! 🎉', `${trimmedName} 어린이의 초기 PIN은 ${DEFAULT_STUDENT_PIN}이에요.`);
    } catch (error) {
      console.warn('학생 계정을 등록하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  /** 학생이 PIN을 잊어버렸을 때 초기값(0000)으로 되돌립니다. */
  const handleResetPin = (student: ManagedStudent) => {
    try {
      Alert.alert('PIN을 초기화했어요 🔐', `${student.name} 어린이의 PIN이 ${DEFAULT_STUDENT_PIN}으로 초기화됐어요.`);
    } catch (error) {
      console.warn('PIN을 초기화하는 중 오류가 발생했습니다.', error);
      Alert.alert('앗, 잠시 쉬어 갈까요?', '잠시 후 다시 시도해 주세요 🌸');
    }
  };

  return (
    <SkyScene>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>학생 계정 관리 👦👧</Text>
            <Text style={styles.caption}>새 친구를 추가하거나, PIN을 잊었을 때 새로 줄 수 있어요.</Text>
          </View>

          <Pressable
            accessibilityLabel="새 학생 등록하기"
            accessibilityRole="button"
            onPress={openModal}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Text style={styles.addButtonText}>+ 새 학생 등록하기</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>등록된 학생 ({students.length}명)</Text>
          <View style={styles.studentList}>
            {students.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <View style={styles.avatarCircle}><Text style={styles.avatar}>{student.avatar}</Text></View>
                <View style={styles.studentBody}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.registeredAt}>{student.registeredAt}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`${student.name} PIN 초기화`}
                  accessibilityRole="button"
                  onPress={() => handleResetPin(student)}
                  style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
                  <Text style={styles.resetButtonText}>PIN 초기화</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setIsModalVisible(false)} transparent visible={isModalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>새 학생 등록하기</Text>
            <Text style={styles.modalCaption}>이름이랑 얼굴만 정하면 끝! PIN은 0000으로 시작해요.</Text>

            <Text style={styles.modalLabel}>이름</Text>
            <TextInput
              accessibilityLabel="새 학생 이름"
              maxLength={10}
              onChangeText={setNameDraft}
              placeholder="예: 김하늘"
              placeholderTextColor="#96918A"
              style={styles.input}
              value={nameDraft}
            />

            <Text style={styles.modalLabel}>아바타</Text>
            <View style={styles.avatarPickerRow}>
              {AVATAR_OPTIONS.map((avatarOption) => {
                const isSelected = avatarDraft === avatarOption;
                return (
                  <Pressable
                    accessibilityLabel={`아바타 ${avatarOption}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={avatarOption}
                    onPress={() => setAvatarDraft(avatarOption)}
                    style={[styles.avatarOption, isSelected && styles.avatarOptionSelected]}>
                    <Text style={styles.avatarOptionEmoji}>{avatarOption}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.pinNoteBox}>
              <Text style={styles.pinNoteText}>🔐 초기 PIN은 항상 {DEFAULT_STUDENT_PIN}이에요. 학생이 처음 로그인할 때 안내해 주세요.</Text>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable accessibilityRole="button" onPress={() => setIsModalVisible(false)} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!canSubmit}
                onPress={handleRegister}
                style={({ pressed }) => [styles.submitButton, !canSubmit && styles.submitButtonDisabled, pressed && styles.pressed]}>
                <Text style={styles.submitButtonText}>등록하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </SkyScene>
  );
}
