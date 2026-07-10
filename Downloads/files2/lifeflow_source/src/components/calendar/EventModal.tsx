import React, { useState, useEffect } from 'react';
import { X, Utensils, Cookie, Droplet, Moon, Footprints, ClipboardCheck } from 'lucide-react';
import { DayRecord } from './CalendarTypes';
import { computeDayAchievement } from './calendarUtils';
import { useTheme } from '../../context/ThemeContext';
import { STICKER_ICON_KEYS, getStickerIcon } from '../../utils/icons';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSaveRecord: (date: string, record: DayRecord) => void;
  initialRecord?: DayRecord;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSaveRecord,
  initialRecord,
}) => {
  const { settings } = useTheme();

  const [note, setNote] = useState('');
  const [score, setScore] = useState<1 | 2 | 3 | undefined>(undefined);
  const [stickers, setStickers] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialRecord) {
        setNote(initialRecord.note || '');
        setScore(initialRecord.score);
        setStickers(initialRecord.stickers || []);
      } else {
        setNote('');
        setScore(undefined);
        setStickers([]);
      }
    }
  }, [initialRecord, selectedDate, isOpen]);

  if (!isOpen) return null;

  const achievement = computeDayAchievement(selectedDate);
  const canAttachSticker = score === 2 || score === 3;

  const handleToggleSticker = (key: string) => {
    if (stickers.includes(key)) {
      setStickers(stickers.filter((s) => s !== key));
    } else {
      setStickers([...stickers, key]);
    }
  };

  const handleScoreChange = (num: 1 | 2 | 3) => {
    setScore(num);
    if (num === 1) setStickers([]); // 1점이면 스티커 부착 불가하므로 초기화
  };

  const handleSave = () => {
    onSaveRecord(selectedDate, {
      date: selectedDate,
      note,
      score,
      stickers: canAttachSticker ? stickers : [],
    });
    onClose();
  };

  const scoreColors = {
    1: settings.scoreColors.score1,
    2: settings.scoreColors.score2,
    3: settings.scoreColors.score3,
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedDate} 기록</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={20} />
          </button>
        </div>

        <div style={bodyStyle}>
          {/* 자동 계산된 달성률 */}
          <div style={achievementBoxStyle}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              이날의 달성률: {achievement.overall}%
            </div>
            <div style={achievementGridStyle}>
              <AchievementChip icon={Utensils} label={`식사 ${achievement.mealsLogged}/3`} done={achievement.conditions.meals} />
              <AchievementChip icon={Cookie} label="간식 관리" done={achievement.conditions.snack} />
              <AchievementChip icon={Droplet} label={`물 ${achievement.waterCount}잔`} done={achievement.conditions.water} />
              <AchievementChip icon={Moon} label={`수면 ${achievement.sleepHours}h`} done={achievement.conditions.sleep} />
              <AchievementChip icon={Footprints} label="운동" done={achievement.conditions.exercise} />
              <AchievementChip icon={ClipboardCheck} label={`습관 ${achievement.habitCompleted}/${achievement.habitTotal}`} done={achievement.conditions.habits} />
            </div>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>하루 평가</label>
            <div style={scoreContainerStyle}>
              {([1, 2, 3] as const).map((num) => {
                const labels = { 1: '아쉬움', 2: '보통', 3: '좋음' };
                const isSelected = score === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleScoreChange(num)}
                    style={{
                      ...scoreButtonStyle,
                      backgroundColor: isSelected ? scoreColors[num] : '#f3f4f6',
                      color: isSelected ? '#fff' : '#1f2937',
                      border: isSelected ? `1px solid ${scoreColors[num]}` : '1px solid #e5e7eb',
                    }}
                  >
                    {num}점 {labels[num]}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>
              스티커 붙이기 {!canAttachSticker && '(2점 이상일 때만 가능해요)'}
            </label>
            <div
              style={{
                ...stickerGridStyle,
                opacity: canAttachSticker ? 1 : 0.4,
                pointerEvents: canAttachSticker ? 'auto' : 'none',
              }}
            >
              {STICKER_ICON_KEYS.map((key) => {
                const StickerIcon = getStickerIcon(key);
                const isSelected = stickers.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleSticker(key)}
                    style={{
                      ...stickerButtonStyle,
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      borderColor: isSelected ? 'var(--theme-primary)' : '#e5e7eb',
                      color: isSelected ? 'var(--theme-primary)' : '#475569',
                    }}
                  >
                    <StickerIcon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>특이사항 / 비고 (체중 기록 등)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="오늘의 특이사항이나 몸무게 변화 등을 기록해보세요."
              rows={3}
              style={textareaStyle}
            />
          </div>
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>취소</button>
          <button onClick={handleSave} style={{ ...saveButtonStyle, backgroundColor: 'var(--theme-primary)' }}>저장하기</button>
        </div>
      </div>
    </div>
  );
};

function AchievementChip({
  icon: Icon,
  label,
  done,
}: {
  icon: React.ElementType;
  label: string;
  done: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: done ? '#ecfdf5' : '#f8fafc',
        color: done ? '#059669' : '#94a3b8',
      }}
    >
      <Icon size={13} />
      {label}
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const modalStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '12px', width: '90%', maxWidth: '420px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' };
const headerStyle: React.CSSProperties = { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' };
const closeButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' };
const bodyStyle: React.CSSProperties = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '70vh' };
const achievementBoxStyle: React.CSSProperties = { padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' };
const achievementGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' };
const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 600, color: '#374151' };
const scoreContainerStyle: React.CSSProperties = { display: 'flex', gap: '8px' };
const scoreButtonStyle: React.CSSProperties = { flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', outline: 'none' };
const stickerGridStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '6px' };
const stickerButtonStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 10px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' };
const footerStyle: React.CSSProperties = { padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '8px' };
const cancelButtonStyle: React.CSSProperties = { padding: '9px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '14px', color: '#4b5563' };
const saveButtonStyle: React.CSSProperties = { padding: '9px 16px', borderRadius: '6px', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: 500 };
