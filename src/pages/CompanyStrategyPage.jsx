import { useMemo, useState } from 'react';
import { AlertTriangle, Rocket, Save, Target, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { createEmptyStrategicPlan } from '../utils/unicornData';
import { STRATEGY_HORIZON_OPTIONS, STRATEGY_STATUS_OPTIONS } from '../utils/constants';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const splitLines = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const initialForm = createEmptyStrategicPlan();

export const CompanyStrategyPage = () => {
  const { data, operatingMetrics, saveStrategicPlan, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const plans = useMemo(() => data.strategicPlans || [], [data.strategicPlans]);
  const activePlan = operatingMetrics.strategyStats.activePlan;

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveStrategicPlan(form);
    setForm(createEmptyStrategicPlan());
    setEditingId('');
  };

  const handleEdit = (plan) => {
    setForm(plan);
    setEditingId(plan.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <PageHeader
        description="Quarterly and annual company strategy, with north-star goals, strategic bets, risks, and execution confidence in one place."
        title="Company Strategy"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Plan</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{activePlan?.period || 'None'}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{activePlan?.northStarMetric || 'Define a current operating plan.'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Progress</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.strategyStats.avgProgress}%</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Across your current strategic plans.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Plans At Risk</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.strategyStats.atRiskPlans}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Low confidence, weak progress, or explicitly at risk.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Open Priorities</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.strategyStats.totalPriorities}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">The current stack of strategic priorities across plans.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit plan' : 'New plan'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A venture-scale founder needs a live strategy system, not scattered quarterly notes.</p>
            </div>
            <Target className="h-5 w-5 text-brand-500" />
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => handleChange('planName', event.target.value)} placeholder="Plan Name" value={form.planName} />
            <div className="grid gap-4 sm:grid-cols-2">
              <select className="select-control" onChange={(event) => handleChange('horizon', event.target.value)} value={form.horizon}>
                {STRATEGY_HORIZON_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <input className="input-control" onChange={(event) => handleChange('period', event.target.value)} placeholder="Period (Q3 2026 / 2026)" value={form.period} />
            </div>
            <textarea className="textarea-control" onChange={(event) => handleChange('mission', event.target.value)} placeholder="Mission / strategic narrative" value={form.mission} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('northStarMetric', event.target.value)} placeholder="North-star metric" value={form.northStarMetric} />
              <input className="input-control" onChange={(event) => handleChange('northStarTarget', event.target.value)} placeholder="Target" value={form.northStarTarget} />
            </div>
            <textarea className="textarea-control" onChange={(event) => handleChange('keyResults', event.target.value)} placeholder="Key results (one per line)" value={form.keyResults} />
            <textarea className="textarea-control" onChange={(event) => handleChange('strategicBets', event.target.value)} placeholder="Strategic bets (one per line)" value={form.strategicBets} />
            <textarea className="textarea-control" onChange={(event) => handleChange('topPriorities', event.target.value)} placeholder="Top priorities (one per line)" value={form.topPriorities} />
            <textarea className="textarea-control" onChange={(event) => handleChange('risks', event.target.value)} placeholder="Risks / failure modes" value={form.risks} />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Progress</label>
                <input className="input-control" max="100" min="0" onChange={(event) => handleChange('progress', Number(event.target.value))} type="number" value={form.progress} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Confidence</label>
                <input className="input-control" max="10" min="1" onChange={(event) => handleChange('confidence', Number(event.target.value))} type="number" value={form.confidence} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
                <select className="select-control" onChange={(event) => handleChange('status', event.target.value)} value={form.status}>
                  {STRATEGY_STATUS_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Plan' : 'Save Plan'}
              </Button>
              {editingId ? (
                <Button className="flex-1" onClick={() => {
                  setForm(createEmptyStrategicPlan());
                  setEditingId('');
                }} type="button" variant="secondary">
                  Reset
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          {operatingMetrics.topPriorityRisks.length ? (
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Pressure Points</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">What could break the plan</h2>
                </div>
                <AlertTriangle className="h-5 w-5 text-brand-500" />
              </div>
              <div className="mt-5 space-y-3">
                {operatingMetrics.topPriorityRisks.map((risk, index) => (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10" key={`${risk.area}-${index}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="badge">{risk.area}</span>
                    </div>
                    <p className="mt-3 font-medium text-slate-900 dark:text-white">{risk.title}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{risk.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Strategy Archive</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Plans and operating bets</h2>
              </div>
              <Rocket className="h-5 w-5 text-brand-500" />
            </div>
            {plans.length ? (
              <div className="mt-6 space-y-4">
                {plans.map((plan) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={plan.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.planName}</h3>
                          <span className="badge">{plan.period}</span>
                          <span className="badge">{plan.status}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{plan.mission}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(plan)} variant="secondary">Edit</Button>
                        <Button onClick={() => deleteRecord('strategicPlans', plan.id)} variant="danger">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">North Star</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{plan.northStarMetric || 'Not set'}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{plan.northStarTarget}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{plan.progress}%</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Confidence {plan.confidence}/10</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Key Results</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{splitLines(plan.keyResults).length}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Priorities</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{splitLines(plan.topPriorities).length}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strategic Bets</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {splitLines(plan.strategicBets).map((item) => (
                            <span className="badge" key={item}>{item}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Top Priorities</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {splitLines(plan.topPriorities).map((item) => (
                            <span className="badge" key={item}>{item}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Risks</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{plan.risks || 'No risks logged yet.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Create a live quarterly or annual plan so the rest of the OS can align to it." title="No strategic plans yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
