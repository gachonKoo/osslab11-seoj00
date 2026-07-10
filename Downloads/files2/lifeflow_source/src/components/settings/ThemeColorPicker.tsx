import { ThemeColors } from "./SettingsTypes";
import { ColorItem } from "./ColorPicker";

interface ThemeColorPickerProps {
  colors: ThemeColors;
  onChange: (colors: ThemeColors) => void;
}

export default function ThemeColorPicker({
  colors,
  onChange,
}: ThemeColorPickerProps) {
  function changeColor(key: keyof ThemeColors, value: string) {
    onChange({
      ...colors,
      [key]: value,
    });
  }

  return (
    <div className="space-y-6">
      <ColorItem
        title="사이드바 색상"
        description="좌측 사이드바 및 하단 내비게이션의 배경 색상"
        value={colors.dark}
        onChange={(value) => changeColor("dark", value)}
      />

      <ColorItem
        title="포인트 색상"
        description="버튼, 선택된 메뉴, 진행률 등 강조에 쓰이는 색상"
        value={colors.primary}
        onChange={(value) => changeColor("primary", value)}
      />

      <ColorItem
        title="보조 색상"
        description="테두리, 보조 텍스트 등에 쓰이는 색상"
        value={colors.gray}
        onChange={(value) => changeColor("gray", value)}
      />

      <ColorItem
        title="배경 색상"
        description="페이지 전체 배경 색상"
        value={colors.background}
        onChange={(value) => changeColor("background", value)}
      />
    </div>
  );
}
