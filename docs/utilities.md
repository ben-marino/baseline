# Utilities and Helpers

File: `src/helpers.tsx`

## Date and Formatting
- `getTime(): number`: Unix seconds now
- `getDateFromLog(log: Log): DateTime`
- `createPoints(data: Log[], colors: AnyMap): JSX.Element[]`
- `timeToString(time: number): string // mm:ss`

## Toast and Network
- `toast(message: string, gravity?: 'top'|'bottom', duration?: number)`
- `networkFailure(message: string): boolean`

## Auth/Keys and Settings
- `checkKeys(): false | 'upfront' | 'discreet' | { visibleKey, encryptedKeyVisible }`
- `setEkeys(keys: string, pwd: string)`: Store encrypted keys and session pwd
- `setSettings(key: string, value: any)` / `parseSettings(): AnyMap`
- `checkPassphrase(passphrase: string): boolean`
- `goBackSafely()`

## Requests
- `BASE_URL = 'https://api.getbaseline.app'`
- `makeRequest(route: string, user: User, body: AnyMap, setSubmitting?, failSilently?): Promise<boolean>`

Example:
```ts
const ok = await makeRequest('accounts/sync', user, { platform: 'web' });
```

## Crypto
- `encrypt(data: string, key: string): string`
- `decrypt(data: string, key: string, signOut=true): string`
- `changeDatabaseEncryption(oldPwdHash: string, newPwdPlain: string): Promise<void>`

## Search/Filter
- `filterLogs(searchText, numberFilter, averageFilter, imageFilter, logs, setFilteredLogs)`

## Fingerprint
- `fingerprint(): number` — stable murmur-based fingerprint used with `/analytics/beacon`

## SociallyFed Migration & Stats
- `migrateLogToSociallyFed(log: Log): Log`
- `validateAndMigrateLog(log: any): Log | null`
- `migrateAllLogs(): Promise<void>`
- `migrateSociallyFedData(): Promise<{ total, migrated, errors, features }>`
- `getUserMigrationPreferences(): Promise<SociallyFedPreferences>`
- `updateUserMigrationPreferences(preferences: Partial<SociallyFedPreferences>): Promise<void>`
- `getSociallyFedStats(): Promise<{ totalLogs, logsWithVirtues, logsWithMedia, logsWithPatterns, logsWithCybernetics, logsWithPrompts, userPreferences }>`

Example: Update preferences
```ts
import { updateUserMigrationPreferences } from '@/helpers';
await updateUserMigrationPreferences({ enableMediaTracking: false, privacyLevel: 'minimal' });
```