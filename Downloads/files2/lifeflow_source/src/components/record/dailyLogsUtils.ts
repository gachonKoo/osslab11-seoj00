// 물/수면/운동 등 날짜별 기록을 관리하는 유틸.
// habitUtils의 habitLogs 패턴과 동일하게 { [date]: value } 형태로 localStorage에 저장한다.

const WATER_KEY = "lifeflow_water_logs";
const SLEEP_KEY = "lifeflow_sleep_logs";
const EXERCISE_KEY = "lifeflow_exercise_logs";

export const WATER_GOAL = 8; // 잔

export interface SleepEntry {
  bedtime: string; // "23:00"
  wake: string; // "07:00"
}

export type WaterLogs = Record<string, number>;
export type SleepLogs = Record<string, SleepEntry>;
export type ExerciseLogs = Record<string, boolean>;

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- 물 ----
export function loadWaterLogs(): WaterLogs {
  return loadJSON(WATER_KEY, {});
}

export function setWaterCount(logs: WaterLogs, date: string, count: number): WaterLogs {
  const clamped = Math.max(0, Math.min(WATER_GOAL, count));
  const updated = { ...logs, [date]: clamped };
  saveJSON(WATER_KEY, updated);
  return updated;
}

// ---- 수면 ----
export function loadSleepLogs(): SleepLogs {
  return loadJSON(SLEEP_KEY, {});
}

export function setSleepEntry(logs: SleepLogs, date: string, entry: SleepEntry): SleepLogs {
  const updated = { ...logs, [date]: entry };
  saveJSON(SLEEP_KEY, updated);
  return updated;
}

export function getSleepHours(entry?: SleepEntry): number {
  if (!entry) return 0;

  const [bh, bm] = entry.bedtime.split(":").map(Number);
  const [wh, wm] = entry.wake.split(":").map(Number);

  if ([bh, bm, wh, wm].some((n) => Number.isNaN(n))) return 0;

  let bedMinutes = bh * 60 + bm;
  let wakeMinutes = wh * 60 + wm;

  if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60;

  return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10;
}

// ---- 간식 상태 (참음/먹음을 명시적으로 기록) ----
const SNACK_STATUS_KEY = "lifeflow_snack_status_logs";
export type SnackStatus = "resisted" | "ate";
export type SnackStatusLogs = Record<string, SnackStatus>;

export function loadSnackStatusLogs(): SnackStatusLogs {
  return loadJSON(SNACK_STATUS_KEY, {});
}

export function setSnackStatus(
  logs: SnackStatusLogs,
  date: string,
  status: SnackStatus
): SnackStatusLogs {
  const updated = { ...logs, [date]: status };
  saveJSON(SNACK_STATUS_KEY, updated);
  return updated;
}

// ---- 운동 ----
export function loadExerciseLogs(): ExerciseLogs {
  return loadJSON(EXERCISE_KEY, {});
}

export function toggleExercise(logs: ExerciseLogs, date: string): ExerciseLogs {
  const updated = { ...logs, [date]: !logs[date] };
  saveJSON(EXERCISE_KEY, updated);
  return updated;
}
