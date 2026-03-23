import { Save } from 'lucide-react';
import { AI_NOTE_TYPES } from '../utils/constants';
import { createEmptyAiNote } from '../utils/aiData';
import { normalizeTagList } from '../utils/aiMetrics';
import { Button } from './Button';
import { Card } from './Card';

export const KnowledgeNoteEditor = ({ form = createEmptyAiNote(), onChange, onSave, onCancel, onReset }) => {
  const setField = (key, value) => onChange({ ...form, [key]: value });

  return (
    <Card className="p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-brand-500">AI Knowledge Notes</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Knowledge note editor</h2>
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
        <input className="input-control" onChange={(event) => setField('title', event.target.value)} placeholder="Title" required value={form.title} />
        <select className="select-control" onChange={(event) => setField('type', event.target.value)} value={form.type}>
          {AI_NOTE_TYPES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <input className="input-control" onChange={(event) => setField('tags', event.target.value)} placeholder="Tags (comma separated)" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} />
        <textarea className="textarea-control !min-h-[280px]" onChange={(event) => setField('content', event.target.value)} placeholder="Write the note" value={form.content} />

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
            Save Note
          </Button>
        </div>
      </form>
    </Card>
  );
};
