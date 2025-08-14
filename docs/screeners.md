# Screeners

Core interface: `src/screeners/screener.ts`

```ts
interface Screener {
  _key: string; // survey key sent to backend
  _currentQuestion: number;
  _clinicalName: string;
  _questions: any[];
  _results: any;
  nextQuestion(answer?: number): Modifier | Done;
  getRecommendation(): JSX.Element;
  getClinicalInformation(): string;
  getPriority(): Priority;
  graph?: (props: GraphProps) => JSX.Element;
  processDataForGraph?: (data?: AnyMap) => AnyMap[];
}
```

Available implementations:
- `SPF()` → `_key: 'spfv1'`, name: SPF-12. Resilience screener. Graph: `ResilienceGraph`.
- `DASS()` → `_key: 'dassv1'`, Depression Anxiety Stress Scales.
- `EDE_QS()` → `_key: 'edev1'`, Eating Disorder Examination Questionnaire (short).
- `HARM()` → `_key: 'harmv1'`, self harm check.
- `CAGE_AID()` → `_key: 'cagev1'`, substance use disorder screener.
- `WAST()` → `_key: 'wastv1'`, abuse screener.

Helpers:
- `generateScreenerRanges(config: number[], labels: string[]): string[]`
- `normalizeRange(value: number, range: number[]): number`

Flow:
- Instantiate screener, call `nextQuestion()` with responses to progress.
- When `done`, submit `{ key: screener._key, results }` to backend `/survey`.

Example:
```ts
const s = SPF();
let step = s.nextQuestion();
// render step.question and step.answers
step = s.nextQuestion(3); // user chose value 3
// ... when done
if ('done' in step && step.done) {
  const results = step._results;
  // POST to /survey with key 'spfv1'
}
```