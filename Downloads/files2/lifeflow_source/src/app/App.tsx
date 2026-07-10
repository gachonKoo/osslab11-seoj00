import "../styles/index.css";

import { useState } from "react";

import MainLayout, { MenuType } from "../components/layout/MainLayout";

import RecordSection from "../components/record/RecordSection";
import MemoSection from "../components/memo/MemoSection";
import CalendarSection from "../components/calendar/CalendarSection";
import SettingsSection from "../components/settings/SettingsSection";

import { ThemeProvider } from "../context/ThemeContext";

export default function App() {
  const [currentMenu, setCurrentMenu] = useState<MenuType>("record");

  function renderPage() {
    switch (currentMenu) {
      case "record":
        return <RecordSection />;
      case "memo":
        return <MemoSection />;
      case "calendar":
        return <CalendarSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <RecordSection />;
    }
  }

  return (
    <ThemeProvider>
      <MainLayout current={currentMenu} onChange={setCurrentMenu}>
        {renderPage()}
      </MainLayout>
    </ThemeProvider>
  );
}
