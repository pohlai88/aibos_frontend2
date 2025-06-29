# AI-BOS™ Accounting Ledger UI

AI-BOS™ is a governance-grade, audit-aware SaaS accounting ledger UI built with Next.js, TypeScript, TailwindCSS, and strict linting. It features modular, role-based, and audit-focused capabilities designed for compliance, operational clarity, and extensibility.

## Features

### Core Features
- **Modular UI Components:** Includes `JournalTable`, `JournalTableRow`, `JournalRowActions`, `EntryStatusBadge`, and more.
- **Role-Based Navigation:** Role-aware views with access control and policy kernel.
- **Audit Banners:** Global audit cues and revision tracking.
- **Dark Mode:** User-friendly dark mode toggle.
- **Client-Side Sorting & Filtering:** Enhanced journal state management with local persistence.

### Audit & Revision
- **Audit Trail:** Field-level diffs, reversion, and revision tracking.
- **Revision Drawer:** Detailed views of changes and audit events.

### Session & Dev Tools
- **Session Snapshot Export/Import:** Save and load session states.
- **Dev Tools:** Includes `DevPresetSwitcher`, `DevPolicyBanner`, and `DevSnapshotLoader`.

### Copilot Assist & Suggestions
- **Copilot Assist Mode:** Inline suggestions with `CopilotFlag` and `InsightLogPanel`.
- **Global Flag State:** Resolve/ignore actions with localStorage persistence.

### Review & Oversight
- **Feedback Dialog:** Human feedback integration.
- **Review Status:** Highlight and filter “Needs Review” entries.
- **Bulk Triage Panel:** Batch triage of Copilot flags.
- **Metrics & Scoring:** Reviewer metrics and aggregate stats with `computeCopilotScore` utility.

## Advanced Features

### Rule Management
- **Declarative Rules:** JSON-based no-code authoring.
- **AI-Driven Suggestions:** Copilot heuristic for rule creation.
- **Rule Lifecycle:** Version history, grouping, tagging, and ownership.

### Export & Backup
- **Export Intelligence:** Export rules, flags, and feedback as JSON/CSV.

### Timeline & Evolution
- **Ledger Timeline:** Chronological activity stream for rules, flags, and feedback.

### Real-Time Alerts
- **Uncovered Entries:** Highlight entries not covered by any rule.

## Development

### Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Project Structure

- **Components:** Modular UI components for journal entries, assist mode, and review.
- **Context:** Centralized state management for roles, session origin, and Copilot flags.
- **Utilities:** Helper functions for session snapshots, CSV export, and scoring.

### Deployment

Deploy on [Vercel](https://vercel.com) for production-ready hosting.

## Next Steps

- Final user-driven testing and QA.
- Optional enhancements: anomaly detection, multi-entity support, plugin APIs, compliance dashboards.
