import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTodayKey } from '../utils/date';
import {
  buildBookTrendData,
  buildWeeklyProgress,
  buildWeeklyTrendData,
  calculateFounderScore,
  getActiveIdea,
  getCurrentReadingBook,
  getLatestInsights,
  getLearningStreak,
  getThisWeekSnapshot,
  getUpcomingFollowUps,
} from '../utils/metrics';
import {
  createEmptyBookRecord,
  createEmptyDailyEntry,
  createSampleData,
} from '../utils/sampleData';
import {
  loadAppData,
  loadStorageSnapshot,
  saveAppData,
  getStorageDiagnostics,
  aiStorageKey,
  migrationKey,
  storageKey,
} from '../utils/storage';
import {
  createEmptyAiAgent,
  createEmptyAiExperiment,
  createEmptyAiModule,
  createEmptyAiNote,
  createEmptyAiOpportunity,
  createEmptyAiPracticeTask,
  createEmptyAiSection,
  createEmptyAiSystem,
  createEmptyAiTool,
  createSeedAiSection,
  mergeAiSection,
  calculateAiLeverageScore,
  calculateOpportunityHoursSaved,
} from '../utils/aiData';
import {
  buildAiAnalytics,
  buildOpportunityCharts,
  calculateFounderLeverage,
  getAiStats,
  normalizeTagList,
} from '../utils/aiMetrics';
import {
  createEmptyBoardItem,
  createEmptyCustomerInsight,
  createEmptyFinanceSnapshot,
  createEmptyRevenueItem,
  createEmptyStrategicPlan,
  createSeedUnicornData,
} from '../utils/unicornData';
import { getFounderOperatingMetrics } from '../utils/unicornMetrics';

const AppContext = createContext(null);
const seededUnicornData = createSeedUnicornData();

const createId = (prefix) =>
  globalThis.crypto?.randomUUID
    ? `${prefix}-${globalThis.crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeTask = (task) => {
  if (typeof task === 'string') {
    return { id: createId('task'), text: task, done: false };
  }

  return {
    id: task?.id || createId('task'),
    text: task?.text || '',
    done: Boolean(task?.done),
  };
};

const normalizeDailyEntry = (entry) => {
  const base = createEmptyDailyEntry(entry?.date || getTodayKey());
  const tasks = Array.from({ length: 3 }, (_, index) => normalizeTask(entry?.missionTasks?.[index] ?? base.missionTasks[index]));

  return {
    ...base,
    ...entry,
    id: entry?.id || base.id,
    date: entry?.date || base.date,
    missionTasks: tasks,
    peopleContacted: toNumber(entry?.peopleContacted, 0),
    learningHours: toNumber(entry?.learningHours, 0),
    readingMinutes: toNumber(entry?.readingMinutes, 0),
    pagesRead: toNumber(entry?.pagesRead, 0),
    deepWorkHours: toNumber(entry?.deepWorkHours, 0),
    smokingCount: toNumber(entry?.smokingCount, 0),
    energyLevel: toNumber(entry?.energyLevel, 5),
    focusLevel: toNumber(entry?.focusLevel, 5),
    bookBeingRead: entry?.bookBeingRead || '',
    bookInsightOfDay: entry?.bookInsightOfDay || '',
    exercise: Boolean(entry?.exercise),
  };
};

const normalizeBook = (book) => {
  const base = createEmptyBookRecord();
  return {
    ...base,
    ...book,
    id: book?.id || base.id,
    bookTitle: book?.bookTitle || '',
    author: book?.author || '',
    category: book?.category || base.category,
    status: book?.status || base.status,
    startDate: book?.startDate || '',
    finishDate: book?.finishDate || '',
    pages: toNumber(book?.pages, 0),
    dailyReadingMinutes: toNumber(book?.dailyReadingMinutes, 0),
    keyLessons: book?.keyLessons || '',
    favoriteQuotes: book?.favoriteQuotes || '',
    actionableIdeas: book?.actionableIdeas || '',
    bookRating: toNumber(book?.bookRating, 7),
    summary: book?.summary || '',
    keyConcepts: book?.keyConcepts || '',
    ideasToApply: book?.ideasToApply || '',
    businessInsights: book?.businessInsights || '',
    personalReflection: book?.personalReflection || '',
    createdAt: book?.createdAt || base.createdAt,
  };
};

const normalizeIdea = (idea) => ({
  id: idea?.id || createId('idea'),
  ideaName: idea?.ideaName || '',
  problem: idea?.problem || '',
  targetCustomer: idea?.targetCustomer || '',
  marketSize: idea?.marketSize || '',
  whyItMatters: idea?.whyItMatters || '',
  existingSolutions: idea?.existingSolutions || '',
  uniqueInsight: idea?.uniqueInsight || '',
  validationScore: toNumber(idea?.validationScore, 50),
  revenueModel: idea?.revenueModel || '',
  difficulty: idea?.difficulty || 'Medium',
  status: idea?.status || 'Exploring',
  nextExperiment: idea?.nextExperiment || '',
  createdAt: idea?.createdAt || getTodayKey(),
});

const normalizeOpportunity = (opportunity) => ({
  id: opportunity?.id || createId('opp'),
  problem: opportunity?.problem || '',
  industry: opportunity?.industry || '',
  whoExperiencesIt: opportunity?.whoExperiencesIt || '',
  evidenceSource: opportunity?.evidenceSource || '',
  frequency: opportunity?.frequency || '',
  marketSize: opportunity?.marketSize || '',
  opportunityScore: toNumber(opportunity?.opportunityScore, 50),
  potentialSolution: opportunity?.potentialSolution || '',
  status: opportunity?.status || 'Watching',
  createdAt: opportunity?.createdAt || getTodayKey(),
});

const normalizeContact = (contact) => ({
  id: contact?.id || createId('contact'),
  name: contact?.name || '',
  company: contact?.company || '',
  industry: contact?.industry || '',
  whereMet: contact?.whereMet || '',
  lastContactDate: contact?.lastContactDate || getTodayKey(),
  keyInsight: contact?.keyInsight || '',
  followUpDate: contact?.followUpDate || '',
  relationshipStrength: contact?.relationshipStrength || 'Warm',
  notes: contact?.notes || '',
  createdAt: contact?.createdAt || getTodayKey(),
});

const normalizeWeeklyReview = (review) => ({
  id: review?.id || createId('review'),
  weekNumber: toNumber(review?.weekNumber, 1),
  biggestProgress: review?.biggestProgress || '',
  biggestMistake: review?.biggestMistake || '',
  lessonsLearned: review?.lessonsLearned || '',
  opportunitiesDiscovered: review?.opportunitiesDiscovered || '',
  importantContacts: review?.importantContacts || '',
  newSkillsLearned: review?.newSkillsLearned || '',
  healthScore: toNumber(review?.healthScore, 5),
  focusScore: toNumber(review?.focusScore, 5),
  nextWeekStrategy: review?.nextWeekStrategy || '',
  createdAt: review?.createdAt || getTodayKey(),
});

const normalizeDecision = (decision) => ({
  id: decision?.id || createId('decision'),
  decision: decision?.decision || '',
  context: decision?.context || '',
  optionsConsidered: decision?.optionsConsidered || '',
  whyChosen: decision?.whyChosen || '',
  expectedOutcome: decision?.expectedOutcome || '',
  reviewDate: decision?.reviewDate || getTodayKey(),
  actualOutcome: decision?.actualOutcome || '',
  linkedEntityType: decision?.linkedEntityType || '',
  linkedEntityId: decision?.linkedEntityId || '',
  area: decision?.area || '',
  createdAt: decision?.createdAt || getTodayKey(),
});

const normalizeKnowledgeItem = (item) => ({
  id: item?.id || createId('knowledge'),
  title: item?.title || '',
  type: item?.type || 'Insight',
  content: item?.content || '',
  tags: Array.isArray(item?.tags)
    ? item.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(item?.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
  createdAt: item?.createdAt || getTodayKey(),
});

const normalizeQuickNote = (note) => ({
  id: note?.id || createId('capture'),
  type: note?.type || 'Note',
  text: note?.text || '',
  createdAt: note?.createdAt || new Date().toISOString(),
});

const normalizeEveningJournal = (journal) => ({
  id: journal?.id || createId('journal'),
  date: journal?.date || getTodayKey(),
  progress: journal?.progress || '',
  problem: journal?.problem || '',
  insight: journal?.insight || '',
  waste: journal?.waste || '',
  tomorrow: journal?.tomorrow || '',
  learning: journal?.learning || '',
  gratitude: journal?.gratitude || '',
});

const normalizeStrategicPlan = (plan) => {
  const base = createEmptyStrategicPlan();
  return {
    ...base,
    ...plan,
    id: plan?.id || base.id,
    planName: plan?.planName || '',
    horizon: plan?.horizon || base.horizon,
    period: plan?.period || '',
    mission: plan?.mission || '',
    northStarMetric: plan?.northStarMetric || '',
    northStarTarget: plan?.northStarTarget || '',
    keyResults: plan?.keyResults || '',
    strategicBets: plan?.strategicBets || '',
    topPriorities: plan?.topPriorities || '',
    risks: plan?.risks || '',
    progress: toNumber(plan?.progress, 0),
    confidence: toNumber(plan?.confidence, 5),
    status: plan?.status || base.status,
    createdAt: plan?.createdAt || base.createdAt,
  };
};

const normalizeCustomerInsight = (insight) => {
  const base = createEmptyCustomerInsight();
  return {
    ...base,
    ...insight,
    id: insight?.id || base.id,
    company: insight?.company || '',
    contactName: insight?.contactName || '',
    segment: insight?.segment || '',
    interviewDate: insight?.interviewDate || base.interviewDate,
    problemArea: insight?.problemArea || '',
    painScore: toNumber(insight?.painScore, 7),
    budgetSignal: toNumber(insight?.budgetSignal, 5),
    currentWorkflow: insight?.currentWorkflow || '',
    urgency: insight?.urgency || '',
    objections: insight?.objections || '',
    requestedOutcome: insight?.requestedOutcome || '',
    notableQuote: insight?.notableQuote || '',
    pmfSignal: insight?.pmfSignal || base.pmfSignal,
    nextStep: insight?.nextStep || '',
    createdAt: insight?.createdAt || base.createdAt,
  };
};

const normalizeRevenueItem = (item) => {
  const base = createEmptyRevenueItem();
  return {
    ...base,
    ...item,
    id: item?.id || base.id,
    accountName: item?.accountName || '',
    channelType: item?.channelType || base.channelType,
    stage: item?.stage || base.stage,
    dealValue: toNumber(item?.dealValue, 0),
    closeProbability: toNumber(item?.closeProbability, 10),
    expectedCloseDate: item?.expectedCloseDate || '',
    source: item?.source || '',
    useCase: item?.useCase || '',
    nextStep: item?.nextStep || '',
    blockers: item?.blockers || '',
    createdAt: item?.createdAt || base.createdAt,
  };
};

const normalizeFinanceSnapshot = (snapshot) => {
  const base = createEmptyFinanceSnapshot();
  return {
    ...base,
    ...snapshot,
    id: snapshot?.id || base.id,
    snapshotDate: snapshot?.snapshotDate || base.snapshotDate,
    cashOnHand: toNumber(snapshot?.cashOnHand, 0),
    monthlyRevenue: toNumber(snapshot?.monthlyRevenue, 0),
    monthlyBurn: toNumber(snapshot?.monthlyBurn, 0),
    payroll: toNumber(snapshot?.payroll, 0),
    infraCost: toNumber(snapshot?.infraCost, 0),
    marketingSpend: toNumber(snapshot?.marketingSpend, 0),
    otherExpenses: toNumber(snapshot?.otherExpenses, 0),
    targetRunwayMonths: toNumber(snapshot?.targetRunwayMonths, 18),
    notes: snapshot?.notes || '',
    scenarioName: snapshot?.scenarioName || base.scenarioName,
    createdAt: snapshot?.createdAt || base.createdAt,
  };
};

const normalizeBoardItem = (item) => {
  const base = createEmptyBoardItem();
  return {
    ...base,
    ...item,
    id: item?.id || base.id,
    entryType: item?.entryType || base.entryType,
    title: item?.title || '',
    contactName: item?.contactName || '',
    firm: item?.firm || '',
    stage: item?.stage || '',
    status: item?.status || base.status,
    date: item?.date || base.date,
    nextActionDate: item?.nextActionDate || '',
    targetRaise: toNumber(item?.targetRaise, 0),
    checkSize: toNumber(item?.checkSize, 0),
    interestLevel: toNumber(item?.interestLevel, 5),
    keyWins: item?.keyWins || '',
    metricsSummary: item?.metricsSummary || '',
    asks: item?.asks || '',
    notes: item?.notes || '',
    createdAt: item?.createdAt || base.createdAt,
  };
};

const normalizeAiModule = (module) => {
  const base = createEmptyAiModule();
  return {
    ...base,
    ...module,
    id: module?.id || base.id,
    title: module?.title || '',
    description: module?.description || '',
    status: module?.status || base.status,
    notes: module?.notes || '',
    resources: module?.resources || '',
    learningHours: toNumber(module?.learningHours, 0),
    completed: Boolean(module?.completed) || module?.status === 'Complete',
    practiceTasks: Array.isArray(module?.practiceTasks) ? module.practiceTasks.filter(Boolean) : [],
    logs: Array.isArray(module?.logs)
      ? module.logs.map((log) => ({
          date: log?.date || getTodayKey(),
          hours: toNumber(log?.hours, 0),
          note: log?.note || '',
        }))
      : [],
    createdAt: module?.createdAt || base.createdAt,
  };
};

const normalizeAiPracticeTask = (task) => {
  const base = createEmptyAiPracticeTask();
  return {
    ...base,
    ...task,
    id: task?.id || base.id,
    title: task?.title || '',
    description: task?.description || '',
    doneDates: Array.isArray(task?.doneDates) ? task.doneDates.filter(Boolean) : [],
    createdAt: task?.createdAt || base.createdAt,
  };
};

const normalizeAiAgent = (agent) => {
  const base = createEmptyAiAgent();
  return {
    ...base,
    ...agent,
    id: agent?.id || base.id,
    agentName: agent?.agentName || agent?.name || '',
    purpose: agent?.purpose || agent?.role || '',
    problemSolved: agent?.problemSolved || '',
    targetUser: agent?.targetUser || '',
    inputData: agent?.inputData || '',
    toolsNeeded: agent?.toolsNeeded || '',
    modelsUsed: agent?.modelsUsed || agent?.model || '',
    workflowSteps: Array.isArray(agent?.workflowSteps)
      ? agent.workflowSteps.map((step) => ({
          id: step?.id || createId('step'),
          text: step?.text || '',
        }))
      : base.workflowSteps,
    memoryType: agent?.memoryType || '',
    output: agent?.output || '',
    status: agent?.status || base.status,
    estimatedTimeSaved: toNumber(agent?.estimatedTimeSaved, 0),
    estimatedCostSaved: toNumber(agent?.estimatedCostSaved, 0),
    leveragePotential: agent?.leveragePotential || 'Medium',
    tags: normalizeTagList(agent?.tags),
    notes: agent?.notes || '',
    decisionIds: Array.isArray(agent?.decisionIds) ? agent.decisionIds.filter(Boolean) : [],
    createdAt: agent?.createdAt || base.createdAt,
  };
};

const normalizeAiSystem = (system) => {
  const base = createEmptyAiSystem();
  return {
    ...base,
    ...system,
    id: system?.id || base.id,
    systemName: system?.systemName || '',
    industry: system?.industry || '',
    problem: system?.problem || '',
    systemDescription: system?.systemDescription || '',
    numberOfAgents: toNumber(system?.numberOfAgents, Array.isArray(system?.agents) ? system.agents.length : 1),
    expectedOutcome: system?.expectedOutcome || '',
    agents: Array.isArray(system?.agents)
      ? system.agents.map((agent) => ({
          id: agent?.id || createId('system-agent'),
          role: agent?.role || '',
          inputs: agent?.inputs || '',
          outputs: agent?.outputs || '',
          dependencies: agent?.dependencies || '',
        }))
      : base.agents,
    status: system?.status || base.status,
    decisionIds: Array.isArray(system?.decisionIds) ? system.decisionIds.filter(Boolean) : [],
    createdAt: system?.createdAt || base.createdAt,
  };
};

const normalizeAiExperiment = (experiment) => {
  const base = createEmptyAiExperiment();
  return {
    ...base,
    ...experiment,
    id: experiment?.id || base.id,
    experimentName: experiment?.experimentName || '',
    hypothesis: experiment?.hypothesis || '',
    promptUsed: experiment?.promptUsed || '',
    modelUsed: experiment?.modelUsed || '',
    toolsUsed: experiment?.toolsUsed || '',
    inputData: experiment?.inputData || '',
    resultOutput: experiment?.resultOutput || '',
    whatWorked: experiment?.whatWorked || '',
    whatFailed: experiment?.whatFailed || '',
    nextIteration: experiment?.nextIteration || '',
    timeSpent: toNumber(experiment?.timeSpent, 0),
    tags: normalizeTagList(experiment?.tags),
    agentId: experiment?.agentId || '',
    versions: Array.isArray(experiment?.versions) ? experiment.versions : [],
    createdAt: experiment?.createdAt || base.createdAt,
    updatedAt: experiment?.updatedAt || new Date().toISOString(),
  };
};

const normalizeAiTool = (tool) => {
  const base = createEmptyAiTool();
  return {
    ...base,
    ...tool,
    id: tool?.id || base.id,
    toolName: tool?.toolName || '',
    category: tool?.category || base.category,
    website: tool?.website || '',
    purpose: tool?.purpose || '',
    useCase: tool?.useCase || '',
    rating: toNumber(tool?.rating, 7),
    notes: tool?.notes || '',
    createdAt: tool?.createdAt || base.createdAt,
  };
};

const normalizeAiOpportunity = (opportunity) => {
  const base = createEmptyAiOpportunity();
  const timeSaved = toNumber(opportunity?.estimatedTimeSavedPct, base.estimatedTimeSavedPct);
  const marketScore = toNumber(opportunity?.marketSizeScore, base.marketSizeScore);
  const speedScore = toNumber(opportunity?.executionSpeedScore, base.executionSpeedScore);
  return {
    ...base,
    ...opportunity,
    id: opportunity?.id || base.id,
    industry: opportunity?.industry || '',
    process: opportunity?.process || '',
    currentManualWork: opportunity?.currentManualWork || '',
    painPoints: opportunity?.painPoints || '',
    aiSolution: opportunity?.aiSolution || '',
    toolsRequired: opportunity?.toolsRequired || '',
    estimatedTimeSavedPct: timeSaved,
    estimatedCostSaved: toNumber(opportunity?.estimatedCostSaved, 0),
    automationPotential: opportunity?.automationPotential || 'Medium',
    implementationDifficulty: opportunity?.implementationDifficulty || 'Medium',
    status: opportunity?.status || 'Idea',
    notes: opportunity?.notes || '',
    marketSizeScore: marketScore,
    executionSpeedScore: speedScore,
    leverageScore: toNumber(opportunity?.leverageScore, calculateAiLeverageScore(timeSaved, marketScore, speedScore)),
    weeklyHoursSaved: toNumber(opportunity?.weeklyHoursSaved, calculateOpportunityHoursSaved(timeSaved)),
    createdAt: opportunity?.createdAt || base.createdAt,
  };
};

const normalizeAiNote = (note) => {
  const base = createEmptyAiNote();
  return {
    ...base,
    ...note,
    id: note?.id || base.id,
    title: note?.title || '',
    type: note?.type || base.type,
    content: note?.content || '',
    tags: normalizeTagList(note?.tags),
    createdAt: note?.createdAt || base.createdAt,
    updatedAt: note?.updatedAt || new Date().toISOString(),
  };
};

const normalizeAiQuickCapture = (capture) => ({
  id: capture?.id || createId('ai-capture'),
  type: capture?.type || 'AI Note',
  text: capture?.text || '',
  attachTo: capture?.attachTo || 'today',
  agentId: capture?.agentId || '',
  date: capture?.date || getTodayKey(),
  createdAt: capture?.createdAt || new Date().toISOString(),
});

const byDateDesc = (left, right) => new Date(right.date || right.updatedAt || right.createdAt || 0) - new Date(left.date || left.updatedAt || left.createdAt || 0);
const byScoreDesc = (key) => (left, right) => toNumber(right[key], 0) - toNumber(left[key], 0);
const byFieldDesc = (key) => (left, right) => new Date(right[key] || right.createdAt || 0) - new Date(left[key] || left.createdAt || 0);
const bookStatusOrder = { Reading: 0, 'Not Started': 1, Completed: 2 };
const byBookPriority = (left, right) => {
  const rankDelta = (bookStatusOrder[left.status] ?? 99) - (bookStatusOrder[right.status] ?? 99);
  if (rankDelta !== 0) return rankDelta;
  return new Date(right.finishDate || right.startDate || right.createdAt || 0) - new Date(left.finishDate || left.startDate || left.createdAt || 0);
};

const normalizeAiSection = (ai) => {
  const base = createEmptyAiSection();
  return {
    ...base,
    ...ai,
    modules: Array.isArray(ai?.modules) ? ai.modules.map(normalizeAiModule) : [],
    dailyPractice: Array.isArray(ai?.dailyPractice) ? ai.dailyPractice.map(normalizeAiPracticeTask) : [],
    agents: Array.isArray(ai?.agents) ? ai.agents.map(normalizeAiAgent).sort(byDateDesc) : [],
    systems: Array.isArray(ai?.systems) ? ai.systems.map(normalizeAiSystem).sort(byDateDesc) : [],
    experiments: Array.isArray(ai?.experiments) ? ai.experiments.map(normalizeAiExperiment).sort(byDateDesc) : [],
    tools: Array.isArray(ai?.tools) ? ai.tools.map(normalizeAiTool).sort(byDateDesc) : [],
    opportunities: Array.isArray(ai?.opportunities) ? ai.opportunities.map(normalizeAiOpportunity).sort(byScoreDesc('leverageScore')) : [],
    notes: Array.isArray(ai?.notes) ? ai.notes.map(normalizeAiNote).sort(byDateDesc) : [],
    quickCaptures: Array.isArray(ai?.quickCaptures) ? ai.quickCaptures.map(normalizeAiQuickCapture).sort(byDateDesc) : [],
  };
};

const normalizeAppData = (raw) => {
  const source = !raw || typeof raw !== 'object' ? createSampleData() : raw;
  return {
    settings: {
      founderName: source.settings?.founderName || 'Founder',
      theme: source.settings?.theme === 'light' ? 'light' : 'dark',
    },
    dailyEntries: Array.isArray(source.dailyEntries) ? source.dailyEntries.map(normalizeDailyEntry).sort(byDateDesc) : [],
    books: Array.isArray(source.books) ? source.books.map(normalizeBook).sort(byBookPriority) : [],
    ideas: Array.isArray(source.ideas) ? source.ideas.map(normalizeIdea).sort(byScoreDesc('validationScore')) : [],
    opportunities: Array.isArray(source.opportunities) ? source.opportunities.map(normalizeOpportunity).sort(byScoreDesc('opportunityScore')) : [],
    contacts: Array.isArray(source.contacts) ? source.contacts.map(normalizeContact).sort(byDateDesc) : [],
    weeklyReviews: Array.isArray(source.weeklyReviews) ? source.weeklyReviews.map(normalizeWeeklyReview).sort(byDateDesc) : [],
    decisions: Array.isArray(source.decisions) ? source.decisions.map(normalizeDecision).sort(byDateDesc) : [],
    knowledgeItems: Array.isArray(source.knowledgeItems) ? source.knowledgeItems.map(normalizeKnowledgeItem).sort(byDateDesc) : [],
    quickNotes: Array.isArray(source.quickNotes) ? source.quickNotes.map(normalizeQuickNote).sort(byDateDesc) : [],
    eveningJournals: Array.isArray(source.eveningJournals) ? source.eveningJournals.map(normalizeEveningJournal).sort(byDateDesc) : [],
    strategicPlans: Array.isArray(source.strategicPlans)
      ? source.strategicPlans.map(normalizeStrategicPlan).sort(byFieldDesc('createdAt'))
      : seededUnicornData.strategicPlans.map(normalizeStrategicPlan).sort(byFieldDesc('createdAt')),
    customerResearch: Array.isArray(source.customerResearch)
      ? source.customerResearch.map(normalizeCustomerInsight).sort(byFieldDesc('interviewDate'))
      : seededUnicornData.customerResearch.map(normalizeCustomerInsight).sort(byFieldDesc('interviewDate')),
    revenuePipeline: Array.isArray(source.revenuePipeline)
      ? source.revenuePipeline.map(normalizeRevenueItem).sort(byFieldDesc('expectedCloseDate'))
      : seededUnicornData.revenuePipeline.map(normalizeRevenueItem).sort(byFieldDesc('expectedCloseDate')),
    financeSnapshots: Array.isArray(source.financeSnapshots)
      ? source.financeSnapshots.map(normalizeFinanceSnapshot).sort(byFieldDesc('snapshotDate'))
      : seededUnicornData.financeSnapshots.map(normalizeFinanceSnapshot).sort(byFieldDesc('snapshotDate')),
    boardItems: Array.isArray(source.boardItems)
      ? source.boardItems.map(normalizeBoardItem).sort(byFieldDesc('date'))
      : seededUnicornData.boardItems.map(normalizeBoardItem).sort(byFieldDesc('date')),
    ai: normalizeAiSection(source.ai || createEmptyAiSection()),
  };
};

const replaceById = (list, record, sortFn = null) => {
  const exists = list.some((item) => item.id === record.id);
  const next = exists ? list.map((item) => (item.id === record.id ? record : item)) : [record, ...list];
  return sortFn ? [...next].sort(sortFn) : next;
};

const upsertDailyByDate = (list, record) => [record, ...list.filter((item) => item.date !== record.date)].sort(byDateDesc);

const convertLegacyAgent = (agent) => ({
  id: agent?.id || createId('legacy-agent'),
  agentName: agent?.name || '',
  purpose: agent?.role || '',
  problemSolved: '',
  targetUser: '',
  inputData: '',
  toolsNeeded: Array.isArray(agent?.capabilities) ? agent.capabilities.join(', ') : '',
  modelsUsed: agent?.model || '',
  workflowSteps: [
    { id: createId('step'), text: 'Receive founder input or workflow trigger' },
    { id: createId('step'), text: 'Use configured capabilities and provider context' },
    { id: createId('step'), text: 'Return the requested draft, summary, or recommendation' },
  ],
  memoryType: 'Short-term context',
  output: '',
  status: agent?.status === 'Active' ? 'Deployed' : agent?.status || 'Idea',
  estimatedTimeSaved: 8,
  estimatedCostSaved: 0,
  leveragePotential: 'Medium',
  tags: Array.isArray(agent?.capabilities) ? agent.capabilities : [],
  notes: '',
  decisionIds: [],
  createdAt: agent?.createdAt || getTodayKey(),
});

const createInitialState = () => {
  const snapshot = loadStorageSnapshot();
  const workspace = normalizeAppData(snapshot.workspace || loadAppData() || createSampleData());

  const namespacedAiPayloads = Object.entries(snapshot.namespace || {})
    .filter(([key, value]) => key !== storageKey && key !== aiStorageKey && key !== migrationKey && value && typeof value === 'object')
    .map(([, value]) => value)
    .filter((value) => value.agents || value.modules || value.systems || value.experiments || value.tools || value.opportunities || value.notes);

  const legacyAiPayload = Array.isArray(snapshot.workspace?.aiAgents) && snapshot.workspace.aiAgents.length
    ? { agents: snapshot.workspace.aiAgents.map(convertLegacyAgent) }
    : null;

  const structuredAiPayloads = [snapshot.workspace?.ai, snapshot.aiMirror, ...namespacedAiPayloads].filter(Boolean);
  const mergedAi =
    structuredAiPayloads.length === 0
      ? legacyAiPayload
        ? mergeAiSection([createSeedAiSection(), legacyAiPayload])
        : createSeedAiSection()
      : mergeAiSection([...structuredAiPayloads, ...(legacyAiPayload ? [legacyAiPayload] : [])]);

  return {
    ...workspace,
    ai: normalizeAiSection(mergedAi),
  };
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(createInitialState);
  const [storageDiagnostics, setStorageDiagnostics] = useState(() => getStorageDiagnostics());
  const todayKey = getTodayKey();

  useEffect(() => {
    saveAppData(data);
    setStorageDiagnostics(getStorageDiagnostics());
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.settings.theme === 'dark');
    document.documentElement.style.colorScheme = data.settings.theme;
  }, [data.settings.theme]);

  const todayEntry = useMemo(
    () => data.dailyEntries.find((entry) => entry.date === todayKey) || createEmptyDailyEntry(todayKey),
    [data.dailyEntries, todayKey],
  );

  const saveDailyEntry = (entry) => {
    const record = normalizeDailyEntry(entry);
    setData((current) => ({
      ...current,
      dailyEntries: upsertDailyByDate(current.dailyEntries, record),
    }));
  };

  const patchDailyEntry = (date, updater) => {
    setData((current) => {
      const existing = current.dailyEntries.find((item) => item.date === date) || createEmptyDailyEntry(date);
      const nextEntry = normalizeDailyEntry(typeof updater === 'function' ? updater(existing) : { ...existing, ...updater, date });
      return {
        ...current,
        dailyEntries: upsertDailyByDate(current.dailyEntries, nextEntry),
      };
    });
  };

  const patchTodayEntry = (updates) => patchDailyEntry(todayKey, (entry) => ({ ...entry, ...updates }));

  const addDeepWorkMinutes = (minutes) => {
    patchDailyEntry(todayKey, (entry) => ({
      ...entry,
      deepWorkHours: Number((Number(entry.deepWorkHours || 0) + minutes / 60).toFixed(1)),
    }));
  };

  const saveBook = (book) => {
    const record = normalizeBook(book);
    setData((current) => ({
      ...current,
      books: replaceById(current.books, record, byBookPriority),
    }));
  };

  const addIdea = (idea) => {
    const record = normalizeIdea(idea);
    setData((current) => ({
      ...current,
      ideas: replaceById(current.ideas, record, byScoreDesc('validationScore')),
    }));
  };

  const addOpportunity = (opportunity) => {
    const record = normalizeOpportunity(opportunity);
    setData((current) => ({
      ...current,
      opportunities: replaceById(current.opportunities, record, byScoreDesc('opportunityScore')),
    }));
  };

  const addContact = (contact) => {
    const record = normalizeContact(contact);
    setData((current) => ({
      ...current,
      contacts: replaceById(current.contacts, record, byDateDesc),
    }));
  };

  const addWeeklyReview = (review) => {
    const record = normalizeWeeklyReview(review);
    setData((current) => ({
      ...current,
      weeklyReviews: replaceById(current.weeklyReviews, record, byDateDesc),
    }));
  };

  const addDecision = (decision) => {
    const record = normalizeDecision(decision);
    setData((current) => ({
      ...current,
      decisions: replaceById(current.decisions, record, byDateDesc),
    }));
    return record;
  };

  const addKnowledgeItem = (item) => {
    const record = normalizeKnowledgeItem(item);
    setData((current) => ({
      ...current,
      knowledgeItems: replaceById(current.knowledgeItems, record, byDateDesc),
    }));
  };

  const saveStrategicPlan = (plan) => {
    const record = normalizeStrategicPlan(plan);
    setData((current) => ({
      ...current,
      strategicPlans: replaceById(current.strategicPlans, record, byFieldDesc('createdAt')),
    }));
  };

  const saveCustomerInsight = (insight) => {
    const record = normalizeCustomerInsight(insight);
    setData((current) => ({
      ...current,
      customerResearch: replaceById(current.customerResearch, record, byFieldDesc('interviewDate')),
    }));
  };

  const saveRevenueItem = (item) => {
    const record = normalizeRevenueItem(item);
    setData((current) => ({
      ...current,
      revenuePipeline: replaceById(current.revenuePipeline, record, byFieldDesc('expectedCloseDate')),
    }));
  };

  const saveFinanceSnapshot = (snapshot) => {
    const record = normalizeFinanceSnapshot(snapshot);
    setData((current) => ({
      ...current,
      financeSnapshots: replaceById(current.financeSnapshots, record, byFieldDesc('snapshotDate')),
    }));
  };

  const saveBoardItem = (item) => {
    const record = normalizeBoardItem(item);
    setData((current) => ({
      ...current,
      boardItems: replaceById(current.boardItems, record, byFieldDesc('date')),
    }));
  };

  const addEveningJournal = (journal) => {
    const record = normalizeEveningJournal(journal);
    setData((current) => ({
      ...current,
      eveningJournals: replaceById(current.eveningJournals, record, byDateDesc),
    }));
  };

  const saveAiModule = (module) => {
    const record = normalizeAiModule(module);
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        modules: replaceById(current.ai.modules, record),
      },
    }));
  };

  const logAiModuleHours = (moduleId, hours, note = '') => {
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        modules: current.ai.modules.map((module) =>
          module.id === moduleId
            ? normalizeAiModule({
                ...module,
                learningHours: Number(module.learningHours || 0) + Number(hours || 0),
                logs: [...(module.logs || []), { date: todayKey, hours: Number(hours || 0), note }],
              })
            : module,
        ),
      },
    }));
  };

  const toggleAiPracticeTask = (taskId, date = todayKey) => {
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        dailyPractice: current.ai.dailyPractice.map((task) =>
          task.id === taskId
            ? normalizeAiPracticeTask({
                ...task,
                doneDates: task.doneDates.includes(date)
                  ? task.doneDates.filter((item) => item !== date)
                  : [...task.doneDates, date],
              })
            : task,
        ),
      },
    }));
  };

  const saveAiAgent = (agent) => {
    const record = normalizeAiAgent(agent);
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        agents: replaceById(current.ai.agents, record, byDateDesc),
      },
    }));
    return record;
  };

  const saveAiSystem = (system) => {
    const record = normalizeAiSystem(system);
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        systems: replaceById(current.ai.systems, record, byDateDesc),
      },
    }));
    return record;
  };

  const saveAiExperiment = (experiment) => {
    setData((current) => {
      const existing = current.ai.experiments.find((item) => item.id === experiment.id);
      const record = normalizeAiExperiment({
        ...experiment,
        versions: existing
          ? [
              {
                recordedAt: new Date().toISOString(),
                snapshot: {
                  ...existing,
                },
              },
              ...(existing.versions || []),
            ]
          : experiment.versions,
        updatedAt: new Date().toISOString(),
      });

      return {
        ...current,
        ai: {
          ...current.ai,
          experiments: replaceById(current.ai.experiments, record, byDateDesc),
        },
      };
    });
  };

  const saveAiTool = (tool) => {
    const record = normalizeAiTool(tool);
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        tools: replaceById(current.ai.tools, record, byDateDesc),
      },
    }));
  };

  const saveAiOpportunity = (opportunity) => {
    const record = normalizeAiOpportunity(opportunity);
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        opportunities: replaceById(current.ai.opportunities, record, byScoreDesc('leverageScore')),
      },
    }));
    return record;
  };

  const saveAiNote = (note) => {
    const record = normalizeAiNote(note);
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        notes: replaceById(current.ai.notes, record, byDateDesc),
      },
    }));
    return record;
  };

  const createLinkedDecision = (entityType, entityId, payload) => {
    const decision = normalizeDecision({
      ...payload,
      linkedEntityType: entityType,
      linkedEntityId: entityId,
      area: 'AI Agents',
    });

    setData((current) => ({
      ...current,
      decisions: replaceById(current.decisions, decision, byDateDesc),
      ai: {
        ...current.ai,
        agents:
          entityType === 'agent'
            ? current.ai.agents.map((agent) =>
                agent.id === entityId
                  ? { ...agent, decisionIds: [...new Set([...(agent.decisionIds || []), decision.id])] }
                  : agent,
              )
            : current.ai.agents,
        systems:
          entityType === 'system'
            ? current.ai.systems.map((system) =>
                system.id === entityId
                  ? { ...system, decisionIds: [...new Set([...(system.decisionIds || []), decision.id])] }
                  : system,
              )
            : current.ai.systems,
      },
    }));

    return decision;
  };

  const createAgentFromBook = (book) => {
    if (!book) return;
    const ideaTitle = `${book.bookTitle} Agent Thesis`;
    const agent = normalizeAiAgent({
      agentName: `${book.bookTitle} Insight Agent`,
      purpose: `Turn the lessons from ${book.bookTitle} into a practical AI assistant or workflow.`,
      problemSolved: book.businessInsights || book.keyLessons || 'Translate reading into execution.',
      targetUser: 'Founder',
      inputData: book.summary || book.keyConcepts || book.actionableIdeas,
      toolsNeeded: 'LLM, notes, workflow memory',
      modelsUsed: 'GPT-4o',
      output: 'Actionable operating plan and product ideas from book insights',
      status: 'Idea',
      estimatedTimeSaved: 4,
      leveragePotential: 'Medium',
      tags: ['book-derived', book.category],
      notes: book.personalReflection || '',
    });

    const idea = normalizeIdea({
      ideaName: ideaTitle,
      problem: book.businessInsights || book.keyLessons || 'Apply reading insight through product or agent design.',
      targetCustomer: 'Founders building leverage systems',
      marketSize: 'Emerging productivity and AI operations market',
      whyItMatters: 'Books should convert into experiments, not just notes.',
      existingSolutions: 'Manual reading notes and static summaries',
      uniqueInsight: book.actionableIdeas || book.ideasToApply || book.summary,
      validationScore: 60,
      revenueModel: 'Subscription or internal leverage gain',
      difficulty: 'Medium',
      status: 'Exploring',
      nextExperiment: `Prototype an agent from ${book.bookTitle}.`,
    });

    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        agents: replaceById(current.ai.agents, agent, byDateDesc),
      },
      ideas: replaceById(current.ideas, idea, byScoreDesc('validationScore')),
    }));
  };

  const addQuickCapture = ({ type = 'Note', text = '', attachTo = 'today', agentId = '' }) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setData((current) => {
      const note = normalizeQuickNote({ type, text: trimmed });
      const capture = normalizeAiQuickCapture({ type, text: trimmed, attachTo, agentId, date: todayKey });
      let next = {
        ...current,
        quickNotes: [note, ...current.quickNotes].slice(0, 40),
        ai: {
          ...current.ai,
          quickCaptures: [capture, ...(current.ai.quickCaptures || [])].slice(0, 60),
        },
      };

      if (type === 'Idea') {
        next = {
          ...next,
          ideas: replaceById(
            next.ideas,
            normalizeIdea({
              ideaName: trimmed,
              status: 'Exploring',
              validationScore: 55,
              nextExperiment: 'Expand this quick capture into a sharper founder thesis.',
            }),
            byScoreDesc('validationScore'),
          ),
        };
      }

      if (type === 'Contact') {
        next = {
          ...next,
          contacts: replaceById(
            next.contacts,
            normalizeContact({
              name: trimmed,
              relationshipStrength: 'Warm',
              followUpDate: todayKey,
              notes: 'Created from quick capture.',
            }),
            byDateDesc,
          ),
        };
      }

      if (type === 'Insight') {
        next = {
          ...next,
          knowledgeItems: replaceById(
            next.knowledgeItems,
            normalizeKnowledgeItem({
              title: trimmed.slice(0, 72),
              type: 'Insight',
              content: trimmed,
              tags: ['quick-capture'],
            }),
            byDateDesc,
          ),
        };
      }

      if (type === 'Task') {
        const existing = next.dailyEntries.find((item) => item.date === todayKey) || createEmptyDailyEntry(todayKey);
        let assigned = false;
        const missionTasks = existing.missionTasks.map((task) => {
          if (!assigned && !task.text.trim()) {
            assigned = true;
            return { ...task, text: trimmed };
          }
          return task;
        });

        if (!assigned) {
          missionTasks[missionTasks.length - 1] = { ...missionTasks[missionTasks.length - 1], text: trimmed, done: false };
        }

        next = {
          ...next,
          dailyEntries: upsertDailyByDate(next.dailyEntries, normalizeDailyEntry({ ...existing, missionTasks })),
        };
      }

      if (type === 'AI Note') {
        next = {
          ...next,
          ai: {
            ...next.ai,
            notes: replaceById(
              next.ai.notes,
              normalizeAiNote({
                title: trimmed.slice(0, 72),
                type: 'Research',
                content: trimmed,
                tags: ['quick-capture'],
              }),
              byDateDesc,
            ),
          },
        };
      }

      if (type === 'AI Opportunity') {
        next = {
          ...next,
          ai: {
            ...next.ai,
            opportunities: replaceById(
              next.ai.opportunities,
              normalizeAiOpportunity({
                industry: 'Unsorted',
                process: trimmed.slice(0, 72),
                currentManualWork: trimmed,
                painPoints: trimmed,
                aiSolution: '',
                status: 'Idea',
              }),
              byScoreDesc('leverageScore'),
            ),
          },
        };
      }

      if (type === 'Experiment') {
        next = {
          ...next,
          ai: {
            ...next.ai,
            experiments: replaceById(
              next.ai.experiments,
              normalizeAiExperiment({
                experimentName: trimmed.slice(0, 72),
                hypothesis: trimmed,
                agentId,
              }),
              byDateDesc,
            ),
          },
        };
      }

      if (type === 'Agent Note' && agentId) {
        next = {
          ...next,
          ai: {
            ...next.ai,
            agents: next.ai.agents.map((agent) =>
              agent.id === agentId
                ? normalizeAiAgent({
                    ...agent,
                    notes: agent.notes ? `${agent.notes}\n\n${trimmed}` : trimmed,
                  })
                : agent,
            ),
          },
        };
      }

      return next;
    });
  };

  const deleteRecord = (collection, id) => {
    setData((current) => ({
      ...current,
      [collection]: Array.isArray(current[collection]) ? current[collection].filter((item) => item.id !== id) : current[collection],
    }));
  };

  const deleteAiRecord = (collection, id) => {
    setData((current) => ({
      ...current,
      ai: {
        ...current.ai,
        [collection]: Array.isArray(current.ai[collection]) ? current.ai[collection].filter((item) => item.id !== id) : current.ai[collection],
      },
    }));
  };

  const updateSettings = (updates) => {
    setData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        ...updates,
      },
    }));
  };

  const importState = (payload) => {
    setData(normalizeAppData(payload));
  };

  const runStorageMerge = () => {
    const snapshot = loadStorageSnapshot();
    const structuredAiPayloads = [snapshot.workspace?.ai, snapshot.aiMirror].filter(Boolean);
    const legacyAiPayload = Array.isArray(snapshot.workspace?.aiAgents) && snapshot.workspace.aiAgents.length
      ? { agents: snapshot.workspace.aiAgents.map(convertLegacyAgent) }
      : null;

    const ai =
      structuredAiPayloads.length === 0
        ? legacyAiPayload
          ? normalizeAiSection(mergeAiSection([createSeedAiSection(), legacyAiPayload]))
          : normalizeAiSection(createSeedAiSection())
        : normalizeAiSection(mergeAiSection([...structuredAiPayloads, ...(legacyAiPayload ? [legacyAiPayload] : [])]));

    setData((current) => ({
      ...current,
      ai,
    }));
    setStorageDiagnostics(getStorageDiagnostics());
  };

  const founderScore = useMemo(() => calculateFounderScore(todayEntry), [todayEntry]);
  const weeklyProgress = useMemo(() => buildWeeklyProgress(data.dailyEntries), [data.dailyEntries]);
  const learningStreak = useMemo(() => getLearningStreak(data.dailyEntries), [data.dailyEntries]);
  const kpiTrends = useMemo(() => buildWeeklyTrendData(data, 8), [data]);
  const bookTrends = useMemo(() => buildBookTrendData(data, 8), [data]);
  const upcomingFollowUps = useMemo(() => getUpcomingFollowUps(data.contacts), [data.contacts]);
  const latestInsights = useMemo(() => {
    const mergedKnowledge = [
      ...data.knowledgeItems,
      ...data.ai.notes.map((note) => ({
        id: note.id,
        title: note.title,
        type: `AI ${note.type}`,
        content: note.content,
        tags: note.tags,
        createdAt: note.createdAt,
      })),
    ];
    return getLatestInsights(mergedKnowledge, data.dailyEntries, data.decisions, data.eveningJournals, data.books);
  }, [data.knowledgeItems, data.ai.notes, data.dailyEntries, data.decisions, data.eveningJournals, data.books]);
  const activeIdea = useMemo(() => getActiveIdea(data.ideas), [data.ideas]);
  const currentBook = useMemo(() => getCurrentReadingBook(data.books, todayEntry), [data.books, todayEntry]);
  const thisWeekSnapshot = useMemo(() => getThisWeekSnapshot(data), [data]);
  const aiStats = useMemo(() => getAiStats(data), [data]);
  const aiAnalytics = useMemo(() => buildAiAnalytics(data), [data]);
  const aiOpportunityCharts = useMemo(() => buildOpportunityCharts(data.ai), [data.ai]);
  const founderLeverage = useMemo(() => calculateFounderLeverage(data), [data]);
  const operatingMetrics = useMemo(() => getFounderOperatingMetrics(data), [data]);

  const value = {
    data,
    todayKey,
    todayEntry,
    founderScore,
    weeklyProgress,
    learningStreak,
    kpiTrends,
    bookTrends,
    upcomingFollowUps,
    latestInsights,
    activeIdea,
    currentBook,
    thisWeekSnapshot,
    storageDiagnostics,
    founderLeverage,
    operatingMetrics,
    aiStats,
    aiAnalytics,
    aiOpportunityCharts,
    saveDailyEntry,
    patchDailyEntry,
    patchTodayEntry,
    addDeepWorkMinutes,
    saveBook,
    addIdea,
    addOpportunity,
    addContact,
    addWeeklyReview,
    addDecision,
    addKnowledgeItem,
    saveStrategicPlan,
    saveCustomerInsight,
    saveRevenueItem,
    saveFinanceSnapshot,
    saveBoardItem,
    addEveningJournal,
    addQuickCapture,
    saveAiModule,
    logAiModuleHours,
    toggleAiPracticeTask,
    saveAiAgent,
    saveAiSystem,
    saveAiExperiment,
    saveAiTool,
    saveAiOpportunity,
    saveAiNote,
    createLinkedDecision,
    createAgentFromBook,
    deleteRecord,
    deleteAiRecord,
    updateSettings,
    importState,
    runStorageMerge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
