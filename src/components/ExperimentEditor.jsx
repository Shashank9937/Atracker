import { Save } from 'lucide-react';
import { createEmptyAiExperiment } from '../utils/aiData';
import { normalizeTagList } from '../utils/aiMetrics';
import { Button } from './Button';
import { Card } from './Card';

export const ExperimentEditor = ({ agents = [], form = createEmptyAiExperiment(), onChange, onSave, onCancel, onReset }) => {
  const setField = (key, value) => onChange({ ...form, [key]: value });

  return (
    <Card className="p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-brand-500">AI Experiments</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Experiment tracker</h2>
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...form,
            tags: normalizeTagList(form.tags),
          });
        }}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <input className="input-control lg:col-span-2" onChange={(event) => setField('experimentName', event.target.value)} placeholder="Experiment Name" required value={form.experimentName} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('hypothesis', event.target.value)} placeholder="Hypothesis / Goal" value={form.hypothesis} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('promptUsed', event.target.value)} placeholder="Prompt Used" value={form.promptUsed} />
          <input className="input-control" onChange={(event) => setField('modelUsed', event.target.value)} placeholder="Model Used" value={form.modelUsed} />
          <input className="input-control" onChange={(event) => setField('toolsUsed', event.target.value)} placeholder="Tools Used" value={form.toolsUsed} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('inputData', event.target.value)} placeholder="Input Data" value={form.inputData} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('resultOutput', event.target.value)} placeholder="Result / Output" value={form.resultOutput} />
          <textarea className="textarea-control" onChange={(event) => setField('whatWorked', event.target.value)} placeholder="What Worked" value={form.whatWorked} />
          <textarea className="textarea-control" onChange={(event) => setField('whatFailed', event.target.value)} placeholder="What Failed" value={form.whatFailed} />
          <textarea className="textarea-control lg:col-span-2" onChange={(event) => setField('nextIteration', event.target.value)} placeholder="Next Iteration" value={form.nextIteration} />
          <input className="input-control" min="0" onChange={(event) => setField('timeSpent', Number(event.target.value))} placeholder="Time Spent (hours)" step="0.1" type="number" value={form.timeSpent} />
          <select className="select-control" onChange={(event) => setField('agentId', event.target.value)} value={form.agentId}>
            <option value="">Link to Agent (optional)</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.agentName}
              </option>
            ))}
          </select>
          <input className="input-control lg:col-span-2" onChange={(event) => setField('tags', event.target.value)} placeholder="Tags (comma separated)" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} />
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
            Save Experiment
          </Button>
        </div>
      </form>
    </Card>
  );
};
