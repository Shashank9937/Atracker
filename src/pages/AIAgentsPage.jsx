import { ArrowUpRight, Brain, Clock, FlaskConical, Layers, Lightbulb, Sparkles, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const AIAgentsPage = ({ onNavigate }) => {
  const { aiStats, founderLeverage, data } = useAppContext();

  const hubs = [
    {
      id: 'roadmap',
      title: 'Learning Roadmap',
      description: 'Turn the Altman leverage thesis into an active learning system.',
      icon: Brain,
      path: 'ai-learning-roadmap',
    },
    {
      id: 'builder',
      title: 'Agent Builder',
      description: 'Design single agents with workflows, memory, leverage, and time-saved logic.',
      icon: Sparkles,
      path: 'ai-agent-builder',
    },
    {
      id: 'architect',
      title: 'Agent Architect',
      description: 'Compose multi-agent systems and export architecture designs as JSON.',
      icon: Layers,
      path: 'ai-agent-architect',
    },
    {
      id: 'experiments',
      title: 'Experiments',
      description: 'Track prompts, model tests, failures, and next iterations.',
      icon: FlaskConical,
      path: 'ai-experiments',
    },
    {
      id: 'opportunities',
      title: 'Leverage Map',
      description: 'Rank AI opportunities by leverage score, automation potential, and hours saved.',
      icon: TrendingUp,
      path: 'ai-opportunities',
    },
    {
      id: 'notes',
      title: 'Knowledge Notes',
      description: 'Store the Altman guide, system ideas, templates, and architecture notes.',
      icon: Lightbulb,
      path: 'ai-knowledge-notes',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <Button onClick={() => onNavigate('ai-agent-builder')} variant="secondary">
              <Sparkles className="h-4 w-4" />
              New Agent
            </Button>
            <Button onClick={() => onNavigate('ai-opportunities')}>
              <TrendingUp className="h-4 w-4" />
              New Opportunity
            </Button>
          </>
        }
        description="AI leverage for a founder: learn the stack, design agents, run experiments, and focus on the highest-return workflows."
        title="AI Overview"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Founder Leverage</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">{founderLeverage}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Composite signal across deep work, AI learning, agent output, and leverage opportunities.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Agents Designed</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.agentsDesigned}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{aiStats.weeklyHoursSaved} cumulative hours saved per week across agents and opportunities.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experiments Run</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.experimentsRun}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Prompt and workflow experiments tied back to agent designs.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Topics Learned</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.aiTopicsLearned}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{data.ai.opportunities.length} AI opportunities logged so far.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hubs.map((hub) => (
            <Card className="cursor-pointer p-5 transition hover:border-brand-400/40 hover:bg-brand-500/5" key={hub.id} onClick={() => onNavigate(hub.path)}>
              <div className="inline-flex rounded-2xl bg-brand-500/10 p-3 text-brand-500">
                <hub.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{hub.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hub.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-200">
                Open
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">High-Leverage Opportunities</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Top wedges</h2>
            </div>
            <Clock className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-5 space-y-3">
            {aiStats.topHighLeverageOpportunities.map((opportunity) => (
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={opportunity.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{opportunity.process}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{opportunity.industry}</p>
                  </div>
                  <span className="badge">{opportunity.leverageScore}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{opportunity.aiSolution}</p>
              </div>
            ))}
            {aiStats.topHighLeverageOpportunities.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Log opportunities and the highest-leverage ones will surface here.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
