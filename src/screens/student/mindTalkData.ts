export type MessageSender = 'teacher' | 'student';

export interface MindTalkMessage {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
}

// Supabase 연결 전에도 1:1 대화 화면을 바로 확인할 수 있는 예시 메시지입니다.
export const MOCK_MIND_TALK_MESSAGES: MindTalkMessage[] = [
  {
    id: 'teacher-1',
    sender: 'teacher',
    text: '하늘아, 오늘 하루는 어땠니? 속상한 일이나 기도제목이 있으면 언제든 편하게 말해주렴 🌸',
    time: '오후 3:20',
  },
  {
    id: 'student-1',
    sender: 'student',
    text: '친구랑 조금 다퉈서 마음이 속상해요. 내일은 먼저 미안하다고 말할 수 있게 기도해 주세요.',
    time: '오후 3:24',
  },
];

export { containsUnsafeLanguage } from '@/data/contentSafety';
