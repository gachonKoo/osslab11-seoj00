import {
  CalendarDays,
  ClipboardCheck,
  NotebookPen,
  Settings,
} from "lucide-react";

import { MenuType } from "./MainLayout";

interface BottomNavProps {
  current: MenuType;
  onChange: (menu: MenuType) => void;
}

interface NavItem {
  key: MenuType;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { key: "record", label: "습관·기록", icon: ClipboardCheck },
  { key: "memo", label: "메모", icon: NotebookPen },
  { key: "calendar", label: "캘린더", icon: CalendarDays },
  { key: "settings", label: "설정", icon: Settings },
];

export default function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
      style={{ backgroundColor: "var(--theme-dark)" }}
    >
      <ul className="grid grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;

          return (
            <li key={item.key}>
              <button
                onClick={() => onChange(item.key)}
                className="flex w-full flex-col items-center justify-center gap-1 py-3 transition-all"
                style={{ color: active ? "var(--theme-primary)" : "#94a3b8" }}
              >
                <Icon size={22} strokeWidth={active ? 2.8 : 2} />

                <span className="text-[11px] font-medium">{item.label}</span>

                {active && (
                  <div
                    className="mt-1 h-1 w-8 rounded-full"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
