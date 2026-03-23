import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { RELATIONSHIP_STRENGTH_OPTIONS } from '../utils/constants';
import { addDays, formatShortDate, getTodayKey, parseDateKey } from '../utils/date';
import { includesQuery } from '../utils/textInsights';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = {
  name: '',
  company: '',
  industry: '',
  whereMet: '',
  lastContactDate: '',
  keyInsight: '',
  followUpDate: '',
  relationshipStrength: 'Warm',
  notes: '',
};

const getDaysUntil = (value, today) => {
  if (!value) return null;
  const diff = parseDateKey(value) - today;
  return Math.round(diff / 86400000);
};

const getFollowUpMeta = (contact, today) => {
  const daysUntil = getDaysUntil(contact.followUpDate, today);

  if (daysUntil === null) {
    return {
      label: 'No follow-up set',
      tone: '',
      priority: 4,
    };
  }

  if (daysUntil < 0) {
    return {
      label: `${Math.abs(daysUntil)}d overdue`,
      tone: '!border-rose-300 !bg-rose-50 !text-rose-700 dark:!border-rose-500/20 dark:!bg-rose-500/10 dark:!text-rose-200',
      priority: 0,
    };
  }

  if (daysUntil === 0) {
    return {
      label: 'Due today',
      tone: '!border-amber-300 !bg-amber-50 !text-amber-700 dark:!border-amber-500/20 dark:!bg-amber-500/10 dark:!text-amber-200',
      priority: 1,
    };
  }

  if (daysUntil <= 7) {
    return {
      label: `${daysUntil}d`,
      tone: '!border-brand-300 !bg-brand-50 !text-brand-700 dark:!border-brand-500/20 dark:!bg-brand-500/10 dark:!text-brand-200',
      priority: 2,
    };
  }

  return {
    label: `${daysUntil}d`,
    tone: '',
    priority: 3,
  };
};

export const NetworkingCRMPage = () => {
  const { data, addContact, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState('');
  const [strengthFilter, setStrengthFilter] = useState('All');

  const today = useMemo(() => parseDateKey(getTodayKey()), []);
  const thisWeekEnd = useMemo(() => addDays(today, 7), [today]);

  const contacts = useMemo(
    () =>
      [...data.contacts].sort((left, right) => {
        const leftMeta = getFollowUpMeta(left, today);
        const rightMeta = getFollowUpMeta(right, today);
        if (leftMeta.priority !== rightMeta.priority) return leftMeta.priority - rightMeta.priority;

        const leftDate = left.followUpDate || left.lastContactDate || '9999-12-31';
        const rightDate = right.followUpDate || right.lastContactDate || '9999-12-31';
        return new Date(leftDate) - new Date(rightDate);
      }),
    [data.contacts, today],
  );

  const visibleContacts = useMemo(
    () =>
      contacts.filter((contact) => {
        const matchesStrength = strengthFilter === 'All' ? true : contact.relationshipStrength === strengthFilter;
        const matchesQuery = includesQuery(
          [contact.name, contact.company, contact.industry, contact.whereMet, contact.keyInsight, contact.notes],
          query,
        );

        return matchesStrength && matchesQuery;
      }),
    [contacts, query, strengthFilter],
  );

  const overdueCount = useMemo(
    () => data.contacts.filter((contact) => contact.followUpDate && parseDateKey(contact.followUpDate) < today).length,
    [data.contacts, today],
  );

  const dueThisWeekCount = useMemo(
    () =>
      data.contacts.filter(
        (contact) => contact.followUpDate && parseDateKey(contact.followUpDate) >= today && parseDateKey(contact.followUpDate) <= thisWeekEnd,
      ).length,
    [data.contacts, thisWeekEnd, today],
  );

  const strategicCount = useMemo(
    () => data.contacts.filter((contact) => contact.relationshipStrength === 'Strategic').length,
    [data.contacts],
  );

  const touchedThisWeek = useMemo(
    () => data.contacts.filter((contact) => contact.lastContactDate && parseDateKey(contact.lastContactDate) >= addDays(today, -7)).length,
    [data.contacts, today],
  );

  const priorityContacts = useMemo(() => contacts.filter((contact) => contact.followUpDate).slice(0, 4), [contacts]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addContact(form);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        description="A founder-native relationship tracker for warm intros, advisors, customers, and strategic peers. Keep the next touchpoint obvious."
        title="Networking CRM"
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">People in System</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.contacts.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Relationship memory compounds when context is captured consistently.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overdue Follow Ups</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{overdueCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Anything overdue is probably losing warmth faster than you think.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due This Week</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{dueThisWeekCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A small weekly follow-up habit protects distribution and trust.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Strategic Coverage</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{strategicCount}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{touchedThisWeek} contacts were touched in the last 7 days.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6" id="contact-form">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Add contact</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Name" value={form.name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} placeholder="Company" value={form.company} />
              <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} placeholder="Industry" value={form.industry} />
            </div>
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, whereMet: event.target.value }))} placeholder="Where Met" value={form.whereMet} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Last Contact Date</label>
                <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, lastContactDate: event.target.value }))} type="date" value={form.lastContactDate} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Follow Up Date</label>
                <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, followUpDate: event.target.value }))} type="date" value={form.followUpDate} />
              </div>
            </div>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, keyInsight: event.target.value }))} placeholder="Key Insight" value={form.keyInsight} />
            <select className="select-control" onChange={(event) => setForm((current) => ({ ...current, relationshipStrength: event.target.value }))} value={form.relationshipStrength}>
              {RELATIONSHIP_STRENGTH_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Notes" value={form.notes} />
            <Button className="w-full" type="submit">
              <UserPlus className="h-4 w-4" />
              Save Contact
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Relationship pipeline</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search by person, company, insight, or context to find the next right conversation quickly.</p>
              </div>
              <span className="badge">{visibleContacts.length} visible</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search people, companies, notes, or insights..." value={query} />
              </div>
              <select className="select-control" onChange={(event) => setStrengthFilter(event.target.value)} value={strengthFilter}>
                <option>All</option>
                {RELATIONSHIP_STRENGTH_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-brand-500" />
              <div>
                <h3 className="section-title">Priority Follow Ups</h3>
                <p className="section-copy">The people most likely to lose momentum if ignored.</p>
              </div>
            </div>
            {priorityContacts.length ? (
              <div className="mt-5 space-y-3">
                {priorityContacts.map((contact) => {
                  const followUp = getFollowUpMeta(contact, today);
                  return (
                    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={contact.id}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {contact.company || 'Independent'} • {contact.industry || 'General'}
                          </p>
                        </div>
                        <span className={`badge ${followUp.tone}`}>{followUp.label}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{contact.keyInsight || contact.notes || 'No follow-up context captured yet.'}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState copy="Set follow-up dates on important contacts and this queue will prioritize itself." title="No priority follow ups" />
              </div>
            )}
          </Card>

          {visibleContacts.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleContacts.map((contact) => {
                const followUp = getFollowUpMeta(contact, today);
                return (
                  <Card className="p-5" key={contact.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{contact.name}</h3>
                          <span className="badge">{contact.relationshipStrength}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {contact.company || 'Independent'} • {contact.industry || 'General'}
                        </p>
                      </div>
                      <button className="danger-button" onClick={() => deleteRecord('contacts', contact.id)} type="button">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Where Met</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{contact.whereMet || 'Not captured yet'}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last Contact</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{contact.lastContactDate ? formatShortDate(contact.lastContactDate) : 'Not logged'}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-brand-500" />
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Key Insight</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{contact.keyInsight || 'No insight captured yet.'}</p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes / Next Move</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{contact.notes || 'Add a concrete next move so future follow-up is faster.'}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CalendarClock className="h-4 w-4" />
                        Follow up {contact.followUpDate ? formatShortDate(contact.followUpDate) : 'TBD'}
                      </div>
                      <span className={`badge ${followUp.tone}`}>{followUp.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState copy="No contacts match the current filters. Widen the search or capture a new relationship." title="No visible contacts" />
          )}
        </div>
      </div>
    </div>
  );
};
