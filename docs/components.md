# Components

This section lists key public components and where they live. Consult source for full props until a typed props interface is added everywhere.

## SociallyFed Components (`src/components/SociallyFed`)
- `EnhancedPatternInsights`: Advanced analysis UI for patterns
- `PatternInsights`: Pattern list and summaries
- `MediaConsumptionPyramid`: Visual representation of media pyramid levels
- `VirtueAlignmentRadar`: Radar chart for virtues
- `WeeklyProgress`: Weekly progress overview

## Graphs (`src/components/graphs`)
- `BaselineGraph`: Baseline rolling average graph
- `DASSGraph`: DASS visualization
- `ResilienceGraph`: Resilience graph
- `InnerGraph`, `helpers`, `useGraphConfig`

## Journal (`src/components/Journal`)
- `RecordJournal`: Recording and attaching journal metadata
- `SearchSpotify`: Song search UI
- `SociallyFedJournalExtensions`: UI to capture virtues, media, patterns, cybernetics, and prompt metadata
- `StartJournal`, `WriteJournal`, `FinishJournal`, `Negative5`, `InfoBadge`

## Summary (`src/components/Summary`)
- `MoodLogList`, `MoodLogCard`, `StaticMoodLogCard`
- `SearchAndFilter`
- `Week/WeekMoodGraph`, `Week/WeekSummary`, `Week/WeekMoodLogList`
- `Month/MonthSummary`, `Month/MonthCalendar`, `Month/MonthMoodLogList`
- `AudioViewer`, `ImageCarousel`

## Settings (`src/components/Settings`)
- `SociallyFedSettings`, `SociallyFedSettingsEnhanced`, `SociallyFedSettingsBox`
- PDP: `PDP`, `SetPassphrase`, `ChangePassphrase`, `RemovePassphrase`, `UnlockCmp`
- Notifications: `NotificationEditor`
- `DebugButtons`, `SettingsBox`

## Misc
- `Textarea`, `Dialog`, `EndSpacer`, `Help`, `KeyboardSpacer`, `ThreeBox`

### Example usage
```tsx
import { SociallyFedJournalExtensions } from '@/components/Journal/SociallyFedJournalExtensions';

<SociallyFedJournalExtensions
  value={journalExtras}
  onChange={setJournalExtras}
/>
```

Note: Many components use internal state and context from the app; prefer reviewing usage in `src/pages/*` to integrate them correctly.