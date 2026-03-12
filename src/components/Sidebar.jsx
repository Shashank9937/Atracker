import {
  Activity,
  BookOpen,
  BookMarked,
  Brain,
  Gauge,
  Home,
  Landmark,
  Lightbulb,
  Network,
  NotebookPen,
  Radar,
  Settings,
  X,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { NAV_ITEMS } from '../utils/constants';
import { cn } from '../utils/cn';

const icons = {
  dashboard: Home,
  'daily-execution': Activity,
  'book-learning': BookMarked,
  'idea-lab': Lightbulb,
  'opportunity-radar': Radar,
  'networking-crm': Network,
  'weekly-review': Landmark,
  'decision-journal': NotebookPen,
  'knowledge-vault': BookOpen,
  'kpi-analytics': Gauge,
  settings: Settings,
};

export const Sidebar = ({ activePage, open, onNavigate, onClose }) => {
  const {
    data: { settings },
  } = useAppContext();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950/95 px-5 py-5 text-slate-100 shadow-2xl transition duration-300 lg:z-20 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-mint text-lg font-bold text-slate-950 shadow-lg shadow-brand-500/20">
              <Brain className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Founder OS</h2>
            <p className="mt-1 text-sm text-slate-400">{settings.founderName}'s operating system</p>
          </div>
          <button className="ghost-button !text-slate-300 lg:hidden" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {NAV_ITEMS.map((item) => {
            const Icon = icons[item.id];
            const active = item.id === activePage;

            return (
              <button
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition',
                  active
                    ? 'bg-gradient-to-r from-brand-500/25 to-mint/10 text-white shadow-lg shadow-brand-500/10'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white',
                )}
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.shortcut}</span>
              </button>
            );
          })}
        </nav>

        <div className="panel-card-strong mt-6 p-4 text-sm text-slate-200">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Daily Loop</p>
          <p className="mt-2 font-medium text-white">Capture fast. Review weekly. Build with conviction.</p>
          <p className="mt-2 text-xs text-slate-300">Quick capture with <span className="font-semibold text-white">Q</span> and open evening journal with <span className="font-semibold text-white">Shift+J</span>.</p>
        </div>
      </aside>
    </>
  );
};
