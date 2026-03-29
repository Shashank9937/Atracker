import { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, Rocket, Save, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { downloadJson } from '../utils/download';
import { createEmptyProject } from '../utils/unicornData';
import { PROJECT_AREA_OPTIONS, PROJECT_STAGE_OPTIONS } from '../utils/constants';
import { formatShortDate } from '../utils/date';
import { BarChart } from '../charts/BarChart';
import { DoughnutChart } from '../charts/DoughnutChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard } from '../components/ProjectCard';

const makeFormState = (project = createEmptyProject()) => ({
  ...project,
  tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
});

const stageDescriptions = {
  Backlog: 'Important work that is defined but not active yet.',
  'In Progress': 'Currently moving and needs execution discipline.',
  Blocked: 'Needs founder intervention or a decision to unblock.',
  'Ready to Launch': 'Prepared enough to push live or into market.',
  Launched: 'Already shipped and now needs follow-through.',
};

export const ProjectsRoadmapPage = () => {
  const { data, operatingMetrics, saveProject, deleteRecord } = useAppContext();
  const [form, setForm] = useState(() => makeFormState());
  const [editingId, setEditingId] = useState('');

  const projects = useMemo(() => data.projects || [], [data.projects]);
  const groupedProjects = useMemo(
    () =>
      PROJECT_STAGE_OPTIONS.reduce((acc, stage) => {
        acc[stage] = projects.filter((project) => project.stage === stage);
        return acc;
      }, {}),
    [projects],
  );

  const launchWindow = operatingMetrics.projectStats.launchThisWeek;

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveProject({
      ...form,
      tags: form.tags,
    });
    setForm(makeFormState());
    setEditingId('');
  };

  const handleEdit = (project) => {
    setForm(makeFormState(project));
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = (project) => {
    downloadJson(`founder-os-project-${project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'}.json`, project);
  };

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Button
              onClick={() => {
                setForm(makeFormState());
                setEditingId('');
              }}
              variant="secondary"
            >
              Reset Form
            </Button>
            <Button onClick={() => downloadJson('founder-os-projects-roadmap.json', projects)} variant="secondary">
              <Rocket className="h-4 w-4" />
              Export Projects JSON
            </Button>
          </>
        }
        description="Run shipping, launches, milestones, blockers, and operating priorities from one roadmap instead of scattering them across notes and memory."
        title="Projects & Launch Tracker"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Projects</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.activeProjects}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Roadmap items still requiring founder energy.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blocked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.blockedProjects}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Projects currently waiting on a decision or unblock.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ready to Launch</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.launchReady}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Work that should move into market soon.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due Soon</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{operatingMetrics.projectStats.dueSoon.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Projects due within the next 14 days.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Launching This Week</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{launchWindow.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Your immediate shipping and launch window.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="p-6" id="project-form">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit project' : 'New project'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Every critical company motion should become a concrete project with a clear next step, owner, timeline, and launch path.</p>
            </div>
            <Target className="h-5 w-5 text-brand-500" />
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => handleChange('projectName', event.target.value)} placeholder="Project name" required value={form.projectName} />
            <div className="grid gap-4 sm:grid-cols-2">
              <select className="select-control" onChange={(event) => handleChange('area', event.target.value)} value={form.area}>
                {PROJECT_AREA_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select className="select-control" onChange={(event) => handleChange('stage', event.target.value)} value={form.stage}>
                {PROJECT_STAGE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <select className="select-control" onChange={(event) => handleChange('linkedPlanId', event.target.value)} value={form.linkedPlanId}>
              <option value="">Link to a strategic plan (optional)</option>
              {data.strategicPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>{plan.planName}</option>
              ))}
            </select>
            <textarea className="textarea-control" onChange={(event) => handleChange('objective', event.target.value)} placeholder="Objective" required value={form.objective} />
            <textarea className="textarea-control" onChange={(event) => handleChange('milestone', event.target.value)} placeholder="Current milestone" value={form.milestone} />
            <textarea className="textarea-control" onChange={(event) => handleChange('nextStep', event.target.value)} placeholder="Immediate next step" required value={form.nextStep} />
            <textarea className="textarea-control" onChange={(event) => handleChange('blockers', event.target.value)} placeholder="Blockers" value={form.blockers} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Due Date</label>
                <input className="input-control" onChange={(event) => handleChange('dueDate', event.target.value)} type="date" value={form.dueDate} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Launch Date</label>
                <input className="input-control" onChange={(event) => handleChange('launchDate', event.target.value)} type="date" value={form.launchDate} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Progress</label>
                <input className="input-control" max="100" min="0" onChange={(event) => handleChange('progress', Number(event.target.value))} type="number" value={form.progress} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Impact Score</label>
                <input className="input-control" max="10" min="1" onChange={(event) => handleChange('impactScore', Number(event.target.value))} type="number" value={form.impactScore} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Confidence</label>
                <input className="input-control" max="10" min="1" onChange={(event) => handleChange('confidenceScore', Number(event.target.value))} type="number" value={form.confidenceScore} />
              </div>
            </div>
            <input className="input-control" onChange={(event) => handleChange('successMetric', event.target.value)} placeholder="Success metric" value={form.successMetric} />
            <input className="input-control" onChange={(event) => handleChange('tags', event.target.value)} placeholder="Tags (comma separated)" value={form.tags} />
            <textarea className="textarea-control" onChange={(event) => handleChange('notes', event.target.value)} placeholder="Notes / launch considerations" value={form.notes} />
            <div className="flex gap-3">
              <Button className="flex-1" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Project' : 'Save Project'}
              </Button>
              {editingId ? (
                <Button
                  className="flex-1"
                  onClick={() => {
                    setForm(makeFormState());
                    setEditingId('');
                  }}
                  type="button"
                  variant="secondary"
                >
                  Reset
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <BarChart
              backgroundColor="rgba(36, 159, 232, 0.25)"
              borderColor="#249fe8"
              data={operatingMetrics.projectStageChart.data}
              labels={operatingMetrics.projectStageChart.labels}
              subtitle="Projects distributed across the roadmap pipeline."
              title="Project Stage Distribution"
            />
            <DoughnutChart
              colors={['#249fe8', '#5de0c0', '#fb7185', '#f4a640', '#34d399']}
              data={operatingMetrics.projectStageChart.data}
              labels={operatingMetrics.projectStageChart.labels}
              subtitle="A quick scan of where shipping energy is concentrated."
              title="Roadmap Mix"
            />
          </div>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Launch Window</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">What is shipping soon</h2>
              </div>
              <Rocket className="h-5 w-5 text-brand-500" />
            </div>
            {launchWindow.length ? (
              <div className="mt-5 space-y-3">
                {launchWindow.map((project) => (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10" key={project.id}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="badge">{project.area}</span>
                          <span className="badge">Launch {project.launchDate ? formatShortDate(project.launchDate) : 'TBD'}</span>
                        </div>
                        <p className="mt-3 font-medium text-slate-900 dark:text-white">{project.projectName}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.nextStep}</p>
                      </div>
                      <Button onClick={() => handleEdit(project)} variant="secondary">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState copy="No projects are currently in the immediate launch window. Move strong roadmap items toward a visible ship date." title="No launches this week" />
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Roadmap Board</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Stage-by-stage execution view</h2>
              </div>
              <Calendar className="h-5 w-5 text-brand-500" />
            </div>
            {projects.length ? (
              <div className="mt-6 grid gap-4 xl:grid-cols-5">
                {PROJECT_STAGE_OPTIONS.map((stage) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={stage}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{stage}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stageDescriptions[stage]}</p>
                      </div>
                      <span className="badge">{groupedProjects[stage].length}</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {groupedProjects[stage].length ? (
                        groupedProjects[stage].map((project) => (
                          <button className="w-full rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-left transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900/70" key={project.id} onClick={() => handleEdit(project)} type="button">
                            <p className="font-medium text-slate-900 dark:text-white">{project.projectName}</p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.nextStep || project.milestone || project.objective}</p>
                            {project.dueDate ? <p className="mt-2 text-xs text-slate-400">Due {formatShortDate(project.dueDate)}</p> : null}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No projects in this stage.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Start with the handful of company projects that truly matter this quarter. The roadmap should be sharp, not crowded." title="No projects yet" />
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Project Archive</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Detailed roadmap records</h2>
              </div>
              <AlertTriangle className="h-5 w-5 text-brand-500" />
            </div>
            {projects.length ? (
              <div className="mt-6 space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} onDelete={(id) => deleteRecord('projects', id)} onEdit={handleEdit} onExport={handleExport} project={project} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Project records will appear here once you start mapping product, GTM, ops, and fundraising work into concrete launch tracks." title="No roadmap records yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
