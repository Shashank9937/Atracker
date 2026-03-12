import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Terminal, ExternalLink, Globe, Smartphone, Database } from 'lucide-react';

export const AIToolsLibraryPage = () => {
    const categories = [
        {
            name: 'Agent Frameworks',
            icon: Terminal,
            tools: [
                { name: 'LangChain', desc: 'Powerful framework for building context-aware aplicaciones.' },
                { name: 'AutoGPT', desc: 'Experimental open-source project for autonomous agents.' },
                { name: 'CrewAI', desc: 'Collaboration framework for role-playing AI agents.' }
            ]
        },
        {
            name: 'Model Providers',
            icon: Database,
            tools: [
                { name: 'Anthropic', desc: 'Makers of Claude, focused on safe and capable AI.' },
                { name: 'OpenAI', desc: 'Industry leader with GPT-4 and powerful API suites.' },
                { name: 'Groq', desc: 'Ultrafast LPU for real-time inference speed.' }
            ]
        },
        {
            name: 'Dev Tools',
            icon: Globe,
            tools: [
                { name: 'LangSmith', desc: 'Debug and monitor LLM applications at scale.' },
                { name: 'Weights & Biases', desc: 'Track and visualize AI experiments and models.' }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="AI Tools Library"
                description="A curated stack for building the next generation of AI-native platforms."
            />

            <div className="grid gap-8">
                {categories.map(cat => (
                    <div key={cat.name}>
                        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                            <cat.icon className="h-5 w-5 text-brand-500" />
                            {cat.name}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {cat.tools.map(tool => (
                                <Card key={tool.name} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group cursor-pointer">
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">{tool.name}</h4>
                                        <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                        {tool.desc}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
