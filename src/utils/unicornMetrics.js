import { addDays, formatShortDate, getTodayKey, getWeekNumber, parseDateKey, startOfWeek, toDateKey } from './date';
import { extractTopTerms } from './textInsights';
import { calculateFounderScore, countCompletedTasks, getLearningStreak, getThisWeekSnapshot } from './metrics';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sortByNewest = (left, right, key) => new Date(right[key] || right.createdAt || 0) - new Date(left[key] || left.createdAt || 0);

export const calculateRunwayMonths = (snapshot) => {
  if (!snapshot) return 0;
  const cash = toNumber(snapshot.cashOnHand, 0);
  const expenses = toNumber(snapshot.monthlyBurn, 0);
  const revenue = toNumber(snapshot.monthlyRevenue, 0);
  const netBurn = Math.max(expenses - revenue, 0);
  if (netBurn <= 0) return cash > 0 ? 60 : 0;
  return Number((cash / netBurn).toFixed(1));
};

const splitLines = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const buildRunwayTrend = (snapshots, count = 6) => {
  const ordered = [...snapshots].sort((left, right) => new Date(left.snapshotDate || left.createdAt || 0) - new Date(right.snapshotDate || right.createdAt || 0));
  const recent = ordered.slice(-count);
  return {
    labels: recent.map((item) => formatShortDate(item.snapshotDate || item.createdAt)),
    data: recent.map((item) => calculateRunwayMonths(item)),
  };
};

export const buildRevenueStageChart = (pipeline) => {
  const stages = ['Prospect', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  return {
    labels: stages,
    data: stages.map((stage) => pipeline.filter((item) => item.stage === stage).reduce((sum, item) => sum + toNumber(item.dealValue, 0), 0)),
  };
};

export const buildPmfSignalChart = (customerResearch) => {
  const signals = ['Weak', 'Emerging', 'Strong'];
  return {
    labels: signals,
    data: signals.map((signal) => customerResearch.filter((item) => item.pmfSignal === signal).length),
  };
};

export const buildBoardTypeChart = (boardItems) => {
  const labels = ['Investor Update', 'Board Meeting', 'Fundraise'];
  return {
    labels,
    data: labels.map((label) => boardItems.filter((item) => item.entryType === label).length),
  };
};

export const getWeekKey = (value = getTodayKey()) => {
  const date = value instanceof Date ? value : parseDateKey(value);
  return `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, '0')}`;
};

export const buildProjectStageChart = (projects) => {
  const labels = ['Backlog', 'In Progress', 'Blocked', 'Ready to Launch', 'Launched'];
  return {
    labels,
    data: labels.map((label) => projects.filter((project) => project.stage === label).length),
  };
};

const buildProjectStats = (projects) => {
  const today = parseDateKey(getTodayKey());
  const activeProjects = projects.filter((project) => !['Launched'].includes(project.stage));
  const blockedProjects = projects.filter((project) => project.stage === 'Blocked');
  const launchReady = projects.filter((project) => project.stage === 'Ready to Launch');
  const dueSoon = activeProjects.filter((project) => {
    if (!project.dueDate) return false;
    const dueDate = parseDateKey(project.dueDate);
    return dueDate >= today && dueDate <= addDays(today, 14);
  });
  const launchThisWeek = projects.filter((project) => {
    if (!project.launchDate) return false;
    const launchDate = parseDateKey(project.launchDate);
    return launchDate >= startOfWeek(today) && launchDate <= addDays(startOfWeek(today), 6);
  });

  return {
    totalProjects: projects.length,
    activeProjects: activeProjects.length,
    blockedProjects: blockedProjects.length,
    launchReady: launchReady.length,
    dueSoon,
    launchThisWeek,
    topProjects: [...activeProjects]
      .sort((left, right) => toNumber(right.impactScore, 0) * 100 + toNumber(right.progress, 0) - (toNumber(left.impactScore, 0) * 100 + toNumber(left.progress, 0)))
      .slice(0, 4),
  };
};

const buildAutomationStats = (inboxAutomations) => {
  const briefs = inboxAutomations?.briefs || [];
  return {
    briefCount: briefs.length,
    latestDailyBrief: briefs.find((brief) => brief.type === 'Daily CEO Brief') || null,
    latestWeeklyBrief: briefs.find((brief) => brief.type === 'Weekly CEO Brief') || null,
    settings: inboxAutomations?.settings || {},
  };
};

export const getFounderOperatingMetrics = (data) => {
  const today = parseDateKey(getTodayKey());
  const strategicPlans = [...(data.strategicPlans || [])].sort((left, right) => sortByNewest(left, right, 'createdAt'));
  const customerResearch = [...(data.customerResearch || [])].sort((left, right) => sortByNewest(left, right, 'interviewDate'));
  const revenuePipeline = [...(data.revenuePipeline || [])].sort((left, right) => sortByNewest(left, right, 'expectedCloseDate'));
  const financeSnapshots = [...(data.financeSnapshots || [])].sort((left, right) => sortByNewest(left, right, 'snapshotDate'));
  const boardItems = [...(data.boardItems || [])].sort((left, right) => sortByNewest(left, right, 'date'));
  const projects = [...(data.projects || [])].sort((left, right) => sortByNewest(left, right, 'dueDate'));

  const activePlan = strategicPlans.find((plan) => plan.status === 'Active') || strategicPlans[0] || null;
  const atRiskPlans = strategicPlans.filter((plan) => plan.status === 'At Risk' || toNumber(plan.progress, 0) < 40 || toNumber(plan.confidence, 0) <= 4);
  const strategyStats = {
    totalPlans: strategicPlans.length,
    activePlans: strategicPlans.filter((plan) => plan.status === 'Active').length,
    atRiskPlans: atRiskPlans.length,
    avgProgress: strategicPlans.length
      ? Math.round(strategicPlans.reduce((sum, plan) => sum + toNumber(plan.progress, 0), 0) / strategicPlans.length)
      : 0,
    totalPriorities: strategicPlans.reduce((sum, plan) => sum + splitLines(plan.topPriorities).length, 0),
    activePlan,
    atRiskList: atRiskPlans,
  };

  const last14DaysCutoff = addDays(today, -14);
  const recentResearch = customerResearch.filter((item) => parseDateKey(item.interviewDate || item.createdAt) >= last14DaysCutoff);
  const strongSignals = customerResearch.filter((item) => item.pmfSignal === 'Strong');
  const topProblemThemes = extractTopTerms(customerResearch.map((item) => [item.problemArea, item.objections, item.requestedOutcome, item.notableQuote]), 5);
  const customerStats = {
    totalInterviews: customerResearch.length,
    recentInterviews: recentResearch.length,
    avgPainScore: customerResearch.length
      ? Number((customerResearch.reduce((sum, item) => sum + toNumber(item.painScore, 0), 0) / customerResearch.length).toFixed(1))
      : 0,
    avgBudgetSignal: customerResearch.length
      ? Number((customerResearch.reduce((sum, item) => sum + toNumber(item.budgetSignal, 0), 0) / customerResearch.length).toFixed(1))
      : 0,
    strongSignals: strongSignals.length,
    latestInsight: customerResearch[0] || null,
    topProblemThemes,
  };

  const openPipeline = revenuePipeline.filter((item) => !['Won', 'Lost'].includes(item.stage));
  const weightedPipeline = Math.round(
    openPipeline.reduce((sum, item) => sum + toNumber(item.dealValue, 0) * (toNumber(item.closeProbability, 0) / 100), 0),
  );
  const committedRevenue = revenuePipeline.filter((item) => item.stage === 'Won').reduce((sum, item) => sum + toNumber(item.dealValue, 0), 0);
  const nearCloseDeals = openPipeline.filter((item) => {
    if (!item.expectedCloseDate) return false;
    const closeDate = parseDateKey(item.expectedCloseDate);
    return closeDate >= today && closeDate <= addDays(today, 21);
  });
  const revenueStats = {
    totalOpenDeals: openPipeline.length,
    weightedPipeline,
    pipelineValue: openPipeline.reduce((sum, item) => sum + toNumber(item.dealValue, 0), 0),
    committedRevenue,
    nearCloseDeals,
    topDeals: [...openPipeline]
      .sort(
        (left, right) =>
          toNumber(right.dealValue, 0) * (toNumber(right.closeProbability, 0) / 100) -
          toNumber(left.dealValue, 0) * (toNumber(left.closeProbability, 0) / 100),
      )
      .slice(0, 3),
  };

  const latestFinance = financeSnapshots[0] || null;
  const runwayMonths = calculateRunwayMonths(latestFinance);
  const targetRunway = toNumber(latestFinance?.targetRunwayMonths, 18);
  const financeStats = {
    latestSnapshot: latestFinance,
    runwayMonths,
    targetRunwayMonths: targetRunway,
    runwayGap: Number((runwayMonths - targetRunway).toFixed(1)),
    netBurn: Math.max(toNumber(latestFinance?.monthlyBurn, 0) - toNumber(latestFinance?.monthlyRevenue, 0), 0),
    revenueCoverage: latestFinance && toNumber(latestFinance.monthlyBurn, 0) > 0
      ? Math.round((toNumber(latestFinance.monthlyRevenue, 0) / toNumber(latestFinance.monthlyBurn, 0)) * 100)
      : 0,
    atRisk: runwayMonths > 0 && runwayMonths < 12,
  };

  const overdueBoardItems = boardItems.filter((item) => item.nextActionDate && parseDateKey(item.nextActionDate) < today && !['Sent', 'Closed'].includes(item.status));
  const upcomingBoardItems = boardItems.filter((item) => {
    if (!item.date) return false;
    const date = parseDateKey(item.date);
    return date >= today && date <= addDays(today, 30);
  });
  const activeFundraise = boardItems.filter((item) => item.entryType === 'Fundraise' && !['Closed', 'Paused'].includes(item.status));
  const boardStats = {
    totalItems: boardItems.length,
    overdueItems: overdueBoardItems.length,
    upcomingItems: upcomingBoardItems,
    activeFundraise,
    highestConvictionInvestor:
      [...boardItems]
        .filter((item) => item.entryType === 'Fundraise' || item.entryType === 'Investor Update')
        .sort((left, right) => toNumber(right.interestLevel, 0) - toNumber(left.interestLevel, 0))[0] || null,
  };

  const projectStats = buildProjectStats(projects);
  const automationStats = buildAutomationStats(data.inboxAutomations);

  const founderScaleScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        strategyStats.avgProgress * 0.25 +
          Math.min(customerStats.strongSignals * 18, 30) +
          Math.min(revenueStats.weightedPipeline / 1000, 20) +
          Math.min(financeStats.runwayMonths * 1.5, 20) +
          Math.min(boardStats.upcomingItems.length * 5, 5) +
          Math.min(projectStats.launchReady * 3, 6),
      ),
    ),
  );

  return {
    strategyStats,
    customerStats,
    revenueStats,
    financeStats,
    boardStats,
    projectStats,
    automationStats,
    founderScaleScore,
    runwayTrend: buildRunwayTrend(financeSnapshots),
    revenueStageChart: buildRevenueStageChart(revenuePipeline),
    pmfSignalChart: buildPmfSignalChart(customerResearch),
    boardTypeChart: buildBoardTypeChart(boardItems),
    projectStageChart: buildProjectStageChart(projects),
    topPriorityRisks: [
      ...(financeStats.atRisk ? [{ area: 'Finance', title: `Runway is ${runwayMonths} months`, detail: 'Extend runway or improve revenue coverage.' }] : []),
      ...atRiskPlans.slice(0, 2).map((plan) => ({ area: 'Strategy', title: plan.planName, detail: plan.risks || 'Plan is at risk and needs a reset.' })),
      ...overdueBoardItems.slice(0, 2).map((item) => ({ area: item.entryType, title: item.title, detail: item.asks || item.notes || 'Next action is overdue.' })),
      ...projectStats.topProjects.filter((project) => project.stage === 'Blocked').slice(0, 2).map((project) => ({ area: 'Project', title: project.projectName, detail: project.blockers || 'A project is blocked and needs founder intervention.' })),
    ].slice(0, 5),
  };
};

export const currency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(toNumber(value, 0));

export const percent = (value) => `${Math.round(toNumber(value, 0))}%`;

export const getUpcomingCloseLabel = (date) => {
  if (!date) return 'No date';
  const day = parseDateKey(toDateKey(date));
  const today = parseDateKey(getTodayKey());
  const diff = Math.round((day.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff > 0) return `In ${diff}d`;
  return `${Math.abs(diff)}d ago`;
};

const createBriefId = (prefix) =>
  globalThis.crypto?.randomUUID
    ? `${prefix}-${globalThis.crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const uniqueList = (items) => [...new Set(items.filter(Boolean))];

export const generateFounderBrief = (type, data) => {
  const todayKey = getTodayKey();
  const operatingMetrics = getFounderOperatingMetrics(data);
  const todayEntry = data.dailyEntries.find((entry) => entry.date === todayKey);
  const currentBook = data.books.find((book) => book.status === 'Reading') || null;
  const weekSnapshot = getThisWeekSnapshot(data);
  const learningStreak = getLearningStreak(data.dailyEntries);
  const incompleteTasks = (todayEntry?.missionTasks || []).filter((task) => task.text?.trim() && !task.done);
  const dueDecisions = (data.decisions || []).filter((decision) => decision.reviewDate && parseDateKey(decision.reviewDate) <= parseDateKey(todayKey) && !decision.actualOutcome);
  const overdueFollowUps = (data.contacts || []).filter((contact) => contact.followUpDate && parseDateKey(contact.followUpDate) < parseDateKey(todayKey));
  const blockedProjects = operatingMetrics.projectStats.topProjects.filter((project) => project.stage === 'Blocked');
  const nearCloseDeals = operatingMetrics.revenueStats.nearCloseDeals;
  const activePlan = operatingMetrics.strategyStats.activePlan;

  if (type === 'Daily CEO Brief') {
    const priorities = uniqueList([
      ...incompleteTasks.map((task) => task.text),
      nearCloseDeals[0]?.nextStep,
      blockedProjects[0]?.nextStep || blockedProjects[0]?.blockers,
      operatingMetrics.boardStats.upcomingItems[0]?.asks || operatingMetrics.boardStats.upcomingItems[0]?.notes,
      activePlan?.topPriorities?.split('\n')?.[0],
    ]).slice(0, 5);

    const watchouts = uniqueList([
      operatingMetrics.financeStats.atRisk ? `Runway is ${operatingMetrics.financeStats.runwayMonths} months.` : '',
      blockedProjects[0]?.blockers,
      operatingMetrics.customerStats.recentInterviews < 2 ? 'Customer signal is getting stale this week.' : '',
      dueDecisions[0]?.decision ? `Decision review due: ${dueDecisions[0].decision}` : '',
      overdueFollowUps[0]?.name ? `Relationship overdue: ${overdueFollowUps[0].name}` : '',
    ]).slice(0, 4);

    const wins = uniqueList([
      todayEntry?.winOfDay,
      operatingMetrics.revenueStats.committedRevenue ? `Committed revenue stands at ${currency(operatingMetrics.revenueStats.committedRevenue)}.` : '',
      currentBook?.bookTitle ? `Learning streak is ${learningStreak} days with ${currentBook.bookTitle} active.` : '',
      weekSnapshot.tasksCompleted ? `${weekSnapshot.tasksCompleted} mission tasks completed this week.` : '',
    ]).slice(0, 4);

    return {
      id: createBriefId('brief'),
      type,
      periodKey: todayKey,
      title: `Daily CEO Brief • ${formatShortDate(todayKey)}`,
      generatedAt: new Date().toISOString(),
      summary: `Protect the company by focusing on execution, customer signal, revenue movement, and capital discipline today.`,
      topPriorities: priorities,
      watchouts,
      wins,
      metrics: [
        { label: 'Founder Score', value: String(calculateFounderScore(todayEntry)) },
        { label: 'Runway', value: `${operatingMetrics.financeStats.runwayMonths} mo` },
        { label: 'Weighted Pipeline', value: currency(operatingMetrics.revenueStats.weightedPipeline) },
        { label: 'Learning Streak', value: `${learningStreak}d` },
      ],
    };
  }

  const weekKey = getWeekKey(todayKey);
  const weeklyPriorities = uniqueList([
    activePlan?.topPriorities?.split('\n')?.[0],
    activePlan?.topPriorities?.split('\n')?.[1],
    nearCloseDeals[0]?.nextStep,
    operatingMetrics.projectStats.launchThisWeek[0]?.nextStep,
    operatingMetrics.boardStats.upcomingItems[0]?.asks || operatingMetrics.boardStats.upcomingItems[0]?.notes,
  ]).slice(0, 5);

  const weeklyWatchouts = uniqueList([
    operatingMetrics.financeStats.atRisk ? `Runway is ${operatingMetrics.financeStats.runwayMonths} months.` : '',
    blockedProjects[0]?.projectName ? `${blockedProjects[0].projectName} is blocked.` : '',
    operatingMetrics.customerStats.recentInterviews < 3 ? 'Interview volume is too low for clean PMF signal.' : '',
    operatingMetrics.strategyStats.atRiskList[0]?.planName ? `${operatingMetrics.strategyStats.atRiskList[0].planName} is at risk.` : '',
  ]).slice(0, 4);

  const weeklyWins = uniqueList([
    weekSnapshot.deepWorkHours ? `${weekSnapshot.deepWorkHours} hours of deep work logged this week.` : '',
    weekSnapshot.tasksCompleted ? `${weekSnapshot.tasksCompleted} mission tasks completed this week.` : '',
    operatingMetrics.revenueStats.committedRevenue ? `${currency(operatingMetrics.revenueStats.committedRevenue)} in won revenue is now in the system.` : '',
    operatingMetrics.projectStats.launchReady ? `${operatingMetrics.projectStats.launchReady} project(s) are ready to launch.` : '',
  ]).slice(0, 4);

  return {
    id: createBriefId('brief'),
    type,
    periodKey: weekKey,
    title: `Weekly CEO Brief • ${weekKey}`,
    generatedAt: new Date().toISOString(),
    summary: `This week's CEO view centers on product shipping, PMF freshness, pipeline conversion, and capital readiness.`,
    topPriorities: weeklyPriorities,
    watchouts: weeklyWatchouts,
    wins: weeklyWins,
    metrics: [
      { label: 'Deep Work', value: `${weekSnapshot.deepWorkHours}h` },
      { label: 'Recent Interviews', value: String(operatingMetrics.customerStats.recentInterviews) },
      { label: 'Weighted Pipeline', value: currency(operatingMetrics.revenueStats.weightedPipeline) },
      { label: 'Runway', value: `${operatingMetrics.financeStats.runwayMonths} mo` },
    ],
  };
};

export const syncFounderBriefs = (data) => {
  const automations = data.inboxAutomations || { settings: {}, briefs: [] };
  const settings = automations.settings || {};
  const briefs = automations.briefs || [];
  const todayKey = getTodayKey();
  const weekKey = getWeekKey(todayKey);

  let nextBriefs = briefs;

  if (settings.autoDailyBrief && !briefs.some((brief) => brief.type === 'Daily CEO Brief' && brief.periodKey === todayKey)) {
    nextBriefs = [generateFounderBrief('Daily CEO Brief', data), ...nextBriefs];
  }

  if (settings.autoWeeklyBrief && !nextBriefs.some((brief) => brief.type === 'Weekly CEO Brief' && brief.periodKey === weekKey)) {
    nextBriefs = [generateFounderBrief('Weekly CEO Brief', data), ...nextBriefs];
  }

  if (nextBriefs === briefs) return automations;
  return {
    ...automations,
    briefs: nextBriefs.slice(0, 60),
  };
};
