import { useEffect, useState } from "react";
import { Habit } from "./HabitTypes";
import { HABIT_ICON_KEYS, getHabitIcon } from "../../utils/icons";

interface AddHabitModalProps {
  open: boolean;
  habit?: Habit | null;
  onClose: () => void;
  onSave: (habit: Habit) => void;
}

const colors = [
  "#34D399",
  "#60A5FA",
  "#FACC15",
  "#FB7185",
  "#A78BFA",
  "#F97316",
  "#06B6D4",
];

export default function AddHabitModal({
  open,
  habit,
  onClose,
  onSave,
}: AddHabitModalProps) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(HABIT_ICON_KEYS[0]);
  const [color, setColor] = useState("#34D399");

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setIcon(habit.icon);
      setColor(habit.color);
    } else {
      setTitle("");
      setIcon(HABIT_ICON_KEYS[0]);
      setColor("#34D399");
    }
  }, [habit, open]);

  function handleSave() {
    if (!title.trim()) {
      alert("습관 이름을 입력해주세요.");
      return;
    }

    onSave({
      id: habit?.id ?? crypto.randomUUID(),
      title,
      icon,
      color,
      createdAt:
        habit?.createdAt ??
        new Date().toISOString(),
    });

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
        bg-black/40
        p-5
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-3xl
          bg-white
          p-8
          shadow-xl
        "
      >
        <h2 className="text-3xl font-bold">
          {habit ? "습관 수정" : "새 습관 추가"}
        </h2>

        <div className="mt-8 space-y-6">

          <div>

            <label className="mb-2 block font-medium">
              습관 이름
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="예) 물 2L 마시기"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                p-3
                outline-none
                focus:border-green-500
              "
            />

          </div>

          <div>

            <label className="mb-3 block font-medium">
              아이콘 선택
            </label>

            <div className="grid grid-cols-6 gap-3">

              {HABIT_ICON_KEYS.map((key) => {
                const IconComp = getHabitIcon(key);
                return (
                  <button
                    key={key}
                    onClick={() => setIcon(key)}
                    className={`
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      border-2
                      p-3
                      transition

                      ${
                        icon === key
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:bg-slate-100"
                      }
                    `}
                  >
                    <IconComp size={22} />
                  </button>
                );
              })}

            </div>

          </div>

          <div>

            <label className="mb-3 block font-medium">
              색상 선택
            </label>

            <div className="flex flex-wrap gap-3">

              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`
                    h-12
                    w-12
                    rounded-full
                    border-4

                    ${
                      color === c
                        ? "border-black"
                        : "border-transparent"
                    }
                  `}
                  style={{
                    backgroundColor: c,
                  }}
                />
              ))}

            </div>

          </div>

        </div>

        <div className="mt-10 flex justify-end gap-3">

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
            onClick={handleSave}
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