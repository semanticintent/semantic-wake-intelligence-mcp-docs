# Layer 3: Propagation Engine (Future - WHAT)

The **Propagation Engine** is WakeIQX's predictive intelligence layer. It answers the question: **"What contexts will be needed next?"**

n::: tip Semantic Intent Research
The Propagation Engine answers **future-oriented questions**: "What will be needed next?" This implements semantic intent principles where context carries forward-looking metadata about its predicted utility, enabling proactive intelligence.

📚 [Explore the research →](https://semanticintent.dev/papers/semantic-intent-ssot)
:::
By analyzing access patterns, causal relationships, and temporal signals, the Propagation Engine predicts which contexts are most likely to be accessed soon, enabling **pre-fetching** and **intelligent prioritization**.

## Core Concept

Not all contexts are created equal. Some are more likely to be accessed in the near future based on:
- **Temporal momentum**: Recently accessed → likely to be accessed again
- **Causal importance**: Root causes → more valuable than leaf nodes
- **Access frequency**: Frequently accessed → patterns suggest reuse

The Propagation Engine combines these signals into a **prediction score** (0.0 to 1.0) that represents the **probability** of future access.

```
High Score (0.8+)  → Pre-fetch and cache
Medium Score (0.5-0.8) → Monitor for access patterns
Low Score (< 0.5) → Standard retrieval
```

---

## Prediction Scoring

### Multi-Factor Scoring Algorithm

The Propagation Engine calculates prediction scores using weighted factors:

```typescript
predictionScore = (
  temporalScore * 0.4 +      // Recent access patterns
  causalScore * 0.3 +         // Position in causal chain
  frequencyScore * 0.3        // Historical access frequency
)
```

### 1. Temporal Score (40% weight)

Based on **how recently** the context was accessed:

```typescript
const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);

if (hoursSinceAccess < 1) return 1.0;        // Just accessed
if (hoursSinceAccess < 6) return 0.8;        // Very recent
if (hoursSinceAccess < 24) return 0.5;       // Recent
if (hoursSinceAccess < 168) return 0.3;      // Past week
return 0.1;                                   // Old
```

**Insight**: Contexts accessed in the past hour have 10x the temporal score of week-old contexts.

---

### 2. Causal Score (30% weight)

Based on **position in the causal chain**:

```typescript
if (isRootCause) return 1.0;              // Root causes are most valuable
if (hasMultipleChildren) return 0.8;       // Branch points are important
if (isDecisionNode) return 0.9;            // Decisions are high-value
if (isLeafNode) return 0.3;                // Leaf nodes less likely to be revisited
return 0.5;                                // Default
```

**Insight**: Root causes and decision nodes are strong predictors of future relevance.

---

### 3. Frequency Score (30% weight)

Based on **how often** the context has been accessed:

```typescript
if (accessCount >= 10) return 1.0;        // Frequently accessed
if (accessCount >= 5) return 0.7;         // Moderate access
if (accessCount >= 2) return 0.4;         // Lightly accessed
return 0.2;                                // Rarely accessed
```

**Insight**: Contexts accessed 10+ times are likely to be accessed again.

---

## Propagation Reasons

Each predicted context includes **reasons** explaining **why** it has a high score:

```typescript
propagationReasons: [
  "recently_accessed",           // Temporal signal
  "causal_chain_root",           // Causality signal
  "high_access_frequency",       // Frequency signal
  "active_memory_tier",          // Memory tier signal
  "decision_node"                // Action type signal
]
```

This transparency helps users understand predictions and debug unexpected scores.

---

## Use Cases

### 1. Pre-fetching High-Value Contexts

Optimize performance by loading likely-to-be-accessed contexts ahead of time:

```typescript
// Get high-value contexts
const highValue = await get_high_value_contexts({
  project: "my-project",
  minScore: 0.7,
  limit: 10
});

// Pre-fetch and cache them
const cache = new Map();
for (const context of highValue) {
  cache.set(context.id, context);
}

// When user requests context, check cache first
function getContext(id: string) {
  return cache.get(id) || loadFromDatabase(id);
}
```

---

### 2. Intelligent Query Prioritization

Return most relevant contexts first:

```typescript
// Standard load (sorted by time)
const contexts = await load_context({ project: "my-project", limit: 5 });

// Propagation-aware load (sorted by prediction score)
const predicted = await get_high_value_contexts({
  project: "my-project",
  minScore: 0.5,
  limit: 5
});

// Predicted contexts are more likely to be what user needs
```

---

### 3. Monitoring Prediction Quality

Track how well predictions perform:

```typescript
const stats = await get_propagation_stats({ project: "my-project" });

// {
//   totalContexts: 150,
//   totalPredicted: 42,
//   averagePredictionScore: 0.685,
//   reasonFrequency: {
//     recently_accessed: 38,
//     causal_chain_root: 12,
//     high_access_frequency: 25,
//     ...
//   }
// }

// Monitor average score over time
if (stats.averagePredictionScore < 0.5) {
  console.warn("Prediction quality declining - consider retraining");
}
```

---

## MCP Tools

### [`update_predictions`](/tools/update-predictions)
Refresh prediction scores for a project's contexts.

**Input:**
- `project` (string): Project to update
- `staleThreshold` (number, optional): Hours before prediction is stale (default: 24)

**Returns:**
- Number of contexts updated

**Example:**
```typescript
// Refresh predictions for all contexts older than 24 hours
update_predictions({
  project: "my-project",
  staleThreshold: 24
})

// More aggressive: refresh predictions older than 6 hours
update_predictions({
  project: "my-project",
  staleThreshold: 6
})
```

**When to use:**
- After significant activity (many new contexts)
- Before important queries
- As part of scheduled maintenance

---

### [`get_high_value_contexts`](/tools/get-high-value-contexts)
Retrieve contexts most likely to be accessed next.

**Input:**
- `project` (string): Project to search
- `minScore` (number, optional): Minimum prediction score (default: 0.6)
- `limit` (number, optional): Max contexts to return (default: 5)

**Returns:**
- Contexts sorted by prediction score (highest first)
- Each context includes:
  - Prediction score
  - Propagation reasons
  - Full context data

**Example:**
```typescript
// Get top 5 high-value contexts
get_high_value_contexts({
  project: "my-project",
  minScore: 0.6,
  limit: 5
})

// Get all contexts with score > 0.8
get_high_value_contexts({
  project: "my-project",
  minScore: 0.8,
  limit: 100
})
```

---

### [`get_propagation_stats`](/tools/get-propagation-stats)
Get analytics on prediction quality and patterns.

**Input:**
- `project` (string): Project to analyze

**Returns:**
- Total contexts
- Number of contexts with predictions
- Average prediction score
- Frequency of each propagation reason

**Example:**
```typescript
get_propagation_stats({
  project: "my-project"
})

// Returns:
// Total contexts: 150
// Contexts predicted: 42 (28%)
// Average prediction score: 0.685
//
// Propagation Reasons:
//   - recently_accessed: 38
//   - causal_chain_root: 12
//   - high_access_frequency: 25
//   - active_memory_tier: 35
```

---

## Implementation Details

### Database Schema

Layer 3 uses these columns in `context_snapshots`:

```sql
-- Propagation columns
prediction_score REAL,          -- 0.0 to 1.0
prediction_reasons TEXT,        -- JSON array of reasons
last_predicted TEXT,            -- ISO timestamp of last prediction update

-- Index for efficient queries
CREATE INDEX idx_prediction_score ON context_snapshots(prediction_score DESC);
```

### Prediction Algorithm

```typescript
async calculatePredictionScore(snapshot: IContextSnapshot): Promise<number> {
  // Temporal score (40%)
  const temporalScore = this.calculateTemporalScore(snapshot.lastAccessed);

  // Causal score (30%)
  const causalScore = await this.calculateCausalScore(snapshot);

  // Frequency score (30%)
  const frequencyScore = this.calculateFrequencyScore(snapshot.accessCount);

  // Weighted combination
  return (
    temporalScore * 0.4 +
    causalScore * 0.3 +
    frequencyScore * 0.3
  );
}
```

### Staleness Detection

Predictions become stale as access patterns change:

```typescript
function isPredictionStale(
  lastPredicted: Date | null,
  staleThreshold: number = 24
): boolean {
  if (!lastPredicted) return true;

  const hoursSincePrediction = (Date.now() - lastPredicted.getTime()) / (1000 * 60 * 60);
  return hoursSincePrediction >= staleThreshold;
}
```

**Recommendation**: Refresh predictions every 12-24 hours for optimal accuracy.

---

## Design Philosophy

### Transparent Predictions

Every prediction includes **reasons** explaining the score:
- ✅ Users can understand why a context has high/low score
- ✅ Developers can debug unexpected predictions
- ✅ System behavior is observable and auditable

### Conservative by Default

Prediction scores are intentionally conservative:
- Default `minScore: 0.6` ensures high precision
- False positives (caching unnecessary contexts) are acceptable
- False negatives (missing important contexts) are minimized

### Performance-Aware

- **Batch updates**: Predictions are recalculated in batches
- **Indexed queries**: Prediction score column is indexed for fast retrieval
- **Lazy evaluation**: Only update stale predictions

---

## Best Practices

### 1. Run Predictions Regularly

Schedule prediction updates:

```typescript
// Every 12 hours: Refresh stale predictions
cron.schedule('0 */12 * * *', async () => {
  await update_predictions({
    project: "my-project",
    staleThreshold: 12
  });
});
```

### 2. Tune the minScore Threshold

Adjust based on your use case:

```typescript
// High precision: Only very confident predictions
get_high_value_contexts({ minScore: 0.8 });

// Balanced: Default setting
get_high_value_contexts({ minScore: 0.6 });

// High recall: Cast a wider net
get_high_value_contexts({ minScore: 0.4 });
```

### 3. Monitor Prediction Quality

Track effectiveness over time:

```typescript
async function monitorPredictions(project: string) {
  const stats = await get_propagation_stats({ project });

  // Log metrics
  console.log({
    avgScore: stats.averagePredictionScore,
    coverage: stats.totalPredicted / stats.totalContexts,
    topReasons: Object.entries(stats.reasonFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
  });
}
```

### 4. Combine with Other Layers

Use propagation predictions alongside causality and memory:

```typescript
// Get high-value contexts
const predicted = await get_high_value_contexts({
  project: "my-project",
  minScore: 0.7
});

// Filter to ACTIVE/RECENT tiers only (Layer 2)
const relevant = predicted.filter(ctx =>
  ctx.memoryTier === "ACTIVE" || ctx.memoryTier === "RECENT"
);

// Build causal chains for each (Layer 1)
for (const ctx of relevant) {
  const chain = await build_causal_chain({ snapshotId: ctx.id });
  console.log("High-value causal chain:", chain);
}
```

---

## Integration with Other Layers

### With Layer 1 (Causality)

Causal position influences prediction score:
- **Root causes** → +0.3 score boost
- **Decision nodes** → +0.2 score boost
- **Branch points** → +0.1 score boost

### With Layer 2 (Memory)

Memory tier influences prediction score:
- **ACTIVE tier** → +0.3 score boost
- **RECENT tier** → +0.1 score boost
- **EXPIRED tier** → -0.2 score penalty

This creates synergy: high-value contexts are accessed frequently → stay in ACTIVE tier → get higher prediction scores → get pre-fetched → accessed more easily.

---

## Future Enhancements

Potential improvements to the Propagation Engine:

1. **Machine Learning Models**: Train on actual access patterns
2. **User Behavior Profiling**: Personalize predictions per user
3. **Time-of-Day Patterns**: Predict based on work schedules
4. **Project Context**: Different projects have different patterns
5. **Semantic Similarity**: Predict based on content similarity

---

## Next Steps

- [Learn about Layer 1: Causality Engine →](/development/layer-1-causality)
- [Learn about Layer 2: Memory Manager →](/development/layer-2-memory)
- [Explore propagation tools →](/tools/overview)
- [View API Reference →](/api/propagation-service)
