import { ChangeEvent } from "react";
import { Settings as SettingsIcon, Palette, Sticker, Database } from "lucide-react";

import ColorPicker from "./ColorPicker";
import ThemeColorPicker from "./ThemeColorPicker";
import DecorationEditor from "./DecorationEditor";
import { UserSettings } from "./SettingsTypes";
import {
  exportSettings,
  importSettings,
  resetSettings,
} from "./settingsUtils";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsSection() {
  const { settings, updateSettings, setSettings } = useTheme();

  function updateSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) {
    updateSettings({ [key]: value } as Partial<UserSettings>);
  }

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const imported = await importSettings(file);
      setSettings(imported);
      alert("설정을 가져왔습니다.");
    } catch {
      alert("설정을 읽을 수 없습니다.");
    }
  }

  function handleReset() {
    if (!confirm("설정을 초기화하시겠습니까?")) return;
    setSettings(resetSettings());
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-4xl font-bold">
          <SettingsIcon size={32} />
          설정
        </h1>
        <p className="mt-2 text-slate-500">
          앱의 테마와 동작을 사용자에 맞게 설정합니다.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">일반</h2>

        <div className="space-y-5">
          <SwitchItem
            title="알림"
            description="일정 및 습관 알림을 사용합니다."
            checked={settings.notifications}
            onChange={(v) => updateSetting("notifications", v)}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Palette size={22} />
          사이트 테마 색상
        </h2>

        <ThemeColorPicker
          colors={settings.themeColors}
          onChange={(themeColors) => updateSetting("themeColors", themeColors)}
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">
          하루 평가 색상
        </h2>

        <ColorPicker
          colors={settings.scoreColors}
          onChange={(scoreColors) => updateSetting("scoreColors", scoreColors)}
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
          <Sticker size={22} />
          꾸미기
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          이미지를 올려서 앱 배경을 자유롭게 꾸며보세요. 스티커를 드래그해서
          위치를 옮길 수 있어요.
        </p>

        <DecorationEditor
          decorations={settings.decorations}
          onChange={(decorations) => updateSetting("decorations", decorations)}
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Database size={22} />
          데이터
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => exportSettings(settings)}
            className="rounded-2xl px-5 py-4 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            설정 백업
          </button>

          <label
            className="cursor-pointer rounded-2xl px-5 py-4 text-center font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--theme-gray)" }}
          >
            설정 가져오기
            <input hidden type="file" accept=".json" onChange={handleImport} />
          </label>

          <button
            onClick={handleReset}
            className="rounded-2xl bg-red-500 px-5 py-4 font-semibold text-white transition hover:bg-red-600"
          >
            초기화
          </button>
        </div>
      </div>
    </section>
  );
}

interface SwitchItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SwitchItem({
  title,
  description,
  checked,
  onChange,
}: SwitchItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-5" style={{ borderColor: "var(--theme-gray)" }}>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        className="relative h-8 w-16 rounded-full transition-all"
        style={{ backgroundColor: checked ? "var(--theme-primary)" : "#cbd5e1" }}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
            checked ? "left-9" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
