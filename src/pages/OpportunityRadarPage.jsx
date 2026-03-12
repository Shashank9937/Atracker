import { useState } from 'react';
import { Radar, Trash2 } from 'lucide-react';
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

  const handleSubmit = (event) => {
    event.preventDefault();
    addOpportunity(form);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        description="Track recurring market pain before it becomes obvious to everyone else."
        title="Opportunity Radar"
      />
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

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Problem signals</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Watch patterns, score urgency, and keep the strongest wedges visible.</p>
            </div>
            <span className="badge">{data.opportunities.length} tracked</span>
          </div>
          {data.opportunities.length ? (
            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800">
              <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm dark:divide-slate-800">
                <thead className="bg-slate-50/70 dark:bg-slate-950/70">
                  <tr>
                    {['Problem', 'Industry', 'Who', 'Evidence', 'Frequency', 'Market', 'Score', 'Solution', 'Status', ''].map((label) => (
                      <th className="px-4 py-3 font-medium text-slate-500 dark:text-slate-300" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                  {data.opportunities.map((opportunity) => (
                    <tr className="align-top" key={opportunity.id}>
                      <td className="px-4 py-4 text-slate-800 dark:text-slate-100">{opportunity.problem}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{opportunity.industry}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{opportunity.whoExperiencesIt}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{opportunity.evidenceSource}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{opportunity.frequency}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{opportunity.marketSize}</td>
                      <td className="px-4 py-4">
                        <span className="badge">{opportunity.opportunityScore}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{opportunity.potentialSolution}</td>
                      <td className="px-4 py-4">
                        <span className="badge">{opportunity.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="danger-button" onClick={() => deleteRecord('opportunities', opportunity.id)} type="button">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState copy="Capture real recurring problems from calls, field notes, and pattern spotting." title="No opportunities yet" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
