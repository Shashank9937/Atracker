import { useMemo, useState } from 'react';
import { MessageSquare, Save, Trash2, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PMF_SIGNAL_OPTIONS } from '../utils/constants';
import { createEmptyCustomerInsight } from '../utils/unicornData';
import { formatShortDate } from '../utils/date';
import { DoughnutChart } from '../charts/DoughnutChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = createEmptyCustomerInsight();

export const CustomerResearchPage = () => {
  const { data, operatingMetrics, saveCustomerInsight, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const items = useMemo(() => data.customerResearch || [], [data.customerResearch]);
  const topThemes = operatingMetrics.customerStats.topProblemThemes;

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveCustomerInsight(form);
    setForm(createEmptyCustomerInsight());
    setEditingId('');
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <PageHeader
        description="Run a proper customer research operating system: interviews, pain intensity, budget signal, PMF strength, and next-step discipline."
        title="Customer Research"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Interviews Logged</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.totalInterviews}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Your cumulative PMF signal base.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last 14 Days</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.recentInterviews}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Freshness matters more than a big archive.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Pain</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.avgPainScore}/10</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">How severe the problem feels across interviews.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strong PMF Signals</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.customerStats.strongSignals}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Interviews that feel closest to a credible wedge.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit interview' : 'Log interview'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Good product decisions come from specific conversations, not memory.</p>
            </div>
            <MessageSquare className="h-5 w-5 text-brand-500" />
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('company', event.target.value)} placeholder="Company" value={form.company} />
              <input className="input-control" onChange={(event) => handleChange('contactName', event.target.value)} placeholder="Contact Name" value={form.contactName} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('segment', event.target.value)} placeholder="Segment" value={form.segment} />
              <input className="input-control" onChange={(event) => handleChange('interviewDate', event.target.value)} type="date" value={form.interviewDate} />
            </div>
            <input className="input-control" onChange={(event) => handleChange('problemArea', event.target.value)} placeholder="Problem Area" value={form.problemArea} />
            <textarea className="textarea-control" onChange={(event) => handleChange('currentWorkflow', event.target.value)} placeholder="Current workflow / workaround" value={form.currentWorkflow} />
            <textarea className="textarea-control" onChange={(event) => handleChange('urgency', event.target.value)} placeholder="Urgency / trigger event" value={form.urgency} />
            <textarea className="textarea-control" onChange={(event) => handleChange('objections', event.target.value)} placeholder="Objections" value={form.objections} />
            <textarea className="textarea-control" onChange={(event) => handleChange('requestedOutcome', event.target.value)} placeholder="Requested outcome / ideal future" value={form.requestedOutcome} />
            <textarea className="textarea-control" onChange={(event) => handleChange('notableQuote', event.target.value)} placeholder="Notable quote" value={form.notableQuote} />
            <textarea className="textarea-control" onChange={(event) => handleChange('nextStep', event.target.value)} placeholder="Next step" value={form.nextStep} />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Pain Score</label>
                <input className="input-control" max="10" min="1" onChange={(event) => handleChange('painScore', Number(event.target.value))} type="number" value={form.painScore} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Budget Signal</label>
                <input className="input-control" max="10" min="1" onChange={(event) => handleChange('budgetSignal', Number(event.target.value))} type="number" value={form.budgetSignal} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">PMF Signal</label>
                <select className="select-control" onChange={(event) => handleChange('pmfSignal', event.target.value)} value={form.pmfSignal}>
                  {PMF_SIGNAL_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Interview' : 'Save Interview'}
              </Button>
              {editingId ? (
                <Button className="flex-1" onClick={() => {
                  setForm(createEmptyCustomerInsight());
                  setEditingId('');
                }} type="button" variant="secondary">
                  Reset
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <DoughnutChart
              colors={['#f87171', '#f4a640', '#5de0c0']}
              data={operatingMetrics.pmfSignalChart.data}
              labels={operatingMetrics.pmfSignalChart.labels}
              subtitle="Weak vs emerging vs strong PMF signals from interviews."
              title="PMF Signal Mix"
            />
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Recurring Themes</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">What customers keep saying</h3>
                </div>
                <Users className="h-5 w-5 text-brand-500" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {topThemes.length ? topThemes.map((item) => <span className="badge" key={item.term}>{item.term} • {item.count}</span>) : <p className="text-sm text-slate-500 dark:text-slate-400">Themes will appear as you log interviews.</p>}
              </div>
              {operatingMetrics.customerStats.latestInsight ? (
                <div className="mt-5 rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest Signal</p>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">{operatingMetrics.customerStats.latestInsight.problemArea}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{operatingMetrics.customerStats.latestInsight.notableQuote || operatingMetrics.customerStats.latestInsight.requestedOutcome}</p>
                </div>
              ) : null}
            </Card>
          </div>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Interview Log</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Structured research archive</h2>
            {items.length ? (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={item.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.company}</h3>
                          <span className="badge">{item.segment}</span>
                          <span className="badge">{item.pmfSignal}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.contactName} • {formatShortDate(item.interviewDate)}</p>
                        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{item.problemArea}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(item)} variant="secondary">Edit</Button>
                        <Button onClick={() => deleteRecord('customerResearch', item.id)} variant="danger">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pain</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{item.painScore}/10</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Budget Signal</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{item.budgetSignal}/10</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Urgency</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.urgency || 'Not logged'}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Step</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.nextStep || 'No next step yet'}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Workflow</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.currentWorkflow}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notable Quote</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.notableQuote || 'No direct quote captured.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Capture customer conversations so the product roadmap is driven by evidence." title="No interviews yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
