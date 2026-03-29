import { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Save, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { createEmptyFinanceSnapshot } from '../utils/unicornData';
import { calculateRunwayMonths, currency, percent } from '../utils/unicornMetrics';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = createEmptyFinanceSnapshot();

export const FinanceRunwayPage = () => {
  const { data, operatingMetrics, saveFinanceSnapshot, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const snapshots = useMemo(() => data.financeSnapshots || [], [data.financeSnapshots]);
  const latest = operatingMetrics.financeStats.latestSnapshot;
  const expenseMix = useMemo(
    () => ({
      labels: ['Payroll', 'Infra', 'Marketing', 'Other'],
      data: [latest?.payroll || 0, latest?.infraCost || 0, latest?.marketingSpend || 0, latest?.otherExpenses || 0],
    }),
    [latest],
  );

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveFinanceSnapshot(form);
    setForm(createEmptyFinanceSnapshot());
    setEditingId('');
  };

  const handleEdit = (snapshot) => {
    setForm(snapshot);
    setEditingId(snapshot.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <PageHeader
        description="Cash, burn, revenue, expense mix, and runway all live here so the founder can make capital decisions from one place."
        title="Finance & Runway"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Runway</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.financeStats.runwayMonths} mo</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Against a target of {operatingMetrics.financeStats.targetRunwayMonths} months.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cash On Hand</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{currency(latest?.cashOnHand)}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Current capital inside the business.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Net Burn</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{currency(operatingMetrics.financeStats.netBurn)}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Monthly burn after revenue contribution.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Revenue Coverage</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{percent(operatingMetrics.financeStats.revenueCoverage)}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">How much of burn is covered by monthly revenue.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit snapshot' : 'New snapshot'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A founder needs a live capital view, not a spreadsheet hidden outside the operating system.</p>
            </div>
            <Gauge className="h-5 w-5 text-brand-500" />
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('snapshotDate', event.target.value)} type="date" value={form.snapshotDate} />
              <input className="input-control" onChange={(event) => handleChange('scenarioName', event.target.value)} placeholder="Scenario Name" value={form.scenarioName} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" min="0" onChange={(event) => handleChange('cashOnHand', Number(event.target.value))} placeholder="Cash On Hand" type="number" value={form.cashOnHand} />
              <input className="input-control" min="0" onChange={(event) => handleChange('monthlyRevenue', Number(event.target.value))} placeholder="Monthly Revenue" type="number" value={form.monthlyRevenue} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" min="0" onChange={(event) => handleChange('monthlyBurn', Number(event.target.value))} placeholder="Monthly Burn" type="number" value={form.monthlyBurn} />
              <input className="input-control" min="1" onChange={(event) => handleChange('targetRunwayMonths', Number(event.target.value))} placeholder="Target Runway" type="number" value={form.targetRunwayMonths} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" min="0" onChange={(event) => handleChange('payroll', Number(event.target.value))} placeholder="Payroll" type="number" value={form.payroll} />
              <input className="input-control" min="0" onChange={(event) => handleChange('infraCost', Number(event.target.value))} placeholder="Infra Cost" type="number" value={form.infraCost} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" min="0" onChange={(event) => handleChange('marketingSpend', Number(event.target.value))} placeholder="Marketing Spend" type="number" value={form.marketingSpend} />
              <input className="input-control" min="0" onChange={(event) => handleChange('otherExpenses', Number(event.target.value))} placeholder="Other Expenses" type="number" value={form.otherExpenses} />
            </div>
            <textarea className="textarea-control" onChange={(event) => handleChange('notes', event.target.value)} placeholder="Scenario notes / decisions" value={form.notes} />
            <div className="rounded-2xl bg-slate-50/70 p-4 text-sm text-slate-600 dark:bg-slate-950/50 dark:text-slate-300">
              Estimated runway from this snapshot: <span className="font-semibold text-slate-900 dark:text-white">{calculateRunwayMonths(form)} months</span>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Snapshot' : 'Save Snapshot'}
              </Button>
              {editingId ? (
                <Button className="flex-1" onClick={() => {
                  setForm(createEmptyFinanceSnapshot());
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
            <LineChart
              backgroundColor="rgba(93, 224, 192, 0.18)"
              borderColor="#5de0c0"
              data={operatingMetrics.runwayTrend.data}
              labels={operatingMetrics.runwayTrend.labels}
              subtitle="Runway trend across saved finance snapshots."
              title="Runway Trend"
            />
            <BarChart
              backgroundColor="rgba(244, 166, 64, 0.25)"
              borderColor="#f4a640"
              data={expenseMix.data}
              labels={expenseMix.labels}
              subtitle="Expense mix from the latest snapshot."
              title="Expense Mix"
            />
          </div>

          {operatingMetrics.financeStats.atRisk ? (
            <Card className="p-6">
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
                <AlertTriangle className="mt-1 h-5 w-5 text-rose-600 dark:text-rose-300" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Runway is below the 12-month safety line</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The operating system is flagging this because capital planning becomes much tighter once runway drops into the single-year range.</p>
                </div>
              </div>
            </Card>
          ) : null}

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Finance Archive</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Snapshots and scenarios</h2>
            {snapshots.length ? (
              <div className="mt-6 space-y-4">
                {snapshots.map((snapshot) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={snapshot.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{snapshot.scenarioName}</h3>
                          <span className="badge">{snapshot.snapshotDate}</span>
                          <span className="badge">{calculateRunwayMonths(snapshot)} mo runway</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{snapshot.notes || 'No notes captured yet.'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(snapshot)} variant="secondary">Edit</Button>
                        <Button onClick={() => deleteRecord('financeSnapshots', snapshot.id)} variant="danger">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cash</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(snapshot.cashOnHand)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Revenue</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(snapshot.monthlyRevenue)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Burn</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(snapshot.monthlyBurn)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Target Runway</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{snapshot.targetRunwayMonths} mo</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Revenue Coverage</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{percent(snapshot.monthlyBurn > 0 ? (snapshot.monthlyRevenue / snapshot.monthlyBurn) * 100 : 0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Add finance snapshots so the inbox can flag runway and capital risk early." title="No finance snapshots yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
