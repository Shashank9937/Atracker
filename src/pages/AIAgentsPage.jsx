import {
    Cpu,
    Layers,
    Microscope,
    Rocket,
    Wand2,
    Terminal,
    BookOpen,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const AIAgentsPage = ({ onNavigate }) => {
    const { data } = useAppContext();

    const hubs = [
        {
            id: 'roadmap',
            title: 'AI learning Roadmap',
            desc: 'Master the stacks, from LLM fundamentals to agentic workflows.',
            icon: BookOpen,
            color: 'text-brand-500',
            path: 'ai-agents/roadmap'
        },
        {
            id: 'builder',
            title: 'AI Agent Builder',
            desc: 'Provision custom agents with specific roles and toolsets.',
            icon: Cpu,
            color: 'text-mint',
            path: 'ai-agents/builder'
        },
        {
            id: 'architect',
            title: 'Multi-Agent Architect',
            desc: 'Design systems where multiple agents collaborate on complex tasks.',
            icon: Layers,
            color: 'text-sunrise',
            path: 'ai-agents/architect'
        },
        {
            id: 'experiments',
            title: 'AI Experiments',
            desc: 'Track prompts, models, and results of your AI research.',
            icon: Microscope,
            color: 'text-sky-500',
            path: 'ai-agents/experiments'
        },
        {
            id: 'library',
            title: 'Tools & Library',
            desc: 'Curated collection of APIs, SDKs, and platforms for builders.',
            icon: Terminal,
            color: 'text-indigo-400',
            path: 'ai-agents/library'
        },
        {
            id: 'leverage',
            title: 'Opportunity Map',
            desc: 'Identify high-leverage points for AI integration in your biz.',
            icon: Rocket,
            color: 'text-emerald-500',
            path: 'opportunity-radar'
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="AI Agents Hub"
                description="Build, manage, and scale your personal AI workforce."
                actions={
                    <Button onClick={() => onNavigate('ai-agents/builder')}>
                        <Wand2 className="h-4 w-4" />
                        New Agent
                    </Button>
                }
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hubs.map((hub) => (
                    <Card
                        key={hub.id}
                        className="p-6 cursor-pointer hover:border-brand-500/50 transition-colors group"
                        onClick={() => onNavigate(hub.path)}
                    >
                        <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 w-fit ${hub.color}`}>
                            <hub.icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                            {hub.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {hub.desc}
                        </p>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Active Workforce</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {data.aiAgents.map((agent) => (
                        <Card key={agent.id} className="p-5 flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500">
                                <Cpu className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">{agent.name}</h4>
                                    <span className="badge">{agent.status}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{agent.type} • {agent.model}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">{agent.role}</p>
                            </div>
                        </Card>
                    ))}
                    {data.aiAgents.length === 0 && (
                        <Card className="p-10 text-center col-span-2 border-dashed border-2">
                            <p className="text-slate-500">No agents provisioned yet. Start building your AI workforce.</p>
                            <Button
                                variant="secondary"
                                className="mt-4 mx-auto"
                                onClick={() => onNavigate('ai-agents/builder')}
                            >
                                Launch Builder
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
