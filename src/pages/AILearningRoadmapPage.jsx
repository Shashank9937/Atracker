import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Circle, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AI_MODULE_STATUS_OPTIONS } from '../utils/constants';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const AILearningRoadmapPage = () => {
  const { data, todayKey, saveAiModule, logAiModuleHours, toggleAiPracticeTask } = useAppContext();
  const [hoursDrafts, setHoursDrafts] = useState({});

  const practiceNote = useMemo(
    () => data.ai.notes.find((note) => note.title === 'Daily Practice Checklist'),
    [data.ai.notes],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        description="A founder-facing AI curriculum seeded from the Altman leverage guide: learn the stack, practice daily, and log actual hours."
        title="AI Learning Roadmap"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Modules</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.ai.modules.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Core AI leverage topics across learning, shipping, and productization.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Completed</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.ai.modules.filter((module) => module.completed || module.status === 'Complete').length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Modules already converted into explicit progress.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Practice Tasks</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.ai.dailyPractice.length}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Daily repetition makes the Altman leverage thesis operational instead of theoretical.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {data.ai.modules.map((module) => (
            <Card className="p-6" key={module.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`rounded-full p-2 ${module.completed || module.status === 'Complete' ? 'bg-mint/10 text-mint' : 'bg-brand-500/10 text-brand-500'}`}>
                      {module.completed || module.status === 'Complete' ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{module.title}</h3>
                    <span className="badge">{module.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{module.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.practiceTasks.map((task) => (
                      <span className="badge" key={task}>
                        <BookOpen className="h-3.5 w-3.5" />
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <select
                    className="select-control min-w-[180px]"
                    onChange={(event) =>
                      saveAiModule({
                        ...module,
                        status: event.target.value,
                        completed: event.target.value === 'Complete',
                      })
                    }
                    value={module.status}
                  >
                    {AI_MODULE_STATUS_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <div className="rounded-2xl bg-slate-50/70 px-4 py-3 text-sm dark:bg-slate-950/50">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hours Logged</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{module.learningHours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                <textarea
                  className="textarea-control"
                  onChange={(event) => saveAiModule({ ...module, notes: event.target.value })}
                  placeholder="Notes and insights"
                  value={module.notes}
                />
                <div className="space-y-3">
                  <input
                    className="input-control w-full"
                    min="0"
                    onChange={(event) => setHoursDrafts((current) => ({ ...current, [module.id]: event.target.value }))}
                    placeholder="Hours"
                    step="0.5"
                    type="number"
                    value={hoursDrafts[module.id] || ''}
                  />
                  <Button
                    className="w-full"
                    onClick={() => {
                      const hours = Number(hoursDrafts[module.id] || 0);
                      if (hours > 0) {
                        logAiModuleHours(module.id, hours, 'Manual learning log');
                        setHoursDrafts((current) => ({ ...current, [module.id]: '' }));
                      }
                    }}
                    type="button"
                  >
                    <Save className="h-4 w-4" />
                    Log Hours
                  </Button>
                </div>
              </div>

              <textarea
                className="textarea-control mt-4"
                onChange={(event) => saveAiModule({ ...module, resources: event.target.value })}
                placeholder="Links / resources"
                value={module.resources}
              />
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Daily Practice</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Practice tasks derived from the leverage guide.</p>
            <div className="mt-5 space-y-3">
              {data.ai.dailyPractice.map((task) => (
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50" key={task.id}>
                  <input checked={task.doneDates.includes(todayKey)} onChange={() => toggleAiPracticeTask(task.id)} type="checkbox" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Daily Practice Checklist</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">{practiceNote?.content || 'Checklist note not found.'}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
