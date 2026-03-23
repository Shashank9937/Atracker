import { useState } from 'react';
import { ExternalLink, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AI_TOOL_CATEGORY_OPTIONS } from '../utils/constants';
import { createEmptyAiTool } from '../utils/aiData';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const AIToolsLibraryPage = () => {
  const { data, saveAiTool, deleteAiRecord } = useAppContext();
  const [form, setForm] = useState(createEmptyAiTool());

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track the LLM, framework, vector DB, automation, and no-code tools that matter to your leverage stack."
        title="AI Tools Library"
      />

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Add tool</h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveAiTool(form);
              setForm(createEmptyAiTool());
            }}
          >
            <input className="input-control" onChange={(event) => setField('toolName', event.target.value)} placeholder="Tool Name" required value={form.toolName} />
            <select className="select-control" onChange={(event) => setField('category', event.target.value)} value={form.category}>
              {AI_TOOL_CATEGORY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <input className="input-control" onChange={(event) => setField('website', event.target.value)} placeholder="Website" value={form.website} />
            <textarea className="textarea-control" onChange={(event) => setField('purpose', event.target.value)} placeholder="Purpose" value={form.purpose} />
            <textarea className="textarea-control" onChange={(event) => setField('useCase', event.target.value)} placeholder="Use Case" value={form.useCase} />
            <input className="input-control" max="10" min="1" onChange={(event) => setField('rating', Number(event.target.value))} placeholder="Rating (1-10)" type="number" value={form.rating} />
            <textarea className="textarea-control" onChange={(event) => setField('notes', event.target.value)} placeholder="Notes" value={form.notes} />
            <Button className="w-full" type="submit">
              <Save className="h-4 w-4" />
              Save Tool
            </Button>
          </form>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {data.ai.tools.map((tool) => (
            <Card className="p-5" key={tool.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{tool.toolName}</h3>
                    <span className="badge">{tool.category}</span>
                    <span className="badge">{tool.rating}/10</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{tool.purpose}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setForm(tool)} variant="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => deleteAiRecord('tools', tool.id)} variant="danger">
                    Delete
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{tool.useCase}</p>
              {tool.website ? (
                <a className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-200" href={tool.website} rel="noreferrer" target="_blank">
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              {tool.notes ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{tool.notes}</p> : null}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
