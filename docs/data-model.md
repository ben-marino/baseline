# Data Model and Validation

File: `src/db.ts`

## Types
- `Log`: core journaling entry with SociallyFed optional fields
- `VirtueAlignment`: 1–10 values for stoicism, courage, wisdom, justice, temperance; optional context
- `MediaConsumption`: minutes for pyramid levels; optional time/mood fields
- `Patterns`: arrays for triggers/strategies/contexts and AI/user notes; confidence; category; optional flags
- `Cybernetics`: goal progress and feedback arrays
- `PromptMetadata`: prompt category and flags
- `SociallyFedPreferences`: feature toggles and privacy level

## Validation Helpers
- `validateVirtueAlignment(data): VirtueAlignment | null`
- `validateMediaConsumption(data): MediaConsumption | null`
- `validatePatterns(data): Patterns | null`
- `validateCybernetics(data): Cybernetics | null`
- `validatePromptMetadata(data): PromptMetadata | null`
- `validateSociallyFedPreferences(data): SociallyFedPreferences | null`

Each validator returns a typed object on success or `null` on validation failure.

## Defaults
- `getDefaultVirtueAlignment()`
- `getDefaultMediaConsumption()`
- `getDefaultPatterns()`
- `getDefaultCybernetics()`
- `getDefaultPromptMetadata()`
- `getDefaultSociallyFedPreferences()`

## IndexedDB (Dexie)
Tables:
- `logs`: `&timestamp, year, month, day, time, zone, mood, average`
- `sociallyFedPreferences`: `&id`

## Example
```ts
import ldb, { Log, validatePatterns, getDefaultVirtueAlignment } from '@/db';

const newLog: Log = {
  timestamp: Date.now(),
  year: 2025, month: 1, day: 1, time: '12:00 PM', zone: 'local',
  mood: 1, average: 'average',
  virtueAlignment: getDefaultVirtueAlignment(),
};

await ldb.logs.put(newLog);

const maybePatterns = validatePatterns({
  emotionalTriggers: ['news'],
  copingStrategies: ['walk'],
  socialContexts: ['alone'],
  aiGenerated: [],
  userNoted: [],
  confidence: 0.7,
  category: 'behavioral'
});
if (maybePatterns) {
  await ldb.logs.update(newLog.timestamp, { patterns: maybePatterns });
}
```