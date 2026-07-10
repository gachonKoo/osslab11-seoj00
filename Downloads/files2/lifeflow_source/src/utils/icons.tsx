import {
  Droplet,
  GlassWater,
  Footprints,
  Dumbbell,
  Bike,
  Pill,
  Sun,
  SprayCan,
  Umbrella,
  Eye,
  BedDouble,
  BookOpen,
  PersonStanding,
  Salad,
  Apple,
  Flower2,
  Smile,
  AlarmClock,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Flame,
  Sparkles,
  Leaf,
  Trophy,
  Star,
  Target,
  Zap,
  CheckCircle2,
  Heart,
  Waves,
  StickyNote,
  User,
  type LucideIcon,
} from "lucide-react";

// ---- 습관 아이콘 (사용자가 습관 추가 시 고를 수 있는 아이콘 목록) ----
export const HABIT_ICON_MAP: Record<string, LucideIcon> = {
  droplet: Droplet,
  glass: GlassWater,
  footprints: Footprints,
  dumbbell: Dumbbell,
  bike: Bike,
  pill: Pill,
  sun: Sun,
  spray: SprayCan,
  umbrella: Umbrella,
  eye: Eye,
  bed: BedDouble,
  book: BookOpen,
  stretch: PersonStanding,
  salad: Salad,
  apple: Apple,
  flower: Flower2,
  smile: Smile,
  alarm: AlarmClock,
};

export const HABIT_ICON_KEYS = Object.keys(HABIT_ICON_MAP);

export function getHabitIcon(key: string): LucideIcon {
  return HABIT_ICON_MAP[key] ?? Smile;
}

// ---- 식사 유형 아이콘 ----
export const MEAL_ICON_MAP: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: UtensilsCrossed,
  snack: Cookie,
};

// ---- 캘린더 성취 스티커 아이콘 ----
export const STICKER_ICON_MAP: Record<string, LucideIcon> = {
  flame: Flame,
  sparkles: Sparkles,
  leaf: Leaf,
  dumbbell: Dumbbell,
  droplet: Droplet,
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  check: CheckCircle2,
  heart: Heart,
  waves: Waves,
};

export const STICKER_ICON_KEYS = Object.keys(STICKER_ICON_MAP);

export function getStickerIcon(key: string): LucideIcon {
  return STICKER_ICON_MAP[key] ?? Star;
}

// ---- 그 외 공용 아이콘 ----
export const NoteIcon = StickyNote;
export const ProfileIcon = User;
