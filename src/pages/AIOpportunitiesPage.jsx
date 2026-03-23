import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AI_AUTOMATION_OPTIONS, AI_OPPORTUNITY_STATUS_OPTIONS } from '../utils/constants';
import { calculateAiLeverageScore, calculateOpportunityHoursSaved, createEmptyAiOpportunity } from '../utils/aiData';
import { BarChart } from '../charts/BarChart';
import { DoughnutChart } from '../charts/DoughnutChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { OpportunityCard } from '../components/OpportunityCard';
import { PageHeader } from '../components/PageHeader';

const BOARD_COLUMNS = ['Idea', 'Research', 'Prototype', 'Implemented'];

export const AIOpportunitiesPage = ({ onNavigate }) => {
  const { data, aiOpportunityCharts, saveAiOpportunity, deleteAiRecord, createLinkedDecision } = useAppContext();
  const [form, setForm] = useState(createEmptyAiOpportunity());

  const leveragePreview = useMemo(
    () => calculateAiLeverageScore(form.estimatedTimeSavedPct, form.marketSizeScore, form.executionSpeedScore),
    [form.estimatedTimeSavedPct, form.marketSizeScore, form.executionSpeedScore],
  );

  const board = useMemo(
    () =>
      BOARD_COLUMNS.reduce(
        (acc, column) => ({
          ...acc,
          [column]: data.ai.opportunities.filter((item) => item.status === column),
        }),
        {},
      ),
    [data.ai.opportunities],
  );

  const handleDecision = (opportunity) => {
    createLinkedDecision('agent', opportunity.id, {
      decision: `Opportunity decision: ${opportunity.process}`,
      context: opportunity.notes || opportunity.currentManualWork,
      optionsConsidered: 'Advance, pause, simplify, or discard the opportunity.',
      whyChosen: 'Logged from AI Opportunities.',
      expectedOutcome: 'Clearer prioritization of high-leverage workflows.',
      reviewDate: new Date().toISOString().slice(0, 10),
    });
    onNavigate('decision-journal');
  };

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        description="Map manual work, pain points, AI wedges, and leverage score so opportunities compete on expected leverage instead of intuition."
        title="AI Opportunities"
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <BarChart
          backgroundColor="rgba(36, 159, 232, 0.65)"
          borderColor="#249fe8"
          data={aiOpportunityCharts.industries.values}
          labels={aiOpportunityCharts.industries.labels}
          subtitle="Industries with the most logged AI opportunities."
          title="Industry Opportunity Density"
        />
        <DoughnutChart
          colors={['#249fe8', '#5de0c0', '#f4a640']}
          data={aiOpportunityCharts.automationPotential.values}
          labels={aiOpportunityCharts.automationPotential.labels}
          subtitle="Distribution of automation potential across opportunities."
          title="Automation Potential"
        />
        <BarChart
          backgroundColor="rgba(93, 224, 192, 0.65)"
          borderColor="#5de0c0"
          data={aiOpportunityCharts.timeSaved.values}
          labels={aiOpportunityCharts.timeSaved.labels}
          subtitle="Estimated time saved percentage per opportunity."
          title="Estimated Time Saved"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">New leverage entry</h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveAiOpportunity({
                ...form,
                leverageScore: calculateAiLeverageScore(form.estimatedTimeSavedPct, form.marketSizeScore, form.executionSpeedScore),
                weeklyHoursSaved: calculateOpportunityHoursSaved(form.estimatedTimeSavedPct),
              });
              setForm(createEmptyAiOpportunity());
            }}
          >
            <input className="input-control" onChange={(event) => setField('industry', event.target.value)} placeholder="Industry" required value={form.industry} />
            <input className="input-control" onChange={(event) => setField('process', event.target.value)} placeholder="Process" required value={form.process} />
            <textarea className="textarea-control" onChange={(event) => setField('currentManualWork', event.target.value)} placeholder="Current Manual Work" value={form.currentManualWork} />
            <textarea className="textarea-control" onChange={(event) => setField('painPoints', event.target.value)} placeholder="Pain Points" value={form.painPoints} />
            <textarea className="textarea-control" onChange={(event) => setField('aiSolution', event.target.value)} placeholder="AI Solution" value={form.aiSolution} />
            <input className="input-control" onChange={(event) => setField('toolsRequired', event.target.value)} placeholder="Tools Required" value={form.toolsRequired} />
            <div className="grid gap-4 lg:grid-cols-2">
              <input className="input-control" max="100" min="0" onChange={(event) => setField('estimatedTimeSavedPct', Number(event.target.value))} placeholder="Estimated Time Saved %" type="number" value={form.estimatedTimeSavedPct} />
              <input className="input-control" min="0" onChange={(event) => setField('estimatedCostSaved', Number(event.target.value))} placeholder="Estimated Cost Saved" type="number" value={form.estimatedCostSaved} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <select className="select-control" onChange={(event) => setField('automationPotential', event.target.value)} value={form.automationPotential}>
                {AI_AUTOMATION_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select className="select-control" onChange={(event) => setField('status', event.target.value)} value={form.status}>
                {AI_OPPORTUNITY_STATUS_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <input className="input-control" onChange={(event) => setField('implementationDifficulty', event.target.value)} placeholder="Implementation Difficulty" value={form.implementationDifficulty} />
            <div className="rounded-3xl border border-slate-200/80 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Market Size Score</span>
                <span className="font-medium text-slate-900 dark:text-white">{form.marketSizeScore}/10</span>
              </div>
              <input className="range-input mt-3 w-full" max="10" min="1" onChange={(event) => setField('marketSizeScore', Number(event.target.value))} type="range" value={form.marketSizeScore} />
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Execution Speed Score</span>
                <span className="font-medium text-slate-900 dark:text-white">{form.executionSpeedScore}/10</span>
              </div>
              <input className="range-input mt-3 w-full" max="10" min="1" onChange={(event) => setField('executionSpeedScore', Number(event.target.value))} type="range" value={form.executionSpeedScore} />
              <div className="mt-4 rounded-2xl bg-brand-500/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Leverage Score</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{leveragePreview}</p>
              </div>
            </div>
            <textarea className="textarea-control" onChange={(event) => setField('notes', event.target.value)} placeholder="Notes" value={form.notes} />
            <Button className="w-full" type="submit">
              <TrendingUp className="h-4 w-4" />
              Save Opportunity
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Board View</h2>
            <div className="mt-5 grid gap-4 xl:grid-cols-4">
              {BOARD_COLUMNS.map((column) => (
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50" key={column}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{column}</h3>
                    <span className="badge">{board[column].length}</span>
                  </div>
                  <div className="space-y-3">
                    {board[column].map((item) => (
                      <button className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-left transition hover:border-brand-400/40 dark:border-slate-800 dark:bg-slate-900/80" key={item.id} onClick={() => setForm(item)} type="button">
                        <p className="font-medium text-slate-900 dark:text-white">{item.process}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.industry}</p>
                        <p className="mt-2 text-xs text-brand-600 dark:text-brand-200">Leverage {item.leverageScore}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {data.ai.opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} onCreateDecision={handleDecision} onDelete={(id) => deleteAiRecord('opportunities', id)} onEdit={setForm} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
