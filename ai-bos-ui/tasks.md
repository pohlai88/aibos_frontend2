# 🔧 AI-BOS Frontend Task Registry

## 🪵 Domain: Journal
- [ ] Build `JournalListPage` in `src/app/journal/` 
- [ ] Add `<JournalTable>` component (RLS-aware rows)
- [ ] Inject `<AuditCue>` chip: shows `updatedBy`, `origin`, `revisionCount`
- [ ] Create Drawer-based `<DiffViewer>` for revisions

## Copilot Prompt Seeds
- Use: `audit cue`, `RLS badge`, `source context`
- Terms: `JournalEntryMeta`, `AuditTrailMeta`, `RevisionDiff`
- Goals: Audit transparency, role-controlled actions, clarity over noise
