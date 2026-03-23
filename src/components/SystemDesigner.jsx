import { ChevronRight, Plus, Save, Trash2 } from 'lucide-react';
import { AI_SYSTEM_STATUS_OPTIONS } from '../utils/constants';
import { createEmptyAiSystem } from '../utils/aiData';
import { Button } from './Button';
import { Card } from './Card';

const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export const SystemDesigner = ({ form = createEmptyAiSystem(), onChange, onSave, onCancel, onReset }) => {
  const setField = (key, value) => onChange({ ...form, [key]: value });

  const setAgent = (agentId, key, value) =>
    setField(
      'agents',
      form.agents.map((agent) => (agent.id === agentId ? { ...agent, [key]: value } : agent)),
    );

  const addAgentCard = () =>
    setField('agents', [
      ...form.agents,
      { id: `${form.id}-agent-${Date.now()}`, role: '', inputs: '', outputs: '', dependencies: '' },
    ]);

  const removeAgentCard = (agentId) => setField('agents', form.agents.filter((agent) => agent.id !== agentId));

  const reorderAgents = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setField('agents', moveItem(form.agents, fromIndex, toIndex));
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">AI Agent Architect</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Multi-agent system design</h2>
        </div>
        <span className="badge">{form.status}</span>
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...form,
            numberOfAgents: form.agents.length,
          });
        }}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <input className="input-control" onChange={(event) => setField('systemName', event.target.value)} placeholder="System Name" required value={form.systemName} />
          <input className="input-control" onChange={(event) => setField('industry', event.target.value)} placeholder="Industry" value={form.industry} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('problem', event.target.value)} placeholder="Problem" value={form.problem} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('systemDescription', event.target.value)} placeholder="System Description" value={form.systemDescription} />
          <input className="input-control lg:col-span-2" onChange={(event) => setField('expectedOutcome', event.target.value)} placeholder="Expected Outcome" value={form.expectedOutcome} />
          <select className="select-control" onChange={(event) => setField('status', event.target.value)} value={form.status}>
            {AI_SYSTEM_STATUS_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <input className="input-control" disabled value={`${form.agents.length}`} />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Agents in the system</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Drag cards to change system order and dependencies.</p>
            </div>
            <Button onClick={addAgentCard} type="button" variant="secondary">
              <Plus className="h-4 w-4" />
              Add Agent
            </Button>
          </div>

          <div className="space-y-4">
            {form.agents.map((agent, index) => (
              <div
                className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                draggable
                key={agent.id}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', String(index))}
                onDrop={(event) => reorderAgents(Number(event.dataTransfer.getData('text/plain')), index)}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="badge">Agent {index + 1}</span>
                    {index < form.agents.length - 1 ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
                  </div>
                  <button className="ghost-button" onClick={() => removeAgentCard(agent.id)} type="button">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <input className="input-control" onChange={(event) => setAgent(agent.id, 'role', event.target.value)} placeholder="Agent role" value={agent.role} />
                  <input className="input-control" onChange={(event) => setAgent(agent.id, 'dependencies', event.target.value)} placeholder="Dependencies" value={agent.dependencies} />
                  <textarea className="textarea-control" onChange={(event) => setAgent(agent.id, 'inputs', event.target.value)} placeholder="Inputs" value={agent.inputs} />
                  <textarea className="textarea-control" onChange={(event) => setAgent(agent.id, 'outputs', event.target.value)} placeholder="Outputs" value={agent.outputs} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-300/80 p-5 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-white">Visual workflow</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {form.agents.map((agent, index) => (
              <div className="flex items-center gap-3" key={agent.id}>
                <div className="rounded-2xl border border-brand-300/40 bg-brand-500/10 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                  {agent.role || `Agent ${index + 1}`}
                </div>
                  {index < form.agents.length - 1 ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {onReset ? (
            <Button onClick={onReset} type="button" variant="secondary">
              Reset
            </Button>
          ) : null}
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4" />
            Save System
          </Button>
        </div>
      </form>
    </Card>
  );
};
