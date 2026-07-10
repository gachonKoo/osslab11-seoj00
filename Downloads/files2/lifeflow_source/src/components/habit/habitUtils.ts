import { Habit, HabitLogs, defaultHabits } from "./HabitTypes";

const HABITS_KEY = "lifeflow_habits_v2";
const LOGS_KEY = "lifeflow_habit_logs";

export function loadHabits(): Habit[] {
  try {
    const data = localStorage.getItem(HABITS_KEY);

    if (!data) {
      saveHabits(defaultHabits);
      return defaultHabits;
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultHabits;
    }

    return parsed;
  } catch {
    return defaultHabits;
  }
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function addHabit(habits: Habit[], habit: Habit) {
  const updated = [...habits, habit];
  saveHabits(updated);
  return updated;
}

export function updateHabit(habits: Habit[], habit: Habit) {
  const updated = habits.map((h) => (h.id === habit.id ? habit : h));
  saveHabits(updated);
  return updated;
}

export function deleteHabit(habits: Habit[], id: string) {
  const updated = habits.filter((h) => h.id !== id);
  saveHabits(updated);
  return updated;
}

export function loadHabitLogs(): HabitLogs {
  try {
    const data = localStorage.getItem(LOGS_KEY);

    if (!data) return {};

    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveHabitLogs(logs: HabitLogs) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function toggleHabitForDate(
  logs: HabitLogs,
  date: string,
  habitId: string
): HabitLogs {
  const dayLog = { ...(logs[date] ?? {}) };

  dayLog[habitId] = !dayLog[habitId];

  const updated = { ...logs, [date]: dayLog };

  saveHabitLogs(updated);

  return updated;
}

export function getCompletionForDate(
  logs: HabitLogs,
  date: string,
  habitId: string
): boolean {
  return Boolean(logs[date]?.[habitId]);
}

export function getDateHabitStats(
  habits: Habit[],
  logs: HabitLogs,
  date: string
) {
  const dayLog = logs[date] ?? {};

  const total = habits.length;

  const completed = habits.filter((h) => Boolean(dayLog[h.id])).length;

  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, rate };
}

// 특정 습관의 "오늘까지 연속 달성일수"를 계산한다.
export function getStreak(
  logs: HabitLogs,
  habitId: string,
  today: string = new Date().toISOString().split("T")[0]
): number {
  let streak = 0;
  let cursor = new Date(today);

  // 오늘 완료 안 했으면 어제부터 거슬러 올라가며 계산(오늘은 아직 진행중일 수 있으므로 0일이 아니라 어제 기준까지 인정)
  const todayStr = cursor.toISOString().split("T")[0];

  if (!logs[todayStr]?.[habitId]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const dateStr = cursor.toISOString().split("T")[0];

    if (logs[dateStr]?.[habitId]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
