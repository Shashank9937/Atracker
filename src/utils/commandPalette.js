const normalize = (value) => String(value || '').toLowerCase().trim();

const createKeywords = (...parts) =>
  parts
    .flat()
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const makeItem = ({ id, title, subtitle, category, keywords, action, priority = 0, pinned = false }) => ({
  id,
  title,
  subtitle,
  category,
  keywords: normalize(keywords),
  action,
  priority,
  pinned,
});

const scoreItem = (item, query) => {
  if (!query) return item.pinned ? 1000 + item.priority : item.priority;

  const title = normalize(item.title);
  const subtitle = normalize(item.subtitle);
  const keywords = item.keywords;

  let score = item.priority;
  if (title.startsWith(query)) score += 120;
  else if (title.includes(query)) score += 80;

  if (subtitle.includes(query)) score += 35;
  if (keywords.includes(query)) score += 20;

  return score;
};

export const buildCommandPaletteItems = ({ data, navItems, operatingMetrics, founderScore, founderLeverage }) => {
  const activeBook = data.books.find((book) => book.status === 'Reading');
  const topDeal = operatingMetrics.revenueStats.topDeals[0];
  const blockedProject = operatingMetrics.projectStats.topProjects.find((project) => project.stage === 'Blocked');
  const topAiOpportunity = [...(data.ai?.opportunities || [])]
    .sort((left, right) => Number(right.leverageScore || 0) - Number(left.leverageScore || 0))[0];

  const actions = [
    makeItem({
      id: 'action-command-quick-capture',
      title: 'Quick Capture',
      subtitle: 'Capture a thought, task, insight, or AI note',
      category: 'Action',
      keywords: 'capture quick note task insight idea',
      action: { type: 'open-quick-capture' },
      pinned: true,
      priority: 90,
    }),
    makeItem({
      id: 'action-command-journal',
      title: 'Evening Journal',
      subtitle: 'Open the end-of-day reflection modal',
      category: 'Action',
      keywords: 'journal reflection evening daily close',
      action: { type: 'open-journal' },
      pinned: true,
      priority: 86,
    }),
    makeItem({
      id: 'action-new-project',
      title: 'New Project',
      subtitle: 'Jump to the Projects & Launches form',
      category: 'Action',
      keywords: 'project roadmap launch milestone shipping',
      action: { type: 'quick-action', value: 'project' },
      pinned: true,
      priority: 95,
    }),
    makeItem({
      id: 'action-new-agent',
      title: 'New AI Agent',
      subtitle: 'Open the new AI agent modal',
      category: 'Action',
      keywords: 'ai agent builder automation leverage',
      action: { type: 'open-agent-modal' },
      pinned: true,
      priority: 88,
    }),
    makeItem({
      id: 'action-new-opportunity',
      title: 'New AI Opportunity',
      subtitle: 'Capture a new AI leverage opportunity',
      category: 'Action',
      keywords: 'ai opportunity automation leverage process',
      action: { type: 'quick-action', value: 'ai-opportunity' },
      pinned: true,
      priority: 82,
    }),
    makeItem({
      id: 'action-generate-daily-brief',
      title: 'Generate Daily CEO Brief',
      subtitle: 'Refresh today’s founder summary from current app data',
      category: 'Action',
      keywords: 'daily ceo brief founder summary automation',
      action: { type: 'generate-brief', briefType: 'Daily CEO Brief' },
      pinned: true,
      priority: 84,
    }),
    makeItem({
      id: 'action-generate-weekly-brief',
      title: 'Generate Weekly CEO Brief',
      subtitle: 'Refresh the weekly company operating summary',
      category: 'Action',
      keywords: 'weekly ceo brief company summary automation',
      action: { type: 'generate-brief', briefType: 'Weekly CEO Brief' },
      pinned: true,
      priority: 78,
    }),
  ];

  const pages = navItems.map((item) =>
    makeItem({
      id: `page-${item.id}`,
      title: item.label,
      subtitle: `${item.section} • ${item.shortcut}`,
      category: 'Page',
      keywords: `${item.label} ${item.section} ${item.shortcut}`,
      action: { type: 'navigate', page: item.id },
      priority: item.id === 'founder-inbox' ? 70 : 20,
    }),
  );

  const liveSignals = [
    makeItem({
      id: 'signal-founder-score',
      title: `Founder Score ${founderScore}`,
      subtitle: 'Open the dashboard to review today’s execution mix',
      category: 'Signal',
      keywords: 'founder score dashboard execution deep work',
      action: { type: 'navigate', page: 'dashboard' },
      priority: 72,
    }),
    makeItem({
      id: 'signal-founder-leverage',
      title: `Founder Leverage ${founderLeverage}`,
      subtitle: 'Review the AI leverage engine and company scale loops',
      category: 'Signal',
      keywords: 'leverage ai founder scale dashboard',
      action: { type: 'navigate', page: 'dashboard' },
      priority: 68,
    }),
    blockedProject
      ? makeItem({
          id: `signal-project-${blockedProject.id}`,
          title: `Blocked: ${blockedProject.projectName}`,
          subtitle: blockedProject.blockers || blockedProject.nextStep || 'A project needs founder intervention',
          category: 'Priority',
          keywords: createKeywords(blockedProject.projectName, blockedProject.blockers, blockedProject.nextStep, blockedProject.area),
          action: { type: 'navigate', page: 'projects-roadmap' },
          priority: 92,
        })
      : null,
    topDeal
      ? makeItem({
          id: `signal-deal-${topDeal.id}`,
          title: `Top Deal: ${topDeal.accountName}`,
          subtitle: topDeal.nextStep || topDeal.useCase || 'Highest weighted revenue opportunity',
          category: 'Priority',
          keywords: createKeywords(topDeal.accountName, topDeal.useCase, topDeal.nextStep, topDeal.stage),
          action: { type: 'navigate', page: 'revenue-engine' },
          priority: 80,
        })
      : null,
    activeBook
      ? makeItem({
          id: `signal-book-${activeBook.id}`,
          title: `Current Book: ${activeBook.bookTitle}`,
          subtitle: activeBook.businessInsights || activeBook.keyLessons || activeBook.author,
          category: 'Learning',
          keywords: createKeywords(activeBook.bookTitle, activeBook.author, activeBook.category, activeBook.businessInsights),
          action: { type: 'navigate', page: 'book-learning' },
          priority: 54,
        })
      : null,
    topAiOpportunity
      ? makeItem({
          id: `signal-ai-opportunity-${topAiOpportunity.id}`,
          title: `AI Wedge: ${topAiOpportunity.process}`,
          subtitle: `${topAiOpportunity.industry} • leverage ${topAiOpportunity.leverageScore}`,
          category: 'AI',
          keywords: createKeywords(topAiOpportunity.process, topAiOpportunity.industry, topAiOpportunity.aiSolution, topAiOpportunity.status),
          action: { type: 'navigate', page: 'ai-opportunities' },
          priority: 56,
        })
      : null,
  ].filter(Boolean);

  const recordItems = [
    ...(data.projects || []).map((project) =>
      makeItem({
        id: `project-${project.id}`,
        title: project.projectName,
        subtitle: `${project.area} • ${project.stage}`,
        category: 'Project',
        keywords: createKeywords(project.projectName, project.objective, project.milestone, project.nextStep, project.tags),
        action: { type: 'navigate', page: 'projects-roadmap' },
        priority: project.stage === 'Blocked' ? 70 : project.stage === 'Ready to Launch' ? 62 : 35,
      }),
    ),
    ...(data.ideas || []).map((idea) =>
      makeItem({
        id: `idea-${idea.id}`,
        title: idea.ideaName,
        subtitle: `${idea.status} • ${idea.targetCustomer || 'Idea'}`,
        category: 'Idea',
        keywords: createKeywords(idea.ideaName, idea.problem, idea.nextExperiment, idea.targetCustomer),
        action: { type: 'navigate', page: 'idea-lab' },
        priority: 30,
      }),
    ),
    ...(data.contacts || []).map((contact) =>
      makeItem({
        id: `contact-${contact.id}`,
        title: contact.name,
        subtitle: `${contact.company || 'Contact'} • ${contact.relationshipStrength}`,
        category: 'Contact',
        keywords: createKeywords(contact.name, contact.company, contact.keyInsight, contact.notes),
        action: { type: 'navigate', page: 'networking-crm' },
        priority: 30,
      }),
    ),
    ...(data.books || []).map((book) =>
      makeItem({
        id: `book-${book.id}`,
        title: book.bookTitle,
        subtitle: `${book.author} • ${book.status}`,
        category: 'Book',
        keywords: createKeywords(book.bookTitle, book.author, book.category, book.keyLessons, book.businessInsights),
        action: { type: 'navigate', page: 'book-learning' },
        priority: book.status === 'Reading' ? 50 : 20,
      }),
    ),
    ...(data.decisions || []).map((decision) =>
      makeItem({
        id: `decision-${decision.id}`,
        title: decision.decision,
        subtitle: decision.reviewDate ? `Review ${decision.reviewDate}` : 'Decision Journal',
        category: 'Decision',
        keywords: createKeywords(decision.decision, decision.context, decision.expectedOutcome, decision.area),
        action: { type: 'navigate', page: 'decision-journal' },
        priority: !decision.actualOutcome ? 42 : 16,
      }),
    ),
    ...(data.knowledgeItems || []).map((item) =>
      makeItem({
        id: `knowledge-${item.id}`,
        title: item.title,
        subtitle: item.type,
        category: 'Knowledge',
        keywords: createKeywords(item.title, item.type, item.content, item.tags),
        action: { type: 'navigate', page: 'knowledge-vault' },
        priority: 18,
      }),
    ),
    ...(data.ai?.agents || []).map((agent) =>
      makeItem({
        id: `agent-${agent.id}`,
        title: agent.agentName,
        subtitle: `${agent.status} • ${agent.purpose}`,
        category: 'AI Agent',
        keywords: createKeywords(agent.agentName, agent.purpose, agent.problemSolved, agent.tags),
        action: { type: 'navigate', page: 'ai-agent-builder' },
        priority: 34,
      }),
    ),
    ...(data.ai?.experiments || []).map((experiment) =>
      makeItem({
        id: `experiment-${experiment.id}`,
        title: experiment.experimentName,
        subtitle: experiment.nextIteration || experiment.modelUsed || 'AI experiment',
        category: 'Experiment',
        keywords: createKeywords(experiment.experimentName, experiment.hypothesis, experiment.whatWorked, experiment.whatFailed, experiment.tags),
        action: { type: 'navigate', page: 'ai-experiments' },
        priority: 28,
      }),
    ),
    ...(data.ai?.opportunities || []).map((opportunity) =>
      makeItem({
        id: `ai-opportunity-${opportunity.id}`,
        title: opportunity.process,
        subtitle: `${opportunity.industry} • leverage ${opportunity.leverageScore}`,
        category: 'AI Opportunity',
        keywords: createKeywords(opportunity.process, opportunity.industry, opportunity.aiSolution, opportunity.notes),
        action: { type: 'navigate', page: 'ai-opportunities' },
        priority: Number(opportunity.leverageScore || 0),
      }),
    ),
    ...(data.ai?.notes || []).map((note) =>
      makeItem({
        id: `ai-note-${note.id}`,
        title: note.title,
        subtitle: `AI ${note.type}`,
        category: 'AI Note',
        keywords: createKeywords(note.title, note.type, note.content, note.tags),
        action: { type: 'navigate', page: 'ai-knowledge-notes' },
        priority: 20,
      }),
    ),
  ];

  return [...actions, ...liveSignals, ...pages, ...recordItems];
};

export const filterCommandPaletteItems = (items, query) => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [...items]
      .sort((left, right) => scoreItem(right, normalizedQuery) - scoreItem(left, normalizedQuery))
      .slice(0, 16);
  }

  return [...items]
    .map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 24)
    .map(({ item }) => item);
};
