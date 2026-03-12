import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from './context/AppContext';
import { NAV_ITEMS } from './utils/constants';
import { DashboardPage } from './pages/DashboardPage';
import { DailyExecutionPage } from './pages/DailyExecutionPage';
import { BookLearningPage } from './pages/BookLearningPage';
import { IdeaLabPage } from './pages/IdeaLabPage';
import { OpportunityRadarPage } from './pages/OpportunityRadarPage';
import { NetworkingCRMPage } from './pages/NetworkingCRMPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { DecisionJournalPage } from './pages/DecisionJournalPage';
import { KnowledgeVaultPage } from './pages/KnowledgeVaultPage';
import { KPIAnalyticsPage } from './pages/KPIAnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIAgentsPage } from './pages/AIAgentsPage';
import { AIAgentBuilderPage } from './pages/AIAgentBuilderPage';
import { AIAgentArchitectPage } from './pages/AIAgentArchitectPage';
import { AILearningRoadmapPage } from './pages/AILearningRoadmapPage';
import { AIAgentExperimentsPage } from './pages/AIAgentExperimentsPage';
import { AIToolsLibraryPage } from './pages/AIToolsLibraryPage';
import { AIAgentNotesPage } from './pages/AIAgentNotesPage';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { EveningJournalModal } from './components/EveningJournalModal';

const DEFAULT_PAGE = 'dashboard';

const resolvePage = () => {
  const hash = window.location.hash.replace('#', '');
  const isValid = NAV_ITEMS.some((item) => item.id === hash) || hash.startsWith('ai-agents');
  return isValid ? hash : DEFAULT_PAGE;
};

function App() {
  const { addEveningJournal, addQuickCapture, todayKey } = useAppContext();
  const [activePage, setActivePage] = useState(resolvePage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash !== `#${activePage}`) {
      window.location.hash = activePage;
    }
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => setActivePage(resolvePage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page, anchorId) => {
    setActivePage(page);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (anchorId) {
      window.setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 140);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

      if (event.key === 'Escape') {
        setSidebarOpen(false);
        setQuickCaptureOpen(false);
        setJournalOpen(false);
      }

      if (!editing && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === 'q') {
        event.preventDefault();
        setQuickCaptureOpen(true);
      }

      if (!editing && event.shiftKey && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setJournalOpen(true);
      }

      if (!editing && event.altKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        navigateTo('book-learning');
        return;
      }

      if (!editing && event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        navigateTo('ai-agents');
        return;
      }

      if (!editing && event.altKey) {
        const map = {
          1: 'dashboard',
          2: 'daily-execution',
          3: 'idea-lab',
          4: 'opportunity-radar',
          5: 'networking-crm',
          6: 'weekly-review',
          7: 'decision-journal',
          8: 'knowledge-vault',
          9: 'kpi-analytics',
          0: 'settings',
        };

        if (map[event.key]) {
          event.preventDefault();
          navigateTo(map[event.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAction = (action) => {
    if (action === 'idea') navigateTo('idea-lab', 'idea-form');
    if (action === 'work') navigateTo('daily-execution', 'daily-entry-form');
    if (action === 'book') navigateTo('book-learning', 'book-form');
    if (action === 'contact') navigateTo('networking-crm', 'contact-form');
    if (action === 'journal') setJournalOpen(true);
  };

  const pageTitle = useMemo(() => NAV_ITEMS.find((item) => item.id === activePage)?.label || 'Dashboard', [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'daily-execution':
        return <DailyExecutionPage />;
      case 'book-learning':
        return <BookLearningPage />;
      case 'idea-lab':
        return <IdeaLabPage />;
      case 'opportunity-radar':
        return <OpportunityRadarPage />;
      case 'networking-crm':
        return <NetworkingCRMPage />;
      case 'weekly-review':
        return <WeeklyReviewPage />;
      case 'decision-journal':
        return <DecisionJournalPage />;
      case 'knowledge-vault':
        return <KnowledgeVaultPage />;
      case 'kpi-analytics':
        return <KPIAnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'ai-agents':
        return <AIAgentsPage onNavigate={navigateTo} />;
      case 'ai-agents/builder':
        return <AIAgentBuilderPage onNavigate={navigateTo} />;
      case 'ai-agents/architect':
        return <AIAgentArchitectPage onNavigate={navigateTo} />;
      case 'ai-agents/roadmap':
        return <AILearningRoadmapPage onNavigate={navigateTo} />;
      case 'ai-agents/experiments':
        return <AIAgentExperimentsPage onNavigate={navigateTo} />;
      case 'ai-agents/library':
        return <AIToolsLibraryPage onNavigate={navigateTo} />;
      case 'ai-agents/notes':
        return <AIAgentNotesPage onNavigate={navigateTo} />;
      case 'dashboard':
      default:
        return <DashboardPage onOpenJournal={() => setJournalOpen(true)} onOpenQuickCapture={() => setQuickCaptureOpen(true)} onQuickAction={handleQuickAction} />;
    }
  };

  return (
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100">
      <Sidebar activePage={activePage} onClose={() => setSidebarOpen(false)} onNavigate={navigateTo} open={sidebarOpen} />
      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onOpenJournal={() => setJournalOpen(true)} onOpenQuickCapture={() => setQuickCaptureOpen(true)} title={pageTitle} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{renderPage()}</main>
      </div>

      <QuickCaptureModal onClose={() => setQuickCaptureOpen(false)} onSave={addQuickCapture} open={quickCaptureOpen} />
      <EveningJournalModal onClose={() => setJournalOpen(false)} onSave={addEveningJournal} open={journalOpen} todayKey={todayKey} />
    </div>
  );
}

export default App;
