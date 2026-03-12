export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', shortcut: 'Alt+1' },
  { id: 'daily-execution', label: 'Daily Execution', shortcut: 'Alt+2' },
  { id: 'book-learning', label: 'Book Learning', shortcut: 'Alt+B' },
  { id: 'idea-lab', label: 'Idea Lab', shortcut: 'Alt+3' },
  { id: 'opportunity-radar', label: 'Opportunity Radar', shortcut: 'Alt+4' },
  { id: 'networking-crm', label: 'Networking CRM', shortcut: 'Alt+5' },
  { id: 'weekly-review', label: 'Weekly Review', shortcut: 'Alt+6' },
  { id: 'decision-journal', label: 'Decision Journal', shortcut: 'Alt+7' },
  { id: 'knowledge-vault', label: 'Knowledge Vault', shortcut: 'Alt+8' },
  { id: 'kpi-analytics', label: 'KPI Analytics', shortcut: 'Alt+9' },
  { id: 'ai-agents', label: 'AI Agents', shortcut: 'Alt+A' },
  { id: 'settings', label: 'Settings', shortcut: 'Alt+0' },
];

export const IDEA_STATUS_OPTIONS = ['Exploring', 'Validating', 'Building', 'Paused'];
export const IDEA_DIFFICULTY_OPTIONS = ['Low', 'Medium', 'High'];
export const OPPORTUNITY_STATUS_OPTIONS = ['Watching', 'Researching', 'Pursuing', 'Archived'];
export const RELATIONSHIP_STRENGTH_OPTIONS = ['Warm', 'Strong', 'Strategic'];
export const KNOWLEDGE_TYPES = ['Insight', 'Article', 'Startup Lesson', 'Market Observation', 'Idea'];
export const QUICK_CAPTURE_TYPES = ['Note', 'Idea', 'Task', 'Insight', 'Contact'];
export const BOOK_CATEGORY_OPTIONS = ['Business', 'Startup', 'Mindset', 'Finance', 'Marketing', 'Technology'];
export const BOOK_STATUS_OPTIONS = ['Not Started', 'Reading', 'Completed'];
export const SHORTCUTS = [
  { keys: 'Q', action: 'Open quick capture from anywhere outside inputs' },
  { keys: 'Shift+J', action: 'Open evening journal modal' },
  { keys: 'Alt+1 ... Alt+0', action: 'Jump between primary sidebar pages' },
  { keys: 'Alt+B', action: 'Open the Book Learning page' },
  { keys: 'Esc', action: 'Close any open modal or mobile sidebar' },
];
