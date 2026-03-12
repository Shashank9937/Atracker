import { useMemo, useState } from 'react';
import { Archive, Tag, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { KNOWLEDGE_TYPES } from '../utils/constants';
import { formatShortDate } from '../utils/date';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const initialForm = {
  title: '',
  type: 'Insight',
  content: '',
  tags: '',
};

export const KnowledgeVaultPage = () => {
  const { data, addKnowledgeItem, deleteRecord } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = useMemo(
    () => ['All', ...new Set(data.knowledgeItems.flatMap((item) => item.tags || []).filter(Boolean))],
    [data.knowledgeItems],
  );

  const items = useMemo(
    () =>
      data.knowledgeItems.filter((item) => (selectedTag === 'All' ? true : (item.tags || []).includes(selectedTag))),
    [data.knowledgeItems, selectedTag],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    addKnowledgeItem({ ...form, tags: form.tags });
    setForm(initialForm);
  };

  return (
    <div>
      <PageHeader
        description="Capture reusable founder knowledge: insights, articles, lessons, market observations, and ideas with tags."
        title="Knowledge Vault"
      />
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Add knowledge item</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Title" value={form.title} />
            <select className="select-control" onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} value={form.type}>
              {KNOWLEDGE_TYPES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <textarea className="textarea-control" onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} placeholder="Capture the note, insight, or lesson" value={form.content} />
            <input className="input-control" onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="Tags (comma separated)" value={form.tags} />
            <Button className="w-full" type="submit">
              <Archive className="h-4 w-4" />
              Save to Vault
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Tagged knowledge</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Filter the vault by theme to reconnect ideas and market context.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    className={`badge ${selectedTag === tag ? '!border-brand-400 !bg-brand-500/15 !text-brand-700 dark:!text-brand-100' : ''}`}
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    type="button"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            {items.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/50" key={item.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                          <span className="badge">{item.type}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">{formatShortDate(item.createdAt)}</p>
                      </div>
                      <button className="danger-button" onClick={() => deleteRecord('knowledgeItems', item.id)} type="button">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{item.content}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(item.tags || []).map((tag) => (
                        <span className="badge" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState copy="No notes match this tag yet. Capture more signal or switch filters." title="No knowledge items" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
