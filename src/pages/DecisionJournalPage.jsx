import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpenCheck, Search, Scale, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatShortDate, getTodayKey, parseDateKey } from '../utils/date';
import { extractTopTerms, includesQuery } from '../utils/textInsights';
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
  const [query, setQuery] = useState('');
  const [reviewFilter, setReviewFilter] = useState('All');

  const today = useMemo(() => parseDateKey(getTodayKey()), []);

  const visibleDecisions = useMemo(
    () =>
      data.decisions.filter((decision) => {
        const matchesQuery = includesQuery(
          [
            decision.decision,
            decision.context,
            decision.optionsConsidered,
            decision.whyChosen,
            decision.expectedOutcome,
            decision.actualOutcome,
          ],
          query,
        );

        const dueNow = decision.reviewDate && parseDateKey(decision.reviewDate) <= today && !decision.actualOutcome;
        const reviewed = Boolean(decision.actualOutcome);

        const matchesFilter =
          reviewFilter === 'All'
            ? true
            : reviewFilter === 'Due Now'
              ? dueNow
              : reviewFilter === 'Reviewed'
                ? reviewed
                : !reviewed;

        return matchesQuery && matchesFilter;
      }),
    [data.decisions, query, reviewFilter, today],
  );

  const dueNowCount = useMemo(
    () => data.decisions.filter((decision) => decision.reviewDate && parseDateKey(decision.reviewDate) <= today && !decision.actualOutcome).length,
    [data.decisions, today],
  );

  const reviewedCount = useMemo(() => data.decisions.filter((decision) => decision.actualOutcome).length, [data.decisions]);
  const pendingCount = data.decisions.length - reviewedCount;

  const recurringTerms = useMemo(
    () =>
      extractTopTerms(
        data.decisions.flatMap((decision) => [decision.decision, decision.context, decision.optionsConsidered, decision.whyChosen]),
        6,
      ),
    [data.decisions],
  );

  const nextReviewQueue = useMemo(
    () =>
      [...data.decisions]
        .filter((decision) => decision.reviewDate && !decision.actualOutcome)
        .sort((left, right) => new Date(left.reviewDate) - new Date(right.reviewDate))
        .slice(0, 4),
    [data.decisions],
  );

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

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Decisions Logged</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.decisions.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Recording reasoning makes judgment improvable instead of mysterious.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due For Review</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{dueNowCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Any due review without an outcome is missing a learning loop.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reviewed Decisions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{reviewedCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{pendingCount} decisions are still waiting for an outcome note.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Recurring Theme</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{recurringTerms[0]?.term || 'No pattern yet'}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Your most common decision-language signal across recent entries.</p>
        </Card>
      </div>

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

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Decision log</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search by context, rationale, or outcomes to revisit your judgment patterns quickly.</p>
              </div>
              <span className="badge">{visibleDecisions.length} visible</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search decisions, reasoning, or outcomes..." value={query} />
              </div>
              <select className="select-control" onChange={(event) => setReviewFilter(event.target.value)} value={reviewFilter}>
                {['All', 'Pending', 'Due Now', 'Reviewed'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-brand-500" />
                <div>
                  <h3 className="section-title">Decision Themes</h3>
                  <p className="section-copy">Terms that recur in your decisions and may reflect your default frame.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {recurringTerms.length ? (
                  recurringTerms.map((term) => (
                    <span className="badge" key={term.term}>
                      {term.term} • {term.count}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">More logged decisions will surface clearer patterns here.</span>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-brand-500" />
                <div>
                  <h3 className="section-title">Upcoming Review Queue</h3>
                  <p className="section-copy">Decisions that need outcome checks so the learning loop stays closed.</p>
                </div>
              </div>
              {nextReviewQueue.length ? (
                <div className="mt-5 space-y-3">
                  {nextReviewQueue.map((decision) => (
                    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={decision.id}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900 dark:text-white">{decision.decision}</p>
                        <span className="badge">{formatShortDate(decision.reviewDate)}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{decision.expectedOutcome || 'No expected outcome written yet.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState copy="Add review dates to important decisions and the queue will keep them visible." title="No pending review queue" />
                </div>
              )}
            </Card>
          </div>

          {visibleDecisions.length ? (
            <div className="space-y-4">
              {visibleDecisions.map((decision) => {
                const dueNow = decision.reviewDate && parseDateKey(decision.reviewDate) <= today && !decision.actualOutcome;
                return (
                  <Card className="p-5" key={decision.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{decision.decision}</h3>
                          {decision.reviewDate ? <span className="badge">Review {formatShortDate(decision.reviewDate)}</span> : null}
                          {dueNow ? (
                            <span className="badge !border-rose-300 !bg-rose-50 !text-rose-700 dark:!border-rose-500/20 dark:!bg-rose-500/10 dark:!text-rose-200">
                              Due now
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{decision.context || 'No context captured yet.'}</p>
                      </div>
                      <button className="danger-button" onClick={() => deleteRecord('decisions', decision.id)} type="button">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Options Considered</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.optionsConsidered || 'No options logged.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Why Chosen</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.whyChosen || 'No rationale captured.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expected Outcome</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.expectedOutcome || 'No expected outcome written.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Actual Outcome</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{decision.actualOutcome || 'Pending review'}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState copy="No decisions match the current filters. Try a broader search or log a new decision." title="No visible decisions" />
          )}
        </div>
      </div>
    </div>
  );
};
