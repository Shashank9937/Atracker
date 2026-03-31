import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Brain,
  CalendarClock,
  Gauge,
  Lightbulb,
  Network,
  NotebookPen,
  Rocket,
  ScanSearch,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { NAV_ITEMS } from '../utils/constants';
import { buildCommandPaletteItems, filterCommandPaletteItems } from '../utils/commandPalette';
import { cn } from '../utils/cn';

const iconMap = {
  Action: Sparkles,
  Page: ArrowUpRight,
  Priority: Target,
  Project: Rocket,
  Idea: Lightbulb,
  Contact: Network,
  Book: NotebookPen,
  Decision: CalendarClock,
  Knowledge: Users,
  'AI Agent': Brain,
  'AI Opportunity': Gauge,
  'AI Note': Brain,
  Experiment: Sparkles,
  Learning: NotebookPen,
  Signal: Gauge,
  AI: Brain,
};

export const CommandPaletteModal = ({
  open,
  onClose,
  onNavigate,
  onQuickAction,
  onOpenQuickCapture,
  onOpenJournal,
  onOpenAgentModal,
}) => {
  const { data, operatingMetrics, founderScore, founderLeverage, generateFounderBriefNow } = useAppContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const items = useMemo(
    () =>
      buildCommandPaletteItems({
        data,
        navItems: NAV_ITEMS,
        operatingMetrics,
        founderScore,
        founderLeverage,
      }),
    [data, operatingMetrics, founderScore, founderLeverage],
  );

  const results = useMemo(() => filterCommandPaletteItems(items, query), [items, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setSelectedIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  const executeItem = (item) => {
    const action = item.action || {};

    if (action.type === 'navigate') onNavigate(action.page, action.anchorId);
    if (action.type === 'quick-action') onQuickAction(action.value);
    if (action.type === 'open-quick-capture') onOpenQuickCapture();
    if (action.type === 'open-journal') onOpenJournal();
    if (action.type === 'open-agent-modal') onOpenAgentModal();
    if (action.type === 'generate-brief') {
      generateFounderBriefNow(action.briefType);
      onNavigate('inbox-automations');
    }

    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((current) => (results.length ? (current + 1) % results.length : 0));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((current) => (results.length ? (current - 1 + results.length) % results.length : 0));
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (results[selectedIndex]) executeItem(results[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh]">
      <button
        aria-label="Close command palette"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/40">
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <ScanSearch className="h-5 w-5 text-brand-300" />
          <input
            className="w-full bg-transparent text-base text-white placeholder:text-slate-500 outline-none"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, projects, books, contacts, AI systems, or run a founder action..."
            ref={inputRef}
            value={query}
          />
          <div className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 sm:block">Enter to open</div>
          <button className="ghost-button !text-slate-300" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-3 py-3">
          {results.length ? (
            <div className="space-y-2">
              {results.map((item, index) => {
                const Icon = iconMap[item.category] || ArrowUpRight;
                const selected = index === selectedIndex;

                return (
                  <button
                    className={cn(
                      'flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition',
                      selected
                        ? 'border-brand-400 bg-brand-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-700 hover:bg-slate-900',
                    )}
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    type="button"
                  >
                    <div className="mt-0.5 rounded-2xl bg-slate-800/90 p-2">
                      <Icon className="h-4 w-4 text-brand-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{item.title}</p>
                        <span className="badge">{item.category}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 text-slate-500" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/70 px-6 py-12 text-center">
              <p className="text-base font-medium text-white">No matches found</p>
              <p className="mt-2 text-sm text-slate-400">Try a page name, project title, contact, book, or an action like “daily brief” or “new project”.</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
          <span className="mr-4">`Ctrl/Cmd+K` or `/` to open</span>
          <span className="mr-4">Arrow keys to move</span>
          <span>`Enter` to run</span>
        </div>
      </div>
    </div>
  );
};
