import { getDateHabitStats, loadHabitLogs, loadHabits } from '../habit/habitUtils';
import { getMealsByDate, loadMeals } from '../meal/mealUtils';
import {
  loadWaterLogs,
  loadSleepLogs,
  loadExerciseLogs,
  loadSnackStatusLogs,
  getSleepHours,
  WATER_GOAL,
} from '../record/dailyLogsUtils';
import { DayRecord } from './CalendarTypes';

export interface CalendarDayItem {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
}

export const generateMonthDays = (year: number, month: number): CalendarDayItem[] => {
  const result: CalendarDayItem[] = [];
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const totalDays = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  // 1. 이전 달 빈칸 채우기
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const pMonth = month === 0 ? 11 : month - 1;
    const pYear = month === 0 ? year - 1 : year;
    result.push({
      dateString: `${pYear}-${String(pMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  // 2. 현재 달 채우기
  for (let d = 1; d <= totalDays; d++) {
    result.push({
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayNumber: d,
      isCurrentMonth: true,
    });
  }

  // 3. 다음 달 빈칸 채우기 (총 42칸 기준)
  const remainingSlots = 42 - result.length;
  for (let d = 1; d <= remainingSlots; d++) {
    const nMonth = month === 11 ? 0 : month + 1;
    const nYear = month === 11 ? year + 1 : year;
    result.push({
      dateString: `${nYear}-${String(nMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  return result;
};

// ---- 달성률 계산 (습관 + 식단 + 간식 참기 종합) ----

export interface DayAchievement {
  habitCompleted: number;
  habitTotal: number;
  habitRate: number; // 0~100
  mealsLogged: number; // 0~3 (아침/점심/저녁)
  snackResisted: boolean;
  snackManaged: boolean;
  waterCount: number;
  sleepHours: number;
  exerciseDone: boolean;
  conditions: {
    meals: boolean;
    snack: boolean;
    water: boolean;
    sleep: boolean;
    exercise: boolean;
    habits: boolean;
  };
  overall: number; // 0~100 (6개 조건 중 달성 비율)
}

// 하루의 달성 여부를 "오늘의 달성" 6개 체크리스트 기준으로 계산한다.
export function computeDayAchievement(dateStr: string): DayAchievement {
  const habits = loadHabits();
  const habitLogsData = loadHabitLogs();
  const habitStats = getDateHabitStats(habits, habitLogsData, dateStr);

  const meals = loadMeals();
  const dayMeals = getMealsByDate(meals, dateStr);

  const mealsLogged = ['breakfast', 'lunch', 'dinner'].filter((type) =>
    dayMeals.some((m) => m.type === type)
  ).length;

  const ateSnack = dayMeals.some((m) => m.type === 'snack');
  const snackStatus = loadSnackStatusLogs()[dateStr];
  const snackResisted = !ateSnack && snackStatus === 'resisted';
  const snackManaged = ateSnack || snackStatus !== undefined;

  const waterCount = loadWaterLogs()[dateStr] ?? 0;
  const sleepHours = getSleepHours(loadSleepLogs()[dateStr]);
  const exerciseDone = Boolean(loadExerciseLogs()[dateStr]);

  const conditions = {
    meals: mealsLogged >= 1,
    snack: snackManaged,
    water: waterCount >= 6,
    sleep: sleepHours >= 7,
    exercise: exerciseDone,
    habits: habitStats.completed >= Math.min(3, habitStats.total),
  };

  const trueCount = Object.values(conditions).filter(Boolean).length;
  const overall = Math.round((trueCount / 6) * 100);

  return {
    habitCompleted: habitStats.completed,
    habitTotal: habitStats.total,
    habitRate: habitStats.rate,
    mealsLogged,
    snackResisted,
    snackManaged,
    waterCount,
    sleepHours,
    exerciseDone,
    conditions,
    overall,
  };
}

export function computeMonthAchievement(
  year: number,
  month: number, // 0-indexed
  records: { [dateStr: string]: DayRecord }
) {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const elapsedDays = isCurrentMonth ? today.getDate() : lastDayOfMonth;

  let goodDays = 0;

  for (let d = 1; d <= elapsedDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const score = records[dateStr]?.score;
    if (score === 2 || score === 3) goodDays += 1;
  }

  const rate = elapsedDays === 0 ? 0 : Math.round((goodDays / elapsedDays) * 100);

  return { goodDays, elapsedDays, rate, isAchieved: rate >= 80 };
}