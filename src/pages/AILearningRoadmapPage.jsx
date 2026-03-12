import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { BookOpen, CheckCircle2, Circle, Trophy } from 'lucide-react';

export const AILearningRoadmapPage = () => {
    const steps = [
        {
            id: 1,
            title: 'Foundation: LLM Fundamentals',
            desc: 'Tokenization, context windows, and the transformer architecture basics.',
            status: 'Completed',
            items: ['What are Transformers?', 'Understanding Quantization', 'Local vs Cloud Models']
        },
        {
            id: 2,
            title: 'Prompt Engineering Mastery',
            desc: 'System prompts, few-shotting, and chain-of-thought techniques.',
            status: 'Current',
            items: ['Structured Output Mastery', 'Prompt Versioning', 'Context Injection']
        },
        {
            id: 3,
            title: 'Agentic Architectures',
            desc: 'Building recursive loops and state management for autonomous units.',
            status: 'Upcoming',
            items: ['Memory Systems (RAG)', 'Tool Use/Function Calling', 'Agentic Reasonings']
        },
        {
            id: 4,
            title: 'Production Engineering',
            desc: 'Latency optimization, cost management, and evaluation frameworks.',
            status: 'Locked',
            items: ['Evaluation Datasets', 'Semantic Caching', 'Deployment Stacks']
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="AI Learning Roadmap"
                description="A structured path to becoming an AI-native founder and engineer."
            />

            <div className="grid gap-6 lg:grid-cols-4">
                <Card className="p-5 bg-brand-500 text-white border-none">
                    <Trophy className="h-8 w-8 mb-4 opacity-80" />
                    <p className="text-xs uppercase tracking-widest opacity-80">Current Skill Level</p>
                    <h3 className="text-3xl font-bold mt-1">Intermediate</h3>
                    <p className="text-sm mt-3 opacity-90">25% through the master roadmap.</p>
                </Card>
                {/* Placeholder for other stats */}
            </div>

            <div className="relative mt-8 space-y-4">
                {steps.map((step, idx) => (
                    <Card
                        key={step.id}
                        className={`p-6 flex gap-6 items-start relative ${step.status === 'Locked' ? 'opacity-50 grayscale' : ''
                            }`}
                    >
                        {idx !== steps.length - 1 && (
                            <div className="absolute left-[39px] top-20 bottom-[-16px] w-0.5 bg-slate-100 dark:bg-slate-800 z-0"></div>
                        )}

                        <div className={`shrink-0 z-10 w-12 h-12 rounded-full flex items-center justify-center ${step.status === 'Completed' ? 'bg-mint/10 text-mint' :
                                step.status === 'Current' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' :
                                    'bg-slate-100 dark:bg-slate-900 text-slate-400'
                            }`}>
                            {step.status === 'Completed' ? <CheckCircle2 className="h-6 w-6" /> :
                                step.status === 'Current' ? <BookOpen className="h-6 w-6" /> :
                                    <Circle className="h-6 w-6" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                                <span className={`badge ${step.status === 'Completed' ? 'bg-mint/10 text-mint border-mint/20' :
                                        step.status === 'Current' ? 'bg-brand-500/10 text-brand-500 border-brand-500/20' :
                                            ''
                                    }`}>{step.status}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{step.desc}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {step.items.map(item => (
                                    <span key={item} className="px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-950/50 text-xs border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
