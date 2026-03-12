import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Layers, Rocket, Zap, MessageSquare } from 'lucide-react';

export const AIAgentArchitectPage = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Multi-Agent Architect"
                description="Design collaborative swarms where agents solve complex problems together."
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5 text-brand-500" />
                        Active Swarms
                    </h3>
                    <div className="p-8 border-2 border-dashed rounded-3xl text-center text-slate-500">
                        <p>No active agent swarms defined.</p>
                        <button className="mt-4 text-brand-500 font-medium hover:underline">Create Swarm Flow</button>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-sunrise" />
                        Architecture Templates
                    </h3>
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <h4 className="font-medium">Researcher + Writer</h4>
                            <p className="text-sm text-slate-500">Sequential loop for producing deep-dive reports.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <h4 className="font-medium">Debate Swarm</h4>
                            <p className="text-sm text-slate-500">Multiple agents testing hypotheses against each other.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <h4 className="font-medium">Manager + Worker</h4>
                            <p className="text-sm text-slate-500">Hierarchical task delegation and verification.</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Workflow Designer</h3>
                    <span className="badge">Beta</span>
                </div>
                <div className="aspect-video bg-slate-900 rounded-3xl flex items-center justify-center text-slate-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                    <div className="z-10 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Visual workflow editor placeholder.</p>
                        <p className="text-xs mt-2 uppercase tracking-widest">Canvas Environment</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
