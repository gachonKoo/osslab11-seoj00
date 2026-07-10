import {
  CalendarDays,
  ClipboardCheck,
  NotebookPen,
  Settings,
  Salad,
} from "lucide-react";

import { MenuType } from "./MainLayout";

interface SidebarProps {
  current: MenuType;
  onChange: (menu: MenuType) => void;
}

interface MenuItem {
  key: MenuType;
  label: string;
  icon: React.ElementType;
}

const menus: MenuItem[] = [
  { key: "record", label: "습관·기록", icon: ClipboardCheck },
  { key: "memo", label: "메모", icon: NotebookPen },
  { key: "calendar", label: "캘린더", icon: CalendarDays },
  { key: "settings", label: "설정", icon: Settings },
];

export default function Sidebar({ current, onChange }: SidebarProps) {
  return (
    <aside
      className="flex h-screen w-72 flex-col text-slate-200"
      style={{ backgroundColor: "var(--theme-dark)" }}
    >
      <div className="flex items-center gap-3 border-b border-white/10 p-8">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          <Salad size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">LifeFlow</h1>
          <p className="text-xs text-slate-400">건강한 하루를 기록하세요</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-3">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = current === menu.key;

            return (
              <li key={menu.key}>
                <button
                  onClick={() => onChange(menu.key)}
                  className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left font-medium transition-all duration-200"
                  style={
                    active
                      ? { backgroundColor: "var(--theme-primary)", color: "#fff" }
                      : { color: "#cbd5e1" }
                  }
                >
                  <Icon size={22} />
                  <span>{menu.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-6">
        <div className="rounded-2xl bg-white/5 p-5">
          <h3 className="font-semibold text-white">오늘도 화이팅</h3>
          <p className="mt-2 text-sm text-slate-400">
            작은 습관이 큰 변화를 만듭니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
