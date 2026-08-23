// 친구의 QT 나눔이나 상태메시지에 텍스트 댓글 대신 남길 수 있는 응원 스티커입니다.
export const REACTION_OPTIONS = [
  { key: 'pray', label: '기도할게 🙏' },
  { key: 'amen', label: '아멘 🤍' },
  { key: 'great', label: '멋져요 👍' },
] as const;

export type ReactionKey = (typeof REACTION_OPTIONS)[number]['key'];
