import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ClipboardCheck, Utensils, Cookie, ThumbsUp } from "lucide-react";

import { Meal, MealType } from "../meal/MealTypes";
import {
  addMeal,
  deleteMeal,
  getMealsByDate,
  loadMeals,
  toggleFavorite,
  updateMeal,
} from "../meal/mealUtils";
import MealCard from "../meal/MealCard";
import AddMealModal from "../meal/AddMealModal";

import { Habit } from "../habit/HabitTypes";
import {
  getDateHabitStats,
  loadHabitLogs,
  loadHabits,
  toggleHabitForDate,
  addHabit,
  deleteHabit,
  updateHabit,
} from "../habit/habitUtils";
import HabitRow from "../habit/HabitRow";
import AddHabitModal from "../habit/AddHabitModal";

import {
  loadWaterLogs,
  setWaterCount,
  loadSleepLogs,
  setSleepEntry,
  SleepEntry,
  loadExerciseLogs,
  toggleExercise,
  loadSnackStatusLogs,
  setSnackStatus,
} from "./dailyLogsUtils";
import WaterWidget from "./WaterWidget";
import SleepWidget from "./SleepWidget";
import ExerciseWidget from "./ExerciseWidget";
import AchievementSummary from "./AchievementSummary";
import { computeDayAchievement } from "../calendar/calendarUtils";
import { MEAL_ICON_MAP } from "../../utils/icons";

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`;
}

const mealMeta: { type: MealType; title: string }[] = [
  { type: "breakfast", title: "아침" },
  { type: "lunch", title: "점심" },
  { type: "dinner", title: "저녁" },
];

export default function RecordSection() {
  const [date, setDate] = useState(() => toDateStr(new Date()));

  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [defaultMealType, setDefaultMealType] = useState<MealType>("breakfast");

  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState(() => loadHabitLogs());
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [waterLogs, setWaterLogs] = useState(() => loadWaterLogs());
  const [sleepLogs, setSleepLogs] = useState(() => loadSleepLogs());
  const [exerciseLogs, setExerciseLogs] = useState(() => loadExerciseLogs());
  const [snackStatusLogs, setSnackStatusLogs] = useState(() => loadSnackStatusLogs());

  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    setMeals(loadMeals());
    setHabits(loadHabits());
    setHabitLogs(loadHabitLogs());
    setWaterLogs(loadWaterLogs());
    setSleepLogs(loadSleepLogs());
    setExerciseLogs(loadExerciseLogs());
    setSnackStatusLogs(loadSnackStatusLogs());
  }, []);

  const dayMeals = useMemo(
    () => getMealsByDate(meals, date),
    [meals, date]
  );

  const snackMeals = useMemo(
    () => dayMeals.filter((m) => m.type === "snack"),
    [dayMeals]
  );

  const ateSnack = snackMeals.length > 0;
  const snackStatus = ateSnack ? "ate" : snackStatusLogs[date];

  const habitStats = useMemo(
    () => getDateHabitStats(habits, habitLogs, date),
    [habits, habitLogs, date]
  );

  const achievement = useMemo(
    () => computeDayAchievement(date),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, meals, habits, habitLogs, waterLogs, sleepLogs, exerciseLogs, snackStatusLogs, refreshTick]
  );

  function handleMealSave(meal: Meal) {
    if (editingMeal) {
      setMeals(updateMeal(meals, meal));
    } else {
      setMeals(addMeal(meals, meal));
    }
    setEditingMeal(null);
    setMealModalOpen(false);
    setRefreshTick((t) => t + 1);
  }

  function handleMealDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    setMeals(deleteMeal(meals, id));
    setRefreshTick((t) => t + 1);
  }

  function handleMealFavorite(id: string) {
    setMeals(toggleFavorite(meals, id));
  }

  function openAddMeal(type: MealType) {
    setEditingMeal(null);
    setDefaultMealType(type);
    setMealModalOpen(true);
  }

  function handleHabitToggle(id: string) {
    setHabitLogs(toggleHabitForDate(habitLogs, date, id));
    setRefreshTick((t) => t + 1);
  }

  function handleHabitSave(habit: Habit) {
    if (editingHabit) {
      setHabits(updateHabit(habits, habit));
    } else {
      setHabits(addHabit(habits, habit));
    }
    setEditingHabit(null);
    setHabitModalOpen(false);
  }

  function handleHabitDelete(id: string) {
    if (!confirm("습관을 삭제하시겠습니까?")) return;
    setHabits(deleteHabit(habits, id));
  }

  function handleWaterChange(count: number) {
    setWaterLogs(setWaterCount(waterLogs, date, count));
    setRefreshTick((t) => t + 1);
  }

  function handleSleepChange(entry: SleepEntry) {
    setSleepLogs(setSleepEntry(sleepLogs, date, entry));
    setRefreshTick((t) => t + 1);
  }

  function handleExerciseToggle() {
    setExerciseLogs(toggleExercise(exerciseLogs, date));
    setRefreshTick((t) => t + 1);
  }

  function handleSnackResisted() {
    setSnackStatusLogs(setSnackStatus(snackStatusLogs, date, "resisted"));
    setRefreshTick((t) => t + 1);
  }

  function shiftDate(days: number) {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + days);
    setDate(toDateStr(d));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {/* 왼쪽: 기록 영역 */}
      <div className="space-y-10 lg:col-span-2">
        {/* 날짜 네비게이션 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{formatDateLabel(date)}</p>
            <h2 className="text-2xl font-bold">오늘의 기록</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftDate(-1)}
              className="rounded-xl border p-2 hover:bg-slate-100"
              style={{ borderColor: "var(--theme-gray)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setDate(toDateStr(new Date()))}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-100"
              style={{ borderColor: "var(--theme-gray)" }}
            >
              오늘
            </button>
            <button
              onClick={() => shiftDate(1)}
              className="rounded-xl border p-2 hover:bg-slate-100"
              style={{ borderColor: "var(--theme-gray)" }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* 식사 기록 */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700">
            <Utensils size={18} />
            식사 기록
          </h3>

          {mealMeta.map(({ type, title }) => {
            const list = dayMeals.filter((m) => m.type === type);
            const Icon = MEAL_ICON_MAP[type];
            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Icon size={16} />
                    {title}
                  </h4>
                  <button
                    onClick={() => openAddMeal(type)}
                    className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium transition hover:bg-slate-200"
                  >
                    <Plus size={14} /> 추가
                  </button>
                </div>

                {list.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                    기록 없음
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {list.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onEdit={(m) => {
                          setEditingMeal(m);
                          setMealModalOpen(true);
                        }}
                        onDelete={handleMealDelete}
                        onToggleFavorite={handleMealFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 간식 관리 */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700">
            <Cookie size={18} />
            간식 관리
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleSnackResisted}
              disabled={ateSnack}
              className="rounded-2xl border-2 p-5 text-center transition disabled:cursor-not-allowed disabled:opacity-40"
              style={
                snackStatus === "resisted"
                  ? { borderColor: "var(--theme-primary)", backgroundColor: "var(--theme-primary)" + "11" }
                  : { borderColor: "var(--theme-gray)" }
              }
            >
              <ThumbsUp size={22} className="mx-auto mb-2" style={{ color: "var(--theme-primary)" }} />
              <div className="font-semibold">간식 참았어요</div>
              <p className="mt-1 text-xs text-slate-400">오늘도 이겨냈어요!</p>
            </button>

            <button
              onClick={() => openAddMeal("snack")}
              className="rounded-2xl border-2 p-5 text-center transition"
              style={
                ateSnack
                  ? { borderColor: "var(--theme-primary)", backgroundColor: "var(--theme-primary)" + "11" }
                  : { borderColor: "var(--theme-gray)" }
              }
            >
              <Cookie size={22} className="mx-auto mb-2 text-slate-400" />
              <div className="font-semibold">먹었어요</div>
              <p className="mt-1 text-xs text-slate-400">뭐 먹었는지 기록</p>
            </button>
          </div>

          {ateSnack && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {snackMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onEdit={(m) => {
                    setEditingMeal(m);
                    setMealModalOpen(true);
                  }}
                  onDelete={handleMealDelete}
                  onToggleFavorite={handleMealFavorite}
                />
              ))}
            </div>
          )}
        </div>

        {/* 생활 습관 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700">
              <ClipboardCheck size={18} />
              생활 습관 ({habitStats.completed}/{habitStats.total})
            </h3>
            <button
              onClick={() => {
                setEditingHabit(null);
                setHabitModalOpen(true);
              }}
              className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              <Plus size={16} /> 습관 추가
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 py-16 text-center text-slate-400">
              등록된 습관이 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  completed={Boolean(habitLogs[date]?.[habit.id])}
                  onToggle={handleHabitToggle}
                  onEdit={(h) => {
                    setEditingHabit(h);
                    setHabitModalOpen(true);
                  }}
                  onDelete={handleHabitDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽: 위젯 */}
      <div className="space-y-6">
        <div className="rounded-3xl border bg-white p-5" style={{ borderColor: "var(--theme-gray)" }}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">오늘 달성률</span>
            <span className="font-bold" style={{ color: "var(--theme-primary)" }}>{achievement.overall}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${achievement.overall}%`, backgroundColor: "var(--theme-primary)" }}
            />
          </div>
        </div>

        <WaterWidget count={waterLogs[date] ?? 0} onChange={handleWaterChange} />

        <SleepWidget entry={sleepLogs[date]} onChange={handleSleepChange} />

        <ExerciseWidget done={Boolean(exerciseLogs[date])} onToggle={handleExerciseToggle} />

        <AchievementSummary achievement={achievement} />
      </div>

      <AddMealModal
        open={mealModalOpen}
        meal={editingMeal}
        defaultDate={date}
        defaultType={defaultMealType}
        onClose={() => {
          setMealModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleMealSave}
      />

      <AddHabitModal
        open={habitModalOpen}
        habit={editingHabit}
        onClose={() => {
          setHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleHabitSave}
      />
    </section>
  );
}
