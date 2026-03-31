# Founder OS

Founder OS is a founder-focused operating system built with React, Vite, Tailwind CSS, Chart.js, `react-chartjs-2`, React Context, and localStorage.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Core Product

- Dashboard command center with founder score, deep work timer, notes, follow-ups, current book, and AI leverage progress
- Founder Inbox as the default command center for daily priorities across execution, learning, GTM, finance, and AI leverage
- Global command palette with `Ctrl/Cmd+K` or `/` for cross-workspace search, instant navigation, and founder actions
- Daily execution tracker with calendar view and book-learning fields
- Book Learning, Idea Lab, Opportunity Radar, Networking CRM, Weekly Review, Decision Journal, Knowledge Vault
- Unicorn founder operating layers: Company Strategy, Customer Research, Revenue Engine, Finance & Runway, Board & Capital
- Projects / Roadmap / Launch Tracker for active company work, blockers, milestones, and launch windows
- Founder Inbox Automations for local-only daily and weekly CEO briefs generated from the app state
- KPI analytics and a dedicated AI analytics section
- Quick capture with `Q`
- Evening journal with `J`
- New agent modal with `A`
- Dark mode support

## AI Agents Section

The app now includes a full frontend-only AI section with:

- AI Learning Roadmap
- AI Agent Builder
- AI Agent Architect
- AI Experiments
- AI Tools Library
- AI Opportunities
- AI Knowledge Notes
- AI Analytics

It ships with seeded sample data including:

- `Altman Leverage Guide`
- `Daily Practice Checklist`
- 3 sample agents
- 3 sample AI opportunities
- 2 sample experiments
- 5 sample tools

## Storage

Founder OS persists data in localStorage under:

- `founder-os::workspace`
- `founder-os::ai-section`
- `founder-os::migration::ai-v1`

## Migration / Safe Merge

On load, the app:

1. Reads the main workspace key.
2. Reads the mirrored AI section key.
3. Scans existing `founder-os::` namespace keys.
4. Safely preserves existing workspace data and fills in any missing structures for new sections such as AI and Unicorn Ops.
5. Safely merges AI structures into the current workspace without deleting existing user data.
6. Migrates legacy `aiAgents` data into the new `data.ai.agents` structure.

The Settings page includes:

- full workspace JSON export
- AI-only JSON export
- JSON restore
- a manual `Run Safe Merge` action
- a workspace snapshot covering founder, AI, and unicorn-scale operating modules

## Projects & CEO Briefs

- `Projects & Launch Tracker` stores project data inside `founder-os::workspace` as `data.projects`
- `Inbox Automations` stores local brief settings and generated CEO brief history inside `founder-os::workspace` as `data.inboxAutomations`
- Daily and weekly CEO briefs are frontend-only summaries generated from the current local app state
- Auto-generation happens when the app loads or syncs locally with automation settings enabled
- You can also generate a daily or weekly CEO brief manually from the `Inbox Automations` page
- Brief archives and projects can be exported as JSON directly from the UI

## Notes

- No backend is required.
- All AI features are design, planning, analytics, and note-taking tools only. No external APIs are called.
- Founder Inbox automations are local browser automations, not server-side scheduled jobs.
