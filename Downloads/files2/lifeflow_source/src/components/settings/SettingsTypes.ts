export interface ScoreColors {
  score1: string; // 1점(아쉬움) 색상
  score2: string; // 2점(보통) 색상
  score3: string; // 3점(좋음) 색상
}

// 사이트 전체 테마 색상 (사이드바/포인트/보조/배경)
export interface ThemeColors {
  dark: string;       // 사이드바 등 어두운 영역
  primary: string;    // 포인트(강조) 색상
  gray: string;       // 보조 텍스트/테두리 색상
  background: string; // 페이지 배경 색상
}

export interface Decoration {
  id: string;
  image: string; // base64 data URL
  x: number; // 0~100 (%)
  y: number; // 0~100 (%)
  size: number; // px
  rotate: number; // deg
}

export interface UserSettings {
  notifications: boolean;

  scoreColors: ScoreColors;

  themeColors: ThemeColors;

  decorations: Decoration[];
}

export const defaultSettings: UserSettings = {
  notifications: false,

  scoreColors: {
    score1: "#EF4444",
    score2: "#EAB308",
    score3: "#22C55E",
  },

  themeColors: {
    dark: "#0F172A",
    primary: "#3B82F6",
    gray: "#64748B",
    background: "#F8FAFC",
  },

  decorations: [],
};
