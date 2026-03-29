export const NAV_ITEMS = [
  { id: 'founder-inbox', label: 'Founder Inbox', shortcut: 'Alt+I', section: 'Founder OS' },
  { id: 'dashboard', label: 'Dashboard', shortcut: 'Alt+1', section: 'Founder OS' },
  { id: 'daily-execution', label: 'Daily Execution', shortcut: 'Alt+2', section: 'Founder OS' },
  { id: 'book-learning', label: 'Book Learning', shortcut: 'Alt+B', section: 'Founder OS' },
  { id: 'idea-lab', label: 'Idea Lab', shortcut: 'Alt+3', section: 'Founder OS' },
  { id: 'opportunity-radar', label: 'Opportunity Radar', shortcut: 'Alt+4', section: 'Founder OS' },
  { id: 'networking-crm', label: 'Networking CRM', shortcut: 'Alt+5', section: 'Founder OS' },
  { id: 'weekly-review', label: 'Weekly Review', shortcut: 'Alt+6', section: 'Founder OS' },
  { id: 'decision-journal', label: 'Decision Journal', shortcut: 'Alt+7', section: 'Founder OS' },
  { id: 'knowledge-vault', label: 'Knowledge Vault', shortcut: 'Alt+8', section: 'Founder OS' },
  { id: 'kpi-analytics', label: 'KPI Analytics', shortcut: 'Alt+9', section: 'Founder OS' },
  { id: 'ai-agents', label: 'AI Overview', shortcut: 'Alt+G', section: 'AI Agents' },
  { id: 'ai-learning-roadmap', label: 'AI Learning Roadmap', shortcut: 'Alt+L', section: 'AI Agents' },
  { id: 'ai-agent-builder', label: 'AI Agent Builder', shortcut: 'A', section: 'AI Agents' },
  { id: 'ai-agent-architect', label: 'AI Agent Architect', shortcut: 'Alt+M', section: 'AI Agents' },
  { id: 'ai-experiments', label: 'AI Experiments', shortcut: 'Alt+E', section: 'AI Agents' },
  { id: 'ai-tools-library', label: 'AI Tools Library', shortcut: 'Alt+T', section: 'AI Agents' },
  { id: 'ai-opportunities', label: 'AI Opportunities', shortcut: 'Alt+O', section: 'AI Agents' },
  { id: 'ai-knowledge-notes', label: 'AI Knowledge Notes', shortcut: 'Alt+N', section: 'AI Agents' },
  { id: 'ai-analytics', label: 'AI Analytics', shortcut: 'Alt+P', section: 'AI Agents' },
  { id: 'settings', label: 'Settings', shortcut: 'Alt+0', section: 'Workspace' },
];

export const IDEA_STATUS_OPTIONS = ['Exploring', 'Validating', 'Building', 'Paused'];
export const IDEA_DIFFICULTY_OPTIONS = ['Low', 'Medium', 'High'];
export const OPPORTUNITY_STATUS_OPTIONS = ['Watching', 'Researching', 'Pursuing', 'Archived'];
export const RELATIONSHIP_STRENGTH_OPTIONS = ['Warm', 'Strong', 'Strategic'];
export const KNOWLEDGE_TYPES = ['Insight', 'Article', 'Startup Lesson', 'Market Observation', 'Idea'];
export const QUICK_CAPTURE_TYPES = ['Note', 'Idea', 'Task', 'Insight', 'Contact', 'AI Note', 'AI Opportunity', 'Experiment', 'Agent Note'];
export const QUICK_CAPTURE_ATTACH_OPTIONS = [
  { value: 'today', label: "Attach to today's date" },
  { value: 'ai-notes', label: 'Attach to AI notes' },
  { value: 'agent', label: "Attach to today's agent" },
];
export const BOOK_CATEGORY_OPTIONS = ['Business', 'Startup', 'Mindset', 'Finance', 'Marketing', 'Technology'];
export const BOOK_STATUS_OPTIONS = ['Not Started', 'Reading', 'Completed'];
export const AI_MODULE_STATUS_OPTIONS = ['Not Started', 'In Progress', 'Complete'];
export const AI_AGENT_STATUS_OPTIONS = ['Idea', 'Designing', 'Prototype', 'Testing', 'Deployed'];
export const AI_SYSTEM_STATUS_OPTIONS = ['Idea', 'Designing', 'Prototype', 'Testing', 'Deployed'];
export const AI_LEVERAGE_OPTIONS = ['Low', 'Medium', 'High'];
export const AI_AUTOMATION_OPTIONS = ['Low', 'Medium', 'High'];
export const AI_OPPORTUNITY_STATUS_OPTIONS = ['Idea', 'Research', 'Prototype', 'Implemented'];
export const AI_TOOL_CATEGORY_OPTIONS = ['LLM', 'Agent Framework', 'Vector DB', 'Automation', 'No-code'];
export const AI_NOTE_TYPES = ['Guide', 'Template', 'Architecture', 'Prompt', 'Research'];

export const SHORTCUTS = [
  { keys: 'Q', action: 'Open quick capture from anywhere outside inputs' },
  { keys: 'J', action: 'Open evening journal modal' },
  { keys: 'A', action: 'Open the new agent modal' },
  { keys: 'Alt+I', action: 'Open the Founder Inbox / command center' },
  { keys: 'Alt+1 ... Alt+0', action: 'Jump between core Founder OS pages' },
  { keys: 'Alt+G / L / M / E / T / O / N / P', action: 'Jump across AI overview, roadmap, architect, experiments, tools, opportunities, notes, and analytics' },
  { keys: 'Esc', action: 'Close any open modal or mobile sidebar' },
];
