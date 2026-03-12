import { useMemo, useState } from 'react';
import { CalendarClock, Trash2, UserPlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { RELATIONSHIP_STRENGTH_OPTIONS } from '../utils/constants';
import { formatShortDate, isPastDate } from '../utils/date';
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

export const NetworkingCRMPage = () => {
  const { data, addContact, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);

  const contacts = useMemo(
    () => [...data.contacts].sort((left, right) => new Date(left.followUpDate || left.lastContactDate || 0) - new Date(right.followUpDate || right.lastContactDate || 0)),
    [data.contacts],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    addContact(form);
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        description="A founder-native relationship tracker for warm intros, advisors, customers, and strategic peers."
        title="Networking CRM"
      />
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

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Relationship pipeline</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Keep context, last touchpoints, and follow-up deadlines in one place.</p>
            </div>
            <span className="badge">{contacts.length} people</span>
          </div>
          {contacts.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {contacts.map((contact) => (
                <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={contact.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{contact.name}</h3>
                        <span className="badge">{contact.relationshipStrength}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{contact.company} • {contact.industry}</p>
                    </div>
                    <button className="danger-button" onClick={() => deleteRecord('contacts', contact.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Where Met</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{contact.whereMet}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last Contact</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{contact.lastContactDate ? formatShortDate(contact.lastContactDate) : 'Not logged'}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{contact.keyInsight}</p>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{contact.notes}</p>
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CalendarClock className="h-4 w-4" />
                      Follow up {contact.followUpDate ? formatShortDate(contact.followUpDate) : 'TBD'}
                    </div>
                    <span className={`badge ${contact.followUpDate && isPastDate(contact.followUpDate) ? '!border-rose-300 !bg-rose-50 !text-rose-700 dark:!border-rose-500/20 dark:!bg-rose-500/10 dark:!text-rose-200' : ''}`}>
                      {contact.followUpDate && isPastDate(contact.followUpDate) ? 'Due' : 'On Track'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState copy="Add founders, operators, advisors, and prospects so every useful relationship stays warm." title="No contacts yet" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
