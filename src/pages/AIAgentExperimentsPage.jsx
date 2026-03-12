import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Microscope, Terminal, Save, Trash2 } from 'lucide-react';

export const AIAgentExperimentsPage = () => {
    const experiments = [
        {
            id: 1,
            title: 'Chain-of-Thought for Strategic Planning',
            model: 'GPT-4o',
            status: 'Active',
            result: '85% improvement in task breakdown granularity.',
            date: '2024-03-10'
        },
        {
            id: 2,
            title: 'Context Window Overflow Pressure Test',
            model: 'Claude 3.5 Sonnet',
            status: 'Completed',
            result: 'Lost signal at 180k tokens in specific retrieval tasks.',
            date: '2024-03-08'
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="AI Experiments Tracker"
                description="Scientific analysis of prompts, models, and agentic behaviors."
                actions={
                    <button className="primary-button">
                        <Microscope className="h-4 w-4" />
                        New Experiment
                    </button>
                }
            />

            <div className="grid gap-4">
                {experiments.map(exp => (
                    <Card key={exp.id} className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{exp.title}</h3>
                                    <span className="badge">{exp.status}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">{exp.model} • {exp.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="secondary-button text-xs px-3 py-1.5">View Logs</button>
                                <button className="text-slate-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Finding</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{exp.result}"</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
