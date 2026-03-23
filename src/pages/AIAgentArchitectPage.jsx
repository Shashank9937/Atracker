import { useState } from 'react';
import { Download, Layout } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { createEmptyAiSystem } from '../utils/aiData';
import { downloadJson } from '../utils/download';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { SystemDesigner } from '../components/SystemDesigner';

export const AIAgentArchitectPage = ({ onNavigate }) => {
  const { data, saveAiSystem, deleteAiRecord, createLinkedDecision } = useAppContext();
  const [form, setForm] = useState(createEmptyAiSystem());

  const handleDecision = (system) => {
    createLinkedDecision('system', system.id, {
      decision: `System decision: ${system.systemName}`,
      context: system.problem || system.systemDescription,
      optionsConsidered: 'Simplify the system, expand agents, or change workflow order.',
      whyChosen: 'Logged from AI Agent Architect.',
      expectedOutcome: system.expectedOutcome || 'Sharper multi-agent design.',
      reviewDate: new Date().toISOString().slice(0, 10),
    });
    onNavigate('decision-journal');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        description="Design multi-agent systems with explicit roles, dependencies, sequencing, and exported JSON architecture definitions."
        title="AI Agent Architect"
      />

      <SystemDesigner form={form} onCancel={() => setForm(createEmptyAiSystem())} onChange={setForm} onReset={() => setForm(createEmptyAiSystem())} onSave={(system) => {
        saveAiSystem(system);
        setForm(createEmptyAiSystem());
      }} />

      <div className="space-y-4">
        {data.ai.systems.map((system) => (
          <Card className="p-6" key={system.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{system.systemName}</h3>
                  <span className="badge">{system.status}</span>
                  <span className="badge">{system.industry}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{system.systemDescription}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setForm(system)} variant="secondary">
                  <Layout className="h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={() => downloadJson(`${system.systemName.replace(/\s+/g, '-').toLowerCase()}.json`, system)} variant="secondary">
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button onClick={() => handleDecision(system)} variant="secondary">
                  Log Decision
                </Button>
                <Button onClick={() => deleteAiRecord('systems', system.id)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {system.agents.map((agent, index) => (
                <div className="flex items-center gap-3" key={agent.id}>
                  <div className="rounded-2xl border border-brand-300/40 bg-brand-500/10 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                    {agent.role || `Agent ${index + 1}`}
                  </div>
                  {index < system.agents.length - 1 ? <span className="text-slate-400">{'\u2192'}</span> : null}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {system.agents.map((agent) => (
                <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50" key={agent.id}>
                  <p className="font-medium text-slate-900 dark:text-white">{agent.role || 'Unnamed agent'}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Inputs</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{agent.inputs || 'Not defined'}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Outputs</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{agent.outputs || 'Not defined'}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Dependencies</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{agent.dependencies || 'None'}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
