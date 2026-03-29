import { useMemo } from 'react';
import { Download, RefreshCcw, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { WEEKDAY_OPTIONS } from '../utils/constants';
import { downloadJson } from '../utils/download';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { CeoBriefCard } from '../components/CeoBriefCard';

export const FounderAutomationsPage = () => {
  const { data, operatingMetrics, updateInboxAutomationSettings, generateFounderBriefNow } = useAppContext();

  const settings = data.inboxAutomations?.settings || {};
  const briefs = useMemo(() => data.inboxAutomations?.briefs || [], [data.inboxAutomations]);
  const latestDaily = operatingMetrics.automationStats.latestDailyBrief;
  const latestWeekly = operatingMetrics.automationStats.latestWeeklyBrief;

  const handleToggle = (key) => updateInboxAutomationSettings({ [key]: !settings[key] });
  const handleChange = (key, value) => updateInboxAutomationSettings({ [key]: value });

  const exportAutomationState = () => {
    downloadJson('founder-os-inbox-automations.json', data.inboxAutomations || {});
  };

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Button onClick={() => generateFounderBriefNow('Daily CEO Brief')} variant="secondary">
              <RefreshCcw className="h-4 w-4" />
              Generate Daily Brief
            </Button>
            <Button onClick={() => generateFounderBriefNow('Weekly CEO Brief')} variant="secondary">
              <RefreshCcw className="h-4 w-4" />
              Generate Weekly Brief
            </Button>
            <Button onClick={exportAutomationState}>
              <Download className="h-4 w-4" />
              Export Brief Archive
            </Button>
          </>
        }
        description="Local-only founder automations that generate daily and weekly CEO briefs from the state already inside Founder OS. These run inside the browser when you open and use the app, not from a backend cron."
        title="Inbox Automations"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Daily Brief</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{settings.autoDailyBrief ? 'On' : 'Off'}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Generated for the current day when the app syncs locally.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weekly Brief</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{settings.autoWeeklyBrief ? 'On' : 'Off'}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Generated once per local week when you use the app.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Brief Archive</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{briefs.length}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Historical CEO snapshots stored in localStorage.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Automation Window</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{settings.weeklyBriefDay || 'Mon'}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Weekly brief day with local trigger time {settings.weeklyBriefTime || '08:30'}.</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Automation Settings</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This is intentionally frontend-only: it uses your current local data and creates briefs when the app is opened or when you generate them manually.</p>
            </div>
            <Sparkles className="h-5 w-5 text-brand-500" />
          </div>

          <div className="mt-6 space-y-5">
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Auto Daily CEO Brief</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create one daily founder brief for the current local day.</p>
              </div>
              <input checked={Boolean(settings.autoDailyBrief)} onChange={() => handleToggle('autoDailyBrief')} type="checkbox" />
            </label>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Daily Brief Time</label>
              <input className="input-control" onChange={(event) => handleChange('dailyBriefTime', event.target.value)} type="time" value={settings.dailyBriefTime || '08:00'} />
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Auto Weekly CEO Brief</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create one weekly company-level brief based on product, PMF, GTM, and runway state.</p>
              </div>
              <input checked={Boolean(settings.autoWeeklyBrief)} onChange={() => handleToggle('autoWeeklyBrief')} type="checkbox" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Weekly Brief Day</label>
                <select className="select-control" onChange={(event) => handleChange('weeklyBriefDay', event.target.value)} value={settings.weeklyBriefDay || 'Mon'}>
                  {WEEKDAY_OPTIONS.map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Weekly Brief Time</label>
                <input className="input-control" onChange={(event) => handleChange('weeklyBriefTime', event.target.value)} type="time" value={settings.weeklyBriefTime || '08:30'} />
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/70 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
              The automation engine does not send notifications outside the browser. It keeps a durable brief archive and refreshes when you open the app, which makes it safe for a frontend-only product.
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {latestDaily ? <CeoBriefCard brief={latestDaily} compact /> : <EmptyState copy="Generate a daily brief or let the local automation create one the next time the app syncs." title="No daily brief yet" />}
            {latestWeekly ? <CeoBriefCard brief={latestWeekly} compact /> : <EmptyState copy="Generate a weekly brief to turn company signal into a weekly CEO view." title="No weekly brief yet" />}
          </div>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Brief Archive</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Recent CEO briefs</h2>
              </div>
              <Sparkles className="h-5 w-5 text-brand-500" />
            </div>
            {briefs.length ? (
              <div className="mt-6 space-y-4">
                {briefs.slice(0, 8).map((brief) => (
                  <CeoBriefCard brief={brief} key={brief.id} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="As the automation runs, your daily and weekly CEO summaries will build a local archive here." title="No CEO briefs yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
