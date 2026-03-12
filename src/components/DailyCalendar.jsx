import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildMonthMatrix, formatMonthLabel, getDayNumber, isSameMonth, isToday, toDateKey, WEEKDAY_LABELS } from '../utils/date';
import { Card } from './Card';
import { cn } from '../utils/cn';

export const DailyCalendar = ({ entries, selectedDate, onSelectDate }) => {
  const selected = new Date(`${selectedDate}T00:00:00`);
  const [monthCursor, setMonthCursor] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));

  useEffect(() => {
    const next = new Date(`${selectedDate}T00:00:00`);
    setMonthCursor(new Date(next.getFullYear(), next.getMonth(), 1));
  }, [selectedDate]);

  const weeks = buildMonthMatrix(monthCursor);
  const entriesByDate = new Map(entries.map((entry) => [entry.date, entry]));

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="section-title">Calendar View</h3>
          <p className="section-copy">Select a day to load or create a daily execution entry.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="secondary-button !rounded-full !px-3" onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))} type="button">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="secondary-button !rounded-full !px-3" onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))} type="button">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium text-slate-900 dark:text-white">{formatMonthLabel(monthCursor)}</p>
        <span className="badge">{entries.length} logged days</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        {weeks.map((week) => (
          <div className="grid grid-cols-7 gap-2" key={week[0].toISOString()}>
            {week.map((date) => {
              const dateKey = toDateKey(date);
              const entry = entriesByDate.get(dateKey);
              const selectedCell = selectedDate === dateKey;

              return (
                <button
                  className={cn(
                    'relative min-h-[74px] rounded-2xl border px-3 py-2 text-left transition',
                    selectedCell
                      ? 'border-brand-400 bg-brand-500/15 shadow-soft dark:border-brand-400'
                      : 'border-slate-200/80 bg-white/65 hover:border-brand-300 hover:bg-brand-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900',
                    !isSameMonth(date, monthCursor) && 'opacity-40',
                    isToday(date) && !selectedCell && 'border-mint/60',
                  )}
                  key={dateKey}
                  onClick={() => onSelectDate(dateKey)}
                  type="button"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{getDayNumber(date)}</span>
                  {entry ? (
                    <div className="mt-3 space-y-2">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
                      <p className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">{entry.missionTasks.find((task) => task.text)?.text || 'Execution logged'}</p>
                    </div>
                  ) : (
                    <p className="mt-6 text-[11px] text-slate-400">No entry</p>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
};
