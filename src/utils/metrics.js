import {
  addDays,
  endOfWeek,
  formatShortDate,
  getShortDayLabel,
  getTodayKey,
  getWeekNumber,
  parseDateKey,
  startOfWeek,
  toDateKey,
} from './date';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getTotalLearningHours = (entry) => Number(entry?.learningHours || 0) + Number(entry?.readingMinutes || 0) / 60;

const isReadingDay = (entry) =>
  Number(entry?.readingMinutes || 0) > 0 || Number(entry?.pagesRead || 0) > 0 || Boolean(entry?.bookInsightOfDay?.trim());

export const countCompletedTasks = (entry) =>
  (entry?.missionTasks ?? []).filter((task) => task.text?.trim() && task.done).length;

export const countDefinedTasks = (entry) =>
  (entry?.missionTasks ?? []).filter((task) => task.text?.trim()).length;

export const getFounderScoreBreakdown = (entry) => {
  if (!entry) {
    return {
      deepWork: 0,
      execution: 0,
      learning: 0,
      health: 0,
      networking: 0,
    };
  }

  const definedTasks = countDefinedTasks(entry);
  const completionRatio = definedTasks ? countCompletedTasks(entry) / definedTasks : 0;

  return {
    deepWork: Math.round(clamp((Number(entry.deepWorkHours) / 5) * 25, 0, 25)),
    execution: Math.round(clamp(completionRatio * 25, 0, 25)),
    learning: Math.round(clamp((getTotalLearningHours(entry) / 2) * 15, 0, 15)),
    health: Math.round(
      clamp(
        (entry.exercise ? 8 : 0) + clamp((10 - Number(entry.smokingCount)) * 0.6, 0, 6) + clamp((Number(entry.energyLevel) / 10) * 6, 0, 6),
        0,
        20,
      ),
    ),
    networking: Math.round(clamp((Number(entry.peopleContacted) / 5) * 15, 0, 15)),
  };
};

export const calculateFounderScore = (entry) => {
  const parts = getFounderScoreBreakdown(entry);
  return parts.deepWork + parts.execution + parts.learning + parts.health + parts.networking;
};

export const buildWeeklyProgress = (dailyEntries, days = 7) =>
  Array.from({ length: days }, (_, index) => {
    const date = addDays(new Date(), -(days - index - 1));
    const key = toDateKey(date);
    const entry = dailyEntries.find((item) => item.date === key);

    return {
      date: key,
      label: getShortDayLabel(date).slice(0, 1),
      founderScore: calculateFounderScore(entry),
      deepWorkHours: entry?.deepWorkHours ?? 0,
    };
  });

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
  const date = parseDateKey(toDateKey(value));
  return date >= start && date <= end;
};

export const getLearningStreak = (dailyEntries, until = new Date()) => {
  const entryMap = new Map(dailyEntries.map((entry) => [entry.date, entry]));
  const cursor = parseDateKey(toDateKey(until));
  let streak = 0;

  while (true) {
    const entry = entryMap.get(toDateKey(cursor));
    if (!isReadingDay(entry)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const buildWeeklyTrendData = (data, weeks = 6) => {
  const buckets = buildWeekBuckets(weeks);

  return {
    labels: buckets.map((bucket) => bucket.label),
    deepWorkHours: buckets.map((bucket) =>
      data.dailyEntries.reduce(
        (total, entry) => (withinRange(entry.date, bucket.start, bucket.end) ? total + Number(entry.deepWorkHours || 0) : total),
        0,
      ),
    ),
    ideasGenerated: buckets.map((bucket) =>
      data.ideas.filter((idea) => withinRange(idea.createdAt || getTodayKey(), bucket.start, bucket.end)).length,
    ),
    contactsMade: buckets.map((bucket) =>
      data.dailyEntries.reduce(
        (total, entry) => (withinRange(entry.date, bucket.start, bucket.end) ? total + Number(entry.peopleContacted || 0) : total),
        0,
      ),
    ),
    learningHours: buckets.map((bucket) =>
      Number(
        data.dailyEntries
          .reduce(
            (total, entry) => (withinRange(entry.date, bucket.start, bucket.end) ? total + getTotalLearningHours(entry) : total),
            0,
          )
          .toFixed(1),
      ),
    ),
    executionTasks: buckets.map((bucket) =>
      data.dailyEntries.reduce(
        (total, entry) => (withinRange(entry.date, bucket.start, bucket.end) ? total + countCompletedTasks(entry) : total),
        0,
      ),
    ),
    healthHabits: buckets.map((bucket) =>
      Number(
        data.dailyEntries
          .filter((entry) => withinRange(entry.date, bucket.start, bucket.end))
          .reduce(
            (total, entry) =>
              total +
              (entry.exercise ? 1 : 0) +
              (Number(entry.smokingCount) === 0 ? 1 : 0) +
              Number(entry.energyLevel || 0) / 10,
            0,
          )
          .toFixed(1),
      ),
    ),
  };
};

export const buildBookTrendData = (data, weeks = 8) => {
  const buckets = buildWeekBuckets(weeks);

  return {
    labels: buckets.map((bucket) => bucket.label),
    booksCompleted: buckets.map((bucket) =>
      data.books.filter(
        (book) => book.status === 'Completed' && book.finishDate && withinRange(book.finishDate, bucket.start, bucket.end),
      ).length,
    ),
    readingMinutesPerWeek: buckets.map((bucket) =>
      data.dailyEntries.reduce(
        (total, entry) => (withinRange(entry.date, bucket.start, bucket.end) ? total + Number(entry.readingMinutes || 0) : total),
        0,
      ),
    ),
    learningStreak: buckets.map((bucket) => getLearningStreak(data.dailyEntries, bucket.end)),
  };
};

export const getUpcomingFollowUps = (contacts, limit = 5) =>
  [...contacts]
    .filter((contact) => contact.followUpDate)
    .sort((left, right) => new Date(left.followUpDate) - new Date(right.followUpDate))
    .slice(0, limit)
    .map((contact) => ({
      ...contact,
      prettyDate: formatShortDate(contact.followUpDate),
    }));

export const getActiveIdea = (ideas) => {
  const focusStatuses = ['Building', 'Validating', 'Exploring'];
  return [...ideas].sort((left, right) => {
    const leftRank = focusStatuses.indexOf(left.status);
    const rightRank = focusStatuses.indexOf(right.status);

    if (leftRank !== rightRank) {
      return (leftRank === -1 ? 99 : leftRank) - (rightRank === -1 ? 99 : rightRank);
    }

    return Number(right.validationScore || 0) - Number(left.validationScore || 0);
  })[0];
};

export const getCurrentReadingBook = (books, todayEntry) => {
  const title = todayEntry?.bookBeingRead?.trim();
  if (title) {
    return books.find((book) => book.bookTitle === title) || {
      bookTitle: title,
      author: 'Unknown author',
      category: 'Book',
      status: 'Reading',
      pages: 0,
      dailyReadingMinutes: 0,
    };
  }

  return books.find((book) => book.status === 'Reading') || null;
};

export const getLatestInsights = (knowledgeItems, dailyEntries, decisions, eveningJournals, books = []) => {
  const merged = [
    ...knowledgeItems.map((item) => ({
      id: item.id,
      source: item.type,
      title: item.title,
      detail: item.content,
      createdAt: item.createdAt,
    })),
    ...dailyEntries
      .filter((entry) => entry.keyInsight)
      .map((entry) => ({
        id: entry.id,
        source: 'Daily insight',
        title: entry.keyInsight,
        detail: entry.winOfDay,
        createdAt: entry.date,
      })),
    ...dailyEntries
      .filter((entry) => entry.bookInsightOfDay)
      .map((entry) => ({
        id: `${entry.id}-book`,
        source: 'Book insight',
        title: entry.bookInsightOfDay,
        detail: entry.bookBeingRead,
        createdAt: entry.date,
      })),
    ...decisions.map((decision) => ({
      id: decision.id,
      source: 'Decision',
      title: decision.decision,
      detail: decision.expectedOutcome,
      createdAt: decision.createdAt,
    })),
    ...eveningJournals.map((journal) => ({
      id: journal.id,
      source: 'Journal',
      title: journal.insight,
      detail: journal.learning,
      createdAt: journal.date,
    })),
    ...books
      .filter((book) => book.keyLessons || book.businessInsights || book.ideasToApply)
      .map((book) => ({
        id: book.id,
        source: 'Book',
        title: book.bookTitle,
        detail: book.businessInsights || book.keyLessons || book.ideasToApply,
        createdAt: book.finishDate || book.startDate || book.createdAt,
      })),
  ];

  return merged
    .filter((item) => item.title)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5);
};

export const getThisWeekSnapshot = (data) => {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const entries = data.dailyEntries.filter((entry) => withinRange(entry.date, weekStart, weekEnd));

  return {
    deepWorkHours: Number(entries.reduce((sum, entry) => sum + Number(entry.deepWorkHours || 0), 0).toFixed(1)),
    learningHours: Number(entries.reduce((sum, entry) => sum + getTotalLearningHours(entry), 0).toFixed(1)),
    contactsReached: entries.reduce((sum, entry) => sum + Number(entry.peopleContacted || 0), 0),
    tasksCompleted: entries.reduce((sum, entry) => sum + countCompletedTasks(entry), 0),
    readingMinutes: entries.reduce((sum, entry) => sum + Number(entry.readingMinutes || 0), 0),
    pagesRead: entries.reduce((sum, entry) => sum + Number(entry.pagesRead || 0), 0),
  };
};
