import { Utensils, Cookie, Droplet, Moon, Footprints, ClipboardCheck } from "lucide-react";
import { DayAchievement } from "../calendar/calendarUtils";

interface AchievementSummaryProps {
  achievement: DayAchievement;
}

const rows: {
  key: keyof DayAchievement["conditions"];
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "meals", label: "식사 기록", icon: Utensils },
  { key: "snack", label: "간식 관리", icon: Cookie },
  { key: "water", label: "물 6잔 이상", icon: Droplet },
  { key: "sleep", label: "수면 7시간 이상", icon: Moon },
  { key: "exercise", label: "운동 완료", icon: Footprints },
  { key: "habits", label: "습관 3개 이상", icon: ClipboardCheck },
];

export default function AchievementSummary({ achievement }: AchievementSummaryProps) {
  return (
    <div className="rounded-3xl p-5 text-white" style={{ backgroundColor: "var(--theme-dark)" }}>
      <h3 className="font-bold">오늘의 달성</h3>

      <div className="mt-4 space-y-3">
        {rows.map(({ key, label, icon: Icon }) => {
          const done = achievement.conditions[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
                style={
                  done
                    ? { backgroundColor: "var(--theme-primary)", borderColor: "var(--theme-primary)" }
                    : { borderColor: "#475569" }
                }
              >
                {done && <div className="h-2 w-2 rounded-sm bg-white" />}
              </div>
              <Icon size={15} className="text-slate-400" />
              <span className={done ? "text-white" : "text-slate-400"}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
