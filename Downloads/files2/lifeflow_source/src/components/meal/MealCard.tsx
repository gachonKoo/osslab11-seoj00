import { Heart, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { Meal } from "./MealTypes";
import { MEAL_ICON_MAP } from "../../utils/icons";

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const mealNames: Record<Meal["type"], string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식",
};

export default function MealCard({
  meal,
  onEdit,
  onDelete,
  onToggleFavorite,
}: MealCardProps) {
  const MealIcon = MEAL_ICON_MAP[meal.type];

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {meal.image ? (
        <img
          src={meal.image}
          alt={meal.title}
          className="h-52 w-full object-cover"
        />
      ) : (
        <div
          className="
            flex
            h-52
            items-center
            justify-center
            bg-slate-100
            text-slate-300
          "
        >
          <UtensilsCrossed size={48} />
        </div>
      )}

      <div className="p-6">

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MealIcon size={15} />
              {mealNames[meal.type]}
            </div>

            <h3 className="mt-2 text-2xl font-bold">
              {meal.title}
            </h3>

          </div>

          <button
            onClick={() => onToggleFavorite(meal.id)}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-pink-100
            "
          >
            <Heart
              size={22}
              className={
                meal.favorite
                  ? "fill-pink-500 text-pink-500"
                  : "text-slate-400"
              }
            />
          </button>

        </div>

        <div className="mt-5">

          <p className="text-sm text-slate-500">
            메모
          </p>

          <p className="mt-1 whitespace-pre-wrap">
            {meal.memo || "작성된 메모가 없습니다."}
          </p>

        </div>

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
          "
        >
          <div>

            <div className="text-sm text-slate-500">
              칼로리
            </div>

            <div className="text-xl font-bold text-orange-500">
              {meal.calories.toLocaleString()} kcal
            </div>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(meal)}
              className="
                rounded-xl
                bg-slate-100
                p-3
                transition
                hover:bg-slate-200
              "
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => onDelete(meal.id)}
              className="
                rounded-xl
                bg-red-100
                p-3
                text-red-600
                transition
                hover:bg-red-200
              "
            >
              <Trash2 size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}