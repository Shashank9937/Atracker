import { useRef, useState } from 'react';
import { Download, Keyboard, RefreshCcw, UploadCloud } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { SHORTCUTS } from '../utils/constants';
import { getTodayKey } from '../utils/date';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export const SettingsPage = () => {
  const { data, importState, updateSettings } = useAppContext();
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('');

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `founder-os-backup-${getTodayKey()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('Backup exported successfully.');
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importState(JSON.parse(text));
      setStatus('Backup restored successfully.');
    } catch (error) {
      console.error(error);
      setStatus('Could not restore this file. Make sure it is valid Founder OS JSON.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div>
      <PageHeader
        description="Theme controls, founder identity, keyboard shortcuts, and JSON backup tools live here."
        title="Settings"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile & Theme</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Founder Name</label>
              <input
                className="input-control"
                onChange={(event) => updateSettings({ founderName: event.target.value || 'Founder' })}
                value={data.settings.founderName}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Theme</label>
              <div className="flex gap-3">
                <Button onClick={() => updateSettings({ theme: 'dark' })} variant={data.settings.theme === 'dark' ? 'primary' : 'secondary'}>
                  Dark
                </Button>
                <Button onClick={() => updateSettings({ theme: 'light' })} variant={data.settings.theme === 'light' ? 'primary' : 'secondary'}>
                  Light
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Backup & Restore</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Export your entire workspace to JSON or restore it from a previous backup.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export JSON Backup
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
              <UploadCloud className="h-4 w-4" />
              Restore JSON Backup
            </Button>
            <input className="hidden" onChange={handleImport} ref={fileInputRef} type="file" accept="application/json" />
          </div>
          {status ? <p className="mt-4 text-sm text-brand-600 dark:text-brand-200">{status}</p> : null}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-brand-500" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <div className="mt-6 space-y-3">
            {SHORTCUTS.map((shortcut) => (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50" key={shortcut.keys}>
                <span className="font-medium text-slate-900 dark:text-white">{shortcut.keys}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-5 w-5 text-brand-500" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Workspace Snapshot</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['Daily Entries', data.dailyEntries.length],
              ['Ideas', data.ideas.length],
              ['Opportunities', data.opportunities.length],
              ['Contacts', data.contacts.length],
              ['Weekly Reviews', data.weeklyReviews.length],
              ['Knowledge Items', data.knowledgeItems.length],
            ].map(([label, value]) => (
              <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-950/50" key={label}>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
