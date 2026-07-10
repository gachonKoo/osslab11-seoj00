import { Meal } from "./MealTypes";

const STORAGE_KEY = "lifeflow_meals";

export function loadMeals(): Meal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    return JSON.parse(data) as Meal[];
  } catch (error) {
    console.error("식단 불러오기 실패", error);
    return [];
  }
}

export function saveMeals(meals: Meal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  } catch (error) {
    console.error("식단 저장 실패", error);
  }
}

export function addMeal(meals: Meal[], meal: Meal): Meal[] {
  const updated = [...meals, meal];

  saveMeals(updated);

  return updated;
}

export function deleteMeal(meals: Meal[], id: string): Meal[] {
  const updated = meals.filter((meal) => meal.id !== id);

  saveMeals(updated);

  return updated;
}

export function updateMeal(meals: Meal[], updatedMeal: Meal): Meal[] {
  const updated = meals.map((meal) =>
    meal.id === updatedMeal.id ? updatedMeal : meal
  );

  saveMeals(updated);

  return updated;
}

export function toggleFavorite(
  meals: Meal[],
  id: string
): Meal[] {
  const updated = meals.map((meal) =>
    meal.id === id
      ? {
          ...meal,
          favorite: !meal.favorite,
        }
      : meal
  );

  saveMeals(updated);

  return updated;
}

export function getMealsByDate(
  meals: Meal[],
  date: string
): Meal[] {
  return meals.filter((meal) => meal.date === date);
}

export function getMealsByType(
  meals: Meal[],
  type: Meal["type"]
): Meal[] {
  return meals.filter((meal) => meal.type === type);
}

export function calculateCalories(
  meals: Meal[]
): number {
  return meals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );
}

export function sortMeals(meals: Meal[]): Meal[] {
  const order = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  };

  return [...meals].sort(
    (a, b) => order[a.type] - order[b.type]
  );
}