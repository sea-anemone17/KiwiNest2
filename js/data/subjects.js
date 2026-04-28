export const DEFAULT_SUBJECTS = [
  { id: "korean", name: "국어" },
  { id: "english", name: "영어" },
  { id: "math", name: "수학" },
  { id: "law", name: "법률" },
  { id: "geo", name: "세계지리" },
  { id: "japanese", name: "일본어" },
  { id: "info", name: "정보" },
  { id: "etc", name: "기타" },
];

export function getAllSubjects(customSubjects = []) {
  return [...DEFAULT_SUBJECTS, ...customSubjects];
}

export function getSubjectName(id, customSubjects = []) {
  return getAllSubjects(customSubjects).find((subject) => subject.id === id)?.name ?? "기타";
}
