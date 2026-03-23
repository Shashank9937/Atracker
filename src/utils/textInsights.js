const STOP_WORDS = new Set([
  'about',
  'after',
  'again',
  'along',
  'also',
  'always',
  'around',
  'because',
  'before',
  'being',
  'between',
  'build',
  'business',
  'could',
  'daily',
  'every',
  'first',
  'focus',
  'founder',
  'from',
  'have',
  'idea',
  'into',
  'just',
  'keep',
  'like',
  'market',
  'more',
  'most',
  'need',
  'next',
  'notes',
  'only',
  'other',
  'people',
  'product',
  'really',
  'should',
  'startup',
  'still',
  'that',
  'their',
  'them',
  'there',
  'these',
  'they',
  'this',
  'through',
  'using',
  'very',
  'what',
  'when',
  'where',
  'which',
  'while',
  'with',
  'work',
  'would',
  'your',
]);

export const includesQuery = (values, query) => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  return values
    .flat(Infinity)
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(trimmed);
};

export const extractTopTerms = (values, limit = 5) => {
  const counts = values
    .flat(Infinity)
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9'-]*/g)?.reduce((acc, token) => {
      if (token.length < 4 || STOP_WORDS.has(token)) return acc;
      acc[token] = (acc[token] || 0) + 1;
      return acc;
    }, {}) || {};

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
};

export const truncateText = (value, maxLength = 180) => {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};
