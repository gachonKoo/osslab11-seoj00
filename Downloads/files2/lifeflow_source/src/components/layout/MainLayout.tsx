import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import DecorationLayer from "./DecorationLayer";

export type MenuType = "record" | "memo" | "calendar" | "settings";

interface Props {
  children: ReactNode;
  current: MenuType;
  onChange: (menu: MenuType) => void;
}

export default function MainLayout({
  children,
  current,
  onChange,
}: Props) {
  return (
    <div
      className="relative flex min-h-screen"
      style={{ backgroundColor: "var(--theme-bg)" }}
    >
      <DecorationLayer />

      <aside className="relative z-10 hidden lg:block">
        <Sidebar current={current} onChange={onChange} />
      </aside>

      <div className="relative z-10 flex flex-1 flex-col">
        <Header current={current} />

        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <div className="relative z-10 lg:hidden">
        <BottomNav current={current} onChange={onChange} />
      </div>
    </div>
  );
}
