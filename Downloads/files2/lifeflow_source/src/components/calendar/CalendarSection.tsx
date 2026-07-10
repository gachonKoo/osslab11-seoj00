import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, PartyPopper } from 'lucide-react';
import { CalendarCell } from './CalendarCell';
import { EventModal } from './EventModal';
import { DayRecord } from './CalendarTypes';
import { generateMonthDays, computeMonthAchievement } from './calendarUtils';

const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<{ [dateStr: string]: DayRecord }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const saved = localStorage.getItem('diet_calendar_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('기록 로드 실패:', e);
      }
    }
  }, []);

  const handleSaveRecord = (dateStr: string, newRecord: DayRecord) => {
    const updated = { ...records, [dateStr]: newRecord };
    setRecords(updated);
    localStorage.setItem('diet_calendar_records', JSON.stringify(updated));
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const daysArray = generateMonthDays(year, month);
  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  const monthAchievement = useMemo(
    () => computeMonthAchievement(year, month, records),
    [year, month, records]
  );

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-3xl font-bold"><CalendarDays size={28} />캘린더</h2>
        <p className="mt-2 text-slate-500">
          한 달간의 습관·식단 흐름을 스티커로 한눈에 확인해보세요.
        </p>
      </div>

      {/* 이번 달 달성 배너 */}
      <div
        className={`rounded-3xl p-5 text-white ${
          monthAchievement.isAchieved
            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
            : 'bg-gradient-to-r from-slate-400 to-slate-500'
        }`}
      >
        {monthAchievement.isAchieved ? (
          <>
            <div className="flex items-center gap-2 text-lg font-bold"><PartyPopper size={20} />이번 달 목표 달성!</div>
            <div className="mt-1 text-sm opacity-90">
              {year}년 {month + 1}월, 좋음(2·3점)인 날이{' '}
              {monthAchievement.rate}%예요. 정말 잘하셨어요!
            </div>
          </>
        ) : (
          <>
            <div className="text-lg font-bold">
              이번 달 진행률 {monthAchievement.rate}%
            </div>
            <div className="mt-1 text-sm opacity-90">
              좋음(2·3점) {monthAchievement.goodDays}일 / 경과{' '}
              {monthAchievement.elapsedDays}일 · 80% 달성 시 축하 메시지가 떠요.
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--theme-gray)" }}>
        <div style={calendarHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
            {year}년 {month + 1}월 다이어리
          </h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handlePrevMonth} style={navButtonStyle}>&lt;</button>
            <button onClick={handleToday} style={{ ...navButtonStyle, fontSize: '13px' }}>오늘</button>
            <button onClick={handleNextMonth} style={navButtonStyle}>&gt;</button>
          </div>
        </div>

        <div style={weekdayGridStyle}>
          {WEEKDAYS.map((day, idx) => (
            <div
              key={day}
              style={{
                ...weekdayCellStyle,
                color: idx === 0 ? '#ef4444' : idx === 6 ? '#3b82f6' : '#6b7280'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div style={calendarGridStyle}>
          {daysArray.map((item) => (
            <CalendarCell
              key={item.dateString}
              dateString={item.dateString}
              dayNumber={item.dayNumber}
              isCurrentMonth={item.isCurrentMonth}
              record={records[item.dateString]}
              onClick={() => {
                setSelectedDate(item.dateString);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSaveRecord={handleSaveRecord}
        initialRecord={records[selectedDate]}
      />
    </section>
  );
};

export default CalendarSection;

const calendarHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const navButtonStyle: React.CSSProperties = { padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', color: '#4b5563' };
const weekdayGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', borderBottom: '1px solid #e5e7eb', marginBottom: '4px' };
const weekdayCellStyle: React.CSSProperties = { fontSize: '13px', fontWeight: '600', padding: '8px 0' };
const calendarGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' };
