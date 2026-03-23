import { Clock, Save, Trash2, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const OpportunityCard = ({ opportunity, onEdit, onDelete, onCreateDecision }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{opportunity.process}</h3>
          <span className="badge">{opportunity.status}</span>
          <span className="badge">{opportunity.automationPotential}</span>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{opportunity.industry}</p>
      </div>
      <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-500">
        <TrendingUp className="h-5 w-5" />
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Leverage Score</p>
        <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{opportunity.leverageScore}</p>
      </div>
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Time Saved</p>
        <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{opportunity.estimatedTimeSavedPct}%</p>
      </div>
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weekly Hours</p>
        <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{opportunity.weeklyHoursSaved}</p>
      </div>
      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cost Saved</p>
        <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">${opportunity.estimatedCostSaved}</p>
      </div>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Manual Work</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.currentManualWork}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Solution</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.aiSolution}</p>
      </div>
    </div>

    <div className="mt-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pain Points</p>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{opportunity.painPoints}</p>
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      <Button onClick={() => onEdit(opportunity)} variant="secondary">
        <Save className="h-4 w-4" />
        Edit
      </Button>
      <Button onClick={() => onCreateDecision(opportunity)} variant="secondary">
        <Clock className="h-4 w-4" />
        Log Decision
      </Button>
      <Button onClick={() => onDelete(opportunity.id)} variant="danger">
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  </Card>
);
