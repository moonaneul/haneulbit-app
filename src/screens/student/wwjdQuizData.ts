export interface QuizChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface WwjdQuiz {
  situation: string;
  situationChoices: QuizChoice[];
  versePrompt: string;
  verseChoices: QuizChoice[];
  completion: {
    title: string;
    message: string;
    emoji: string;
  };
}

// Supabase 연동 전에도 두 단계 퀴즈를 바로 체험할 수 있는 오늘의 Mock 문제입니다.
export const TODAY_WWJD_QUIZ: WwjdQuiz = {
  situation: '학교에서 친구가 나에게 속상한 장난을 쳤어요. 나는 어떻게 할까요?',
  situationChoices: [
    { id: 'forgive', text: '친구의 이야기를 듣고 용서해 줘요 🤝', isCorrect: true },
    { id: 'revenge', text: '나도 똑같이 장난쳐서 갚아 줘요 😤', isCorrect: false },
  ],
  versePrompt: '정답이에요! 그렇다면 용서하라는 지침이 담긴 오늘의 성경 구절은 무엇일까요?',
  verseChoices: [
    {
      id: 'colossians',
      text: '골로새서 3:13\n“서로 용납하여 피차 용서하되…”',
      isCorrect: true,
    },
    {
      id: 'psalms',
      text: '시편 150:6\n“호흡이 있는 자마다 여호와를 찬양할지어다”',
      isCorrect: false,
    },
    {
      id: 'genesis',
      text: '창세기 1:1\n“태초에 하나님이 천지를 창조하시니라”',
      isCorrect: false,
    },
  ],
  completion: {
    title: '정답이에요! +10 달란트 🪙',
    message: '친구를 용서하고 사랑으로 품어 주는\n예수님을 닮은 아이가 되어요! 💛',
    emoji: '🛡️',
  },
};
