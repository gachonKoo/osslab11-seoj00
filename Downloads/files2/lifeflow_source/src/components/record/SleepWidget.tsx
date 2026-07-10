import { Moon } from "lucide-react";
import { SleepEntry, getSleepHours } from "./dailyLogsUtils";

interface SleepWidgetProps {
  entry?: SleepEntry;
  onChange: (entry: SleepEntry) => void;
}

export default function SleepWidget({ entry, onChange }: SleepWidgetProps) {
  const bedtime = entry?.bedtime ?? "23:00";
  const wake = entry?.wake ?? "07:00";
  const hours = getSleepHours({ bedtime, wake });
  const enough = hours >= 7;

  return (
    <div className="rounded-3xl border bg-white p-5" style={{ borderColor: "var(--theme-gray)" }}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <Moon size={18} style={{ color: "var(--theme-primary)" }} />
          수면
        </h3>
        <span className="text-sm font-semibold text-slate-500">{hours}시간</span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">취침</span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => onChange({ bedtime: e.target.value, wake })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-[var(--theme-primary)]"
            style={{ borderColor: "var(--theme-gray)" }}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">기상</span>
          <input
            type="time"
            value={wake}
            onChange={(e) => onChange({ bedtime, wake: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-[var(--theme-primary)]"
            style={{ borderColor: "var(--theme-gray)" }}
          />
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, (hours / 8) * 100)}%`,
            backgroundColor: "var(--theme-primary)",
          }}
        />
      </div>

      <p className="mt-2 text-xs" style={{ color: enough ? "var(--theme-primary)" : "#94a3b8" }}>
        {enough ? "충분한 수면이에요" : "조금 더 자면 좋겠어요"}
      </p>
    </div>
  );
}
