import { ArrowDownWideNarrow, Plus, Save, Trash2 } from 'lucide-react';
import { AI_AGENT_STATUS_OPTIONS, AI_LEVERAGE_OPTIONS } from '../utils/constants';
import { createEmptyAiAgent } from '../utils/aiData';
import { normalizeTagList } from '../utils/aiMetrics';
import { Button } from './Button';
import { Card } from './Card';

const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export const AgentEditor = ({ form = createEmptyAiAgent(), onChange, onSave, onCancel, onReset, title = 'Design Agent' }) => {
  const setField = (key, value) => onChange({ ...form, [key]: value });
  const setStep = (stepId, value) =>
    setField(
      'workflowSteps',
      form.workflowSteps.map((step) => (step.id === stepId ? { ...step, text: value } : step)),
    );

  const addStep = () =>
    setField('workflowSteps', [...form.workflowSteps, { id: `${form.id}-step-${Date.now()}`, text: '' }]);

  const removeStep = (stepId) => setField('workflowSteps', form.workflowSteps.filter((step) => step.id !== stepId));

  const handleDrop = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setField('workflowSteps', moveItem(form.workflowSteps, fromIndex, toIndex));
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500">AI Agent Builder</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <span className="badge">{form.status}</span>
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...form,
            tags: normalizeTagList(form.tags),
            workflowSteps: form.workflowSteps.filter((step) => step.text.trim()),
          });
        }}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <input className="input-control lg:col-span-2" onChange={(event) => setField('agentName', event.target.value)} placeholder="Agent Name" required value={form.agentName} />
          <input className="input-control" onChange={(event) => setField('purpose', event.target.value)} placeholder="Purpose" required value={form.purpose} />
          <input className="input-control" onChange={(event) => setField('targetUser', event.target.value)} placeholder="Target User" value={form.targetUser} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('problemSolved', event.target.value)} placeholder="Problem Solved" value={form.problemSolved} />
          <textarea className="textarea-control" onChange={(event) => setField('inputData', event.target.value)} placeholder="Input Data" value={form.inputData} />
          <textarea className="textarea-control" onChange={(event) => setField('toolsNeeded', event.target.value)} placeholder="Tools Needed" value={form.toolsNeeded} />
          <input className="input-control" onChange={(event) => setField('modelsUsed', event.target.value)} placeholder="Model(s) Used" value={form.modelsUsed} />
          <input className="input-control" onChange={(event) => setField('memoryType', event.target.value)} placeholder="Memory Type" value={form.memoryType} />
          <input className="input-control lg:col-span-2" onChange={(event) => setField('output', event.target.value)} placeholder="Output" value={form.output} />
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <select className="select-control" onChange={(event) => setField('status', event.target.value)} value={form.status}>
            {AI_AGENT_STATUS_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <input className="input-control" min="0" onChange={(event) => setField('estimatedTimeSaved', Number(event.target.value))} placeholder="Estimated Time Saved" type="number" value={form.estimatedTimeSaved} />
          <input className="input-control" min="0" onChange={(event) => setField('estimatedCostSaved', Number(event.target.value))} placeholder="Estimated Cost Saved" type="number" value={form.estimatedCostSaved} />
          <select className="select-control" onChange={(event) => setField('leveragePotential', event.target.value)} value={form.leveragePotential}>
            {AI_LEVERAGE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Workflow Steps</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Drag or reorder the execution flow for this agent.</p>
            </div>
            <Button onClick={addStep} type="button" variant="secondary">
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {form.workflowSteps.map((step, index) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50"
                draggable
                key={step.id}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', String(index))}
                onDrop={(event) => handleDrop(Number(event.dataTransfer.getData('text/plain')), index)}
              >
                <div className="badge !rounded-2xl">
                  <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                  {index + 1}
                </div>
                <input className="input-control flex-1" onChange={(event) => setStep(step.id, event.target.value)} placeholder={`Workflow step ${index + 1}`} value={step.text} />
                <button className="ghost-button" onClick={() => removeStep(step.id)} type="button">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <input
          className="input-control"
          onChange={(event) => setField('tags', Array.isArray(form.tags) ? event.target.value : event.target.value)}
          placeholder="Tags (comma separated)"
          value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
        />
        <textarea className="textarea-control" onChange={(event) => setField('notes', event.target.value)} placeholder="Notes" value={form.notes} />

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
            Save Agent
          </Button>
        </div>
      </form>
    </Card>
  );
};
