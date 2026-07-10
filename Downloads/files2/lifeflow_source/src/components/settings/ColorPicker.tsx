import { ScoreColors } from "./SettingsTypes";

interface ColorPickerProps {
  colors: ScoreColors;
  onChange: (colors: ScoreColors) => void;
}

export default function ColorPicker({
  colors,
  onChange,
}: ColorPickerProps) {
  function changeColor(key: keyof ScoreColors, value: string) {
    onChange({
      ...colors,
      [key]: value,
    });
  }

  return (
    <div className="space-y-6">
      <ColorItem
        title="1점 (아쉬움) 색상"
        description="하루 평가에서 1점을 줬을 때 캘린더에 표시될 색상"
        value={colors.score1}
        onChange={(value) => changeColor("score1", value)}
      />

      <ColorItem
        title="2점 (보통) 색상"
        description="하루 평가에서 2점을 줬을 때 캘린더에 표시될 색상"
        value={colors.score2}
        onChange={(value) => changeColor("score2", value)}
      />

      <ColorItem
        title="3점 (좋음) 색상"
        description="하루 평가에서 3점을 줬을 때 캘린더에 표시될 색상"
        value={colors.score3}
        onChange={(value) => changeColor("score3", value)}
      />

      <div className="rounded-3xl border p-6" style={{ borderColor: "var(--theme-gray)" }}>
        <h3 className="mb-5 text-xl font-bold">미리보기</h3>

        <div className="flex flex-wrap gap-4">
          <button
            className="rounded-2xl px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: colors.score1 }}
          >
            1점
          </button>

          <button
            className="rounded-2xl px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: colors.score2 }}
          >
            2점
          </button>

          <button
            className="rounded-2xl px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: colors.score3 }}
          >
            3점
          </button>
        </div>
      </div>
    </div>
  );
}

interface ColorItemProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorItem({
  title,
  description,
  value,
  onChange,
}: ColorItemProps) {
  return (
    <div className="rounded-3xl border p-6" style={{ borderColor: "var(--theme-gray)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-12 cursor-pointer border-0 bg-transparent"
          />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 rounded-xl border p-2 font-mono"
          />
        </div>
      </div>
    </div>
  );
}
