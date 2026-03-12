const pad = (value) => String(value).padStart(2, '0');

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WEEKDAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const toDateKey = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const parseDateKey = (value) => {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getTodayKey = () => toDateKey(new Date());

export const addDays = (value, amount) => {
  const date = value instanceof Date ? new Date(value) : parseDateKey(value);
  date.setDate(date.getDate() + amount);
  return date;
};

export const startOfWeek = (value) => {
  const date = value instanceof Date ? new Date(value) : parseDateKey(value);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  return date;
};

export const endOfWeek = (value) => {
  const date = startOfWeek(value);
  date.setDate(date.getDate() + 6);
  return date;
};

export const formatShortDate = (value) =>
  parseDateKey(toDateKey(value)).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

export const formatLongDate = (value) =>
  parseDateKey(toDateKey(value)).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const formatMonthLabel = (value) => {
  const date = value instanceof Date ? value : parseDateKey(value);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

export const getShortDayLabel = (value) => {
  const date = value instanceof Date ? value : parseDateKey(value);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
};

export const getDayNumber = (value) => {
  const date = value instanceof Date ? value : parseDateKey(value);
  return date.getDate();
};

export const getWeekNumber = (value) => {
  const date = value instanceof Date ? new Date(value) : parseDateKey(value);
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNumber = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3);
  const diff = target - firstThursday;
  return 1 + Math.round(diff / 604800000);
};

export const isToday = (value) => toDateKey(value) === getTodayKey();

export const isSameMonth = (left, right) => {
  const a = left instanceof Date ? left : parseDateKey(left);
  const b = right instanceof Date ? right : parseDateKey(right);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
};

export const isPastDate = (value) => parseDateKey(value) < parseDateKey(getTodayKey());

export const buildMonthMatrix = (value) => {
  const pivot = value instanceof Date ? new Date(value) : parseDateKey(value);
  const firstOfMonth = new Date(pivot.getFullYear(), pivot.getMonth(), 1);
  const cursor = startOfWeek(firstOfMonth);
  const weeks = [];

  for (let week = 0; week < 6; week += 1) {
    const row = [];
    for (let day = 0; day < 7; day += 1) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }

  return weeks;
};

export const formatTimeAgo = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatShortDate(date);
};
