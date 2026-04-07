import {
  Activity,
  Archive,
  BookMarked,
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  Cpu,
  FlaskConical,
  Gauge,
  Home,
  Landmark,
  Layout,
  Lightbulb,
  MessageSquare,
  Network,
  NotebookPen,
  Radar,
  Rocket,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { NAV_ITEMS } from '../utils/constants';
import { cn } from '../utils/cn';

const icons = {
  'founder-inbox': Layout,
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
  'company-strategy': Target,
  'customer-research': MessageSquare,
  'revenue-engine': TrendingUp,
  'finance-runway': Gauge,
  'board-capital': Landmark,
  'projects-roadmap': Rocket,
  'inbox-automations': Sparkles,
  'ai-agents': Brain,
  'ai-learning-roadmap': Sparkles,
  'ai-agent-builder': Cpu,
  'ai-agent-architect': Layout,
  'ai-experiments': FlaskConical,
  'ai-tools-library': Archive,
  'ai-opportunities': TrendingUp,
  'ai-knowledge-notes': NotebookPen,
  'ai-analytics': ChartNoAxesCombined,
  settings: Settings,
};

export const Sidebar = ({ activePage, open, onNavigate, onClose }) => {
  const {
    data: { settings },
    founderScore,
    founderLeverage,
  } = useAppContext();

  const scoreGrade = founderScore >= 80 ? 'Elite' : founderScore >= 60 ? 'Strong' : founderScore >= 40 ? 'Building' : 'Early';
  const scoreColor = founderScore >= 70 ? 'text-emerald-400' : founderScore >= 40 ? 'text-amber-400' : 'text-rose-400';

  const sections = NAV_ITEMS.reduce((acc, item) => {
    acc[item.section] = [...(acc[item.section] || []), item];
    return acc;
  }, {});

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

        <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              <p className="mb-2 px-3 text-[11px] uppercase tracking-[0.26em] text-slate-500">{section}</p>
              <div className="space-y-2">
                {items.map((item) => {
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
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Today's Score</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-2xl font-semibold ${scoreColor}`}>{founderScore}</span>
                <span className="text-xs text-slate-500">/ 100 · {scoreGrade}</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
              <Zap className={`h-5 w-5 ${scoreColor}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Leverage: <span className="font-medium text-slate-300">{founderLeverage}</span></span>
            <span className="text-slate-600">·</span>
            <span><kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] text-slate-400">Q</kbd> capture <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] text-slate-400">J</kbd> journal</span>
          </div>
        </div>
      </aside>
    </>
  );
};
