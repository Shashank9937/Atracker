import { useState } from 'react';
import { BookOpenCheck, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatShortDate } from '../utils/date';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = {
  decision: '',
  context: '',
  optionsConsidered: '',
  whyChosen: '',
  expectedOutcome: '',
  reviewDate: '',
  actualOutcome: '',
};

export const DecisionJournalPage = () => {
  const { data, addDecision, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (event) => {
    event.preventDefault();
    addDecision(form);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        description="Log major decisions with the reasoning behind them so future you can audit judgment quality."
        title="Decision Journal"
      />
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">New decision</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, decision: event.target.value }))} placeholder="Decision" value={form.decision} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))} placeholder="Context" value={form.context} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, optionsConsidered: event.target.value }))} placeholder="Options Considered" value={form.optionsConsidered} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, whyChosen: event.target.value }))} placeholder="Why Chosen" value={form.whyChosen} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, expectedOutcome: event.target.value }))} placeholder="Expected Outcome" value={form.expectedOutcome} />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Review Date</label>
              <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, reviewDate: event.target.value }))} type="date" value={form.reviewDate} />
            </div>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, actualOutcome: event.target.value }))} placeholder="Actual Outcome" value={form.actualOutcome} />
            <Button className="w-full" type="submit">
              <BookOpenCheck className="h-4 w-4" />
              Save Decision
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Decision log</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Keep a record of deliberate bets, not just outcomes.</p>
            </div>
            <span className="badge">{data.decisions.length} decisions</span>
          </div>
          {data.decisions.length ? (
            <div className="mt-6 space-y-4">
              {data.decisions.map((decision) => (
                <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={decision.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{decision.decision}</h3>
                        {decision.reviewDate ? <span className="badge">Review {formatShortDate(decision.reviewDate)}</span> : null}
                      </div>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{decision.context}</p>
                    </div>
                    <button className="danger-button" onClick={() => deleteRecord('decisions', decision.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Options Considered</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.optionsConsidered}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Why Chosen</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.whyChosen}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expected Outcome</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.expectedOutcome}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Actual Outcome</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.actualOutcome || 'Pending review'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState copy="Track the decisions that shape your startup so you can refine judgment over time." title="No decisions yet" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
