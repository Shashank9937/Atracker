import { useState } from 'react';
import { Wand2, Save, Cpu, Terminal, Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const AIAgentBuilderPage = ({ onNavigate }) => {
    const { saveAIAgent } = useAppContext();
    const [form, setForm] = useState({
        name: '',
        role: '',
        type: 'Assistant',
        provider: 'OpenAI',
        model: 'GPT-4o',
        status: 'Active',
        capabilities: [],
    });

    const handleField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        saveAIAgent(form);
        onNavigate('ai-agents');
    };

    const capabilityOptions = [
        'Web Search', 'Code Execution', 'Data Analysis',
        'Image Generation', 'Memory Persistence', 'API Integration'
    ];

    const toggleCapability = (cap) => {
        setForm(prev => ({
            ...prev,
            capabilities: prev.capabilities.includes(cap)
                ? prev.capabilities.filter(c => c !== cap)
                : [...prev.capabilities, cap]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <PageHeader
                title="Agent Builder"
                description="Craft a specialized AI agent for your specific workflow needs."
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1.5">Agent Name</label>
                            <input
                                className="input-control w-full"
                                placeholder="e.g. Market Research Pro"
                                value={form.name}
                                onChange={e => handleField('name', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Agent Type</label>
                            <select
                                className="select-control w-full"
                                value={form.type}
                                onChange={e => handleField('type', e.target.value)}
                            >
                                <option>Assistant</option>
                                <option>Researcher</option>
                                <option>Engineer</option>
                                <option>Manager</option>
                                <option>Planner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Provider</label>
                            <select
                                className="select-control w-full"
                                value={form.provider}
                                onChange={e => handleField('provider', e.target.value)}
                            >
                                <option>OpenAI</option>
                                <option>Anthropic</option>
                                <option>Vertex AI</option>
                                <option>Groq</option>
                                <option>Ollama</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Primary Role & Instructions</label>
                        <textarea
                            className="textarea-control w-full h-32"
                            placeholder="Describe what this agent does, its tone, and its specific constraints..."
                            value={form.role}
                            onChange={e => handleField('role', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Capabilities</label>
                        <div className="flex flex-wrap gap-2">
                            {capabilityOptions.map(cap => (
                                <button
                                    key={cap}
                                    type="button"
                                    onClick={() => toggleCapability(cap)}
                                    className={`px-4 py-2 rounded-xl border text-sm transition-colors ${form.capabilities.includes(cap)
                                        ? 'bg-brand-500 border-brand-500 text-white'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                        }`}
                                >
                                    {cap}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" type="button" onClick={() => onNavigate('ai-agents')}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        <Save className="h-4 w-4" />
                        Provision Agent
                    </Button>
                </div>
            </form>
        </div>
    );
};
