import { useMemo } from 'react';
import { Activity, Brain, ChartNoAxesCombined, Gauge, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DoughnutChart } from '../charts/DoughnutChart';
import { LineChart } from '../charts/LineChart';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const KPIAnalyticsPage = () => {
  const { data, kpiTrends, thisWeekSnapshot, weeklyProgress } = useAppContext();

  const averageFounderScore = useMemo(() => {
    if (!weeklyProgress.length) return 0;
    return Math.round(weeklyProgress.reduce((total, item) => total + Number(item.founderScore || 0), 0) / weeklyProgress.length);
  }, [weeklyProgress]);

  const strongestDay = useMemo(
    () => [...weeklyProgress].sort((left, right) => Number(right.founderScore || 0) - Number(left.founderScore || 0))[0],
    [weeklyProgress],
  );

  const relationshipMix = useMemo(
    () => ({
      labels: ['Warm', 'Strong', 'Strategic'],
      data: [
        data.contacts.filter((contact) => contact.relationshipStrength === 'Warm').length,
        data.contacts.filter((contact) => contact.relationshipStrength === 'Strong').length,
        data.contacts.filter((contact) => contact.relationshipStrength === 'Strategic').length,
      ],
    }),
    [data.contacts],
  );

  const ideaStatusMix = useMemo(
    () => ({
      labels: ['Exploring', 'Validating', 'Building', 'Paused'],
      data: [
        data.ideas.filter((idea) => idea.status === 'Exploring').length,
        data.ideas.filter((idea) => idea.status === 'Validating').length,
        data.ideas.filter((idea) => idea.status === 'Building').length,
        data.ideas.filter((idea) => idea.status === 'Paused').length,
      ],
    }),
    [data.ideas],
  );

  return (
    <div>
      <PageHeader
        description="Weekly trend lines across work, learning, idea generation, networking, execution, and health habits."
        title="KPI Analytics"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">This Week</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.deepWorkHours}h</p>
            </div>
            <Activity className="h-5 w-5 text-brand-500" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Deep work hours logged this week.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.learningHours}h</p>
            </div>
            <Brain className="h-5 w-5 text-mint" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Hours invested in deliberate learning.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Networking</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.contactsReached}</p>
            </div>
            <Users className="h-5 w-5 text-sky-500" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">People contacted during execution days.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Execution</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.tasksCompleted}</p>
            </div>
            <ChartNoAxesCombined className="h-5 w-5 text-sunrise" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Mission tasks completed this week.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg Founder Score</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{averageFounderScore}</p>
            </div>
            <Gauge className="h-5 w-5 text-brand-500" />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Average daily founder score across the last 7 days.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strongest Day</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{strongestDay?.founderScore || 0}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{strongestDay ? `${strongestDay.label} was the highest-scoring day this week.` : 'Log more days to reveal a weekly high point.'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading Minutes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{thisWeekSnapshot.readingMinutes}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Reading contributes directly to your learning system, not just your book list.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <LineChart
          backgroundColor="rgba(36, 159, 232, 0.18)"
          borderColor="#249fe8"
          data={kpiTrends.deepWorkHours}
          labels={kpiTrends.labels}
          subtitle="Weekly total deep work hours."
          title="Deep Work Hours"
        />
        <LineChart
          backgroundColor="rgba(244, 166, 64, 0.18)"
          borderColor="#f4a640"
          data={kpiTrends.ideasGenerated}
          labels={kpiTrends.labels}
          subtitle="Weekly idea generation volume."
          title="Ideas Generated"
        />
        <LineChart
          backgroundColor="rgba(93, 224, 192, 0.18)"
          borderColor="#5de0c0"
          data={kpiTrends.contactsMade}
          labels={kpiTrends.labels}
          subtitle="Weekly outreach and conversations logged."
          title="Contacts Made"
        />
        <LineChart
          backgroundColor="rgba(99, 102, 241, 0.18)"
          borderColor="#818cf8"
          data={kpiTrends.learningHours}
          labels={kpiTrends.labels}
          subtitle="Weekly learning hours captured from the daily tracker."
          title="Learning Hours"
        />
        <LineChart
          backgroundColor="rgba(248, 113, 113, 0.18)"
          borderColor="#fb7185"
          data={kpiTrends.executionTasks}
          labels={kpiTrends.labels}
          subtitle="Completed mission tasks per week."
          title="Execution Tasks"
        />
        <LineChart
          backgroundColor="rgba(45, 212, 191, 0.18)"
          borderColor="#2dd4bf"
          data={kpiTrends.healthHabits}
          labels={kpiTrends.labels}
          subtitle="Exercise, low-smoking days, and energy rolled into a weekly habit score."
          title="Health Habits"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DoughnutChart
          colors={['#38bdf8', '#5de0c0', '#249fe8']}
          data={relationshipMix.data}
          labels={relationshipMix.labels}
          subtitle="Are you maintaining depth across your founder network, not just volume?"
          title="Relationship Strength Mix"
        />
        <DoughnutChart
          colors={['#818cf8', '#f4a640', '#249fe8', '#94a3b8']}
          data={ideaStatusMix.data}
          labels={ideaStatusMix.labels}
          subtitle="A good funnel has both exploration and a few clear build-worthy bets."
          title="Idea Status Mix"
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ideas in System</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.ideas.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A healthy idea funnel keeps strategic options open.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Opportunities Tracked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.opportunities.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Real problem signals are often more valuable than brainstormed ideas.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Contacts in CRM</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{data.contacts.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Founder momentum compounds faster with warm, maintained relationships.</p>
        </Card>
      </div>
    </div>
  );
};
