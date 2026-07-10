import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { UserSettings } from "../components/settings/SettingsTypes";
import {
  loadSettings,
  saveSettings,
} from "../components/settings/settingsUtils";

interface ThemeContextValue {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  setSettings: (settings: UserSettings) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<UserSettings>(() =>
    loadSettings()
  );

  useEffect(() => {
    saveSettings(settings);

    const root = document.documentElement;

    root.style.setProperty("--theme-dark", settings.themeColors.dark);
    root.style.setProperty("--theme-primary", settings.themeColors.primary);
    root.style.setProperty("--theme-gray", settings.themeColors.gray);
    root.style.setProperty("--theme-bg", settings.themeColors.background);

    root.style.setProperty("--score-1", settings.scoreColors.score1);
    root.style.setProperty("--score-2", settings.scoreColors.score2);
    root.style.setProperty("--score-3", settings.scoreColors.score3);
  }, [settings]);

  function updateSettings(partial: Partial<UserSettings>) {
    setSettingsState((prev) => ({ ...prev, ...partial }));
  }

  function setSettings(next: UserSettings) {
    setSettingsState(next);
  }

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        setSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme은 ThemeProvider 내부에서만 사용할 수 있습니다.");
  }

  return ctx;
}
