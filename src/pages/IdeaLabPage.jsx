import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, FlaskConical, Trash2 } from 'lucide-react';
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

  const ideas = useMemo(
    () => [...data.ideas].sort((left, right) => (descending ? right.validationScore - left.validationScore : left.validationScore - right.validationScore)),
    [data.ideas, descending],
  );

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
        description="A running database of startup ideas, ranked by conviction and next experiment quality."
        title="Idea Lab"
      />

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

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Idea database</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track conviction, market logic, and next experiments without losing context.</p>
            </div>
            <span className="badge">{ideas.length} ideas</span>
          </div>
          {ideas.length ? (
            <div className="mt-6 space-y-4">
              {ideas.map((idea) => (
                <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={idea.id}>
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
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Target Customer</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.targetCustomer}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Size</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.marketSize}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Revenue Model</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.revenueModel}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Why It Matters</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.whyItMatters}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Existing Solutions</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.existingSolutions}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Difficulty</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.difficulty}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/80">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unique Insight</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.uniqueInsight}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/80">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Experiment</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{idea.nextExperiment}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">Added {formatShortDate(idea.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState copy="Log startup ideas and rank them by validation score to focus your exploration." title="No ideas yet" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
