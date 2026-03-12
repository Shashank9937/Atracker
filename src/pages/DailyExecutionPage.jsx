import { useEffect, useMemo, useState } from 'react';
import { BookMarked, Save, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DailyCalendar } from '../components/DailyCalendar';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { formatLongDate, getTodayKey } from '../utils/date';
import { calculateFounderScore, countCompletedTasks } from '../utils/metrics';
import { createEmptyDailyEntry } from '../utils/sampleData';

const cloneTasks = (tasks) => tasks.map((task) => ({ ...task }));

export const DailyExecutionPage = () => {
  const { data, saveDailyEntry } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [form, setForm] = useState(createEmptyDailyEntry(getTodayKey()));

  const selectedEntry = useMemo(() => data.dailyEntries.find((entry) => entry.date === selectedDate), [data.dailyEntries, selectedDate]);
  const bookTitles = useMemo(() => data.books.map((book) => book.bookTitle).filter(Boolean), [data.books]);

  useEffect(() => {
    if (selectedEntry) {
      setForm({ ...selectedEntry, missionTasks: cloneTasks(selectedEntry.missionTasks) });
      return;
    }

    setForm(createEmptyDailyEntry(selectedDate));
  }, [selectedDate, selectedEntry]);

  const handleField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const handleTask = (index, patch) =>
    setForm((current) => ({
      ...current,
      missionTasks: current.missionTasks.map((task, taskIndex) => (taskIndex === index ? { ...task, ...patch } : task)),
    }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveDailyEntry({ ...form, date: selectedDate });
  };

  const score = calculateFounderScore(form);

  return (
    <div>
      <PageHeader
        description="Track the founder inputs that compound: mission tasks, deep work, learning, reading, health, and sharp reflection."
        title="Daily Execution"
      />

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-6">
          <DailyCalendar entries={data.dailyEntries} onSelectDate={setSelectedDate} selectedDate={selectedDate} />
          <Card className="p-5">
            <h3 className="section-title">Selected Day Summary</h3>
            <p className="section-copy">{formatLongDate(selectedDate)}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Founder Score</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{score}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tasks Completed</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{countCompletedTasks(form)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Deep Work Hours</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{Number(form.deepWorkHours || 0).toFixed(1)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning Hours</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{Number(form.learningHours || 0).toFixed(1)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading Minutes</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{form.readingMinutes}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pages Read</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{form.pagesRead}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6" id="daily-entry-form">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Daily Log</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Daily execution tracker</h2>
            </div>
            <input className="input-control max-w-[190px]" onChange={(event) => setSelectedDate(event.target.value)} type="date" value={selectedDate} />
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Top 3 Mission Tasks</label>
              <div className="space-y-3">
                {form.missionTasks.map((task, index) => (
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]" key={task.id}>
                    <input
                      className="input-control"
                      onChange={(event) => handleTask(index, { text: event.target.value })}
                      placeholder={`Mission task ${index + 1}`}
                      value={task.text}
                    />
                    <label className="secondary-button min-w-[110px] justify-center gap-2">
                      <input checked={task.done} onChange={(event) => handleTask(index, { done: event.target.checked })} type="checkbox" />
                      Done
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Startup Execution Notes</label>
                <textarea className="textarea-control" onChange={(event) => handleField('executionNotes', event.target.value)} value={form.executionNotes} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Idea Exploration</label>
                <textarea className="textarea-control" onChange={(event) => handleField('ideaExploration', event.target.value)} value={form.ideaExploration} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">People Contacted</label>
                <input className="input-control" min="0" onChange={(event) => handleField('peopleContacted', Number(event.target.value))} type="number" value={form.peopleContacted} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Deep Work Hours</label>
                <input className="input-control" min="0" onChange={(event) => handleField('deepWorkHours', Number(event.target.value))} step="0.1" type="number" value={form.deepWorkHours} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Learning Hours</label>
                <input className="input-control" min="0" onChange={(event) => handleField('learningHours', Number(event.target.value))} step="0.1" type="number" value={form.learningHours} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Smoking Count</label>
                <input className="input-control" min="0" onChange={(event) => handleField('smokingCount', Number(event.target.value))} type="number" value={form.smokingCount} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="mb-5 flex items-center gap-3">
                <BookMarked className="h-5 w-5 text-brand-500" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Book Learning</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Attach daily reading to the rest of your operating loop.</p>
                </div>
              </div>
              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.6fr_0.6fr]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Book Being Read</label>
                  <input className="input-control" list="daily-book-titles" onChange={(event) => handleField('bookBeingRead', event.target.value)} placeholder="Select or type a book title" value={form.bookBeingRead} />
                  <datalist id="daily-book-titles">
                    {bookTitles.map((title) => (
                      <option key={title} value={title} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Reading Minutes</label>
                  <input className="input-control" min="0" onChange={(event) => handleField('readingMinutes', Number(event.target.value))} type="number" value={form.readingMinutes} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Pages Read</label>
                  <input className="input-control" min="0" onChange={(event) => handleField('pagesRead', Number(event.target.value))} type="number" value={form.pagesRead} />
                </div>
              </div>
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Book Insight of the Day</label>
                <textarea className="textarea-control" onChange={(event) => handleField('bookInsightOfDay', event.target.value)} value={form.bookInsightOfDay} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Learning</label>
                <textarea className="textarea-control" onChange={(event) => handleField('learning', event.target.value)} value={form.learning} />
              </div>
              <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                <label className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Exercise</span>
                  <input checked={form.exercise} onChange={(event) => handleField('exercise', event.target.checked)} type="checkbox" />
                </label>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Energy Level</span>
                    <span>{form.energyLevel}/10</span>
                  </div>
                  <input className="range-input w-full" max="10" min="1" onChange={(event) => handleField('energyLevel', Number(event.target.value))} type="range" value={form.energyLevel} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Focus Level</span>
                    <span>{form.focusLevel}/10</span>
                  </div>
                  <input className="range-input w-full" max="10" min="1" onChange={(event) => handleField('focusLevel', Number(event.target.value))} type="range" value={form.focusLevel} />
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Win of the Day</label>
                <textarea className="textarea-control" onChange={(event) => handleField('winOfDay', event.target.value)} value={form.winOfDay} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Biggest Challenge</label>
                <textarea className="textarea-control" onChange={(event) => handleField('biggestChallenge', event.target.value)} value={form.biggestChallenge} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Key Insight</label>
                <textarea className="textarea-control" onChange={(event) => handleField('keyInsight', event.target.value)} value={form.keyInsight} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Next Day Priority</label>
                <textarea className="textarea-control" onChange={(event) => handleField('nextDayPriority', event.target.value)} value={form.nextDayPriority} />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button onClick={() => setForm(createEmptyDailyEntry(selectedDate))} type="button" variant="secondary">
                <Sparkles className="h-4 w-4" />
                Clear Form
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" />
                Save Daily Entry
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <h3 className="section-title">Recent Entries</h3>
          <p className="section-copy">A fast read of your latest execution and learning patterns.</p>
          {data.dailyEntries.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.dailyEntries.slice(0, 6).map((entry) => (
                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={entry.id}>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatLongDate(entry.date)}</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{entry.winOfDay || entry.executionNotes || 'No summary captured yet.'}</p>
                  {entry.bookInsightOfDay ? (
                    <p className="mt-3 text-sm text-brand-600 dark:text-brand-200">Book insight: {entry.bookInsightOfDay}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="badge">{entry.deepWorkHours}h deep work</span>
                    <span className="badge">{entry.peopleContacted} contacts</span>
                    <span className="badge">{entry.readingMinutes} min reading</span>
                    <span className="badge">{entry.pagesRead} pages</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState copy="Start logging days to build your execution history." title="No daily entries yet" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
