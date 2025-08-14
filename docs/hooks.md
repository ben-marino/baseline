# Hooks

## useLLMInsights
File: `src/hooks/useLLMInsights.ts`

Hook to initialize the local LLM service and fetch insights for different data types.

### Signature
```ts
useLLMInsights(options?: {
  autoInitialize?: boolean; // default true
  dataType?: 'journal' | 'patterns' | 'virtues' | 'media'; // default 'journal'
  maxLogs?: number; // default 100
})
```

### Returns
```ts
{
  insights: LLMInsights | null,
  loading: boolean,
  error: string | null,
  connected: boolean,
  lastUpdated: number | null,

  // actions
  getInsights(dataType?): Promise<LLMInsights|null>,
  refreshInsights(): Promise<LLMInsights|null>,
  getAllInsights(): Promise<Record<string, LLMInsights | null> | null>,
  getConnectionStatus(): { connected: boolean; serverUrl: string | null },
  checkHealth(): Promise<boolean>,
  initializeLLM(): Promise<void>,

  // convenience
  hasInsights: boolean,
  isReady: boolean
}
```

### Example
```tsx
import { useLLMInsights } from '@/hooks/useLLMInsights';

export function InsightsPanel() {
  const { insights, loading, error, refreshInsights, isReady } = useLLMInsights({ dataType: 'journal' });

  return (
    <div>
      <button disabled={!isReady} onClick={() => refreshInsights()}>Refresh</button>
      {loading && <p>Loading…</p>}
      {error && <p role="alert">{error}</p>}
      {insights && insights.trends.map(t => (
        <div key={t.metric}>{t.metric}: {t.direction} ({t.confidence})</div>
      ))}
    </div>
  );
}
```

### Specialized Hooks
- `useJournalInsights()`
- `usePatternInsights()`
- `useVirtueInsights()`
- `useMediaInsights()`