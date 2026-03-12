import { useState } from 'react';
import { BookMarked, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getWeekNumber } from '../utils/date';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = {
  weekNumber: getWeekNumber(new Date()),
  biggestProgress: '',
  biggestMistake: '',
  lessonsLearned: '',
  opportunitiesDiscovered: '',
  importantContacts: '',
  newSkillsLearned: '',
  healthScore: 7,
  focusScore: 7,
  nextWeekStrategy: '',
};

export const WeeklyReviewPage = () => {
  const { data, addWeeklyReview, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (event) => {
    event.preventDefault();
    addWeeklyReview(form);
    setForm({ ...initialForm, weekNumber: getWeekNumber(new Date()) });
  };

  return (
    <div>
      <PageHeader
        description="Close every week with brutal clarity on wins, mistakes, lessons, health, and next-week strategy."
        title="Weekly Review"
      />
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">New weekly review</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" min="1" onChange={(event) => setForm((current) => ({ ...current, weekNumber: Number(event.target.value) }))} placeholder="Week Number" type="number" value={form.weekNumber} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, biggestProgress: event.target.value }))} placeholder="Biggest Progress" value={form.biggestProgress} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, biggestMistake: event.target.value }))} placeholder="Biggest Mistake" value={form.biggestMistake} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, lessonsLearned: event.target.value }))} placeholder="Lessons Learned" value={form.lessonsLearned} />
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, opportunitiesDiscovered: event.target.value }))} placeholder="Opportunities Discovered" value={form.opportunitiesDiscovered} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, importantContacts: event.target.value }))} placeholder="Important Contacts" value={form.importantContacts} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, newSkillsLearned: event.target.value }))} placeholder="New Skills Learned" value={form.newSkillsLearned} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control" max="10" min="1" onChange={(event) => setForm((current) => ({ ...current, healthScore: Number(event.target.value) }))} placeholder="Health Score" type="number" value={form.healthScore} />
              <input className="input-control" max="10" min="1" onChange={(event) => setForm((current) => ({ ...current, focusScore: Number(event.target.value) }))} placeholder="Focus Score" type="number" value={form.focusScore} />
            </div>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, nextWeekStrategy: event.target.value }))} placeholder="Next Week Strategy" value={form.nextWeekStrategy} />
            <Button className="w-full" type="submit">
              <BookMarked className="h-4 w-4" />
              Save Weekly Review
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Review archive</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Weekly founder reviews make the operating system honest.</p>
            </div>
            <span className="badge">{data.weeklyReviews.length} reviews</span>
          </div>
          {data.weeklyReviews.length ? (
            <div className="mt-6 space-y-4">
              {data.weeklyReviews.map((review) => (
                <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={review.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Week {review.weekNumber}</h3>
                        <span className="badge">Health {review.healthScore}/10</span>
                        <span className="badge">Focus {review.focusScore}/10</span>
                      </div>
                    </div>
                    <button className="danger-button" onClick={() => deleteRecord('weeklyReviews', review.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Biggest Progress</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.biggestProgress}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Biggest Mistake</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.biggestMistake}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Lessons Learned</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.lessonsLearned}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Opportunities Discovered</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.opportunitiesDiscovered}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Important Contacts</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.importantContacts}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">New Skills Learned</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.newSkillsLearned}</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/80">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Week Strategy</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.nextWeekStrategy}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState copy="Use weekly reviews to compound lessons and maintain strategic direction." title="No weekly reviews yet" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
