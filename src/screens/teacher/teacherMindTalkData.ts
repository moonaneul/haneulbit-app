export type MessageSender = 'teacher' | 'student';

export interface MindTalkMessage {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
}

/** 한 학생과 나눈 1:1 마음 톡 목록에 표시되는 요약 정보입니다. */
export interface StudentTalkThread {
  id: string;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  hasUnread: boolean;
  messages: MindTalkMessage[];
}

// Supabase 연동 전, 12명 중 대화가 있는 학생만 보여 주는 Mock 목록입니다.
export const MOCK_TALK_THREADS: StudentTalkThread[] = [
  {
    id: 'student-01', studentName: '김하늘', studentAvatar: '👧🏻',
    lastMessage: '친구랑 조금 다퉈서 마음이 속상해요. 내일은 먼저 미안하다고 말할 수 있게 기도해 주세요.',
    lastMessageTime: '오후 3:24', hasUnread: true,
    messages: [
      { id: 'm1', sender: 'teacher', text: '하늘아, 오늘 하루는 어땠니? 속상한 일이나 기도제목이 있으면 언제든 편하게 말해주렴 🌸', time: '오후 3:20' },
      { id: 'm2', sender: 'student', text: '친구랑 조금 다퉈서 마음이 속상해요. 내일은 먼저 미안하다고 말할 수 있게 기도해 주세요.', time: '오후 3:24' },
    ],
  },
  {
    id: 'student-07', studentName: '윤샬롬', studentAvatar: '👧🏻',
    lastMessage: '요즘 숙제가 너무 많아서 힘들어요 ㅠㅠ',
    lastMessageTime: '어제', hasUnread: true,
    messages: [
      { id: 'm1', sender: 'student', text: '요즘 숙제가 너무 많아서 힘들어요 ㅠㅠ', time: '어제 오후 7:10' },
    ],
  },
  {
    id: 'student-10', studentName: '임찬양', studentAvatar: '🧒🏽',
    lastMessage: '선생님, 오늘 칭찬해 주셔서 감사해요!',
    lastMessageTime: '2일 전', hasUnread: false,
    messages: [
      { id: 'm1', sender: 'student', text: '선생님 저 오늘 피아노 학원 잘 다녀왔어요!', time: '2일 전 오후 5:02' },
      { id: 'm2', sender: 'teacher', text: '우와 정말 잘했어! 찬양이가 요즘 부쩍 성실해졌구나 👏', time: '2일 전 오후 5:10' },
      { id: 'm3', sender: 'student', text: '선생님, 오늘 칭찬해 주셔서 감사해요!', time: '2일 전 오후 5:12' },
    ],
  },
];

export { containsUnsafeLanguage } from '@/data/contentSafety';
