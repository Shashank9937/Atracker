import { Brain, Clock, Cpu, Save, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const AgentCard = ({ agent, onEdit, onDelete, onCreateDecision }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{agent.agentName}</h3>
          <span className="badge">{agent.status}</span>
          <span className="badge">{agent.leveragePotential}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{agent.purpose}</p>
      </div>
      <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-500">
        <Cpu className="h-5 w-5" />
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Target User</p>
        <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{agent.targetUser || 'Not set'}</p>
      </div>
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Models</p>
        <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{agent.modelsUsed || 'Not set'}</p>
      </div>
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hours Saved</p>
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{Number(agent.estimatedTimeSaved || 0)} hrs/week</p>
      </div>
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cost Saved</p>
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">${Number(agent.estimatedCostSaved || 0)}</p>
      </div>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Problem Solved</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{agent.problemSolved || 'No problem statement yet.'}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Output</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{agent.output || 'No output definition yet.'}</p>
      </div>
    </div>

    <div className="mt-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workflow Steps</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(agent.workflowSteps || []).map((step, index) => (
          <span className="badge" key={step.id || `${agent.id}-${index}`}>
            <Brain className="h-3.5 w-3.5" />
            {index + 1}. {step.text}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Button onClick={() => onEdit(agent)} variant="secondary">
        <Save className="h-4 w-4" />
        Edit Agent
      </Button>
      <Button onClick={() => onCreateDecision(agent)} variant="secondary">
        <Clock className="h-4 w-4" />
        Log Decision
      </Button>
      <Button onClick={() => onDelete(agent.id)} variant="danger">
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  </Card>
);
