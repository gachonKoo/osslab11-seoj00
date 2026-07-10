import React from 'react';
import { StickyNote } from 'lucide-react';
import { CalendarCellProps } from './CalendarTypes';
import { getStickerIcon } from '../../utils/icons';

const scoreVar: Record<number, string> = {
  1: 'var(--score-1)',
  2: 'var(--score-2)',
  3: 'var(--score-3)',
};

export const CalendarCell: React.FC<CalendarCellProps> = ({
  dayNumber,
  isCurrentMonth,
  record,
  onClick,
}) => {
  const scoreColor = record?.score ? scoreVar[record.score] : undefined;

  return (
    <div
      onClick={onClick}
      style={{
        ...cellStyle,
        backgroundColor: scoreColor ? `${scoreColor}1a` : '#ffffff',
        borderColor: scoreColor ?? '#e5e7eb',
        opacity: isCurrentMonth ? 1 : 0.35,
      }}
    >
      <div style={dayNumberStyle}>{dayNumber}</div>

      <div style={stickerContainerStyle}>
        {record?.stickers?.map((key, idx) => {
          const Icon = getStickerIcon(key);
          return <Icon key={idx} size={13} style={{ color: scoreColor ?? '#475569' }} />;
        })}
      </div>

      {record?.note ? (
        <div style={noteSummaryStyle} title={record.note}>
          <StickyNote size={11} />
          {record.note}
        </div>
      ) : (
        <div style={{ height: '16px' }} />
      )}
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  border: '2px solid #e5e7eb',
  minHeight: '90px',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  transition: 'background-color 0.2s',
  borderRadius: '10px',
};

const dayNumberStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  alignSelf: 'flex-start',
};

const stickerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3px',
  margin: '4px 0',
  flexGrow: 1,
  alignContent: 'flex-start',
};

const noteSummaryStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  fontSize: '11px',
  color: '#4b5563',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  padding: '2px 4px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  border: '1px solid #f3f4f6',
};
