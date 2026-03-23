import { addDays, endOfWeek, getWeekNumber, parseDateKey, startOfWeek, toDateKey } from './date';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildWeekBuckets = (weeks) =>
  Array.from({ length: weeks }, (_, index) => {
    const offset = weeks - index - 1;
    const weekStart = startOfWeek(addDays(new Date(), -offset * 7));
    return {
      id: toDateKey(weekStart),
      label: `W${getWeekNumber(weekStart)}`,
      start: weekStart,
      end: endOfWeek(weekStart),
    };
  });

const withinRange = (value, start, end) => {
  if (!value) return false;
  const date = parseDateKey(toDateKey(value));
  return date >= start && date <= end;
};

const parseTags = (value) => {
  if (Array.isArray(value)) return value;
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const calculateAgentHoursSaved = (agent) => Number(agent?.estimatedTimeSaved || 0);

export const getAiLearningHoursLast7Days = (ai) =>
  (ai?.modules || []).reduce(
    (total, module) =>
      total +
      (module.logs || []).reduce((moduleTotal, log) => {
        const date = parseDateKey(log.date || toDateKey(new Date()));
        const cutoff = parseDateKey(toDateKey(addDays(new Date(), -6)));
        return date >= cutoff ? moduleTotal + Number(log.hours || 0) : moduleTotal;
      }, 0),
    0,
  );

export const getAiStats = (data) => {
  const ai = data.ai || {};
  const agents = ai.agents || [];
  const experiments = ai.experiments || [];
  const opportunities = ai.opportunities || [];
  const completedModules = (ai.modules || []).filter((module) => module.completed || module.status === 'Complete');
  const highLeverageOpportunities = opportunities
    .filter((item) => Number(item.leverageScore || 0) >= 70)
    .sort((left, right) => Number(right.leverageScore || 0) - Number(left.leverageScore || 0));

  return {
    agentsDesigned: agents.length,
    experimentsRun: experiments.length,
    aiTopicsLearned: completedModules.length,
    aiOpportunitiesLogged: opportunities.length,
    opportunitiesHighLeverageCount: highLeverageOpportunities.length,
    topHighLeverageOpportunities: highLeverageOpportunities.slice(0, 3),
    weeklyHoursSaved:
      agents.reduce((total, agent) => total + calculateAgentHoursSaved(agent), 0) +
      opportunities.reduce((total, item) => total + Number(item.weeklyHoursSaved || 0), 0),
  };
};

export const buildAiAnalytics = (data, weeks = 8) => {
  const ai = data.ai || {};
  const buckets = buildWeekBuckets(weeks);

  const weeklyLearningHours = buckets.map((bucket) =>
    Number(
      (ai.modules || [])
        .reduce(
          (total, module) =>
            total +
            (module.logs || []).reduce(
              (moduleTotal, log) => (withinRange(log.date, bucket.start, bucket.end) ? moduleTotal + Number(log.hours || 0) : moduleTotal),
              0,
            ),
          0,
        )
        .toFixed(1),
    ),
  );

  const agentsDesigned = buckets.map((bucket) =>
    (ai.agents || []).filter((agent) => withinRange(agent.createdAt, bucket.start, bucket.end)).length,
  );

  const experimentSuccessRate = buckets.map((bucket) => {
    const experiments = (ai.experiments || []).filter((experiment) => withinRange(experiment.createdAt, bucket.start, bucket.end));
    if (!experiments.length) return 0;
    const score = experiments.reduce((total, experiment) => {
      if (experiment.whatWorked && !experiment.whatFailed) return total + 1;
      if (experiment.whatWorked && experiment.whatFailed) return total + 0.6;
      if (!experiment.whatWorked && experiment.whatFailed) return total + 0.2;
      return total + 0.4;
    }, 0);
    return Math.round((score / experiments.length) * 100);
  });

  const opportunityLeverage = (ai.opportunities || [])
    .map((opportunity) => ({
      label: opportunity.process || opportunity.industry || 'Opportunity',
      value: Number(opportunity.leverageScore || 0),
    }))
    .sort((left, right) => right.value - left.value);

  return {
    labels: buckets.map((bucket) => bucket.label),
    weeklyLearningHours,
    agentsDesigned,
    experimentSuccessRate,
    opportunityLeverage,
  };
};

export const buildOpportunityCharts = (ai) => {
  const opportunities = ai?.opportunities || [];
  const industryCounts = opportunities.reduce((acc, item) => {
    const key = item.industry || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const automationCounts = opportunities.reduce((acc, item) => {
    const key = item.automationPotential || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    industries: {
      labels: Object.keys(industryCounts),
      values: Object.values(industryCounts),
    },
    automationPotential: {
      labels: Object.keys(automationCounts),
      values: Object.values(automationCounts),
    },
    timeSaved: {
      labels: opportunities.map((item) => item.process || item.industry || 'Opportunity'),
      values: opportunities.map((item) => Number(item.estimatedTimeSavedPct || 0)),
    },
  };
};

export const calculateFounderLeverage = (data) => {
  const deepWorkEntries = data.dailyEntries || [];
  const avgDeepWorkHours =
    deepWorkEntries.length > 0
      ? deepWorkEntries.reduce((total, entry) => total + Number(entry.deepWorkHours || 0), 0) / deepWorkEntries.length
      : 0;
  const aiStats = getAiStats(data);
  const learningHoursLast7Days = getAiLearningHoursLast7Days(data.ai || {});

  const raw =
    avgDeepWorkHours * 10 * 0.35 +
    aiStats.agentsDesigned * 6 * 0.25 +
    aiStats.opportunitiesHighLeverageCount * 12 * 0.2 +
    learningHoursLast7Days * 5 * 0.2;

  return clamp(Math.round(raw), 0, 100);
};

export const normalizeTagList = (value) => parseTags(value);
