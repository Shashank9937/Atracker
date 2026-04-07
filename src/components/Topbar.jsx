import { CalendarDays, Menu, NotebookPen, ScanSearch, Sparkles, Zap } from 'lucide-react';
import { formatLongDate } from '../utils/date';
import { useAppContext } from '../context/AppContext';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

export const Topbar = ({ title, onMenuClick, onOpenCommandPalette, onOpenQuickCapture, onOpenJournal }) => {
  const { founderScore } = useAppContext();

  const scoreColor = founderScore >= 70
    ? 'text-emerald-600 dark:text-emerald-400'
    : founderScore >= 40
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-rose-600 dark:text-rose-400';

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/60 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="secondary-button lg:hidden" onClick={onMenuClick} type="button">
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-500">Founder OS</p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
          </div>
        </div>
        <div className="hidden items-center gap-3 xl:flex">
          <div className="badge">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatLongDate(new Date())}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 dark:border-slate-800/80 dark:bg-slate-900/80">
            <Zap className={`h-3.5 w-3.5 ${scoreColor}`} />
            <span className={`text-xs font-semibold ${scoreColor}`}>{founderScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onOpenCommandPalette}>
            <ScanSearch className="h-4 w-4" />
            Search
          </Button>
          <Button variant="secondary" onClick={onOpenQuickCapture}>
            <Sparkles className="h-4 w-4" />
            Quick Capture
          </Button>
          <Button variant="secondary" onClick={onOpenJournal}>
            <NotebookPen className="h-4 w-4" />
            Journal
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
