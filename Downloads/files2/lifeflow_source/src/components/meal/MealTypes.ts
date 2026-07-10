export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export interface Meal {
  id: string;

  date: string;

  type: MealType;

  title: string;

  memo: string;

  calories: number;

  favorite: boolean;

  image?: string;
}