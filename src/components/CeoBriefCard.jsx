import { CalendarClock, Gauge, Sparkles } from 'lucide-react';
import { formatShortDate } from '../utils/date';

export const CeoBriefCard = ({ brief, compact = false }) => {
  if (!brief) return null;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{brief.type}</span>
            <span className="badge">{brief.periodKey}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{brief.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{brief.summary}</p>
        </div>
        <div className="text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            {formatShortDate(brief.generatedAt)}
          </div>
        </div>
      </div>

      <div className={`mt-5 grid gap-4 ${compact ? 'lg:grid-cols-2' : 'xl:grid-cols-3'}`}>
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-brand-500" />
            Top Priorities
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {brief.topPriorities.length ? brief.topPriorities.map((item, index) => <p key={`${brief.id}-priority-${index}`}>{item}</p>) : <p>No priorities generated.</p>}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
            <Gauge className="h-4 w-4 text-brand-500" />
            Watchouts
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {brief.watchouts.length ? brief.watchouts.map((item, index) => <p key={`${brief.id}-watchout-${index}`}>{item}</p>) : <p>No major watchouts flagged.</p>}
          </div>
        </div>
        {!compact ? (
          <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
              <Gauge className="h-4 w-4 text-brand-500" />
              Metrics
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {brief.metrics.length ? brief.metrics.map((metric) => <p key={`${brief.id}-${metric.label}`}><span className="font-medium text-slate-900 dark:text-white">{metric.label}:</span> {metric.value}</p>) : <p>No metrics captured.</p>}
            </div>
          </div>
        ) : null}
      </div>

      {!compact && brief.wins.length ? (
        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-sm font-medium text-slate-900 dark:text-white">Wins</p>
          <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {brief.wins.map((item, index) => <p key={`${brief.id}-win-${index}`}>{item}</p>)}
          </div>
        </div>
      ) : null}
    </div>
  );
};
