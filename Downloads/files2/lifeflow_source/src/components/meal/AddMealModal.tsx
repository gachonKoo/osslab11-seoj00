import { ChangeEvent, useEffect, useState } from "react";
import { Meal, MealType } from "./MealTypes";

interface AddMealModalProps {
  open: boolean;
  meal?: Meal | null;
  defaultDate?: string;
  defaultType?: MealType;
  onClose: () => void;
  onSave: (meal: Meal) => void;
}

const defaultMeal: Meal = {
  id: "",
  date: "",
  type: "breakfast",
  title: "",
  memo: "",
  calories: 0,
  favorite: false,
  image: "",
};

export default function AddMealModal({
  open,
  meal,
  defaultDate,
  defaultType,
  onClose,
  onSave,
}: AddMealModalProps) {
  const [form, setForm] = useState<Meal>(defaultMeal);

  useEffect(() => {
    if (meal) {
      setForm(meal);
    } else {
      setForm({
        ...defaultMeal,
        id: crypto.randomUUID(),
        date: defaultDate ?? new Date().toISOString().split("T")[0],
        type: defaultType ?? "breakfast",
      });
    }
  }, [meal, open, defaultDate, defaultType]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "calories"
          ? Number(value)
          : value,
    }));
  }

  function handleImage(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      alert("음식명을 입력하세요.");
      return;
    }

    onSave(form);

    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-5
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-xl
          overflow-y-auto
          rounded-3xl
          bg-white
          p-8
        "
      >
        <h2 className="mb-6 text-3xl font-bold">
          {meal ? "식단 수정" : "식단 추가"}
        </h2>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              식사 종류
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="breakfast">아침</option>
              <option value="lunch">점심</option>
              <option value="dinner">저녁</option>
              <option value="snack">간식</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              음식명
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
              placeholder="예) 닭가슴살 샐러드"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              칼로리
            </label>

            <input
              type="number"
              name="calories"
              value={form.calories}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              메모
            </label>

            <textarea
              rows={5}
              name="memo"
              value={form.memo}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
              placeholder="메모를 입력하세요."
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              사진
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </div>

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="
                h-60
                w-full
                rounded-2xl
                object-cover
              "
            />
          )}

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-slate-200
              px-6
              py-3
              font-medium
            "
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className="
              rounded-xl
              bg-green-500
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-green-600
            "
          >
            저장
          </button>

        </div>
      </div>
    </div>
  );
}