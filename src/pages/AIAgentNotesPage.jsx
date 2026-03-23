import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { createEmptyAiNote } from '../utils/aiData';
import { downloadJson } from '../utils/download';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { KnowledgeNoteEditor } from '../components/KnowledgeNoteEditor';
import { PageHeader } from '../components/PageHeader';

export const AIAgentNotesPage = () => {
  const { data, saveAiNote, deleteAiRecord } = useAppContext();
  const [form, setForm] = useState(createEmptyAiNote());
  const [query, setQuery] = useState('');

  const filteredNotes = useMemo(
    () =>
      data.ai.notes.filter((note) => {
        const haystack = `${note.title} ${note.content} ${(note.tags || []).join(' ')}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [data.ai.notes, query],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        description="Store the Altman leverage guide, architecture notes, agent templates, and reusable research in one searchable place."
        title="AI Knowledge Notes"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search AI notes..." value={query} />
            </div>
          </Card>

          {filteredNotes.map((note) => (
            <Card className="p-6" key={note.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{note.title}</h3>
                    <span className="badge">{note.type}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(note.tags || []).map((tag) => (
                      <span className="badge" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setForm(note)} variant="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => downloadJson(`${note.title.replace(/\s+/g, '-').toLowerCase()}.json`, note)} variant="secondary">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  {note.title !== 'Altman Leverage Guide' ? (
                    <Button onClick={() => deleteAiRecord('notes', note.id)} variant="danger">
                      Delete
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">{note.content}</p>
            </Card>
          ))}
        </div>

        <KnowledgeNoteEditor
          form={form}
          onCancel={() => setForm(createEmptyAiNote())}
          onChange={setForm}
          onReset={() => setForm(createEmptyAiNote())}
          onSave={(note) => {
            saveAiNote(note);
            setForm(createEmptyAiNote());
          }}
        />
      </div>
    </div>
  );
};
