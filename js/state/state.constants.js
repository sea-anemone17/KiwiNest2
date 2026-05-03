export const STORAGE_KEY = "kiwinest-alpha-state-v1";

export const CURRENT_SCHEMA_VERSION = 7;

export const DEFAULT_STATE = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  kiwi: {
    name: "위키",
    exp: 0,
    affection: 0,
    titleTickets: 0,
  },
  kiwiDex: {
    selectedVariantId: "basic",
    unlockedVariantIds: ["basic"],
    newlyUnlockedIds: [],
  },
  titles: {
    equippedTitleId: "nest_beginner",
    ownedTitleIds: ["nest_beginner"],
    recentTitleIds: [],
  },
  achievements: {
    unlockedIds: [],
    recentIds: [],
  },
  letters: {
    unlockedIds: [],
    recentIds: [],
  },
  diaries: [],
  metaSessions: [],
  calmLogs: [],
  reviewQueue: [],
  customSubjects: [],
  lastMessage: "둥지에 온 걸 환영해요.\n오늘은 무엇을 가르쳐 줄 건가요?",
};
