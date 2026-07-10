import { Footprints, Check } from "lucide-react";

interface ExerciseWidgetProps {
  done: boolean;
  onToggle: () => void;
}

export default function ExerciseWidget({ done, onToggle }: ExerciseWidgetProps) {
  return (
    <div className="rounded-3xl border bg-white p-5" style={{ borderColor: "var(--theme-gray)" }}>
      <h3 className="flex items-center gap-2 font-bold">
        <Footprints size={18} style={{ color: "var(--theme-primary)" }} />
        운동
      </h3>

      <button
        onClick={onToggle}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition"
        style={
          done
            ? { backgroundColor: "var(--theme-primary)", color: "#fff" }
            : { backgroundColor: "#f1f5f9", color: "#64748b" }
        }
      >
        {done ? <Check size={16} /> : null}
        {done ? "운동 완료" : "운동 기록하기"}
      </button>
    </div>
  );
}
