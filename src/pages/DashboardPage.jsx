import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  Dumbbell,
  Gauge,
  HeartPulse,
  Landmark,
  Lightbulb,
  NotebookPen,
  Plus,
  Target,
  TrendingUp,
  UserPlus,
  Zap,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { countCompletedTasks, countDefinedTasks, getFounderScoreBreakdown } from '../utils/metrics';
import { formatShortDate, formatTimeAgo } from '../utils/date';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DeepWorkTimer } from '../components/DeepWorkTimer';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const scorePalette = {
  deepWork: 'from-brand-500 to-brand-300',
  execution: 'from-mint to-brand-400',
  learning: 'from-sunrise to-brand-400',
  health: 'from-emerald-500 to-mint',
  networking: 'from-sky-500 to-indigo-400',
};

export const DashboardPage = ({ onQuickAction, onOpenQuickCapture, onOpenJournal }) => {
  const {
    data,
    todayEntry,
    founderScore,
    founderLeverage,
    aiStats,
    operatingMetrics,
    activeIdea,
    currentBook,
    learningStreak,
    latestInsights,
    weeklyProgress,
    upcomingFollowUps,
    thisWeekSnapshot,
    saveDailyEntry,
    patchTodayEntry,
    addDeepWorkMinutes,
    addQuickCapture,
  } = useAppContext();
  const [noteText, setNoteText] = useState('');

  const breakdown = useMemo(() => getFounderScoreBreakdown(todayEntry), [todayEntry]);
  const definedTasks = countDefinedTasks(todayEntry);
  const completedTasks = countCompletedTasks(todayEntry);
  const recentCaptures = data.quickNotes.slice(0, 4);

  const handleTaskToggle = (taskId) => {
    saveDailyEntry({
      ...todayEntry,
      missionTasks: todayEntry.missionTasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    });
  };

  const handleQuickNote = (event) => {
    event.preventDefault();
    if (!noteText.trim()) return;
    addQuickCapture({ type: 'Note', text: noteText });
    setNoteText('');
  };

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Button onClick={onOpenQuickCapture} variant="secondary">
              <Zap className="h-4 w-4" />
              Quick Capture
            </Button>
            <Button onClick={onOpenJournal} variant="secondary">
              <NotebookPen className="h-4 w-4" />
              Evening Journal
            </Button>
          </>
        }
        description="Your founder command center for execution, learning, reading, health, and network momentum."
        title="Dashboard"
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr_1fr]">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Today's Top 3 Tasks</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Execution before everything else</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{completedTasks}/{definedTasks || 3} mission tasks completed today.</p>
            </div>
            <span className="badge">Founder Score {founderScore}</span>
          </div>
          <div className="mt-6 space-y-3">
            {todayEntry.missionTasks.map((task, index) => (
              <label
                className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-4 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-950/50"
                key={task.id}
              >
                <input
                  checked={task.done}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
                  onChange={() => handleTaskToggle(task.id)}
                  type="checkbox"
                />
                <div>
                  <p className={`text-sm font-medium ${task.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                    {task.text || `Mission task ${index + 1}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Keep the list short and unambiguous.</p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <button className="secondary-button justify-start" onClick={() => onQuickAction('idea')} type="button">
              <Lightbulb className="h-4 w-4" />
              Add Idea
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('work')} type="button">
              <Activity className="h-4 w-4" />
              Log Work
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('journal')} type="button">
              <NotebookPen className="h-4 w-4" />
              Journal Entry
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('contact')} type="button">
              <UserPlus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Founder Score</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-5xl font-semibold text-slate-900 dark:text-white">{founderScore}</span>
            <span className="mb-2 text-sm text-slate-500 dark:text-slate-400">/100 today</span>
          </div>
          <div className="mt-6 space-y-4">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-600 dark:text-slate-300">{key}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                  <div className={`h-full rounded-full bg-gradient-to-r ${scorePalette[key]}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">AI Leverage Progress</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Founder leverage engine</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track how AI learning, agents, experiments, and opportunity selection increase output.</p>
            </div>
            <Gauge className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Founder Leverage</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{founderLeverage}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Agents Designed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.agentsDesigned}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experiments Run</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.experimentsRun}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Topics Learned</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.aiTopicsLearned}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {aiStats.topHighLeverageOpportunities.map((opportunity) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={opportunity.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900 dark:text-white">{opportunity.process}</p>
                  <span className="badge">{opportunity.leverageScore}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{opportunity.industry}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button className="secondary-button justify-start" onClick={() => onQuickAction('agent')} type="button">
              New Agent
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('ai-opportunity')} type="button">
              New Opportunity
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('ai-experiment')} type="button">
              Run Experiment
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Unicorn Control Tower</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Company signal in one scan</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Strategy, PMF, GTM, runway, and capital readiness now sit inside the same operating system.</p>
            </div>
            <Target className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Founder Scale Score</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.founderScaleScore}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Runway</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.financeStats.runwayMonths} mo</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weighted Pipeline</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">${Math.round(operatingMetrics.revenueStats.weightedPipeline / 1000)}k</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strong PMF Signals</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.strongSignals}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                Revenue Focus
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {operatingMetrics.revenueStats.topDeals[0]?.accountName
                  ? `${operatingMetrics.revenueStats.topDeals[0].accountName} is the highest-weighted open opportunity.`
                  : 'No top revenue opportunity logged yet.'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                <Landmark className="h-4 w-4 text-brand-500" />
                Capital Focus
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {operatingMetrics.boardStats.upcomingItems[0]?.title
                  ? `${operatingMetrics.boardStats.upcomingItems[0].title} is the next board or investor moment on deck.`
                  : 'No upcoming board or capital item logged yet.'}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button className="secondary-button justify-start" onClick={() => onQuickAction('strategy')} type="button">
              Company Strategy
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('research')} type="button">
              Customer Research
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('finance')} type="button">
              Finance & Runway
            </button>
          </div>
        </Card>

        <DeepWorkTimer onLogMinutes={addDeepWorkMinutes} totalLoggedHours={Number(todayEntry.deepWorkHours || 0)} />

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Current Book Being Read</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{currentBook?.bookTitle || 'No active book yet'}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{currentBook ? `${currentBook.author} • ${currentBook.category}` : 'Use Book Learning to capture your current reading loop.'}</p>
            </div>
            <BookMarked className="h-5 w-5 text-brand-500" />
          </div>
          {currentBook ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pages Read Today</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{todayEntry.pagesRead || 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading Minutes</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{todayEntry.readingMinutes || 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning Streak</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{learningStreak}d</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Book Insight of the Day</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{todayEntry.bookInsightOfDay || currentBook.businessInsights || currentBook.keyLessons}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState copy="Add a book, mark it as Reading, and your active learning system will appear here." title="No current book" />
            </div>
          )}
          <div className="mt-5">
            <button className="secondary-button w-full justify-center" onClick={() => onQuickAction('book')} type="button">
              <ArrowUpRight className="h-4 w-4" />
              Open Book Learning
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Startup Idea Currently Exploring</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{activeIdea?.ideaName || 'No active idea yet'}</h3>
            </div>
            {activeIdea ? <span className="badge">{activeIdea.status}</span> : null}
          </div>
          {activeIdea ? (
            <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>{activeIdea.problem}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Target Customer</p>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">{activeIdea.targetCustomer}</p>
                </div>
                <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Experiment</p>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">{activeIdea.nextExperiment}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState copy="Start capturing ideas and the strongest one will surface here." title="No active idea" />
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Today's Health Tracker</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Protect the energy engine</h3>
            </div>
            <HeartPulse className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/70 px-4 py-3 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <Dumbbell className="h-4 w-4 text-mint" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Exercise</span>
              </div>
              <button className={todayEntry.exercise ? 'primary-button !py-2' : 'secondary-button !py-2'} onClick={() => patchTodayEntry({ exercise: !todayEntry.exercise })} type="button">
                {todayEntry.exercise ? 'Logged' : 'Mark done'}
              </button>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Smoking Count</span>
                <span className="font-medium text-slate-900 dark:text-white">{todayEntry.smokingCount}</span>
              </div>
              <div className="flex gap-2">
                <button className="secondary-button !rounded-full !px-3" onClick={() => patchTodayEntry({ smokingCount: Math.max(0, todayEntry.smokingCount - 1) })} type="button">
                  -
                </button>
                <button className="secondary-button !rounded-full !px-3" onClick={() => patchTodayEntry({ smokingCount: todayEntry.smokingCount + 1 })} type="button">
                  +
                </button>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Energy Level</span>
                <span className="font-medium text-slate-900 dark:text-white">{todayEntry.energyLevel}/10</span>
              </div>
              <input
                className="range-input w-full"
                max="10"
                min="1"
                onChange={(event) => patchTodayEntry({ energyLevel: Number(event.target.value) })}
                type="range"
                value={todayEntry.energyLevel}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Quick Notes Capture</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Keep the signal moving</h3>
            </div>
            <Button onClick={onOpenQuickCapture} variant="secondary">
              <Plus className="h-4 w-4" />
              Open Modal
            </Button>
          </div>
          <form className="mt-5 flex flex-col gap-3 lg:flex-row" onSubmit={handleQuickNote}>
            <input
              className="input-control flex-1"
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Capture an idea, follow-up, insight, or a sharp question..."
              value={noteText}
            />
            <Button type="submit">Save Note</Button>
          </form>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {recentCaptures.map((note) => (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={note.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{note.type}</span>
                  <span className="text-xs text-slate-400">{formatTimeAgo(note.createdAt)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{note.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Weekly Progress</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Consistency over intensity</h3>
          <div className="mt-6 flex items-end gap-3">
            {weeklyProgress.map((item) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={item.date}>
                <div className="relative flex h-36 w-full items-end overflow-hidden rounded-2xl bg-slate-100/80 px-2 pb-2 dark:bg-slate-900">
                  <div className="w-full rounded-xl bg-gradient-to-t from-brand-500 to-mint" style={{ height: `${Math.max(item.founderScore, 6)}%` }} />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deep Work</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.deepWorkHours}h</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.readingMinutes} min</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Latest Insights</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Fresh signal from the system</h3>
          <div className="mt-5 space-y-3">
            {latestInsights.map((item) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={`${item.source}-${item.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{item.source}</span>
                  <span className="text-xs text-slate-400">{formatShortDate(item.createdAt)}</span>
                </div>
                <p className="mt-3 font-medium text-slate-900 dark:text-white">{item.title}</p>
                {item.detail ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p> : null}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Upcoming Follow Ups</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Don't let warm relationships cool</h3>
          <div className="mt-5 space-y-3">
            {upcomingFollowUps.map((contact) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={contact.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company}</p>
                  </div>
                  <span className="badge">{contact.prettyDate}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{contact.keyInsight}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button className="secondary-button flex-1" onClick={() => onQuickAction('contact')} type="button">
              <UserPlus className="h-4 w-4" />
              Add Contact
            </button>
            <button className="secondary-button flex-1" onClick={() => onQuickAction('journal')} type="button">
              <ArrowUpRight className="h-4 w-4" />
              Journal Entry
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
