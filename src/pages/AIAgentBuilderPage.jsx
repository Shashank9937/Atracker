import { useMemo, useState } from 'react';
import { BookMarked, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { createEmptyAiAgent } from '../utils/aiData';
import { AgentCard } from '../components/AgentCard';
import { AgentEditor } from '../components/AgentEditor';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const AIAgentBuilderPage = ({ onNavigate }) => {
  const { data, currentBook, saveAiAgent, deleteAiRecord, createLinkedDecision, createAgentFromBook } = useAppContext();
  const [form, setForm] = useState(createEmptyAiAgent());

  const templates = useMemo(
    () => data.ai.agents.filter((agent) => agent.id.startsWith('seed-agent-')).slice(0, 3),
    [data.ai.agents],
  );

  const handleSave = (agent) => {
    saveAiAgent(agent);
    setForm(createEmptyAiAgent());
  };

  const handleDecision = (agent) => {
    createLinkedDecision('agent', agent.id, {
      decision: `Major agent decision: ${agent.agentName}`,
      context: agent.notes || agent.problemSolved || agent.purpose,
      optionsConsidered: 'Adjust scope, keep current design, or pause the build.',
      whyChosen: 'Logged from AI Agent Builder for future review.',
      expectedOutcome: 'Clearer leverage and implementation direction.',
      reviewDate: new Date().toISOString().slice(0, 10),
    });
    onNavigate('decision-journal');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Button onClick={() => setForm(createEmptyAiAgent())} variant="secondary">
            <Sparkles className="h-4 w-4" />
            Fresh Agent
          </Button>
        }
        description="Design founder-grade agents with explicit leverage, workflow steps, model choices, memory, and decision links."
        title="AI Agent Builder"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <AgentEditor form={form} onCancel={() => setForm(createEmptyAiAgent())} onChange={setForm} onReset={() => setForm(createEmptyAiAgent())} onSave={handleSave} />

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Priority Templates</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Seeded from the Altman leverage workflow.</p>
            <div className="mt-5 space-y-3">
              {templates.map((template) => (
                <button
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-left transition hover:border-brand-400/40 hover:bg-brand-500/5 dark:border-slate-800 dark:bg-slate-950/50"
                  key={template.id}
                  onClick={() =>
                    setForm({
                      ...createEmptyAiAgent(),
                      ...template,
                      id: createEmptyAiAgent().id,
                      agentName: `${template.agentName} Copy`,
                    })
                  }
                  type="button"
                >
                  <p className="font-medium text-slate-900 dark:text-white">{template.agentName}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{template.purpose}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <BookMarked className="h-5 w-5 text-brand-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Book Insight Integration</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {currentBook
                ? `Current book: ${currentBook.bookTitle}`
                : 'If no book is active, set one in Book Learning and use it to seed an agent idea.'}
            </p>
            {currentBook ? (
              <>
                <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{currentBook.businessInsights || currentBook.keyLessons || currentBook.summary}</p>
                <Button className="mt-4 w-full" onClick={() => createAgentFromBook(currentBook)} type="button">
                  <Sparkles className="h-4 w-4" />
                    Book Insight {'\u2192'} Agent
                </Button>
              </>
            ) : null}
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        {data.ai.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onCreateDecision={handleDecision} onDelete={(id) => deleteAiRecord('agents', id)} onEdit={setForm} />
        ))}
      </div>
    </div>
  );
};
