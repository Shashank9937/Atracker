import { addDays, getTodayKey, toDateKey } from './date';

const createId = (prefix) =>
  globalThis.crypto?.randomUUID
    ? `${prefix}-${globalThis.crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const ALTMAN_LEVERAGE_GUIDE = `1. The Core Idea Sam Altman Is Talking About
Historically:
Era	What it took to build a company
1990s	Large teams + huge capital
2000s	Smaller startup teams
2020s	Potentially one highly skilled founder
Why?
Because tools now give extreme leverage.
Examples:
* AI writes code
* AI creates designs
* AI analyzes markets
* automation runs operations
* cloud infrastructure scales instantly
So one person can produce the output of 50–500 people.

2. The Real Meaning of “One-Person Billion Dollar Company”
It does not mean literally working alone forever.
It means:
* one founder creates the product
* technology does most of the work
* automation replaces large teams
Examples of leveraged companies:
* software products
* AI platforms
* marketplaces
* digital infrastructure tools
These businesses scale without proportional employees.

3. The Three Things Altman Is Saying You Must Do
1. Master Leverage Tools
These tools multiply your productivity.
The most powerful categories today:
AI tools
Examples:
* ChatGPT
* Claude
* Midjourney
* coding AI
AI can:
* write code
* analyze data
* build products
* generate content

Automation tools
Examples:
* Zapier
* Make
* workflow automation systems
They automate repetitive work.

No-code / low-code builders
Examples:
* Webflow
* Bubble
* Glide
You can build software without full programming teams.

Data tools
Examples:
* analytics platforms
* dashboards
* data automation
These help you make better decisions quickly.

4. The Second Principle: Find a Real Problem
Altman emphasizes:
Don’t force startup ideas.
Instead:
1. Study industries
2. Explore problems
3. Find inefficiencies
4. Build solutions
Great ideas usually come from deep understanding of a field.
Example:
* logistics inefficiency
* energy waste
* carbon markets
* supply chain chaos

5. Third Principle: Focus on Product
Many founders waste time on things like:
* office space
* hiring too early
* fancy branding
Instead focus on:
building something people actually want.
If the product is great, everything else becomes easier.

6. What This Means For Someone Like You
Since you are already around biomass / energy / supply chains, your leverage path could look like this:
Example:
Build an AI platform for biomass supply intelligence
Features:
* predict agricultural waste availability
* optimize biomass logistics
* track carbon credits
This combines:
industry knowledge + AI leverage.

7. The Real Formula Behind Altman’s Advice
The formula is simple:
Leverage × Problem Size × Execution Speed
If these three align, you can build huge companies.

8. The Ultimate Prompt (Optimized Version)
Here is a much stronger prompt than the one you wrote. You can use this with AI daily.
Writing

Act as a startup strategist and technology advisor.
My goal is to build a highly leveraged company using modern tools, potentially starting as a one-person operation that can scale massively.
Step 1: Identify the most powerful leverage tools available today (AI, automation, no-code, data platforms) that could multiply the productivity of a single founder.
Step 2: Based on my interests in energy, biomass supply chains, sustainability, and technology, identify high-value problems that are currently unsolved or inefficient.
Step 3: Generate startup ideas that use modern technology and automation to solve these problems at scale.
Step 4: Evaluate each idea using venture capital criteria:
* market size
* urgency of problem
* scalability
* defensibility
* revenue potential
Step 5: Create a step-by-step plan to build the most promising idea using modern leverage tools so that a small team (or even a single founder initially) could build and scale it.
Focus on ideas that could realistically grow into very large companies.

9. One Important Reality
Altman’s idea works best when:
* the problem is large
* the product is software or technology-enabled
* the market is global
These are the types of businesses that scale dramatically.

If you want, I can also show you something extremely valuable:
The 5 industries where one-person billion-dollar companies are most likely to emerge in the next 10 years.
This insight can change how you choose your startup direction.

1. Learn AI as a Productivity Engine
AI should become your thinking partner and execution assistant.
Skills to develop:
* advanced prompting (how to instruct AI clearly)
* research automation
* AI-assisted coding
* AI-generated content and analysis
What you should practice daily:
* using AI to research industries
* generating startup ideas
* analyzing markets
* drafting business strategies
Good platforms to learn:
* ChatGPT
* Claude
* Perplexity
* AI coding tools
Goal: AI becomes your personal analyst, researcher, and assistant.

2. Learn Basic Programming (Even If You’re Not a Developer)
You don’t need to be a world-class engineer, but you must understand:
* Python basics
* APIs
* data processing
* automation scripts
Why this matters: You can connect tools and build systems.
Example: AI analyzes biomass supply data -> Python script -> dashboard.
Goal: You can build small tools yourself instead of waiting for developers.

3. Master Automation Systems
Automation replaces repetitive work.
Learn platforms such as:
* Zapier
* Make (Integromat)
* n8n
You can automate:
* emails
* reports
* customer onboarding
* market research
* business operations
Goal: Work happens automatically without manual effort.

4. Learn No-Code Product Building
You can build entire applications without heavy programming.
Tools to learn:
* Bubble
* Webflow
* Glide
* Airtable
You can build:
* SaaS tools
* dashboards
* marketplaces
* internal systems
Goal: You can launch products quickly.

5. Learn Data Analysis
Data gives you strategic advantage.
Skills to learn:
* spreadsheets (advanced)
* dashboards
* market data analysis
* predictive insights
Tools:
* Excel / Google Sheets
* Power BI
* Tableau
* Python analytics
Goal: Make decisions using data, not guesswork.

6. Develop Strategic Thinking
Technology alone isn’t enough.
You must understand:
* industry structures
* market size
* customer behavior
* competitive advantages
Practice: Analyze industries every week.
Ask:
* what inefficiencies exist?
* what technology could improve this?
Goal: See opportunities others miss.

7. Learn Product Thinking
Great companies come from great products.
Understand:
* user experience
* product-market fit
* rapid experimentation
Frameworks from The Lean Startup are very useful.
Goal: Build things people actually want.

8. Develop Founder Execution Discipline
Technology multiplies output only if you execute consistently.
Daily habits:
* deep work
* problem solving
* customer conversations
* iteration
Books like Deep Work emphasize focused work.
Goal: Maintain high productivity and clarity.

9. Learn Distribution & Marketing
Even great products fail without distribution.
Learn:
* digital marketing
* growth loops
* storytelling
* community building
You must know how to reach customers.

10. Combine Everything into Systems
This is where leverage happens.
Example system:
AI research -> automation collects data -> dashboard analyzes -> product built -> marketing automated.
One person can manage a complex operation using systems.

Simple Summary
To operate like a 50–500 person company, you must combine:
1. AI leverage
2. automation systems
3. product building skills
4. strategic thinking
5. consistent execution
This combination creates massive productivity leverage.

Important Insight
Most people try to learn everything randomly.
Instead, focus on a specific industry  and apply these tools there.
That’s where real opportunities appear.`;

export const DAILY_PRACTICE_CHECKLIST = `Daily AI Practice Checklist

1. Run one AI research sprint on an industry or workflow pain point.
2. Rewrite or improve one prompt using clearer structure and constraints.
3. Test one automation or no-code workflow that removes manual work.
4. Capture one agent idea or AI opportunity from what you learned.
5. Document one result, one failure, and one next iteration.`;

export const createEmptyAiSection = () => ({
  modules: [],
  dailyPractice: [],
  agents: [],
  systems: [],
  experiments: [],
  tools: [],
  opportunities: [],
  notes: [],
  quickCaptures: [],
});

export const createEmptyAiModule = () => ({
  id: createId('ai-module'),
  title: '',
  description: '',
  status: 'Not Started',
  notes: '',
  resources: '',
  learningHours: 0,
  completed: false,
  practiceTasks: [],
  logs: [],
  createdAt: getTodayKey(),
});

export const createEmptyAiPracticeTask = () => ({
  id: createId('ai-practice'),
  title: '',
  description: '',
  doneDates: [],
  createdAt: getTodayKey(),
});

export const createEmptyAiAgent = () => ({
  id: createId('ai-agent'),
  agentName: '',
  purpose: '',
  problemSolved: '',
  targetUser: '',
  inputData: '',
  toolsNeeded: '',
  modelsUsed: '',
  workflowSteps: [
    { id: createId('step'), text: 'Collect inputs' },
    { id: createId('step'), text: 'Reason over context' },
    { id: createId('step'), text: 'Deliver structured output' },
  ],
  memoryType: 'Short-term context',
  output: '',
  status: 'Idea',
  estimatedTimeSaved: 0,
  estimatedCostSaved: 0,
  leveragePotential: 'Medium',
  tags: [],
  notes: '',
  decisionIds: [],
  createdAt: getTodayKey(),
});

export const createEmptyAiSystem = () => ({
  id: createId('ai-system'),
  systemName: '',
  industry: '',
  problem: '',
  systemDescription: '',
  numberOfAgents: 1,
  expectedOutcome: '',
  agents: [
    {
      id: createId('system-agent'),
      role: 'Coordinator',
      inputs: '',
      outputs: '',
      dependencies: '',
    },
  ],
  status: 'Idea',
  decisionIds: [],
  createdAt: getTodayKey(),
});

export const createEmptyAiExperiment = () => ({
  id: createId('ai-experiment'),
  experimentName: '',
  hypothesis: '',
  promptUsed: '',
  modelUsed: '',
  toolsUsed: '',
  inputData: '',
  resultOutput: '',
  whatWorked: '',
  whatFailed: '',
  nextIteration: '',
  timeSpent: 0,
  tags: [],
  agentId: '',
  versions: [],
  createdAt: getTodayKey(),
  updatedAt: new Date().toISOString(),
});

export const createEmptyAiTool = () => ({
  id: createId('ai-tool'),
  toolName: '',
  category: 'LLM',
  website: '',
  purpose: '',
  useCase: '',
  rating: 7,
  notes: '',
  createdAt: getTodayKey(),
});

export const createEmptyAiOpportunity = () => ({
  id: createId('ai-opportunity'),
  industry: '',
  process: '',
  currentManualWork: '',
  painPoints: '',
  aiSolution: '',
  toolsRequired: '',
  estimatedTimeSavedPct: 25,
  estimatedCostSaved: 0,
  automationPotential: 'Medium',
  implementationDifficulty: 'Medium',
  status: 'Idea',
  notes: '',
  marketSizeScore: 5,
  executionSpeedScore: 5,
  leverageScore: 13,
  weeklyHoursSaved: 10,
  createdAt: getTodayKey(),
});

export const createEmptyAiNote = () => ({
  id: createId('ai-note'),
  title: '',
  type: 'Guide',
  content: '',
  tags: [],
  createdAt: getTodayKey(),
  updatedAt: new Date().toISOString(),
});

export const createEmptyAiQuickCapture = () => ({
  id: createId('ai-capture'),
  type: 'AI Note',
  text: '',
  attachTo: 'today',
  agentId: '',
  date: getTodayKey(),
  createdAt: new Date().toISOString(),
});

export const calculateAiLeverageScore = (timeSavedPct, marketSizeScore, executionSpeedScore) => {
  const raw = Number(timeSavedPct || 0) * Number(marketSizeScore || 0) * Number(executionSpeedScore || 0);
  return Math.max(0, Math.min(100, Math.round(raw / 100)));
};

export const calculateOpportunityHoursSaved = (timeSavedPct) => Math.round((Number(timeSavedPct || 0) / 100) * 40);

const createSeedModules = () => [
  {
    id: 'ai-module-foundations',
    title: 'Foundations of AI',
    description: 'LLMs, embeddings, retrieval, vector databases, and how modern AI systems are composed.',
    status: 'In Progress',
    notes: 'Focus on how model capabilities, context windows, and retrieval patterns shape product design.',
    resources: 'ChatGPT docs, Claude docs, vector DB explainers, transformer primers.',
    learningHours: 5.5,
    completed: false,
    practiceTasks: ['Read one LLM systems explainer', 'Map an LLM + embedding + retrieval flow'],
    logs: [
      { date: toDateKey(addDays(new Date(), -6)), hours: 1.5, note: 'Reviewed LLM and embedding system basics.' },
      { date: toDateKey(addDays(new Date(), -2)), hours: 2, note: 'Studied retrieval architecture and vector DB patterns.' },
      { date: getTodayKey(), hours: 2, note: 'Mapped how an AI note system would use memory and retrieval.' },
    ],
    createdAt: toDateKey(addDays(new Date(), -10)),
  },
  {
    id: 'ai-module-prompting',
    title: 'Prompt Engineering / Advanced Prompting',
    description: 'Clear instructions, structured output, critique loops, prompt versioning, and task decomposition.',
    status: 'In Progress',
    notes: 'The Altman guide implies prompting is leverage, not a side skill.',
    resources: 'Structured prompting examples, JSON schema prompting, evaluation checklists.',
    learningHours: 4.5,
    completed: false,
    practiceTasks: ['Rewrite one weak prompt', 'Test prompt variants against the same problem'],
    logs: [
      { date: toDateKey(addDays(new Date(), -5)), hours: 1.5, note: 'Refined startup strategy prompts.' },
      { date: toDateKey(addDays(new Date(), -1)), hours: 2, note: 'Tested prompt structure for research and market analysis.' },
      { date: getTodayKey(), hours: 1, note: 'Logged structured output patterns for agent builders.' },
    ],
    createdAt: toDateKey(addDays(new Date(), -9)),
  },
  {
    id: 'ai-module-agents',
    title: 'AI Agents (Single & Multi-Agent)',
    description: 'Agent roles, orchestration, delegation, handoffs, memory, and design tradeoffs.',
    status: 'Not Started',
    notes: '',
    resources: 'Agentic workflow guides, orchestration examples, evaluation patterns.',
    learningHours: 2,
    completed: false,
    practiceTasks: ['Design a single-agent workflow', 'Design a manager-worker system'],
    logs: [{ date: toDateKey(addDays(new Date(), -3)), hours: 2, note: 'Drafted a research agent concept.' }],
    createdAt: toDateKey(addDays(new Date(), -8)),
  },
  {
    id: 'ai-module-automation',
    title: 'Automation + No-code Integration',
    description: 'Zapier, n8n, Make, Airtable, and no-code patterns that replace repetitive founder work.',
    status: 'Not Started',
    notes: '',
    resources: 'Zapier, n8n, Make tutorials, Airtable automation examples.',
    learningHours: 1.5,
    completed: false,
    practiceTasks: ['Automate a daily report', 'Prototype a no-code intake pipeline'],
    logs: [{ date: toDateKey(addDays(new Date(), -4)), hours: 1.5, note: 'Sketched an automation for support triage.' }],
    createdAt: toDateKey(addDays(new Date(), -7)),
  },
  {
    id: 'ai-module-data',
    title: 'Data & Analytics for Agents',
    description: 'Operational data, metrics, dashboards, and evaluation loops for agent systems.',
    status: 'Not Started',
    notes: '',
    resources: 'Analytics tools, dashboard case studies, eval frameworks.',
    learningHours: 1,
    completed: false,
    practiceTasks: ['Define agent KPIs', 'Create one evaluation dashboard spec'],
    logs: [{ date: toDateKey(addDays(new Date(), -1)), hours: 1, note: 'Outlined experiment metrics and leverage dashboards.' }],
    createdAt: toDateKey(addDays(new Date(), -6)),
  },
  {
    id: 'ai-module-deployment',
    title: 'Agent Deployment & Monitoring',
    description: 'Latency, cost control, observability, logging, failure handling, and trust.',
    status: 'Not Started',
    notes: '',
    resources: 'Inference cost management, monitoring patterns, eval pipelines.',
    learningHours: 0,
    completed: false,
    practiceTasks: ['Define failure modes', 'Create a monitoring checklist'],
    logs: [],
    createdAt: toDateKey(addDays(new Date(), -5)),
  },
  {
    id: 'ai-module-productization',
    title: 'Productization & Distribution',
    description: 'Turn agent systems into products with clear wedges, distribution, and adoption loops.',
    status: 'Not Started',
    notes: '',
    resources: 'PLG case studies, distribution strategy notes, founder-led sales playbooks.',
    learningHours: 0,
    completed: false,
    practiceTasks: ['Draft one product wedge', 'Draft one GTM angle'],
    logs: [],
    createdAt: toDateKey(addDays(new Date(), -4)),
  },
];

const createDailyPractice = () => [
  {
    id: 'ai-practice-research',
    title: 'Daily AI research sprint',
    description: 'Use AI to research one industry problem, inefficiency, or market signal.',
    doneDates: [toDateKey(addDays(new Date(), -2)), getTodayKey()],
    createdAt: toDateKey(addDays(new Date(), -7)),
  },
  {
    id: 'ai-practice-prompts',
    title: 'Prompt practice',
    description: 'Refine one prompt for structure, clarity, and better output quality.',
    doneDates: [toDateKey(addDays(new Date(), -1)), getTodayKey()],
    createdAt: toDateKey(addDays(new Date(), -7)),
  },
  {
    id: 'ai-practice-automation',
    title: 'Automation exercise',
    description: 'Prototype one workflow that removes repetitive founder work.',
    doneDates: [toDateKey(addDays(new Date(), -3))],
    createdAt: toDateKey(addDays(new Date(), -7)),
  },
  {
    id: 'ai-practice-capture',
    title: 'Opportunity capture',
    description: 'Log one AI opportunity, agent idea, or experiment result.',
    doneDates: [toDateKey(addDays(new Date(), -4)), toDateKey(addDays(new Date(), -1))],
    createdAt: toDateKey(addDays(new Date(), -7)),
  },
];

const createSeedAgents = () => [
  {
    id: 'seed-agent-research',
    agentName: 'Research Agent',
    purpose: 'Scrape, cluster, and synthesize pain points from research notes, calls, and field evidence.',
    problemSolved: 'Founders lose raw market signal because research notes stay fragmented.',
    targetUser: 'Founders and research-heavy operators',
    inputData: 'Call transcripts, notes, opportunity logs, market articles',
    toolsNeeded: 'LLM, search, spreadsheet export, note storage',
    modelsUsed: 'GPT-4o / Claude-class reasoning model',
    workflowSteps: [
      { id: 'seed-agent-research-step-1', text: 'Collect notes and raw evidence from research sources.' },
      { id: 'seed-agent-research-step-2', text: 'Cluster recurring problems, pain language, and urgency signals.' },
      { id: 'seed-agent-research-step-3', text: 'Output a ranked problem map with hypotheses and next interviews.' },
    ],
    memoryType: 'Research memory with tagged notes',
    output: 'Structured research brief with pain clusters and opportunity hypotheses',
    status: 'Idea',
    estimatedTimeSaved: 20,
    estimatedCostSaved: 1500,
    leveragePotential: 'High',
    tags: ['research', 'market-map', 'discovery'],
    notes: 'Derived directly from the Altman guidance to study industries and find real problems.',
    decisionIds: [],
    createdAt: toDateKey(addDays(new Date(), -8)),
  },
  {
    id: 'seed-agent-execution',
    agentName: 'Execution Agent',
    purpose: 'Act as a founder assistant for reports, summaries, follow-ups, and operational drafting.',
    problemSolved: 'Founders spend too much time formatting output instead of making decisions.',
    targetUser: 'Solo founders and lean startup teams',
    inputData: 'Daily logs, contacts, weekly review notes, meeting notes',
    toolsNeeded: 'LLM, CRM data, calendar notes, document exports',
    modelsUsed: 'GPT-4o',
    workflowSteps: [
      { id: 'seed-agent-execution-step-1', text: 'Pull current priorities, recent notes, and pending follow-ups.' },
      { id: 'seed-agent-execution-step-2', text: 'Draft reports, investor updates, and outreach sequences.' },
      { id: 'seed-agent-execution-step-3', text: 'Return polished drafts plus recommended next actions.' },
    ],
    memoryType: 'Rolling founder context',
    output: 'Drafts, summaries, follow-up prompts, and execution packs',
    status: 'Designing',
    estimatedTimeSaved: 10,
    estimatedCostSaved: 900,
    leveragePotential: 'Medium',
    tags: ['assistant', 'execution', 'founder-ops'],
    notes: 'Best used on repetitive communication and synthesis work.',
    decisionIds: [],
    createdAt: toDateKey(addDays(new Date(), -6)),
  },
  {
    id: 'seed-agent-automation',
    agentName: 'Automation Agent',
    purpose: 'Triage customer support requests, classify urgency, and route the next action.',
    problemSolved: 'Manual support triage slows response time and creates repetitive operational work.',
    targetUser: 'Support and operations teams',
    inputData: 'Support tickets, form submissions, product issue logs',
    toolsNeeded: 'LLM, workflow automation, ticketing system',
    modelsUsed: 'GPT-4o-mini or similar fast model',
    workflowSteps: [
      { id: 'seed-agent-automation-step-1', text: 'Ingest incoming support tickets and classify issue type.' },
      { id: 'seed-agent-automation-step-2', text: 'Draft replies, assign routing, and escalate critical cases.' },
      { id: 'seed-agent-automation-step-3', text: 'Summarize repeated failure patterns for product feedback.' },
    ],
    memoryType: 'Short-term queue memory',
    output: 'Categorized tickets, draft replies, and escalation summaries',
    status: 'Prototype',
    estimatedTimeSaved: 25,
    estimatedCostSaved: 2200,
    leveragePotential: 'High',
    tags: ['automation', 'support', 'triage'],
    notes: 'Strong candidate for immediate automation because the workflow is repetitive and bounded.',
    decisionIds: [],
    createdAt: toDateKey(addDays(new Date(), -4)),
  },
];

const createSeedSystems = () => [
  {
    id: 'seed-system-biomass',
    systemName: 'Biomass Intelligence System',
    industry: 'Energy / Biomass',
    problem: 'Biomass availability, logistics planning, and carbon credit visibility are fragmented.',
    systemDescription: 'A multi-agent system that researches supply signals, forecasts availability, and produces operating recommendations.',
    numberOfAgents: 3,
    expectedOutcome: 'Faster sourcing decisions with clearer supply and carbon economics.',
    agents: [
      { id: 'seed-system-biomass-a1', role: 'Research Agent', inputs: 'Crop calendars, field reports, weather, supply notes', outputs: 'Availability clusters', dependencies: '' },
      { id: 'seed-system-biomass-a2', role: 'Forecast Agent', inputs: 'Availability clusters, route constraints', outputs: 'Forecast and route plans', dependencies: 'Research Agent' },
      { id: 'seed-system-biomass-a3', role: 'Compliance Agent', inputs: 'Forecasts, transaction logs, carbon rules', outputs: 'Carbon credit and reporting summaries', dependencies: 'Forecast Agent' },
    ],
    status: 'Designing',
    decisionIds: [],
    createdAt: toDateKey(addDays(new Date(), -5)),
  },
];

const createSeedExperiments = () => [
  {
    id: 'seed-exp-prompt',
    experimentName: 'Prompt optimization for startup idea generation',
    hypothesis: 'A stepwise structured prompt will produce higher-quality startup ideas than open-ended prompting.',
    promptUsed: 'Act as a startup strategist. Identify leverage tools, map industry pain, generate ideas, and rank them by market size, urgency, defensibility, and revenue.',
    modelUsed: 'GPT-4o',
    toolsUsed: 'ChatGPT-style LLM',
    inputData: 'Energy, biomass, logistics, and sustainability interests',
    resultOutput: 'Ideas became more concrete once the prompt forced problem discovery before solutioning.',
    whatWorked: 'Structured sequencing improved specificity and ranking quality.',
    whatFailed: 'Open-ended ideation produced vague and repetitive ideas.',
    nextIteration: 'Add real market evidence and interview snippets into the prompt context.',
    timeSpent: 1.5,
    tags: ['prompting', 'ideation'],
    agentId: 'seed-agent-research',
    versions: [],
    createdAt: toDateKey(addDays(new Date(), -4)),
    updatedAt: new Date(addDays(new Date(), -4)).toISOString(),
  },
  {
    id: 'seed-exp-workflow',
    experimentName: 'Workflow prototype for support triage agent',
    hypothesis: 'A bounded triage workflow can automate first-response handling without damaging quality.',
    promptUsed: 'Classify each ticket by urgency, summarize the issue, suggest the next action, and draft a reply.',
    modelUsed: 'GPT-4o-mini',
    toolsUsed: 'LLM + no-code automation mock flow',
    inputData: '20 sample support requests',
    resultOutput: 'The workflow handled standard requests well but struggled with ambiguous edge cases.',
    whatWorked: 'Fast categorization and routing for repeated ticket types.',
    whatFailed: 'Escalation logic was too weak for ambiguous product bugs.',
    nextIteration: 'Tighten escalation rules and introduce human-in-the-loop review for low-confidence cases.',
    timeSpent: 2,
    tags: ['automation', 'support'],
    agentId: 'seed-agent-automation',
    versions: [],
    createdAt: toDateKey(addDays(new Date(), -2)),
    updatedAt: new Date(addDays(new Date(), -2)).toISOString(),
  },
];

const createSeedTools = () => [
  {
    id: 'seed-tool-chatgpt',
    toolName: 'ChatGPT',
    category: 'LLM',
    website: 'https://chatgpt.com',
    purpose: 'General reasoning, drafting, ideation, and structured analysis.',
    useCase: 'Startup ideation, research synthesis, and execution support.',
    rating: 9,
    notes: 'High leverage daily tool for founder research and drafting.',
    createdAt: toDateKey(addDays(new Date(), -14)),
  },
  {
    id: 'seed-tool-langchain',
    toolName: 'LangChain',
    category: 'Agent Framework',
    website: 'https://www.langchain.com',
    purpose: 'Framework for chains, agents, retrieval, and orchestration.',
    useCase: 'Agent prototypes and retrieval-augmented workflows.',
    rating: 8,
    notes: 'Useful once moving beyond prompt-only workflows.',
    createdAt: toDateKey(addDays(new Date(), -13)),
  },
  {
    id: 'seed-tool-pinecone',
    toolName: 'Pinecone',
    category: 'Vector DB',
    website: 'https://www.pinecone.io',
    purpose: 'Vector storage and retrieval for semantic memory systems.',
    useCase: 'Knowledge retrieval and long-lived agent memory.',
    rating: 7,
    notes: 'Any vector DB fits the same learning slot if this changes later.',
    createdAt: toDateKey(addDays(new Date(), -12)),
  },
  {
    id: 'seed-tool-zapier',
    toolName: 'Zapier',
    category: 'Automation',
    website: 'https://zapier.com',
    purpose: 'Automate repetitive workflows without heavy engineering.',
    useCase: 'Ticket triage, notifications, CRM syncing, and reporting.',
    rating: 8,
    notes: 'Fastest way to test automation leverage before custom code.',
    createdAt: toDateKey(addDays(new Date(), -11)),
  },
  {
    id: 'seed-tool-n8n',
    toolName: 'n8n',
    category: 'No-code',
    website: 'https://n8n.io',
    purpose: 'Flexible workflow automation with more control than typical no-code tools.',
    useCase: 'Internal workflow orchestration, AI routing, and data pipelines.',
    rating: 8,
    notes: 'Good fit when workflows become more technical or stateful.',
    createdAt: toDateKey(addDays(new Date(), -10)),
  },
];

const createSeedOpportunities = () => [
  {
    id: 'seed-opportunity-biomass',
    industry: 'Biomass / Energy',
    process: 'Biomass Supply Intelligence',
    currentManualWork: 'Teams manually chase fragmented supply signals, route assumptions, and carbon paperwork.',
    painPoints: 'Unclear availability, poor logistics visibility, delayed sourcing decisions, weak carbon reporting.',
    aiSolution: 'Predict agricultural waste availability, optimize logistics, and track carbon credits in one intelligence layer.',
    toolsRequired: 'LLM, forecasting model, GIS/logistics data, analytics dashboard',
    estimatedTimeSavedPct: 45,
    estimatedCostSaved: 5000,
    automationPotential: 'High',
    implementationDifficulty: 'High',
    status: 'Research',
    notes: 'Strong wedge because it combines industry knowledge with software leverage.',
    marketSizeScore: 9,
    executionSpeedScore: 6,
    leverageScore: calculateAiLeverageScore(45, 9, 6),
    weeklyHoursSaved: calculateOpportunityHoursSaved(45),
    createdAt: toDateKey(addDays(new Date(), -5)),
  },
  {
    id: 'seed-opportunity-logistics',
    industry: 'Logistics',
    process: 'Route Optimization',
    currentManualWork: 'Dispatch teams plan and adjust routes manually with weak visibility into constraints.',
    painPoints: 'Slow planning, margin leakage, poor exception handling, and inconsistent decisions.',
    aiSolution: 'Use AI-assisted exception handling and route recommendations for branch-level operations teams.',
    toolsRequired: 'LLM, routing engine, operational dashboard',
    estimatedTimeSavedPct: 35,
    estimatedCostSaved: 3200,
    automationPotential: 'High',
    implementationDifficulty: 'Medium',
    status: 'Prototype',
    notes: 'Aligned with the logistics inefficiency theme in the Altman guidance.',
    marketSizeScore: 8,
    executionSpeedScore: 7,
    leverageScore: calculateAiLeverageScore(35, 8, 7),
    weeklyHoursSaved: calculateOpportunityHoursSaved(35),
    createdAt: toDateKey(addDays(new Date(), -4)),
  },
  {
    id: 'seed-opportunity-support',
    industry: 'Customer Support',
    process: 'Support Automation',
    currentManualWork: 'Agents manually sort, categorize, and draft replies for repetitive support tickets.',
    painPoints: 'Slow response times, repetitive labor, inconsistent routing, and low-quality summaries.',
    aiSolution: 'AI triage and first-response drafting with escalation for complex cases.',
    toolsRequired: 'LLM, ticketing system, automation workflow',
    estimatedTimeSavedPct: 55,
    estimatedCostSaved: 2800,
    automationPotential: 'High',
    implementationDifficulty: 'Medium',
    status: 'Implemented',
    notes: 'Fast path to visible leverage because workflows are repetitive and measurable.',
    marketSizeScore: 7,
    executionSpeedScore: 8,
    leverageScore: calculateAiLeverageScore(55, 7, 8),
    weeklyHoursSaved: calculateOpportunityHoursSaved(55),
    createdAt: toDateKey(addDays(new Date(), -3)),
  },
];

const createSeedNotes = () => [
  {
    id: 'seed-note-altman-guide',
    title: 'Altman Leverage Guide',
    type: 'Guide',
    content: ALTMAN_LEVERAGE_GUIDE,
    tags: ['altman', 'leverage', 'strategy', 'ai'],
    createdAt: toDateKey(addDays(new Date(), -20)),
    updatedAt: new Date(addDays(new Date(), -20)).toISOString(),
  },
  {
    id: 'seed-note-daily-practice',
    title: 'Daily Practice Checklist',
    type: 'Template',
    content: DAILY_PRACTICE_CHECKLIST,
    tags: ['practice', 'checklist', 'learning'],
    createdAt: toDateKey(addDays(new Date(), -12)),
    updatedAt: new Date(addDays(new Date(), -12)).toISOString(),
  },
];

export const createSeedAiSection = () => ({
  modules: createSeedModules(),
  dailyPractice: createDailyPractice(),
  agents: createSeedAgents(),
  systems: createSeedSystems(),
  experiments: createSeedExperiments(),
  tools: createSeedTools(),
  opportunities: createSeedOpportunities(),
  notes: createSeedNotes(),
  quickCaptures: [],
});

const mergeById = (left = [], right = []) => {
  const map = new Map();
  [...left, ...right].forEach((item) => {
    if (item?.id) {
      map.set(item.id, item);
    }
  });
  return [...map.values()];
};

export const mergeAiSection = (payloads = []) =>
  payloads.reduce(
    (acc, payload) => {
      if (!payload || typeof payload !== 'object') return acc;
      return {
        modules: mergeById(acc.modules, payload.modules),
        dailyPractice: mergeById(acc.dailyPractice, payload.dailyPractice),
        agents: mergeById(acc.agents, payload.agents),
        systems: mergeById(acc.systems, payload.systems),
        experiments: mergeById(acc.experiments, payload.experiments),
        tools: mergeById(acc.tools, payload.tools),
        opportunities: mergeById(acc.opportunities, payload.opportunities),
        notes: mergeById(acc.notes, payload.notes),
        quickCaptures: mergeById(acc.quickCaptures, payload.quickCaptures),
      };
    },
    createEmptyAiSection(),
  );
