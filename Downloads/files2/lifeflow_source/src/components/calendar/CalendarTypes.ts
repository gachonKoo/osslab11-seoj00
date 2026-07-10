export interface DayRecord {
  date: string;          // YYYY-MM-DD 형식
  note?: string;         // 특이사항 및 체중 기록 메모
  score?: 1 | 2 | 3;     // 하루 평가 점수 (1, 2, 3점)
  stickers?: string[];   // 붙인 스티커 이모지 목록
}

export interface CalendarCellProps {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  record?: DayRecord;
  onClick: () => void;
}