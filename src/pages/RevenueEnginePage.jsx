import { useMemo, useState } from 'react';
import { Save, Target, Trash2, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { REVENUE_CHANNEL_OPTIONS, REVENUE_STAGE_OPTIONS } from '../utils/constants';
import { createEmptyRevenueItem } from '../utils/unicornData';
import { currency, getUpcomingCloseLabel } from '../utils/unicornMetrics';
import { BarChart } from '../charts/BarChart';
import { DoughnutChart } from '../charts/DoughnutChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = createEmptyRevenueItem();
const stageColumns = ['Prospect', 'Discovery', 'Proposal', 'Negotiation', 'Won'];

export const RevenueEnginePage = () => {
  const { data, operatingMetrics, saveRevenueItem, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const pipeline = useMemo(() => data.revenuePipeline || [], [data.revenuePipeline]);
  const openPipeline = useMemo(() => pipeline.filter((item) => !['Lost'].includes(item.stage)), [pipeline]);
  const stageCounts = useMemo(
    () => ({
      labels: stageColumns,
      data: stageColumns.map((stage) => openPipeline.filter((item) => item.stage === stage).length),
    }),
    [openPipeline],
  );

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveRevenueItem(form);
    setForm(createEmptyRevenueItem());
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
        description="Track founder-led sales, pilots, partnerships, and expansion opportunities with weighted pipeline visibility and next-step discipline."
        title="Revenue Engine"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weighted Pipeline</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{currency(operatingMetrics.revenueStats.weightedPipeline)}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Risk-adjusted revenue potential from open deals.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Open Pipeline</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{currency(operatingMetrics.revenueStats.pipelineValue)}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Total open opportunity value before weighting.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Committed Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{currency(operatingMetrics.revenueStats.committedRevenue)}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Won deals already inside the system.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Near-Close Deals</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.revenueStats.nearCloseDeals.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Deals expected to move in the next 21 days.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit pipeline item' : 'New pipeline item'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">If the founder runs GTM, the founder needs a revenue cockpit.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-brand-500" />
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => handleChange('accountName', event.target.value)} placeholder="Account / opportunity name" value={form.accountName} />
            <div className="grid gap-4 sm:grid-cols-2">
              <select className="select-control" onChange={(event) => handleChange('channelType', event.target.value)} value={form.channelType}>
                {REVENUE_CHANNEL_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select className="select-control" onChange={(event) => handleChange('stage', event.target.value)} value={form.stage}>
                {REVENUE_STAGE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" min="0" onChange={(event) => handleChange('dealValue', Number(event.target.value))} placeholder="Deal Value" type="number" value={form.dealValue} />
              <input className="input-control" max="100" min="0" onChange={(event) => handleChange('closeProbability', Number(event.target.value))} placeholder="Close Probability" type="number" value={form.closeProbability} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('expectedCloseDate', event.target.value)} type="date" value={form.expectedCloseDate} />
              <input className="input-control" onChange={(event) => handleChange('source', event.target.value)} placeholder="Source" value={form.source} />
            </div>
            <input className="input-control" onChange={(event) => handleChange('useCase', event.target.value)} placeholder="Use Case" value={form.useCase} />
            <textarea className="textarea-control" onChange={(event) => handleChange('nextStep', event.target.value)} placeholder="Next Step" value={form.nextStep} />
            <textarea className="textarea-control" onChange={(event) => handleChange('blockers', event.target.value)} placeholder="Blockers" value={form.blockers} />
            <div className="flex gap-3">
              <Button className="flex-1" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Item' : 'Save Item'}
              </Button>
              {editingId ? (
                <Button className="flex-1" onClick={() => {
                  setForm(createEmptyRevenueItem());
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
            <BarChart
              backgroundColor="rgba(36, 159, 232, 0.25)"
              borderColor="#249fe8"
              data={operatingMetrics.revenueStageChart.data}
              labels={operatingMetrics.revenueStageChart.labels}
              subtitle="Pipeline value distributed across each GTM stage."
              title="Revenue by Stage"
            />
            <DoughnutChart
              colors={['#58c0ff', '#5de0c0', '#f4a640', '#fb7185', '#34d399']}
              data={stageCounts.data}
              labels={stageCounts.labels}
              subtitle="Open opportunity count by stage."
              title="Deal Flow Mix"
            />
          </div>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Top Opportunities</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Where revenue likely comes from next</h2>
              </div>
              <Target className="h-5 w-5 text-brand-500" />
            </div>
            {operatingMetrics.revenueStats.topDeals.length ? (
              <div className="mt-6 space-y-4">
                {operatingMetrics.revenueStats.topDeals.map((item) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={item.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.accountName}</h3>
                          <span className="badge">{item.stage}</span>
                          <span className="badge">{item.channelType}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.useCase || item.source}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(item)} variant="secondary">Edit</Button>
                        <Button onClick={() => deleteRecord('revenuePipeline', item.id)} variant="danger">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deal Value</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(item.dealValue)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Probability</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item.closeProbability}%</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weighted</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(item.dealValue * (item.closeProbability / 100))}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expected Close</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{getUpcomingCloseLabel(item.expectedCloseDate)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Step</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.nextStep || 'No next step'}</p>
                      </div>
                    </div>
                    {item.blockers ? <p className="mt-4 text-sm text-rose-600 dark:text-rose-300">Blocker: {item.blockers}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Log revenue opportunities so the founder inbox can surface GTM risk and momentum." title="No pipeline items yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
