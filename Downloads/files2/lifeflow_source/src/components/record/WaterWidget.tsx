import { Droplet } from "lucide-react";
import { WATER_GOAL } from "./dailyLogsUtils";

interface WaterWidgetProps {
  count: number;
  onChange: (count: number) => void;
}

export default function WaterWidget({ count, onChange }: WaterWidgetProps) {
  return (
    <div className="rounded-3xl border bg-white p-5" style={{ borderColor: "var(--theme-gray)" }}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <Droplet size={18} style={{ color: "var(--theme-primary)" }} />
          수분 섭취
        </h3>
        <span className="text-sm font-semibold text-slate-500">
          {count}/{WATER_GOAL}잔
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {Array.from({ length: WATER_GOAL }).map((_, idx) => {
          const filled = idx < count;
          return (
            <button
              key={idx}
              onClick={() => onChange(filled && idx === count - 1 ? idx : idx + 1)}
              className="flex aspect-square items-center justify-center rounded-xl transition"
              style={{
                backgroundColor: filled ? "var(--theme-primary)" + "22" : "#f1f5f9",
              }}
            >
              <Droplet
                size={20}
                style={{ color: filled ? "var(--theme-primary)" : "#cbd5e1" }}
                fill={filled ? "var(--theme-primary)" : "none"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
