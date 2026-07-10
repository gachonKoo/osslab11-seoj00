import {
  Bell,
  Search,
  User,
} from "lucide-react";

import { MenuType } from "./MainLayout";

interface HeaderProps {
  current: MenuType;
}

const pageTitle: Record<MenuType, string> = {
  record: "습관·기록",
  memo: "메모",
  calendar: "캘린더",
  settings: "설정",
};

export default function Header({
  current,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur"
      style={{ borderColor: "var(--theme-gray)" }}
    >
      <div className="flex items-center justify-between gap-6 px-4 py-4 md:px-6 lg:px-8">
        {/* 제목 */}

        <div>
          <h1 className="text-3xl font-bold">
            {pageTitle[current]}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {new Date().toLocaleDateString(
              "ko-KR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              }
            )}
          </p>
        </div>

        {/* 우측 메뉴 */}

        <div className="flex items-center gap-3">
          {/* 검색 */}

          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="검색..."
              className="w-64 rounded-2xl border py-3 pl-11 pr-4 outline-none transition focus:border-[var(--theme-primary)]"
              style={{ borderColor: "var(--theme-gray)" }}
            />
          </div>

          {/* 알림 */}

          <button
            className="relative rounded-2xl border p-3 transition hover:bg-slate-100"
            style={{ borderColor: "var(--theme-gray)" }}
          >
            <Bell size={22} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          {/* 프로필 */}

          <button
            className="flex h-12 w-12 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            <User size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
