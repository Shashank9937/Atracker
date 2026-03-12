import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTodayKey } from '../utils/date';
import {
  buildWeeklyProgress,
  buildWeeklyTrendData,
  calculateFounderScore,
  getActiveIdea,
  getLatestInsights,
  getThisWeekSnapshot,
  getUpcomingFollowUps,
} from '../utils/metrics';
import { createEmptyDailyEntry, createSampleData } from '../utils/sampleData';
import { loadAppData, saveAppData } from '../utils/storage';

const AppContext = createContext(null);

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
    deepWorkHours: toNumber(entry?.deepWorkHours, 0),
    smokingCount: toNumber(entry?.smokingCount, 0),
    energyLevel: toNumber(entry?.energyLevel, 5),
    focusLevel: toNumber(entry?.focusLevel, 5),
    exercise: Boolean(entry?.exercise),
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

const byDateDesc = (left, right) => new Date(right.date || right.createdAt || 0) - new Date(left.date || left.createdAt || 0);
const byScoreDesc = (key) => (left, right) => toNumber(right[key], 0) - toNumber(left[key], 0);

const normalizeAppData = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return createSampleData();
  }

  return {
    settings: {
      founderName: raw.settings?.founderName || 'Founder',
      theme: raw.settings?.theme === 'light' ? 'light' : 'dark',
    },
    dailyEntries: Array.isArray(raw.dailyEntries) ? raw.dailyEntries.map(normalizeDailyEntry).sort(byDateDesc) : [],
    ideas: Array.isArray(raw.ideas) ? raw.ideas.map(normalizeIdea).sort(byScoreDesc('validationScore')) : [],
    opportunities: Array.isArray(raw.opportunities)
      ? raw.opportunities.map(normalizeOpportunity).sort(byScoreDesc('opportunityScore'))
      : [],
    contacts: Array.isArray(raw.contacts) ? raw.contacts.map(normalizeContact).sort(byDateDesc) : [],
    weeklyReviews: Array.isArray(raw.weeklyReviews) ? raw.weeklyReviews.map(normalizeWeeklyReview).sort(byDateDesc) : [],
    decisions: Array.isArray(raw.decisions) ? raw.decisions.map(normalizeDecision).sort(byDateDesc) : [],
    knowledgeItems: Array.isArray(raw.knowledgeItems) ? raw.knowledgeItems.map(normalizeKnowledgeItem).sort(byDateDesc) : [],
    quickNotes: Array.isArray(raw.quickNotes) ? raw.quickNotes.map(normalizeQuickNote).sort(byDateDesc) : [],
    eveningJournals: Array.isArray(raw.eveningJournals)
      ? raw.eveningJournals.map(normalizeEveningJournal).sort(byDateDesc)
      : [],
  };
};

const upsertById = (list, record) => [record, ...list.filter((item) => item.id !== record.id)].sort(byDateDesc);

const upsertDailyByDate = (list, record) => [record, ...list.filter((item) => item.date !== record.date)].sort(byDateDesc);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => normalizeAppData(loadAppData() || createSampleData()));
  const todayKey = getTodayKey();

  useEffect(() => {
    saveAppData(data);
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

  const addIdea = (idea) => {
    const record = normalizeIdea(idea);
    setData((current) => ({
      ...current,
      ideas: [record, ...current.ideas].sort(byScoreDesc('validationScore')),
    }));
  };

  const addOpportunity = (opportunity) => {
    const record = normalizeOpportunity(opportunity);
    setData((current) => ({
      ...current,
      opportunities: [record, ...current.opportunities].sort(byScoreDesc('opportunityScore')),
    }));
  };

  const addContact = (contact) => {
    const record = normalizeContact(contact);
    setData((current) => ({
      ...current,
      contacts: upsertById(current.contacts, record),
    }));
  };

  const addWeeklyReview = (review) => {
    const record = normalizeWeeklyReview(review);
    setData((current) => ({
      ...current,
      weeklyReviews: upsertById(current.weeklyReviews, record),
    }));
  };

  const addDecision = (decision) => {
    const record = normalizeDecision(decision);
    setData((current) => ({
      ...current,
      decisions: upsertById(current.decisions, record),
    }));
  };

  const addKnowledgeItem = (item) => {
    const record = normalizeKnowledgeItem(item);
    setData((current) => ({
      ...current,
      knowledgeItems: upsertById(current.knowledgeItems, record),
    }));
  };

  const addEveningJournal = (journal) => {
    const record = normalizeEveningJournal(journal);
    setData((current) => ({
      ...current,
      eveningJournals: upsertById(current.eveningJournals, record),
    }));
  };

  const addQuickCapture = ({ type = 'Note', text = '' }) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setData((current) => {
      const note = normalizeQuickNote({ type, text: trimmed });
      let next = {
        ...current,
        quickNotes: [note, ...current.quickNotes].slice(0, 40),
      };

      if (type === 'Idea') {
        next = {
          ...next,
          ideas: [
            normalizeIdea({
              ideaName: trimmed,
              status: 'Exploring',
              validationScore: 55,
              nextExperiment: 'Expand this quick capture into a sharper founder thesis.',
            }),
            ...next.ideas,
          ].sort(byScoreDesc('validationScore')),
        };
      }

      if (type === 'Contact') {
        next = {
          ...next,
          contacts: upsertById(
            next.contacts,
            normalizeContact({
              name: trimmed,
              relationshipStrength: 'Warm',
              followUpDate: todayKey,
              notes: 'Created from quick capture.',
            }),
          ),
        };
      }

      if (type === 'Insight') {
        next = {
          ...next,
          knowledgeItems: upsertById(
            next.knowledgeItems,
            normalizeKnowledgeItem({
              title: trimmed.slice(0, 72),
              type: 'Insight',
              content: trimmed,
              tags: ['quick-capture'],
            }),
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

      return next;
    });
  };

  const deleteRecord = (collection, id) => {
    setData((current) => ({
      ...current,
      [collection]: Array.isArray(current[collection]) ? current[collection].filter((item) => item.id !== id) : current[collection],
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

  const founderScore = useMemo(() => calculateFounderScore(todayEntry), [todayEntry]);
  const weeklyProgress = useMemo(() => buildWeeklyProgress(data.dailyEntries), [data.dailyEntries]);
  const kpiTrends = useMemo(() => buildWeeklyTrendData(data, 8), [data]);
  const upcomingFollowUps = useMemo(() => getUpcomingFollowUps(data.contacts), [data.contacts]);
  const latestInsights = useMemo(
    () => getLatestInsights(data.knowledgeItems, data.dailyEntries, data.decisions, data.eveningJournals),
    [data.knowledgeItems, data.dailyEntries, data.decisions, data.eveningJournals],
  );
  const activeIdea = useMemo(() => getActiveIdea(data.ideas), [data.ideas]);
  const thisWeekSnapshot = useMemo(() => getThisWeekSnapshot(data), [data]);

  const value = {
    data,
    todayKey,
    todayEntry,
    founderScore,
    weeklyProgress,
    kpiTrends,
    upcomingFollowUps,
    latestInsights,
    activeIdea,
    thisWeekSnapshot,
    saveDailyEntry,
    patchDailyEntry,
    patchTodayEntry,
    addDeepWorkMinutes,
    addIdea,
    addOpportunity,
    addContact,
    addWeeklyReview,
    addDecision,
    addKnowledgeItem,
    addEveningJournal,
    addQuickCapture,
    deleteRecord,
    updateSettings,
    importState,
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
