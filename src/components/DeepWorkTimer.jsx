import { Pause, Play, RotateCcw, TimerReset } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';

const presets = [25, 45, 90];

const formatClock = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

export const DeepWorkTimer = ({ totalLoggedHours, onLogMinutes }) => {
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running) {
      setRemainingSeconds(durationMinutes * 60);
    }
  }, [durationMinutes, running]);

  const elapsedMinutes = useMemo(() => Math.max(0, Math.round((durationMinutes * 60 - remainingSeconds) / 60)), [durationMinutes, remainingSeconds]);
  const progress = useMemo(() => ((durationMinutes * 60 - remainingSeconds) / (durationMinutes * 60)) * 100, [durationMinutes, remainingSeconds]);

  const handleReset = () => {
    setRunning(false);
    setRemainingSeconds(durationMinutes * 60);
  };

  const handleLog = () => {
    if (elapsedMinutes <= 0) return;
    onLogMinutes(elapsedMinutes);
    handleReset();
  };

  return (
    <Card className="panel-card-strong overflow-hidden p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-200">Deep Work Timer</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{formatClock(remainingSeconds)}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Today logged: {totalLoggedHours.toFixed(1)} hours</p>
        </div>
        <div className="rounded-full border border-white/60 bg-white/70 p-3 text-brand-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-brand-200">
          <TimerReset className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/60 dark:bg-slate-900/70">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            className={`badge ${preset === durationMinutes ? '!border-brand-400 !bg-brand-500/15 !text-brand-700 dark:!text-brand-100' : ''}`}
            key={preset}
            onClick={() => {
              if (!running) setDurationMinutes(preset);
            }}
            type="button"
          >
            {preset}m
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => setRunning((current) => !current)}>
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleReset} variant="secondary">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button disabled={elapsedMinutes <= 0} onClick={handleLog} variant="secondary">
          Log {elapsedMinutes || durationMinutes}m
        </Button>
      </div>
    </Card>
  );
};
