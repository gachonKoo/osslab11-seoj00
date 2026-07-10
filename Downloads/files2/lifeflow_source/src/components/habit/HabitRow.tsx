import { Check, Pencil, Trash2 } from "lucide-react";
import { Habit } from "./HabitTypes";
import { getHabitIcon } from "../../utils/icons";

interface HabitRowProps {
  habit: Habit;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitRow({
  habit,
  completed,
  onToggle,
  onEdit,
  onDelete,
}: HabitRowProps) {
  const Icon = getHabitIcon(habit.icon);

  return (
    <div className="group flex items-center gap-4 rounded-2xl border bg-white p-4" style={{ borderColor: "var(--theme-gray)" }}>
      <button
        onClick={() => onToggle(habit.id)}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
          completed ? "text-white" : "text-transparent"
        }`}
        style={completed ? { backgroundColor: habit.color, borderColor: habit.color } : { borderColor: "#cbd5e1" }}
      >
        <Check size={16} />
      </button>

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: habit.color + "22" }}
      >
        <Icon size={18} style={{ color: habit.color }} />
      </div>

      <span className={`flex-1 font-medium ${completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
        {habit.title}
      </span>

      {completed && (
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          완료
        </span>
      )}

      <div className="hidden gap-1 group-hover:flex">
        <button onClick={() => onEdit(habit)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(habit.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-100 hover:text-red-500">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
