import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { NotebookPen, Search, Plus, Tag } from 'lucide-react';

export const AIAgentNotesPage = () => {
    const notes = [
        {
            id: 'altman-guide',
            title: "Sam Altman's Guide to AI Productivity",
            tags: ['productivity', 'strategy'],
            excerpt: "The most important thing is to focus on the high-leverage tasks that only you can do...",
            date: '2024-03-01'
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="AI Research Notes"
                description="Captured patterns, guides, and insights from the AI frontier."
                actions={
                    <button className="primary-button">
                        <Plus className="h-4 w-4" />
                        New Note
                    </button>
                }
            />

            <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
                <Card className="p-6 h-fit space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input className="input-control pl-10 w-full" placeholder="Search notes..." />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold px-2 mb-2">Categories</p>
                        {['Strategy', 'Prompting', 'Architecture', 'Market'].map(tag => (
                            <button key={tag} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                                <Tag className="h-3 w-3" />
                                {tag}
                            </button>
                        ))}
                    </div>
                </Card>

                <div className="grid gap-4">
                    {notes.map(note => (
                        <Card key={note.id} className="p-6 hover:border-brand-500/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors truncate">
                                        {note.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{note.date}</p>
                                </div>
                                <div className="flex gap-2">
                                    {note.tags.map(tag => (
                                        <span key={tag} className="badge">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                {note.excerpt}
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-brand-500 font-medium text-sm">
                                Read Full Note
                                <NotebookPen className="h-4 w-4" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
