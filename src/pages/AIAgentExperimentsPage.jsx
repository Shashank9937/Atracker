import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { createEmptyAiExperiment } from '../utils/aiData';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ExperimentEditor } from '../components/ExperimentEditor';
import { PageHeader } from '../components/PageHeader';

export const AIAgentExperimentsPage = () => {
  const { data, saveAiExperiment, deleteAiRecord } = useAppContext();
  const [form, setForm] = useState(createEmptyAiExperiment());

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track AI experiments with prompts, outputs, linked agents, what worked, what failed, and versioned history."
        title="AI Experiments"
      />

      <ExperimentEditor
        agents={data.ai.agents}
        form={form}
        onCancel={() => setForm(createEmptyAiExperiment())}
        onChange={setForm}
        onReset={() => setForm(createEmptyAiExperiment())}
        onSave={(experiment) => {
          saveAiExperiment(experiment);
          setForm(createEmptyAiExperiment());
        }}
      />

      <div className="space-y-4">
        {data.ai.experiments.map((experiment) => (
          <Card className="p-6" key={experiment.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{experiment.experimentName}</h3>
                  {experiment.agentId ? (
                    <span className="badge">
                      {data.ai.agents.find((agent) => agent.id === experiment.agentId)?.agentName || 'Linked Agent'}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{experiment.hypothesis}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setForm(experiment)} variant="secondary">
                  Edit
                </Button>
                <Button onClick={() => deleteAiRecord('experiments', experiment.id)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Prompt Used</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{experiment.promptUsed || 'No prompt logged.'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Result / Output</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{experiment.resultOutput || 'No result logged.'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">What Worked</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{experiment.whatWorked || 'Not documented.'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">What Failed</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{experiment.whatFailed || 'No failure captured.'}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-brand-500" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Experiment Versions</p>
              </div>
              <div className="mt-3 space-y-2">
                {(experiment.versions || []).length ? (
                  experiment.versions.map((version, index) => (
                    <div className="rounded-2xl bg-slate-50/70 px-4 py-3 text-sm dark:bg-slate-950/50" key={`${experiment.id}-version-${index}`}>
                      <p className="font-medium text-slate-900 dark:text-white">{new Date(version.recordedAt).toLocaleString()}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{version.snapshot?.nextIteration || version.snapshot?.whatWorked || 'Version snapshot captured.'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No previous versions yet. Editing an existing experiment will append history here.</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
