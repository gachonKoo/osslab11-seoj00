export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  createdAt: string;
}

// 날짜별 습관 완료 기록: { "2026-07-08": { "habitId1": true, "habitId2": false } }
export type HabitLogs = Record<string, Record<string, boolean>>;

export const defaultHabits: Habit[] = [
  { id: "habit-sunscreen", title: "선크림", icon: "sun", color: "#FACC15", createdAt: new Date().toISOString() },
  { id: "habit-lotion", title: "바디로션", icon: "spray", color: "#60A5FA", createdAt: new Date().toISOString() },
  { id: "habit-parasol", title: "양산", icon: "umbrella", color: "#F472B6", createdAt: new Date().toISOString() },
  { id: "habit-supplement", title: "영양제", icon: "pill", color: "#34D399", createdAt: new Date().toISOString() },
  { id: "habit-eyecare", title: "눈운동&스트레칭", icon: "stretch", color: "#A78BFA", createdAt: new Date().toISOString() },
];
