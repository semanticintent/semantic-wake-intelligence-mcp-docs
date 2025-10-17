# PropagationService

Layer 3 service that predicts future context relevance using multi-factor scoring.

## Overview

`PropagationService` is the implementation of Layer 3 (Propagation Engine). It predicts WHAT contexts will be needed next by analyzing temporal patterns, causal importance, and access frequency.

**Location**: `src/domain/services/PropagationService.ts`

**Layer**: Layer 3 - Future (WHAT)

**Purpose**: Predict future context relevance for pre-fetching optimization

---

## Constructor

```typescript
constructor(private readonly repository: IContextRepository)
```

**Parameters:**
- `repository`: Database abstraction for context storage

---

## Methods

### `calculatePredictionScore(context: IContextSnapshot): Promise<number>`

Calculate prediction score (0.0-1.0) using multi-factor algorithm.

**Parameters:**
- `context`: Context snapshot to score

**Returns**: Prediction score between 0.0 and 1.0

**Algorithm:**
```typescript
predictionScore = (
  temporalScore * 0.4 +      // Recent access → High score
  causalScore * 0.3 +         // Root cause → High score
  frequencyScore * 0.3        // High access count → High score
)
```

**Example:**
```typescript
const score = await propagationEngine.calculatePredictionScore(context);
// Returns: 0.851 (high likelihood of future access)
```

**Scoring Breakdown:**

#### Temporal Score (40% weight)
```typescript
const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);

if (hoursSinceAccess < 1) return 1.0;        // Just accessed
if (hoursSinceAccess < 6) return 0.8;        // Very recent
if (hoursSinceAccess < 24) return 0.5;       // Recent
if (hoursSinceAccess < 168) return 0.3;      // Past week
return 0.1;                                   // Old
```

#### Causal Score (30% weight)
```typescript
if (isRootCause) return 1.0;              // Root causes very valuable
if (hasMultipleChildren) return 0.8;       // Branch points important
if (isDecisionNode) return 0.9;            // Decisions high-value
if (isLeafNode) return 0.3;                // Leaves less likely revisited
return 0.5;                                // Default
```

#### Frequency Score (30% weight)
```typescript
if (accessCount >= 10) return 1.0;        // Frequently accessed
if (accessCount >= 5) return 0.7;         // Moderate access
if (accessCount >= 2) return 0.4;         // Lightly accessed
return 0.2;                                // Rarely accessed
```

---

### `updateProjectPredictions(project: string, staleThreshold?: number): Promise<number>`

Refresh prediction scores for contexts with stale predictions.

**Parameters:**
- `project`: Project to update
- `staleThreshold`: Hours before prediction is stale (default: 24)

**Returns**: Number of contexts updated

**Example:**
```typescript
// Update stale predictions (older than 24 hours)
const updated = await propagationEngine.updateProjectPredictions('my-project');
console.log(`Updated ${updated} predictions`);

// Aggressive updates (every 6 hours)
const updated = await propagationEngine.updateProjectPredictions('my-project', 6);
```

**Staleness Check:**
```typescript
function isPredictionStale(
  lastPredicted: Date | null,
  threshold: number
): boolean {
  if (!lastPredicted) return true;
  const hoursSince = (Date.now() - lastPredicted.getTime()) / (1000 * 60 * 60);
  return hoursSince >= threshold;
}
```

**Performance**: Processes only stale predictions, batched for efficiency

---

### `getHighValueContexts(project: string, minScore?: number, limit?: number): Promise<IContextSnapshot[]>`

Retrieve contexts most likely to be accessed next.

**Parameters:**
- `project`: Project to search
- `minScore`: Minimum prediction score (default: 0.6)
- `limit`: Maximum contexts to return (default: 5)

**Returns**: Array of contexts sorted by prediction score (highest first)

**Example:**
```typescript
const highValue = await propagationEngine.getHighValueContexts(
  'my-project',
  0.7,
  10
);

// Returns contexts with score >= 0.7, max 10 results
```

**Query:**
```sql
SELECT * FROM context_snapshots
WHERE project = ?
  AND prediction_score >= ?
ORDER BY prediction_score DESC
LIMIT ?
```

**Use Cases:**
- Pre-fetching for cache
- Intelligent recommendations
- Priority loading

---

### `getPropagationStats(project: string): Promise<PropagationStats>`

Get aggregate statistics on prediction quality and patterns.

**Parameters:**
- `project`: Project to analyze

**Returns**: Statistics object

**Return Type:**
```typescript
interface PropagationStats {
  totalContexts: number;
  totalPredicted: number;
  averagePredictionScore: number;
  reasonFrequency: Record<string, number>;
}
```

**Example:**
```typescript
const stats = await propagationEngine.getPropagationStats('my-project');

// Returns:
// {
//   totalContexts: 150,
//   totalPredicted: 42,
//   averagePredictionScore: 0.685,
//   reasonFrequency: {
//     recently_accessed: 38,
//     causal_chain_root: 12,
//     high_access_frequency: 25,
//     active_memory_tier: 35
//   }
// }
```

---

### `calculatePropagationReasons(context: IContextSnapshot): string[]`

Determine why a context has high/low prediction score.

**Parameters:**
- `context`: Context to analyze

**Returns**: Array of reason strings

**Possible Reasons:**
- `recently_accessed` - Accessed in past 24h
- `causal_chain_root` - Root of causal chain
- `high_access_frequency` - Accessed 10+ times
- `moderate_access_frequency` - Accessed 5-9 times
- `active_memory_tier` - In ACTIVE tier
- `decision_node` - ActionType = decision

**Example:**
```typescript
const reasons = propagationEngine.calculatePropagationReasons(context);
// Returns: ['recently_accessed', 'causal_chain_root', 'active_memory_tier']
```

**Logic:**
```typescript
const reasons: string[] = [];

if (hoursSinceAccess < 24) reasons.push('recently_accessed');
if (context.causality?.causedBy === null) reasons.push('causal_chain_root');
if (context.memory?.accessCount >= 10) reasons.push('high_access_frequency');
if (context.memory?.tier === MemoryTier.ACTIVE) reasons.push('active_memory_tier');
if (context.causality?.actionType === 'decision') reasons.push('decision_node');

return reasons;
```

---

## Types

### `PropagationStats`

```typescript
interface PropagationStats {
  totalContexts: number;           // Total contexts in project
  totalPredicted: number;          // Contexts with predictions
  averagePredictionScore: number;  // Mean score
  reasonFrequency: Record<string, number>;  // Reason counts
}
```

---

## Usage Examples

### Pre-Fetching Workflow

```typescript
// 1. Update predictions
await propagationEngine.updateProjectPredictions('my-project');

// 2. Get high-value contexts
const highValue = await propagationEngine.getHighValueContexts(
  'my-project',
  0.7,
  10
);

// 3. Pre-fetch and cache
const cache = new Map();
for (const context of highValue) {
  cache.set(context.id, context);
}

// 4. User requests are now faster
function getContext(id: string) {
  return cache.get(id) || loadFromDatabase(id);
}
```

### Monitor Prediction Quality

```typescript
const stats = await propagationEngine.getPropagationStats('my-project');

console.log(`Prediction Coverage: ${stats.totalPredicted / stats.totalContexts * 100}%`);
console.log(`Average Score: ${stats.averagePredictionScore.toFixed(3)}`);

// Alert if quality is low
if (stats.averagePredictionScore < 0.5) {
  console.warn('Prediction quality is low - review algorithm');
}
```

### Scheduled Updates

```typescript
// Every 12 hours
cron.schedule('0 */12 * * *', async () => {
  const updated = await propagationEngine.updateProjectPredictions(
    'my-project',
    12  // Refresh if older than 12 hours
  );
  console.log(`Updated ${updated} predictions`);
});
```

---

## Best Practices

### 1. Update Predictions Regularly

```typescript
// ✅ Good: Scheduled updates
cron.schedule('0 0 * * *', async () => {
  await propagationEngine.updateProjectPredictions('my-project');
});

// ❌ Bad: Never updating
// Predictions become stale
```

### 2. Tune minScore Threshold

```typescript
// ✅ High confidence only
const critical = await propagationEngine.getHighValueContexts(
  'production-api',
  0.8,
  5
);

// ✅ Exploratory
const exploratory = await propagationEngine.getHighValueContexts(
  'research-project',
  0.4,
  20
);
```

### 3. Measure Effectiveness

```typescript
// Track if predictions are accurate
const predicted = await propagationEngine.getHighValueContexts('my-project');

// Log when predicted contexts are accessed
onContextAccess((id) => {
  if (predicted.some(p => p.id === id)) {
    logPredictionHit(id);
  }
});

// Analyze hit rate
const hitRate = predictionHits / totalPredictions;
console.log(`Prediction accuracy: ${hitRate * 100}%`);
```

---

## Testing

### Unit Test Example

```typescript
describe('PropagationService', () => {
  it('gives high score to recently accessed context', async () => {
    const context: IContextSnapshot = {
      id: '123',
      memory: {
        lastAccessed: new Date(),  // Just now
        accessCount: 10,
        tier: MemoryTier.ACTIVE
      },
      causality: {
        causedBy: null  // Root cause
      }
    };

    const service = new PropagationService(mockRepo);
    const score = await service.calculatePredictionScore(context);

    expect(score).toBeGreaterThan(0.8);  // High score
  });

  it('gives low score to old, rarely accessed context', async () => {
    const context: IContextSnapshot = {
      id: '456',
      memory: {
        lastAccessed: new Date('2024-01-01'),  // Old
        accessCount: 1,  // Rarely accessed
        tier: MemoryTier.EXPIRED
      }
    };

    const service = new PropagationService(mockRepo);
    const score = await service.calculatePredictionScore(context);

    expect(score).toBeLessThan(0.3);  // Low score
  });
});
```

---

## Integration with Other Layers

### With Layer 1 (Causality)

Causal position affects prediction:
- Root causes: +0.3 score
- Decision nodes: +0.2 score
- Branch points: +0.1 score

### With Layer 2 (Memory)

Memory tier affects prediction:
- ACTIVE tier: +0.3 score
- RECENT tier: +0.1 score
- EXPIRED tier: -0.2 score

---

## See Also

- [API Overview](/api/overview) - Service architecture
- [ContextSnapshot](/api/context-snapshot) - Entity with propagation metadata
- [Layer 3: Propagation Engine](/development/layer-3-propagation) - Concepts and design
- [update_predictions tool](/tools/update-predictions) - MCP tool usage
- [get_high_value_contexts tool](/tools/get-high-value-contexts) - MCP tool usage
