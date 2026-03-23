import { Gauge, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BarChart } from '../charts/BarChart';
import { DoughnutChart } from '../charts/DoughnutChart';
import { LineChart } from '../charts/LineChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { downloadJson } from '../utils/download';

export const AIAnalyticsPage = () => {
  const { data, aiStats, aiAnalytics, founderLeverage } = useAppContext();

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Button onClick={() => downloadJson('founder-os-ai-section.json', data.ai)} variant="secondary">
            Export AI JSON
          </Button>
        }
        description="Measure AI leverage across learning, agent design, experiments, and opportunity prioritization."
        title="AI Analytics"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="panel-card-strong p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-200">Founder Leverage</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">{founderLeverage}</p>
            </div>
            <Gauge className="h-6 w-6 text-brand-500" />
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Scaled from deep work, learning, agents designed, and high-leverage opportunities.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">High-Leverage Opportunities</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.opportunitiesHighLeverageCount}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Entries with leverage score above 70.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experiments</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.experimentsRun}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Total experiments recorded and versioned.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weekly Hours Saved</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{aiStats.weeklyHoursSaved}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Estimated cumulative weekly time saved from the AI layer.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LineChart
          backgroundColor="rgba(36, 159, 232, 0.18)"
          borderColor="#249fe8"
          data={aiAnalytics.weeklyLearningHours}
          labels={aiAnalytics.labels}
          subtitle="Weekly AI learning hours captured from module logs."
          title="Weekly Learning Hours"
        />
        <LineChart
          backgroundColor="rgba(93, 224, 192, 0.18)"
          borderColor="#5de0c0"
          data={aiAnalytics.agentsDesigned}
          labels={aiAnalytics.labels}
          subtitle="Weekly agent designs created in the builder."
          title="Agents Designed"
        />
        <BarChart
          backgroundColor="rgba(244, 166, 64, 0.65)"
          borderColor="#f4a640"
          data={aiAnalytics.opportunityLeverage.map((item) => item.value)}
          labels={aiAnalytics.opportunityLeverage.map((item) => item.label)}
          subtitle="Leverage score distribution across logged opportunities."
          title="Opportunity Leverage Distribution"
        />
        <DoughnutChart
          colors={['#5de0c0', '#249fe8', '#f4a640', '#fb7185']}
          data={[
            data.ai.experiments.filter((experiment) => experiment.whatWorked && !experiment.whatFailed).length,
            data.ai.experiments.filter((experiment) => experiment.whatWorked && experiment.whatFailed).length,
            data.ai.experiments.filter((experiment) => !experiment.whatWorked && experiment.whatFailed).length,
            data.ai.experiments.filter((experiment) => !experiment.whatWorked && !experiment.whatFailed).length,
          ]}
          labels={['Clear Wins', 'Mixed Results', 'Mostly Failed', 'Unscored']}
          subtitle="Simple success mix based on what worked vs what failed."
          title="Experiment Success Rate"
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-brand-500" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Leverage summary</h2>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Founder Leverage = (AvgDeepWorkHours * 0.35) + (AgentsDesigned * 0.25) + (OpportunitiesHighLeverageCount * 0.2) + (LearningHoursLast7Days * 0.2), scaled to 0-100.
        </p>
      </Card>
    </div>
  );
};
