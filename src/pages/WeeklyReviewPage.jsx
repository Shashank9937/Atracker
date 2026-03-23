import { useMemo, useState } from 'react';
import { BookMarked, Search, Target, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getWeekNumber } from '../utils/date';
import { extractTopTerms, includesQuery } from '../utils/textInsights';
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
  const [query, setQuery] = useState('');

  const filteredReviews = useMemo(
    () =>
      data.weeklyReviews.filter((review) =>
        includesQuery(
          [
            review.biggestProgress,
            review.biggestMistake,
            review.lessonsLearned,
            review.opportunitiesDiscovered,
            review.importantContacts,
            review.newSkillsLearned,
            review.nextWeekStrategy,
          ],
          query,
        ),
      ),
    [data.weeklyReviews, query],
  );

  const averageHealth = useMemo(() => {
    if (!data.weeklyReviews.length) return 0;
    return (data.weeklyReviews.reduce((total, review) => total + Number(review.healthScore || 0), 0) / data.weeklyReviews.length).toFixed(1);
  }, [data.weeklyReviews]);

  const averageFocus = useMemo(() => {
    if (!data.weeklyReviews.length) return 0;
    return (data.weeklyReviews.reduce((total, review) => total + Number(review.focusScore || 0), 0) / data.weeklyReviews.length).toFixed(1);
  }, [data.weeklyReviews]);

  const recurringThemes = useMemo(
    () =>
      extractTopTerms(
        data.weeklyReviews.flatMap((review) => [
          review.biggestProgress,
          review.biggestMistake,
          review.lessonsLearned,
          review.opportunitiesDiscovered,
          review.nextWeekStrategy,
        ]),
        6,
      ),
    [data.weeklyReviews],
  );

  const latestReview = data.weeklyReviews[0];

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

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reviews Logged</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.weeklyReviews.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A consistent review loop keeps the operating system honest.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Health</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{averageHealth}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Weekly reviews are most useful when health gets treated as a real input.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Focus</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{averageFocus}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Focus quality is often the hidden constraint behind founder output.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Latest Strategy</p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Week {latestReview?.weekNumber || '-'}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{latestReview?.nextWeekStrategy || 'The next sharp weekly strategy will show up here.'}</p>
        </Card>
      </div>

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

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Review archive</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search prior reviews to find recurring patterns, not isolated events.</p>
              </div>
              <span className="badge">{filteredReviews.length} visible</span>
            </div>
            <div className="mt-5 relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search progress, lessons, strategy, or mistakes..." value={query} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-brand-500" />
              <div>
                <h3 className="section-title">Pattern Signals</h3>
                <p className="section-copy">Themes that keep showing up across your weekly reviews.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {recurringThemes.length ? (
                recurringThemes.map((theme) => (
                  <span className="badge" key={theme.term}>
                    {theme.term} • {theme.count}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">More written reviews will make recurring themes visible here.</span>
              )}
            </div>
          </Card>

          {filteredReviews.length ? (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card className="p-5" key={review.id}>
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
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.biggestProgress || 'No progress summary logged.'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Biggest Mistake</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.biggestMistake || 'No mistake captured.'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Lessons Learned</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.lessonsLearned || 'No lesson captured.'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Opportunities Discovered</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.opportunitiesDiscovered || 'No opportunity logged.'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Important Contacts</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.importantContacts || 'No contacts highlighted.'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">New Skills Learned</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.newSkillsLearned || 'No new skill logged.'}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/80">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Week Strategy</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{review.nextWeekStrategy || 'No forward strategy written yet.'}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState copy="No weekly reviews match the current search. Try a broader term or add another review." title="No visible reviews" />
          )}
        </div>
      </div>
    </div>
  );
};
