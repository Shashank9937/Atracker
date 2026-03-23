import { useMemo, useState } from 'react';
import { Radar, Search, Target, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OPPORTUNITY_STATUS_OPTIONS } from '../utils/constants';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = {
  problem: '',
  industry: '',
  whoExperiencesIt: '',
  evidenceSource: '',
  frequency: '',
  marketSize: '',
  opportunityScore: 60,
  potentialSolution: '',
  status: 'Watching',
};

export const OpportunityRadarPage = () => {
  const { data, addOpportunity, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const visibleOpportunities = useMemo(
    () =>
      data.opportunities.filter((opportunity) => {
        const haystack = `${opportunity.problem} ${opportunity.industry} ${opportunity.whoExperiencesIt} ${opportunity.potentialSolution}`.toLowerCase();
        const matchesQuery = haystack.includes(query.toLowerCase());
        const matchesStatus = statusFilter === 'All' ? true : opportunity.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [data.opportunities, query, statusFilter],
  );

  const averageScore = useMemo(() => {
    if (!data.opportunities.length) return 0;
    return Math.round(data.opportunities.reduce((total, item) => total + Number(item.opportunityScore || 0), 0) / data.opportunities.length);
  }, [data.opportunities]);

  const topIndustry = useMemo(() => {
    const counts = data.opportunities.reduce((acc, item) => {
      acc[item.industry] = (acc[item.industry] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'No data';
  }, [data.opportunities]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addOpportunity(form);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        description="Track recurring market pain before it becomes obvious to everyone else. Use this page to separate noise from real operating signal."
        title="Opportunity Radar"
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signals Logged</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.opportunities.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A denser radar gives better odds of noticing real founder wedges early.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Score</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{averageScore}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Current strongest industry cluster: {topIndustry}.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Research Queue</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.opportunities.filter((item) => item.status === 'Researching').length}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">These are the problems that deserve founder attention right now.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Log opportunity</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, problem: event.target.value }))} placeholder="Problem" value={form.problem} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} placeholder="Industry" value={form.industry} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, whoExperiencesIt: event.target.value }))} placeholder="Who Experiences It" value={form.whoExperiencesIt} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, evidenceSource: event.target.value }))} placeholder="Evidence Source" value={form.evidenceSource} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))} placeholder="Frequency" value={form.frequency} />
              <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, marketSize: event.target.value }))} placeholder="Market Size" value={form.marketSize} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Opportunity Score</label>
              <input className="input-control" max="100" min="0" onChange={(event) => setForm((current) => ({ ...current, opportunityScore: Number(event.target.value) }))} type="number" value={form.opportunityScore} />
            </div>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, potentialSolution: event.target.value }))} placeholder="Potential Solution" value={form.potentialSolution} />
            <select className="select-control" onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}>
              {OPPORTUNITY_STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Button className="w-full" type="submit">
              <Radar className="h-4 w-4" />
              Save Opportunity
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Problem signals</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search by industry, problem, or user pain to focus the radar.</p>
              </div>
              <span className="badge">{visibleOpportunities.length} visible</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search problems, industries, or solutions..." value={query} />
              </div>
              <select className="select-control" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                <option>All</option>
                {OPPORTUNITY_STATUS_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </Card>

          {visibleOpportunities.length ? (
            <div className="space-y-4">
              {visibleOpportunities.map((opportunity) => (
                <Card className="p-5" key={opportunity.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{opportunity.problem}</h3>
                        <span className="badge">{opportunity.status}</span>
                        <span className="badge">{opportunity.opportunityScore}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{opportunity.industry} • {opportunity.whoExperiencesIt}</p>
                    </div>
                    <button className="danger-button" onClick={() => deleteRecord('opportunities', opportunity.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Evidence Source</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.evidenceSource}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Frequency</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.frequency}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Size</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.marketSize}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-brand-500" />
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Potential Solution</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.potentialSolution}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState copy="No opportunities match the current filters. Widen the search or log a new signal." title="No visible signals" />
          )}
        </div>
      </div>
    </div>
  );
};
