import { AlertTriangle, Calendar, CheckCircle2, Clock, Rocket, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { formatShortDate } from '../utils/date';

const stageTone = {
  Backlog: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  'In Progress': 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200',
  Blocked: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
  'Ready to Launch': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  Launched: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
};

export const ProjectCard = ({ project, onEdit, onDelete, onExport }) => {
  const isBlocked = project.stage === 'Blocked';
  const isLaunchReady = project.stage === 'Ready to Launch';

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.projectName}</h3>
            <span className={`badge border-0 ${stageTone[project.stage] || ''}`}>{project.stage}</span>
            <span className="badge">{project.area}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{project.objective || 'No objective captured yet.'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onExport ? (
            <Button onClick={() => onExport(project)} variant="secondary">
              <Rocket className="h-4 w-4" />
              Export
            </Button>
          ) : null}
          <Button onClick={() => onEdit(project)} variant="secondary">Edit</Button>
          <Button onClick={() => onDelete(project.id)} variant="danger">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{project.progress}%</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Confidence {project.confidenceScore}/10</p>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Impact</p>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{project.impactScore}/10</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{project.successMetric || 'No success metric yet'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due Date</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Calendar className="h-4 w-4 text-brand-500" />
            {project.dueDate ? formatShortDate(project.dueDate) : 'Not set'}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Launch Date</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Rocket className="h-4 w-4 text-brand-500" />
            {project.launchDate ? formatShortDate(project.launchDate) : 'TBD'}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next Step</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{project.nextStep || 'No next step set'}</p>
        </div>
      </div>

      {project.milestone ? (
        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
            <CheckCircle2 className="h-4 w-4 text-brand-500" />
            Milestone
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.milestone}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className={`rounded-2xl border p-4 ${isBlocked ? 'border-rose-200 bg-rose-50/80 dark:border-rose-500/20 dark:bg-rose-500/10' : 'border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60'}`}>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
            {isBlocked ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <Clock className="h-4 w-4 text-brand-500" />}
            Blockers
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.blockers || 'No blockers logged.'}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${isLaunchReady ? 'border-amber-200 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-500/10' : 'border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60'}`}>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
            <Rocket className="h-4 w-4 text-brand-500" />
            Launch Notes
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.notes || 'No launch notes captured yet.'}</p>
        </div>
      </div>

      {project.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span className="badge" key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
