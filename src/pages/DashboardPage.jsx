import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  Dumbbell,
  Flame,
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
import { CeoBriefCard } from '../components/CeoBriefCard';
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

const runwayColor = (months) => {
  if (months <= 6) return 'text-rose-500 dark:text-rose-400';
  if (months <= 12) return 'text-amber-500 dark:text-amber-400';
  return 'text-emerald-500 dark:text-emerald-400';
};

const pipelineColor = (value) => {
  if (value >= 100000) return 'text-emerald-500 dark:text-emerald-400';
  if (value >= 30000) return 'text-brand-500 dark:text-brand-400';
  return 'text-slate-500 dark:text-slate-400';
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
  const recentCaptures = data.quickNotes.slice(0, 3);
  const latestDailyBrief = operatingMetrics.automationStats.latestDailyBrief;
  const latestWeeklyBrief = operatingMetrics.automationStats.latestWeeklyBrief;

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

  const scoreGrade = founderScore >= 80 ? 'Elite' : founderScore >= 60 ? 'Strong' : founderScore >= 40 ? 'Building' : 'Early';

  return (
    <div className="space-y-6">
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
        description="Your founder command center. Execute today. Build the machine."
        title="Dashboard"
      />

      {/* Today at a Glance — instant health check */}
      <div className="panel-card-strong rounded-3xl p-5">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-brand-600 dark:text-brand-300">Today at a Glance</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Founder Score</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{founderScore}</p>
            <p className="text-xs font-medium text-brand-500">{scoreGrade}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Tasks</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{completedTasks}<span className="text-sm text-slate-400">/{definedTasks || 3}</span></p>
            <p className="text-xs text-slate-500">{completedTasks === definedTasks && definedTasks > 0 ? '✓ Done' : 'In progress'}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Deep Work</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{Number(todayEntry.deepWorkHours || 0).toFixed(1)}<span className="text-sm text-slate-400">h</span></p>
            <p className="text-xs text-slate-500">Today logged</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Runway</p>
            <p className={`text-2xl font-semibold ${runwayColor(operatingMetrics.financeStats.runwayMonths)}`}>{operatingMetrics.financeStats.runwayMonths}<span className="text-sm"> mo</span></p>
            <p className="text-xs text-slate-500">Capital buffer</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Pipeline</p>
            <p className={`text-2xl font-semibold ${pipelineColor(operatingMetrics.revenueStats.weightedPipeline)}`}>${Math.round(operatingMetrics.revenueStats.weightedPipeline / 1000)}<span className="text-sm">k</span></p>
            <p className="text-xs text-slate-500">Weighted GTM</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">AI Leverage</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{founderLeverage}</p>
            <p className="text-xs text-slate-500">Leverage score</p>
          </div>
        </div>
      </div>

      {/* Row 1: Mission Tasks + Founder Score */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Today's Top 3 Tasks</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Execution before everything else</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{completedTasks}/{definedTasks || 3} mission tasks completed today.</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {todayEntry.missionTasks.map((task, index) => (
              <label
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-4 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-950/50"
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
                </div>
              </label>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <button className="secondary-button justify-start" onClick={() => onQuickAction('idea')} type="button">
              <Lightbulb className="h-4 w-4" />
              Add Idea
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('work')} type="button">
              <Activity className="h-4 w-4" />
              Log Work
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('contact')} type="button">
              <UserPlus className="h-4 w-4" />
              Add Contact
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('project')} type="button">
              <Target className="h-4 w-4" />
              New Project
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
      </div>

      {/* Row 2: Unicorn Control Tower + AI Leverage + CEO Brief */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Unicorn Control Tower</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Company signal in one scan</h3>
            </div>
            <Target className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-5 grid gap-3 grid-cols-2">
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Scale Score</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.founderScaleScore}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Runway</p>
              <p className={`mt-2 text-3xl font-semibold ${runwayColor(operatingMetrics.financeStats.runwayMonths)}`}>{operatingMetrics.financeStats.runwayMonths} mo</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pipeline</p>
              <p className={`mt-2 text-3xl font-semibold ${pipelineColor(operatingMetrics.revenueStats.weightedPipeline)}`}>${Math.round(operatingMetrics.revenueStats.weightedPipeline / 1000)}k</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">PMF Signals</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.strongSignals}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Projects</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.activeProjects}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blocked</p>
              <p className={`mt-2 text-3xl font-semibold ${operatingMetrics.projectStats.blockedProjects > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{operatingMetrics.projectStats.blockedProjects}</p>
            </div>
          </div>
          <div className="mt-4">
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
          </div>
          <div className="mt-4 grid gap-2 grid-cols-2">
            <button className="secondary-button justify-start" onClick={() => onQuickAction('strategy')} type="button">
              Strategy
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('revenue')} type="button">
              Revenue
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('finance')} type="button">
              Finance
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('project')} type="button">
              Projects
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">AI Leverage Engine</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Automate the work. Keep the edge.</h3>
            </div>
            <Zap className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-5 grid gap-3 grid-cols-2">
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Leverage Score</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{founderLeverage}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Agents Built</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.agentsDesigned}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experiments</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.experimentsRun}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hours/Week Saved</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-500">{aiStats.weeklyHoursSaved}</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {aiStats.topHighLeverageOpportunities.slice(0, 2).map((opportunity) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/50" key={opportunity.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{opportunity.process}</p>
                  <span className="badge">{opportunity.leverageScore}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 grid-cols-2">
            <button className="secondary-button justify-start" onClick={() => onQuickAction('agent')} type="button">
              New Agent
            </button>
            <button className="secondary-button justify-start" onClick={() => onQuickAction('ai-experiment')} type="button">
              Experiment
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">CEO Brief Engine</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Daily and weekly company summaries</h3>
            </div>
            <NotebookPen className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-5 space-y-4">
            {latestDailyBrief ? <CeoBriefCard brief={latestDailyBrief} compact /> : null}
            {latestWeeklyBrief ? <CeoBriefCard brief={latestWeeklyBrief} compact /> : null}
            {!latestDailyBrief && !latestWeeklyBrief ? (
              <EmptyState copy="Generate your first CEO brief from Inbox Automations." title="No CEO briefs yet" />
            ) : null}
          </div>
          <div className="mt-5">
            <button className="secondary-button w-full justify-center" onClick={() => onQuickAction('briefs')} type="button">
              <ArrowUpRight className="h-4 w-4" />
              Open Inbox Automations
            </button>
          </div>
        </Card>
      </div>

      {/* Row 3: Deep Work Timer + Current Book + Health */}
      <div className="grid gap-6 xl:grid-cols-3">
        <DeepWorkTimer onLogMinutes={addDeepWorkMinutes} totalLoggedHours={Number(todayEntry.deepWorkHours || 0)} />

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Current Book</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{currentBook?.bookTitle || 'No active book yet'}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{currentBook ? `${currentBook.author} • ${currentBook.category}` : 'Use Book Learning to start your reading loop.'}</p>
            </div>
            <BookMarked className="h-5 w-5 text-brand-500" />
          </div>
          {currentBook ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 grid-cols-3">
                <div className="rounded-2xl bg-slate-50/70 p-3 dark:bg-slate-950/50">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Pages Today</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{todayEntry.pagesRead || 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-50/70 p-3 dark:bg-slate-950/50">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Min Read</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{todayEntry.readingMinutes || 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-50/70 p-3 dark:bg-slate-950/50">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Streak</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{learningStreak}d</p>
                </div>
              </div>
              {(todayEntry.bookInsightOfDay || currentBook.businessInsights || currentBook.keyLessons) ? (
                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Insight of the Day</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{todayEntry.bookInsightOfDay || currentBook.businessInsights || currentBook.keyLessons}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState copy="Add a book and mark it as Reading." title="No current book" />
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Today's Health</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Protect the energy engine</h3>
            </div>
            <HeartPulse className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/70 px-4 py-3 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <Dumbbell className="h-4 w-4 text-mint" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Exercise</span>
              </div>
              <button className={todayEntry.exercise ? 'primary-button !py-2' : 'secondary-button !py-2'} onClick={() => patchTodayEntry({ exercise: !todayEntry.exercise })} type="button">
                {todayEntry.exercise ? 'Done ✓' : 'Mark done'}
              </button>
            </div>
            <div className="rounded-2xl bg-slate-50/70 px-4 py-3 dark:bg-slate-950/50">
              <div className="mb-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-slate-600 dark:text-slate-300">Smoking Today</span>
                </div>
                <span className={`text-lg font-semibold ${todayEntry.smokingCount === 0 ? 'text-emerald-500' : todayEntry.smokingCount <= 3 ? 'text-amber-500' : 'text-rose-500'}`}>{todayEntry.smokingCount}</span>
              </div>
              <div className="flex gap-2">
                <button className="secondary-button flex-1 justify-center !py-2" onClick={() => patchTodayEntry({ smokingCount: Math.max(0, todayEntry.smokingCount - 1) })} type="button">
                  −
                </button>
                <button className="secondary-button flex-1 justify-center !py-2" onClick={() => patchTodayEntry({ smokingCount: todayEntry.smokingCount + 1 })} type="button">
                  +
                </button>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50/70 px-4 py-3 dark:bg-slate-950/50">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Energy Level</span>
                <span className="font-semibold text-slate-900 dark:text-white">{todayEntry.energyLevel}/10</span>
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
      </div>

      {/* Row 4: Active Idea + Weekly Progress + Follow Ups */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Active Idea</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{activeIdea?.ideaName || 'No active idea yet'}</h3>
            </div>
            {activeIdea ? <span className="badge">{activeIdea.status}</span> : null}
          </div>
          {activeIdea ? (
            <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>{activeIdea.problem}</p>
              <div className="grid gap-3 grid-cols-2">
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
          <div className="mt-5">
            <button className="secondary-button w-full justify-center" onClick={() => onQuickAction('idea')} type="button">
              <Lightbulb className="h-4 w-4" />
              Open Idea Lab
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Weekly Progress</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Consistency over intensity</h3>
          <div className="mt-6 flex items-end gap-2">
            {weeklyProgress.map((item) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={item.date}>
                <div className="relative flex h-28 w-full items-end overflow-hidden rounded-2xl bg-slate-100/80 px-1 pb-1 dark:bg-slate-900">
                  <div className="w-full rounded-xl bg-gradient-to-t from-brand-500 to-mint" style={{ height: `${Math.max(item.founderScore, 6)}%` }} />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 grid-cols-2">
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
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Upcoming Follow Ups</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Warm relationships win deals</h3>
          <div className="mt-5 space-y-3">
            {upcomingFollowUps.length ? upcomingFollowUps.map((contact) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={contact.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company}</p>
                  </div>
                  <span className="badge">{contact.prettyDate}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{contact.keyInsight}</p>
              </div>
            )) : (
              <EmptyState copy="Add key contacts and set follow-up dates." title="No follow-ups scheduled" />
            )}
          </div>
          <div className="mt-5 flex gap-3">
            <button className="secondary-button flex-1" onClick={() => onQuickAction('contact')} type="button">
              <UserPlus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </Card>
      </div>

      {/* Row 5: Latest Insights + Quick Notes */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Latest Insights</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Fresh signal from the system</h3>
          <div className="mt-5 space-y-3">
            {latestInsights.length ? latestInsights.map((item) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={`${item.source}-${item.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{item.source}</span>
                  <span className="text-xs text-slate-400">{formatShortDate(item.createdAt)}</span>
                </div>
                <p className="mt-3 font-medium text-slate-900 dark:text-white">{item.title}</p>
                {item.detail ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p> : null}
              </div>
            )) : (
              <EmptyState copy="Insights will surface as you log decisions, books, and opportunities." title="No insights yet" />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Quick Notes</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Keep the signal moving</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Press <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Q</kbd> anywhere for quick capture.</p>
            </div>
            <Button onClick={onOpenQuickCapture} variant="secondary">
              <Plus className="h-4 w-4" />
              Capture
            </Button>
          </div>
          <form className="mt-5 flex flex-col gap-3 lg:flex-row" onSubmit={handleQuickNote}>
            <input
              className="input-control flex-1"
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Capture an idea, follow-up, insight..."
              value={noteText}
            />
            <Button type="submit">Save</Button>
          </form>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {recentCaptures.map((note) => (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={note.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{note.type}</span>
                  <span className="text-xs text-slate-400">{formatTimeAgo(note.createdAt)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{note.text}</p>
              </div>
            ))}
            {!recentCaptures.length ? (
              <div className="md:col-span-3">
                <EmptyState copy="Your recent captures will appear here." title="No notes yet" />
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
