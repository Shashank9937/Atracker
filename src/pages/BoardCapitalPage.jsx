import { useMemo, useState } from 'react';
import { CalendarClock, Landmark, Save, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BOARD_ENTRY_TYPES, BOARD_STATUS_OPTIONS } from '../utils/constants';
import { createEmptyBoardItem } from '../utils/unicornData';
import { currency } from '../utils/unicornMetrics';
import { DoughnutChart } from '../charts/DoughnutChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = createEmptyBoardItem();

export const BoardCapitalPage = () => {
  const { data, operatingMetrics, saveBoardItem, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const items = useMemo(() => data.boardItems || [], [data.boardItems]);

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveBoardItem(form);
    setForm(createEmptyBoardItem());
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
        description="Investor updates, board prep, fundraising relationships, asks, and follow-up dates live in one system instead of drifting across notes and inboxes."
        title="Board & Capital"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upcoming Items</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.boardStats.upcomingItems.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Board meetings, updates, or capital moments in the next 30 days.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overdue Actions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.boardStats.overdueItems}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Follow-ups that the founder should not let go cold.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Raise Paths</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.boardStats.activeFundraise.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Capital relationships still open or warming.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Highest Conviction</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.boardStats.highestConvictionInvestor?.interestLevel || 0}/10</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{operatingMetrics.boardStats.highestConvictionInvestor?.contactName || 'No active investor tracked'}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit item' : 'New item'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Capital raising and board discipline should be part of the daily OS, not a side document.</p>
            </div>
            <Landmark className="h-5 w-5 text-brand-500" />
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <select className="select-control" onChange={(event) => handleChange('entryType', event.target.value)} value={form.entryType}>
                {BOARD_ENTRY_TYPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select className="select-control" onChange={(event) => handleChange('status', event.target.value)} value={form.status}>
                {BOARD_STATUS_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <input className="input-control" onChange={(event) => handleChange('title', event.target.value)} placeholder="Title" value={form.title} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('contactName', event.target.value)} placeholder="Contact Name" value={form.contactName} />
              <input className="input-control" onChange={(event) => handleChange('firm', event.target.value)} placeholder="Firm / board group" value={form.firm} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('stage', event.target.value)} placeholder="Stage / relationship context" value={form.stage} />
              <input className="input-control" max="10" min="1" onChange={(event) => handleChange('interestLevel', Number(event.target.value))} placeholder="Interest Level" type="number" value={form.interestLevel} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => handleChange('date', event.target.value)} type="date" value={form.date} />
              <input className="input-control" onChange={(event) => handleChange('nextActionDate', event.target.value)} type="date" value={form.nextActionDate} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" min="0" onChange={(event) => handleChange('targetRaise', Number(event.target.value))} placeholder="Target Raise" type="number" value={form.targetRaise} />
              <input className="input-control" min="0" onChange={(event) => handleChange('checkSize', Number(event.target.value))} placeholder="Check Size" type="number" value={form.checkSize} />
            </div>
            <textarea className="textarea-control" onChange={(event) => handleChange('keyWins', event.target.value)} placeholder="Key wins" value={form.keyWins} />
            <textarea className="textarea-control" onChange={(event) => handleChange('metricsSummary', event.target.value)} placeholder="Metrics summary" value={form.metricsSummary} />
            <textarea className="textarea-control" onChange={(event) => handleChange('asks', event.target.value)} placeholder="Asks" value={form.asks} />
            <textarea className="textarea-control" onChange={(event) => handleChange('notes', event.target.value)} placeholder="Notes" value={form.notes} />
            <div className="flex gap-3">
              <Button className="flex-1" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Item' : 'Save Item'}
              </Button>
              {editingId ? (
                <Button className="flex-1" onClick={() => {
                  setForm(createEmptyBoardItem());
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
              colors={['#249fe8', '#5de0c0', '#f4a640']}
              data={operatingMetrics.boardTypeChart.data}
              labels={operatingMetrics.boardTypeChart.labels}
              subtitle="Mix of investor updates, board meetings, and fundraising entries."
              title="Capital Operating Mix"
            />
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Next Capital Move</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Highest-leverage next interaction</h3>
                </div>
                <CalendarClock className="h-5 w-5 text-brand-500" />
              </div>
              {operatingMetrics.boardStats.highestConvictionInvestor ? (
                <div className="mt-5 rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{operatingMetrics.boardStats.highestConvictionInvestor.entryType}</span>
                    <span className="badge">Interest {operatingMetrics.boardStats.highestConvictionInvestor.interestLevel}/10</span>
                  </div>
                  <p className="mt-3 font-medium text-slate-900 dark:text-white">{operatingMetrics.boardStats.highestConvictionInvestor.title}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{operatingMetrics.boardStats.highestConvictionInvestor.asks || operatingMetrics.boardStats.highestConvictionInvestor.notes}</p>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">No capital items yet.</p>
              )}
            </Card>
          </div>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Board / Capital Log</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Updates, meetings, and raise pipeline</h2>
            {items.length ? (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={item.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                          <span className="badge">{item.entryType}</span>
                          <span className="badge">{item.status}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.contactName} • {item.firm} • {item.stage}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(item)} variant="secondary">Edit</Button>
                        <Button onClick={() => deleteRecord('boardItems', item.id)} variant="danger">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item.date || 'No date'}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Action</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item.nextActionDate || 'No next action'}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Raise Target</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(item.targetRaise)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Check Size</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{currency(item.checkSize)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Interest</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item.interestLevel}/10</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Key Wins</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.keyWins || 'No wins logged.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Metrics Summary</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.metricsSummary || 'No metrics summary logged.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Asks</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.asks || 'No asks logged.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Add board and fundraising items so capital relationships are managed with the same rigor as product and GTM." title="No board or capital items yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
