# Frontend Services

## LLMService (singleton `llmService`)
File: `src/services/LLMService.ts`

Purpose: Connects to a local LLM analysis server, encrypts user data before sending, and decrypts returned insights.

Types exported: `LLMInsights`, `LLMConfig`, `HealthCheckResponse`.

### Methods
- `initialize(): Promise<boolean>`: Discover server (`/health`), perform health check, start periodic checks.
- `analyzeJournalData(logs: Log[], dataType: 'journal'|'patterns'|'virtues'|'media'): Promise<LLMInsights|null>`: Encrypts and sends data for analysis, returns decrypted insights.
- `getConnectionStatus(): { connected: boolean; serverUrl: string | null }`
- `checkHealth(): Promise<boolean>`: Manual health check.
- `destroy(): void`: Cleanup intervals, reset state.

### Usage Example
```ts
import { llmService } from '@/services/LLMService';
import ldb from '@/db';

await llmService.initialize();
const logs = (await ldb.logs.toArray()).slice(-100);
const insights = await llmService.analyzeJournalData(logs, 'journal');
if (insights) {
  console.log(insights.patterns, insights.recommendations);
}
```

Notes:
- Requires encryption keys to be available in local storage (`checkKeys()` must return keys), otherwise throws.
- Shows toast messages on connectivity changes.

---

## SociallyFedConfigService (singleton `sociallyFedConfig`)
File: `src/services/SociallyFedConfigService.ts`

Purpose: Manage user-facing configuration for SociallyFed features, with secure local storage (encrypted when passphrase present).

### Key Types
- `SociallyFedConfig`, `LLMServerConfig`, `PrivacyConfig`, `FeatureToggles`, `AnalysisFrequency`, `VirtueDefinition`, plus configs for media tracking, stoic practices, cybernetics, etc.

### Core Methods
- Lifecycle: `initialize()`, `getConfig()`, `updateConfig(partial)`
- Sections:
  - LLM: `updateLLMConfig`, `validateLLMConfig`, `getLLMUrl`
  - Privacy: `updatePrivacyConfig`, `getPrivacyLevel`, `isDataSharingAllowed(type)`
  - Features: `updateFeatureToggles`, `isFeatureEnabled`
  - Analysis: `updateAnalysisFrequency`, `getAnalysisSchedule`, `shouldRunAnalysis`
  - Virtues: `updateVirtues`, `updateVirtue(name, updates)`, `addCustomVirtue`, `removeVirtue`, `getEnabledVirtues`, `getVirtue(name)`
  - Preferences: `updatePreferences`
  - Media: `updateMediaConsumption`, `addSocialMediaPlatform`, `removeSocialMediaPlatform`, `getMediaConsumptionConfig`, `getPyramidLevelConfig`, `updatePyramidLevel`
  - Stoic: `updateStoicVirtues`, `isStoicVirtueEnabled`, `getStoicVirtueWeight`, `getStoicVirtueConfig`, `getEnabledStoicVirtues`
  - Cybernetics: `updateCybernetics`, `updateFeedbackLoop`, `isFeedbackLoopEnabled`, `getCyberneticConfig`, `getEnabledFeedbackLoops`
  - Extended frameworks: `updateStoicPractices`, `updateCyberneticLoops`, `updateMediaDietTracking`, `updatePatternRecognition`, getters for each
  - Backup: `exportConfig()`, `importConfig(json)`
  - Defaults: `resetToDefaults()`

### Usage Example
```ts
import { sociallyFedConfig } from '@/services/SociallyFedConfigService';

await sociallyFedConfig.initialize();

// Enable local LLM and set endpoint
await sociallyFedConfig.updateLLMConfig({ endpoint: 'localhost', port: 3001, protocol: 'http' });

// Toggle features
await sociallyFedConfig.updateFeatureToggles({ enableAIAnalysis: true, enableVirtueTracking: true });

// Check if analysis should run
if (sociallyFedConfig.shouldRunAnalysis()) {
  // trigger analysis job
}

// Export/import
const backup = sociallyFedConfig.exportConfig();
await sociallyFedConfig.importConfig(backup);
```

Security:
- When a PDP passphrase is set and present in session, configuration is encrypted in localStorage.