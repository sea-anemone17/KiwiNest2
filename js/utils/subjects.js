export const SUBJECTS = [
  { id: "english", name: "영어" },
  { id: "korean", name: "국어" },
  { id: "math", name: "수학" },
  { id: "law", name: "법률" },
  { id: "geography", name: "세계지리" },
  { id: "japanese", name: "일본어" },
  { id: "info", name: "정보" },
  { id: "etc", name: "기타" },
];

export function getSubjectName(subjectId) {
  return SUBJECTS.find((subject) => subject.id === subjectId)?.name ?? "기타";
}
