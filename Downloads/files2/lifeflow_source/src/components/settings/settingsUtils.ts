import {
  UserSettings,
  defaultSettings,
} from "./SettingsTypes";

const STORAGE_KEY = "lifeflow_settings";

export function loadSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      saveSettings(defaultSettings);
      return defaultSettings;
    }

    const parsed = JSON.parse(data);

    // 이전 버전 저장값과 안전하게 병합한다.
    const merged: UserSettings = {
      ...defaultSettings,
      ...parsed,
      scoreColors: {
        ...defaultSettings.scoreColors,
        ...(parsed?.scoreColors ?? {}),
      },
      themeColors: {
        ...defaultSettings.themeColors,
        ...(parsed?.themeColors ?? {}),
      },
      decorations: Array.isArray(parsed?.decorations)
        ? parsed.decorations.filter((d: any) => typeof d?.image === "string")
        : defaultSettings.decorations,
    };

    return merged;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(
  settings: UserSettings
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );
}

export function resetSettings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(defaultSettings)
  );

  return defaultSettings;
}

export function exportSettings(
  settings: UserSettings
) {
  const blob = new Blob(
    [JSON.stringify(settings, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "lifeflow-settings.json";

  link.click();

  URL.revokeObjectURL(url);
}

export function importSettings(
  file: File
): Promise<UserSettings> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(
          JSON.parse(
            reader.result as string
          )
        );
      } catch {
        reject();
      }
    };

    reader.readAsText(file);
  });
}
