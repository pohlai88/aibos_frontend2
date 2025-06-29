# 🔧 AI-BOS Frontend Task Registry

## 🪵 Domain: Journal
- [x] Build `JournalListPage` in `src/app/journal/`
- [x] Add `<JournalTable>` component (RLS-aware rows)
- [x] Inject `<AuditCue>` chip: shows `updatedBy`, `origin`, `revisionCount`
- [x] Create Drawer-based `<DiffViewer>` for revisions

## 🚀 Domain: Intelligence
- [x] Add `CopilotFlag` inline suggestions
- [x] Build `InsightLogPanel` for global flag state
- [x] Implement `ReviewActivitySummary` for metrics
- [x] Create `RulesManagementPanel` for rule lifecycle
- [x] Add `LedgerTimeline` for audit trail
- [x] Export rules, flags, and feedback as JSON/CSV

## 🛠 Pending Enhancements
- [ ] Multi-entity policy propagation
- [ ] Anomaly detection for unusual patterns
- [ ] Real-time notifications for uncovered entries
- [ ] BI tool integration (PowerBI, Tableau)

## Copilot Prompt Seeds
- Use: `audit cue`, `RLS badge`, `source context`
- Terms: `JournalEntryMeta`, `AuditTrailMeta`, `RevisionDiff`
- Goals: Audit transparency, role-controlled actions, clarity over noise
