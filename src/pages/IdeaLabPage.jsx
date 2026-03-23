import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, FlaskConical, Search, Target, Trash2, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { IDEA_DIFFICULTY_OPTIONS, IDEA_STATUS_OPTIONS } from '../utils/constants';
import { formatShortDate } from '../utils/date';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = {
  ideaName: '',
  problem: '',
  targetCustomer: '',
  marketSize: '',
  whyItMatters: '',
  existingSolutions: '',
  uniqueInsight: '',
  validationScore: 60,
  revenueModel: '',
  difficulty: 'Medium',
  status: 'Exploring',
  nextExperiment: '',
};

export const IdeaLabPage = () => {
  const { data, addIdea, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [descending, setDescending] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const ideas = useMemo(() => {
    const filtered = data.ideas.filter((idea) => {
      const haystack = `${idea.ideaName} ${idea.problem} ${idea.targetCustomer} ${idea.uniqueInsight} ${idea.nextExperiment}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : idea.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    return filtered.sort((left, right) => (descending ? right.validationScore - left.validationScore : left.validationScore - right.validationScore));
  }, [data.ideas, descending, query, statusFilter]);

  const averageValidation = useMemo(() => {
    if (!data.ideas.length) return 0;
    return Math.round(data.ideas.reduce((total, idea) => total + Number(idea.validationScore || 0), 0) / data.ideas.length);
  }, [data.ideas]);

  const buildingCount = useMemo(() => data.ideas.filter((idea) => idea.status === 'Building').length, [data.ideas]);
  const topIdea = useMemo(() => data.ideas[0], [data.ideas]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addIdea(form);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        actions={
          <Button onClick={() => setDescending((current) => !current)} variant="secondary">
            <ArrowDownWideNarrow className="h-4 w-4" />
            Sort by Validation {descending ? 'High-Low' : 'Low-High'}
          </Button>
        }
        description="A running database of startup ideas, ranked by conviction, clarity, and next experiment quality."
        title="Idea Lab"
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ideas Tracked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.ideas.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Keep a healthy pipeline so exploration is never dependent on one thesis.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Validation</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{averageValidation}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{buildingCount} ideas are already in `Building` mode.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Top Candidate</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{topIdea?.ideaName || 'No idea yet'}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{topIdea?.nextExperiment || 'The strongest idea will surface here once you start logging them.'}</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6" id="idea-form">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Add startup idea</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, ideaName: event.target.value }))} placeholder="Idea Name" value={form.ideaName} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, problem: event.target.value }))} placeholder="Problem" value={form.problem} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, targetCustomer: event.target.value }))} placeholder="Target Customer" value={form.targetCustomer} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, marketSize: event.target.value }))} placeholder="Market Size" value={form.marketSize} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, whyItMatters: event.target.value }))} placeholder="Why It Matters" value={form.whyItMatters} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, existingSolutions: event.target.value }))} placeholder="Existing Solutions" value={form.existingSolutions} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, uniqueInsight: event.target.value }))} placeholder="Unique Insight" value={form.uniqueInsight} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Validation Score</label>
                <input className="input-control" max="100" min="0" onChange={(event) => setForm((current) => ({ ...current, validationScore: Number(event.target.value) }))} type="number" value={form.validationScore} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Difficulty</label>
                <select className="select-control" onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))} value={form.difficulty}>
                  {IDEA_DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, revenueModel: event.target.value }))} placeholder="Revenue Model" value={form.revenueModel} />
            <select className="select-control" onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}>
              {IDEA_STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, nextExperiment: event.target.value }))} placeholder="Next Experiment" value={form.nextExperiment} />
            <Button className="w-full" type="submit">
              <FlaskConical className="h-4 w-4" />
              Save Idea
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Idea database</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search, filter, and keep the strongest bets visible.</p>
              </div>
              <span className="badge">{ideas.length} visible</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search ideas, customers, or next experiments..." value={query} />
              </div>
              <select className="select-control" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                <option>All</option>
                {IDEA_STATUS_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </Card>

          {ideas.length ? (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <Card className="p-5" key={idea.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{idea.ideaName}</h3>
                        <span className="badge">{idea.status}</span>
                        <span className="badge">Validation {idea.validationScore}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{idea.problem}</p>
                    </div>
                    <button className="danger-button" onClick={() => deleteRecord('ideas', idea.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Target Customer</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.targetCustomer}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Size</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.marketSize}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Difficulty</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.difficulty}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Revenue Model</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.revenueModel}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-500" />
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Why It Matters</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.whyItMatters}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-brand-500" />
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unique Insight</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.uniqueInsight}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-brand-500" />
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Experiment</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.nextExperiment}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">Added {formatShortDate(idea.createdAt)}</p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState copy="No ideas match the current filters. Widen the search or capture a new wedge." title="No visible ideas" />
          )}
        </div>
      </div>
    </div>
  );
};
