import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookMarked,
  Brain,
  CalendarClock,
  FlaskConical,
  Gauge,
  Lightbulb,
  Network,
  NotebookPen,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatShortDate, parseDateKey } from '../utils/date';
import { countCompletedTasks, countDefinedTasks } from '../utils/metrics';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CeoBriefCard } from '../components/CeoBriefCard';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const priorityStyles = {
  critical: 'border-rose-200 bg-rose-50/80 dark:border-rose-500/20 dark:bg-rose-500/10',
  important: 'border-amber-200 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-500/10',
  normal: 'border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/50',
};

const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;

const buildActionQueue = ({
  activeIdea,
  boardStats,
  customerStats,
  currentBook,
  dueDecisions,
  experimentsNeedingIteration,
  financeStats,
  highLeverageAi,
  incompleteTasks,
  latestReview,
  modulesInProgress,
  overdueFollowUps,
  pendingPracticeTasks,
  projectStats,
  revenueStats,
  strategyStats,
  todayEntry,
}) => {
  const actions = [];

  if (incompleteTasks.length) {
    actions.push({
      id: 'today-mission',
      tone: 'critical',
      area: 'Execution',
      title: `Finish ${pluralize(incompleteTasks.length, 'mission task')}`,
      detail: incompleteTasks.map((task) => task.text || 'Unwritten task').join(' • '),
      actionKind: 'navigate',
      page: 'daily-execution',
      anchorId: 'daily-entry-form',
      actionLabel: 'Open Daily Execution',
    });
  }

  overdueFollowUps.slice(0, 2).forEach((contact) => {
    actions.push({
      id: `follow-up-${contact.id}`,
      tone: 'critical',
      area: 'Relationships',
      title: `Follow up with ${contact.name}`,
      detail: contact.keyInsight || contact.notes || `${contact.company || 'Contact'} is overdue for a touchpoint.`,
      actionKind: 'navigate',
      page: 'networking-crm',
      anchorId: 'contact-form',
      actionLabel: 'Open CRM',
    });
  });

  dueDecisions.slice(0, 2).forEach((decision) => {
    actions.push({
      id: `decision-${decision.id}`,
      tone: 'critical',
      area: 'Decisions',
      title: `Review decision: ${decision.decision}`,
      detail: decision.expectedOutcome || decision.context || 'Outcome review is due.',
      actionKind: 'navigate',
      page: 'decision-journal',
      actionLabel: 'Open Decision Journal',
    });
  });

  if (currentBook && Number(todayEntry.readingMinutes || 0) === 0) {
    actions.push({
      id: 'current-book',
      tone: 'important',
      area: 'Learning',
      title: `Read ${currentBook.bookTitle}`,
      detail: currentBook.businessInsights || currentBook.keyLessons || `Protect the reading streak with ${currentBook.dailyReadingMinutes || 20} focused minutes.`,
      actionKind: 'navigate',
      page: 'book-learning',
      anchorId: 'book-form',
      actionLabel: 'Open Book Learning',
    });
  }

  if (projectStats.blockedProjects) {
    const blockedProject = projectStats.topProjects.find((project) => project.stage === 'Blocked');
    actions.push({
      id: blockedProject ? `project-blocked-${blockedProject.id}` : 'project-blocked',
      tone: 'critical',
      area: 'Projects',
      title: blockedProject ? `Unblock ${blockedProject.projectName}` : 'Unblock a project bottleneck',
      detail: blockedProject?.blockers || blockedProject?.nextStep || 'A core project is blocked and needs founder intervention.',
      actionKind: 'navigate',
      page: 'projects-roadmap',
      actionLabel: 'Open Projects',
    });
  }

  if (projectStats.launchReady || projectStats.dueSoon?.[0]) {
    const launchProject = projectStats.launchThisWeek?.[0] || projectStats.dueSoon?.[0] || projectStats.topProjects?.[0];
    if (launchProject) {
      actions.push({
        id: `project-launch-${launchProject.id}`,
        tone: 'important',
        area: 'Launch',
        title: `Move ${launchProject.projectName}`,
        detail: launchProject.nextStep || launchProject.milestone || 'A near-term project needs a push toward launch.',
        actionKind: 'navigate',
        page: 'projects-roadmap',
        actionLabel: 'Open Roadmap',
      });
    }
  }

  if (financeStats.atRisk) {
    actions.push({
      id: 'runway-risk',
      tone: 'critical',
      area: 'Finance',
      title: `Runway is at ${financeStats.runwayMonths} months`,
      detail: `Target runway is ${financeStats.targetRunwayMonths} months. Tighten burn or grow revenue coverage.`,
      actionKind: 'navigate',
      page: 'finance-runway',
      actionLabel: 'Open Finance',
    });
  }

  if (revenueStats.nearCloseDeals[0]) {
    actions.push({
      id: `revenue-${revenueStats.nearCloseDeals[0].id}`,
      tone: 'important',
      area: 'Revenue',
      title: `Advance ${revenueStats.nearCloseDeals[0].accountName}`,
      detail: revenueStats.nearCloseDeals[0].nextStep || 'A near-close deal needs a decisive next move.',
      actionKind: 'navigate',
      page: 'revenue-engine',
      actionLabel: 'Open Revenue',
    });
  }

  if (customerStats.recentInterviews < 2) {
    actions.push({
      id: 'pmf-freshness',
      tone: 'important',
      area: 'PMF',
      title: 'Refresh customer signal this week',
      detail: 'Recent interview volume is low. Fresh customer evidence should guide product and GTM decisions.',
      actionKind: 'navigate',
      page: 'customer-research',
      actionLabel: 'Open Research',
    });
  }

  if (strategyStats.atRiskList?.[0]) {
    actions.push({
      id: `strategy-${strategyStats.atRiskList[0].id}`,
      tone: 'important',
      area: 'Strategy',
      title: `Reset ${strategyStats.atRiskList[0].planName}`,
      detail: strategyStats.atRiskList[0].risks || 'The current plan is underpowered or drifting.',
      actionKind: 'navigate',
      page: 'company-strategy',
      actionLabel: 'Open Strategy',
    });
  }

  if (boardStats.overdueItems || boardStats.upcomingItems[0]) {
    const boardItem = boardStats.upcomingItems[0];
    actions.push({
      id: boardItem ? `board-${boardItem.id}` : 'board-overdue',
      tone: boardStats.overdueItems ? 'critical' : 'important',
      area: 'Board & Capital',
      title: boardStats.overdueItems ? 'Clear overdue capital follow-ups' : `Prepare ${boardItem.title}`,
      detail: boardStats.overdueItems
        ? 'Board and investor relationships lose value fast when follow-ups go stale.'
        : boardItem.asks || boardItem.notes || 'Upcoming board or investor moment needs preparation.',
      actionKind: 'navigate',
      page: 'board-capital',
      actionLabel: 'Open Board & Capital',
    });
  }

  if (activeIdea?.nextExperiment) {
    actions.push({
      id: 'active-idea',
      tone: 'important',
      area: 'Ideas',
      title: `Run next experiment for ${activeIdea.ideaName}`,
      detail: activeIdea.nextExperiment,
      actionKind: 'navigate',
      page: 'idea-lab',
      anchorId: 'idea-form',
      actionLabel: 'Open Idea Lab',
    });
  }

  if (pendingPracticeTasks[0]) {
    actions.push({
      id: `practice-${pendingPracticeTasks[0].id}`,
      tone: 'important',
      area: 'AI Practice',
      title: pendingPracticeTasks[0].title,
      detail: pendingPracticeTasks[0].description,
      actionKind: 'toggle-practice',
      taskId: pendingPracticeTasks[0].id,
      actionLabel: 'Mark Done',
    });
  }

  if (experimentsNeedingIteration[0]) {
    actions.push({
      id: `experiment-${experimentsNeedingIteration[0].id}`,
      tone: 'important',
      area: 'Experiments',
      title: `Advance experiment: ${experimentsNeedingIteration[0].experimentName}`,
      detail: experimentsNeedingIteration[0].nextIteration || experimentsNeedingIteration[0].whatFailed || 'Needs another iteration.',
      actionKind: 'navigate',
      page: 'ai-experiments',
      actionLabel: 'Open Experiments',
    });
  }

  if (highLeverageAi[0]) {
    actions.push({
      id: `ai-opportunity-${highLeverageAi[0].id}`,
      tone: 'normal',
      area: 'AI Opportunity',
      title: `Push ${highLeverageAi[0].process}`,
      detail: `${highLeverageAi[0].industry} • leverage ${highLeverageAi[0].leverageScore} • ${highLeverageAi[0].weeklyHoursSaved} hrs/week saved`,
      actionKind: 'navigate',
      page: 'ai-opportunities',
      actionLabel: 'Open AI Opportunities',
    });
  }

  if (modulesInProgress[0]) {
    actions.push({
      id: `module-${modulesInProgress[0].id}`,
      tone: 'normal',
      area: 'AI Learning',
      title: `Log progress in ${modulesInProgress[0].title}`,
      detail: modulesInProgress[0].notes || modulesInProgress[0].description,
      actionKind: 'navigate',
      page: 'ai-learning-roadmap',
      actionLabel: 'Open Roadmap',
    });
  }

  if (latestReview?.nextWeekStrategy) {
    actions.push({
      id: 'weekly-strategy',
      tone: 'normal',
      area: 'Weekly Strategy',
      title: 'Execute this week’s strategy',
      detail: latestReview.nextWeekStrategy,
      actionKind: 'navigate',
      page: 'weekly-review',
      actionLabel: 'Open Weekly Review',
    });
  }

  return actions.slice(0, 8);
};

export const FounderInboxPage = ({ onNavigate, onOpenJournal, onOpenQuickCapture, onQuickAction }) => {
  const {
    data,
    todayKey,
    todayEntry,
    founderScore,
    founderLeverage,
    operatingMetrics,
    learningStreak,
    upcomingFollowUps,
    latestInsights,
    activeIdea,
    currentBook,
    thisWeekSnapshot,
    aiStats,
    saveDailyEntry,
    toggleAiPracticeTask,
  } = useAppContext();

  const today = useMemo(() => parseDateKey(todayKey), [todayKey]);

  const incompleteTasks = useMemo(
    () => todayEntry.missionTasks.filter((task) => task.text?.trim() && !task.done),
    [todayEntry.missionTasks],
  );

  const overdueFollowUps = useMemo(
    () =>
      [...data.contacts]
        .filter((contact) => contact.followUpDate && parseDateKey(contact.followUpDate) < today)
        .sort((left, right) => new Date(left.followUpDate) - new Date(right.followUpDate)),
    [data.contacts, today],
  );

  const dueDecisions = useMemo(
    () =>
      [...data.decisions]
        .filter((decision) => decision.reviewDate && parseDateKey(decision.reviewDate) <= today && !decision.actualOutcome)
        .sort((left, right) => new Date(left.reviewDate) - new Date(right.reviewDate)),
    [data.decisions, today],
  );

  const experimentsNeedingIteration = useMemo(
    () =>
      [...data.ai.experiments]
        .filter((experiment) => experiment.nextIteration || (!experiment.whatWorked && experiment.whatFailed))
        .sort((left, right) => new Date(right.updatedAt || right.createdAt || 0) - new Date(left.updatedAt || left.createdAt || 0)),
    [data.ai.experiments],
  );

  const pendingPracticeTasks = useMemo(
    () => data.ai.dailyPractice.filter((task) => !task.doneDates.includes(todayKey)),
    [data.ai.dailyPractice, todayKey],
  );

  const modulesInProgress = useMemo(
    () =>
      [...data.ai.modules]
        .filter((module) => !module.completed)
        .sort((left, right) => {
          const leftRank = left.status === 'In Progress' ? 0 : left.status === 'Complete' ? 2 : 1;
          const rightRank = right.status === 'In Progress' ? 0 : right.status === 'Complete' ? 2 : 1;
          return leftRank - rightRank;
        }),
    [data.ai.modules],
  );

  const highLeverageAi = useMemo(
    () =>
      [...data.ai.opportunities]
        .filter((opportunity) => opportunity.status !== 'Implemented')
        .sort((left, right) => Number(right.leverageScore || 0) - Number(left.leverageScore || 0))
        .slice(0, 3),
    [data.ai.opportunities],
  );

  const latestReview = data.weeklyReviews[0];
  const latestDailyBrief = operatingMetrics.automationStats.latestDailyBrief;
  const latestWeeklyBrief = operatingMetrics.automationStats.latestWeeklyBrief;
  const definedTasks = countDefinedTasks(todayEntry);
  const completedTasks = countCompletedTasks(todayEntry);
  const reviewsDueCount = overdueFollowUps.length + dueDecisions.length;
  const learningGaps = pendingPracticeTasks.length + (currentBook && Number(todayEntry.readingMinutes || 0) === 0 ? 1 : 0);

  const inboxActions = useMemo(
    () =>
      buildActionQueue({
        activeIdea,
        boardStats: operatingMetrics.boardStats,
        customerStats: operatingMetrics.customerStats,
        currentBook,
        dueDecisions,
        experimentsNeedingIteration,
        financeStats: operatingMetrics.financeStats,
        highLeverageAi,
        incompleteTasks,
        latestReview,
        modulesInProgress,
        overdueFollowUps,
        pendingPracticeTasks,
        projectStats: operatingMetrics.projectStats,
        revenueStats: operatingMetrics.revenueStats,
        strategyStats: operatingMetrics.strategyStats,
        todayEntry,
      }),
    [
      activeIdea,
      operatingMetrics,
      currentBook,
      dueDecisions,
      experimentsNeedingIteration,
      highLeverageAi,
      incompleteTasks,
      latestReview,
      modulesInProgress,
      overdueFollowUps,
      pendingPracticeTasks,
      todayEntry,
    ],
  );

  const handleAction = (action) => {
    if (action.actionKind === 'navigate') {
      onNavigate(action.page, action.anchorId);
      return;
    }

    if (action.actionKind === 'toggle-practice') {
      toggleAiPracticeTask(action.taskId);
      return;
    }
  };

  const handleTaskToggle = (taskId) => {
    saveDailyEntry({
      ...todayEntry,
      missionTasks: todayEntry.missionTasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    });
  };

  const criticalCount = inboxActions.filter((item) => item.tone !== 'normal').length;

  const scoreBadgeClass = founderScore >= 70
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
    : founderScore >= 40
      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
      : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300';

  const runwayBadgeClass = operatingMetrics.financeStats.runwayMonths > 12
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
    : operatingMetrics.financeStats.runwayMonths > 6
      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
      : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300';

  const pipelineBadgeClass = operatingMetrics.revenueStats.weightedPipeline >= 100000
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
    : 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300';

  const deepWorkBadgeClass = thisWeekSnapshot.deepWorkHours >= 20
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
    : 'border-slate-200/80 bg-white/70 text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300';

  const criticalNumClass = criticalCount > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400';
  const reviewsNumClass = reviewsDueCount > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400';
  const learningNumClass = learningGaps > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400';
  const runwayNumClass = operatingMetrics.financeStats.runwayMonths > 12 ? 'text-emerald-500 dark:text-emerald-400' : operatingMetrics.financeStats.runwayMonths > 6 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400';
  const pipelineNumClass = operatingMetrics.revenueStats.weightedPipeline >= 100000 ? 'text-emerald-500 dark:text-emerald-400' : 'text-brand-500 dark:text-brand-400';

  const briefText = useMemo(() => {
    const parts = [];

    if (incompleteTasks.length) parts.push(`finish ${pluralize(incompleteTasks.length, 'mission task')}`);
    if (reviewsDueCount) parts.push(`clear ${pluralize(reviewsDueCount, 'review item')}`);
    if (operatingMetrics.financeStats.atRisk) parts.push('protect runway');
    if (operatingMetrics.customerStats.recentInterviews < 2) parts.push('refresh customer signal');
    if (operatingMetrics.revenueStats.nearCloseDeals.length) parts.push(`move ${pluralize(operatingMetrics.revenueStats.nearCloseDeals.length, 'deal')} toward close`);
    if (experimentsNeedingIteration.length) parts.push(`move ${pluralize(experimentsNeedingIteration.length, 'experiment')} forward`);
    if (!parts.length) return 'The system is clear. Use today to compound deep work, learning, and high-leverage decisions.';

    return `Today the system wants you to ${parts.join(', ')}.`;
  }, [experimentsNeedingIteration.length, incompleteTasks.length, operatingMetrics.customerStats.recentInterviews, operatingMetrics.financeStats.atRisk, operatingMetrics.revenueStats.nearCloseDeals.length, reviewsDueCount]);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <Button onClick={onOpenQuickCapture} variant="secondary">
              <Sparkles className="h-4 w-4" />
              Quick Capture
            </Button>
            <Button onClick={() => onQuickAction('work')} variant="secondary">
              <Activity className="h-4 w-4" />
              Log Work
            </Button>
            <Button onClick={() => onQuickAction('agent')} variant="secondary">
              <Brain className="h-4 w-4" />
              New Agent
            </Button>
            <Button onClick={onOpenJournal}>
              <NotebookPen className="h-4 w-4" />
              Evening Journal
            </Button>
          </>
        }
        description="A single command center for what needs founder attention right now across execution, learning, relationships, decisions, and AI leverage."
        title="Founder Inbox"
      />

      <Card className="panel-card-strong p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">Morning Brief</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{briefText}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${scoreBadgeClass}`}>
            Score {founderScore}
          </span>
          <span className="badge">Leverage {founderLeverage}</span>
          <span className="badge">Scale {operatingMetrics.founderScaleScore}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${runwayBadgeClass}`}>
            {operatingMetrics.financeStats.runwayMonths} mo runway
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${pipelineBadgeClass}`}>
            ${Math.round(operatingMetrics.revenueStats.weightedPipeline / 1000)}k pipeline
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${deepWorkBadgeClass}`}>
            {thisWeekSnapshot.deepWorkHours}h deep work
          </span>
          <span className="badge">{aiStats.weeklyHoursSaved} hrs/week saved</span>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Critical Queue</p>
          <p className={`mt-2 text-3xl font-semibold ${criticalNumClass}`}>{criticalCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Items that should not drift into next week.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reviews Due</p>
          <p className={`mt-2 text-3xl font-semibold ${reviewsNumClass}`}>{reviewsDueCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Follow-ups and decisions needing closure.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning Gap</p>
          <p className={`mt-2 text-3xl font-semibold ${learningNumClass}`}>{learningGaps}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Pending practice + today’s reading gap.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Runway</p>
          <p className={`mt-2 text-3xl font-semibold ${runwayNumClass}`}>{operatingMetrics.financeStats.runwayMonths} mo</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Capital buffer vs current burn rate.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weighted Pipeline</p>
          <p className={`mt-2 text-3xl font-semibold ${pipelineNumClass}`}>${Math.round(operatingMetrics.revenueStats.weightedPipeline / 1000)}k</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Risk-adjusted GTM momentum.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Priority Queue</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">What needs your attention now</h3>
              </div>
              <AlertTriangle className="h-5 w-5 text-brand-500" />
            </div>
            {inboxActions.length ? (
              <div className="mt-5 space-y-3">
                {inboxActions.map((item) => (
                  <div className={`rounded-2xl border p-4 ${priorityStyles[item.tone]}`} key={item.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <span className="badge">{item.area}</span>
                        <p className="mt-3 font-medium text-slate-900 dark:text-white">{item.title}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                      </div>
                      <Button onClick={() => handleAction(item)} variant={item.tone === 'critical' ? 'danger' : 'secondary'}>
                        {item.actionLabel}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState copy="Nothing urgent is surfaced right now. Use the space to compound deep work and strategic thinking." title="Inbox is clear" />
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Today's Mission</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Execution before drift</h3>
              </div>
              <span className="badge">
                {completedTasks}/{definedTasks || 3}
              </span>
            </div>
            <div className="mt-5 space-y-3">
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
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Keep the work concrete and easy to finish.</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Daily AI Practice</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Keep leverage compounding</h3>
              </div>
              <Brain className="h-5 w-5 text-brand-500" />
            </div>
            {data.ai.dailyPractice.length ? (
              <div className="mt-5 space-y-3">
                {data.ai.dailyPractice.map((task) => {
                  const doneToday = task.doneDates.includes(todayKey);
                  return (
                    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={task.id}>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
                        </div>
                        <Button onClick={() => toggleAiPracticeTask(task.id)} variant={doneToday ? 'secondary' : 'primary'}>
                          {doneToday ? 'Done Today' : 'Mark Done'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState copy="Add practice tasks in the AI Learning Roadmap and they will appear here." title="No practice tasks yet" />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Current Book</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{currentBook?.bookTitle || 'No active book'}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{currentBook ? `${currentBook.author} • ${currentBook.category}` : 'Use Book Learning to keep the reading loop visible.'}</p>
              </div>
              <BookMarked className="h-5 w-5 text-brand-500" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading Today</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{todayEntry.readingMinutes || 0}m</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pages Read</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{todayEntry.pagesRead || 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Streak</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{learningStreak}d</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{todayEntry.bookInsightOfDay || currentBook?.businessInsights || currentBook?.keyLessons || 'Capture a book insight and it will surface here.'}</p>
            <div className="mt-4">
              <Button className="w-full" onClick={() => onQuickAction('book')} variant="secondary">
                <ArrowUpRight className="h-4 w-4" />
                Open Book Learning
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">CEO Briefs</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Daily and weekly operating summaries</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">These are generated from the live state of the company inside Founder OS.</p>
              </div>
              <Sparkles className="h-5 w-5 text-brand-500" />
            </div>
            <div className="mt-5 space-y-4">
              {latestDailyBrief ? <CeoBriefCard brief={latestDailyBrief} compact /> : null}
              {latestWeeklyBrief ? <CeoBriefCard brief={latestWeeklyBrief} compact /> : null}
              {!latestDailyBrief && !latestWeeklyBrief ? (
                <EmptyState copy="Open Inbox Automations to generate your first daily and weekly CEO briefs." title="No CEO briefs yet" />
              ) : null}
            </div>
            <div className="mt-4">
              <Button className="w-full" onClick={() => onQuickAction('briefs')} variant="secondary">
                <ArrowUpRight className="h-4 w-4" />
                Open Inbox Automations
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Active Idea</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{activeIdea?.ideaName || 'No active idea'}</h3>
              </div>
              <Lightbulb className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{activeIdea?.problem || 'Once you capture and rank ideas, the strongest one will stay visible here.'}</p>
            <div className="mt-4 rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Experiment</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{activeIdea?.nextExperiment || 'No experiment defined yet.'}</p>
            </div>
            <div className="mt-4">
              <Button className="w-full" onClick={() => onQuickAction('idea')} variant="secondary">
                <ArrowUpRight className="h-4 w-4" />
                Open Idea Lab
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Scale OS</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.strategyStats.activePlan?.planName || 'No active strategy plan'}</h3>
              </div>
              <Target className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
              {operatingMetrics.strategyStats.activePlan?.mission || 'Create an active quarterly plan so strategy, PMF, GTM, and finance all stay connected.'}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent Interviews</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.recentInterviews}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weighted Pipeline</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">${Math.round(operatingMetrics.revenueStats.weightedPipeline / 1000)}k</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Runway</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.financeStats.runwayMonths} mo</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upcoming Board Items</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.boardStats.upcomingItems.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Projects</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.activeProjects}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blocked Projects</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.blockedProjects}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => onQuickAction('strategy')} variant="secondary">
                Open Strategy
              </Button>
              <Button onClick={() => onQuickAction('research')} variant="secondary">
                Open Research
              </Button>
              <Button onClick={() => onQuickAction('revenue')} variant="secondary">
                Open Revenue
              </Button>
              <Button onClick={() => onQuickAction('board')} variant="secondary">
                Open Board & Capital
              </Button>
              <Button onClick={() => onQuickAction('project')} variant="secondary">
                Open Projects
              </Button>
              <Button onClick={() => onQuickAction('briefs')} variant="secondary">
                Open Briefs
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Weekly Strategy</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Current operating direction</h3>
              </div>
              <Target className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{latestReview?.nextWeekStrategy || 'Log a weekly review to keep strategy visible here.'}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Health</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{latestReview?.healthScore ?? '-'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{latestReview?.focusScore ?? '-'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Top AI Wedge</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{highLeverageAi[0]?.process || 'No AI wedge yet'}</h3>
              </div>
              <Gauge className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{highLeverageAi[0]?.aiSolution || 'Capture AI opportunities and the strongest one will surface here.'}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {highLeverageAi[0] ? (
                <>
                  <span className="badge">Leverage {highLeverageAi[0].leverageScore}</span>
                  <span className="badge">{highLeverageAi[0].weeklyHoursSaved} hrs/week</span>
                  <span className="badge">{highLeverageAi[0].status}</span>
                </>
              ) : null}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 text-brand-500" />
            <div>
              <h3 className="section-title">Relationship Queue</h3>
              <p className="section-copy">Who needs a touchpoint soon.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {upcomingFollowUps.length ? (
              upcomingFollowUps.slice(0, 4).map((contact) => (
                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={contact.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company}</p>
                    </div>
                    <span className="badge">{contact.prettyDate}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{contact.keyInsight || contact.notes}</p>
                </div>
              ))
            ) : (
              <EmptyState copy="Add contact follow-up dates and this queue will stay useful automatically." title="No follow-ups queued" />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-brand-500" />
            <div>
              <h3 className="section-title">Decision Reviews</h3>
              <p className="section-copy">Judgment loops that need closure.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {dueDecisions.length ? (
              dueDecisions.slice(0, 4).map((decision) => (
                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={decision.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900 dark:text-white">{decision.decision}</p>
                    <span className="badge">{formatShortDate(decision.reviewDate)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{decision.expectedOutcome || decision.context}</p>
                </div>
              ))
            ) : (
              <EmptyState copy="No decisions are due for review right now." title="Review queue is clear" />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-brand-500" />
            <div>
              <h3 className="section-title">Experiment Next Iterations</h3>
              <p className="section-copy">AI work that still needs another pass.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {experimentsNeedingIteration.length ? (
              experimentsNeedingIteration.slice(0, 4).map((experiment) => (
                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={experiment.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900 dark:text-white">{experiment.experimentName}</p>
                    <span className="badge">{experiment.timeSpent}h</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{experiment.nextIteration || experiment.whatFailed || 'Needs another iteration.'}</p>
                </div>
              ))
            ) : (
              <EmptyState copy="No experiments are currently waiting for a next iteration." title="Experiment queue is clear" />
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-brand-500" />
            <div>
              <h3 className="section-title">Latest Insights</h3>
              <p className="section-copy">Fresh signal pulled from books, notes, decisions, and journals.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {latestInsights.length ? (
              latestInsights.slice(0, 5).map((item) => (
                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={`${item.source}-${item.id}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="badge">{item.source}</span>
                    <span className="text-xs text-slate-400">{formatShortDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-3 font-medium text-slate-900 dark:text-white">{item.title}</p>
                  {item.detail ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p> : null}
                </div>
              ))
            ) : (
              <EmptyState copy="Capture notes, insights, or journal entries and they will surface here." title="No insight feed yet" />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-brand-500" />
            <div>
              <h3 className="section-title">Operating Snapshot</h3>
              <p className="section-copy">The current week in one glance.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deep Work</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.deepWorkHours}h</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.learningHours}h</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.readingMinutes}m</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Contacts</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.contactsReached}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tasks Completed</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.tasksCompleted}</p>
            </div>
            <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Topics Learned</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{aiStats.aiTopicsLearned}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => onNavigate('dashboard')} variant="secondary">
              <ArrowUpRight className="h-4 w-4" />
              Open Dashboard
            </Button>
            <Button onClick={() => onQuickAction('contact')} variant="secondary">
              <CalendarClock className="h-4 w-4" />
              Add Contact
            </Button>
            <Button onClick={() => onQuickAction('ai-opportunity')} variant="secondary">
              <Sparkles className="h-4 w-4" />
              New AI Opportunity
            </Button>
            <Button onClick={onOpenQuickCapture} variant="secondary">
              <NotebookPen className="h-4 w-4" />
              Capture Note
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
