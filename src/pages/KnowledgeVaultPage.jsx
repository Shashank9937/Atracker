import { useMemo, useState } from 'react';
import { Archive, Search, Tag, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { KNOWLEDGE_TYPES } from '../utils/constants';
import { formatShortDate } from '../utils/date';
import { extractTopTerms, includesQuery, truncateText } from '../utils/textInsights';
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
  const [typeFilter, setTypeFilter] = useState('All');
  const [query, setQuery] = useState('');

  const tagCounts = useMemo(
    () =>
      data.knowledgeItems.reduce((acc, item) => {
        (item.tags || []).forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {}),
    [data.knowledgeItems],
  );

  const tags = useMemo(
    () => ['All', ...Object.entries(tagCounts).sort((left, right) => right[1] - left[1]).map(([tag]) => tag)],
    [tagCounts],
  );

  const items = useMemo(
    () =>
      data.knowledgeItems.filter((item) => {
        const matchesTag = selectedTag === 'All' ? true : (item.tags || []).includes(selectedTag);
        const matchesType = typeFilter === 'All' ? true : item.type === typeFilter;
        const matchesQuery = includesQuery([item.title, item.type, item.content, item.tags], query);
        return matchesTag && matchesType && matchesQuery;
      }),
    [data.knowledgeItems, query, selectedTag, typeFilter],
  );

  const dominantType = useMemo(() => {
    const counts = data.knowledgeItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'None yet';
  }, [data.knowledgeItems]);

  const recentAdds = useMemo(
    () => data.knowledgeItems.filter((item) => new Date(item.createdAt) >= new Date(Date.now() - 14 * 86400000)).length,
    [data.knowledgeItems],
  );

  const recurringTerms = useMemo(
    () => extractTopTerms(data.knowledgeItems.flatMap((item) => [item.title, item.content, item.tags]), 6),
    [data.knowledgeItems],
  );

  const topTags = useMemo(() => Object.entries(tagCounts).sort((left, right) => right[1] - left[1]).slice(0, 6), [tagCounts]);

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

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes Stored</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.knowledgeItems.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A strong vault turns scattered thinking into reusable founder memory.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unique Tags</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{Object.keys(tagCounts).length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Tags make cross-domain patterns much easier to rediscover later.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent Additions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{recentAdds}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Items added in the last 14 days keep the vault fresh and alive.</p>
        </Card>
        <Card className="panel-card-strong p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Dominant Type</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{dominantType}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">The most common knowledge shape currently captured in your system.</p>
        </Card>
      </div>

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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Tagged knowledge</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Search by title, type, content, or tags to reconnect ideas and market context quickly.</p>
              </div>
              <span className="badge">{items.length} visible</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input className="input-control pl-10" onChange={(event) => setQuery(event.target.value)} placeholder="Search notes, tags, or ideas..." value={query} />
              </div>
              <select className="select-control" onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}>
                <option>All</option>
                {KNOWLEDGE_TYPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select className="select-control" onChange={(event) => setSelectedTag(event.target.value)} value={selectedTag}>
                {tags.map((tag) => (
                  <option key={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => (
                <button
                  className={`badge ${selectedTag === tag ? '!border-brand-400 !bg-brand-500/15 !text-brand-700 dark:!text-brand-100' : ''}`}
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  type="button"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag} • {count}
                </button>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-brand-500" />
                <div>
                  <h3 className="section-title">Top Themes</h3>
                  <p className="section-copy">Terms that recur across the vault and may deserve their own operating principles.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {recurringTerms.length ? (
                  recurringTerms.map((term) => (
                    <span className="badge" key={term.term}>
                      {term.term} • {term.count}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">Add more knowledge notes to reveal recurring themes.</span>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-brand-500" />
                <div>
                  <h3 className="section-title">Knowledge Mix</h3>
                  <p className="section-copy">The type distribution of what you capture most often.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {KNOWLEDGE_TYPES.map((type) => {
                  const count = data.knowledgeItems.filter((item) => item.type === type).length;
                  return (
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50/70 px-4 py-3 dark:bg-slate-950/50" key={type}>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{type}</span>
                      <span className="badge">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

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
                    <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{truncateText(item.content, 260) || 'No note body yet.'}</p>
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
              <EmptyState copy="No notes match the current filters. Widen the search or switch tags." title="No visible knowledge items" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
