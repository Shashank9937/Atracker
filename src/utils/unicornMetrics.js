import { addDays, formatShortDate, getTodayKey, parseDateKey, toDateKey } from './date';
import { extractTopTerms } from './textInsights';

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

export const getFounderOperatingMetrics = (data) => {
  const today = parseDateKey(getTodayKey());
  const strategicPlans = [...(data.strategicPlans || [])].sort((left, right) => sortByNewest(left, right, 'createdAt'));
  const customerResearch = [...(data.customerResearch || [])].sort((left, right) => sortByNewest(left, right, 'interviewDate'));
  const revenuePipeline = [...(data.revenuePipeline || [])].sort((left, right) => sortByNewest(left, right, 'expectedCloseDate'));
  const financeSnapshots = [...(data.financeSnapshots || [])].sort((left, right) => sortByNewest(left, right, 'snapshotDate'));
  const boardItems = [...(data.boardItems || [])].sort((left, right) => sortByNewest(left, right, 'date'));

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
    upcomingItems,
    activeFundraise,
    highestConvictionInvestor:
      [...boardItems]
        .filter((item) => item.entryType === 'Fundraise' || item.entryType === 'Investor Update')
        .sort((left, right) => toNumber(right.interestLevel, 0) - toNumber(left.interestLevel, 0))[0] || null,
  };

  const founderScaleScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        strategyStats.avgProgress * 0.25 +
          Math.min(customerStats.strongSignals * 18, 30) +
          Math.min(revenueStats.weightedPipeline / 1000, 20) +
          Math.min(financeStats.runwayMonths * 1.5, 20) +
          Math.min(boardStats.upcomingItems.length * 5, 5),
      ),
    ),
  );

  return {
    strategyStats,
    customerStats,
    revenueStats,
    financeStats,
    boardStats,
    founderScaleScore,
    runwayTrend: buildRunwayTrend(financeSnapshots),
    revenueStageChart: buildRevenueStageChart(revenuePipeline),
    pmfSignalChart: buildPmfSignalChart(customerResearch),
    boardTypeChart: buildBoardTypeChart(boardItems),
    topPriorityRisks: [
      ...(financeStats.atRisk ? [{ area: 'Finance', title: `Runway is ${runwayMonths} months`, detail: 'Extend runway or improve revenue coverage.' }] : []),
      ...atRiskPlans.slice(0, 2).map((plan) => ({ area: 'Strategy', title: plan.planName, detail: plan.risks || 'Plan is at risk and needs a reset.' })),
      ...overdueBoardItems.slice(0, 2).map((item) => ({ area: item.entryType, title: item.title, detail: item.asks || item.notes || 'Next action is overdue.' })),
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
