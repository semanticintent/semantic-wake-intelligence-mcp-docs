# get_high_value_contexts

Retrieve contexts most likely to be accessed next (predicted high-value).

## Overview

The `get_high_value_contexts` tool is part of Layer 3 (Propagation Engine). It returns contexts with the highest prediction scores - those most likely to be needed soon based on temporal patterns, causal importance, and access frequency.

**Layer**: Layer 3 - Propagation Engine (Future)

**Purpose**: Pre-fetch and prioritize likely-to-be-accessed contexts

**Temporal Focus**: Future - predicting what will be needed

---

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project` | string | Yes | - | Project to search |
| `minScore` | number | No | 0.6 | Minimum prediction score (0.0-1.0) |
| `limit` | number | No | 5 | Maximum contexts to return |

### Parameter Details

#### `project`
Project identifier to search within.

#### `minScore`
Minimum prediction score threshold. Only contexts with score >= minScore are returned.

**Recommendations:**
- `0.8`: Very high confidence only
- `0.6`: Default, balanced
- `0.4`: Cast wider net

#### `limit`
Maximum number of contexts to return. Results are sorted by prediction score (highest first).

---

## Returns

Formatted text with high-value contexts:

```
🎯 High-Value Contexts (2 found):

**mobile-app-auth** (Score: 0.851)
Decision to use OAuth2 with PKCE for mobile app authentication
Reasons: recently_accessed, causal_chain_root, active_memory_tier

**mobile-app-auth** (Score: 0.723)
Research findings on OAuth2 security best practices
Reasons: recently_accessed, high_access_frequency, decision_node
```

If no high-value contexts found:
```
No high-value contexts found for mobile-app-auth (min score: 0.6)
```

---

## Examples

### Basic Usage

```typescript
get_high_value_contexts({
  project: "api-service"
})
```

Returns top 5 contexts with score >= 0.6.

---

### High Confidence Only

```typescript
get_high_value_contexts({
  project: "critical-service",
  minScore: 0.8,
  limit: 3
})
```

Only very confident predictions.

---

### Pre-Fetching Workflow

```typescript
// 1. Update predictions
update_predictions({ project: "my-project" });

// 2. Get high-value contexts
const highValue = get_high_value_contexts({
  project: "my-project",
  minScore: 0.7,
  limit: 10
});

// 3. Pre-fetch and cache them
// (In your application code)
const cache = new Map();
for (const context of highValue) {
  cache.set(context.id, context);
}

// 4. When user requests, check cache first
function getContext(id) {
  return cache.get(id) || loadFromDatabase(id);
}
```

---

## Use Cases

### 1. Performance Optimization

Pre-load likely contexts before user requests them:

```typescript
// Background task
const highValue = get_high_value_contexts({
  project: "user-session",
  minScore: 0.7
});

// Cache these contexts
preFetchToCache(highValue);

// User requests are now faster (cache hits)
```

### 2. Intelligent Recommendations

Show users what they'll likely need:

```typescript
const recommendations = get_high_value_contexts({
  project: "current-work",
  minScore: 0.6,
  limit: 5
});

// Display as "You might need these contexts"
displayRecommendations(recommendations);
```

### 3. Priority Loading

Load high-value contexts first:

```typescript
// High priority (load immediately)
const critical = get_high_value_contexts({
  project: "my-project",
  minScore: 0.8,
  limit: 5
});

loadImmediately(critical);

// Low priority (load later)
const others = load_context({
  project: "my-project",
  limit: 20
});

loadInBackground(others);
```

---

## Prediction Reasons

Each context includes reasons explaining its score:

| Reason | Meaning | Impact |
|--------|---------|--------|
| `recently_accessed` | Accessed in past 24h | High temporal score |
| `causal_chain_root` | Root of causal chain | High causal score |
| `high_access_frequency` | Accessed 10+ times | High frequency score |
| `active_memory_tier` | In ACTIVE tier | Tier bonus |
| `decision_node` | ActionType = decision | Action type bonus |
| `moderate_access_frequency` | Accessed 5-9 times | Medium frequency |

**Example:**
```
Reasons: recently_accessed, causal_chain_root, active_memory_tier
```
This context scores high because it's:
- Recently used (temporal)
- A root cause (causal)
- In active tier (recency)

---

## Score Interpretation

| Score Range | Interpretation | Action |
|-------------|----------------|--------|
| 0.9 - 1.0 | Almost certain | Pre-fetch aggressively |
| 0.7 - 0.9 | Highly likely | Pre-fetch |
| 0.5 - 0.7 | Moderate | Monitor |
| 0.3 - 0.5 | Low | Standard loading |
| 0.0 - 0.3 | Unlikely | Low priority |

---

## Integration with Layer 3

### After Updating Predictions

```typescript
// Refresh predictions
update_predictions({ project: "my-project" });

// Get fresh high-value contexts
get_high_value_contexts({ project: "my-project" });
```

### Monitor Prediction Quality

```typescript
// Get high-value contexts
const highValue = get_high_value_contexts({ project: "my-project" });

// Check if they're actually being accessed
// (Track cache hits in your app)

// Get overall quality metrics
get_propagation_stats({ project: "my-project" });
```

---

## Performance

- **Latency**: 20-100ms (indexed query on prediction_score)
- **Scalability**: Efficient even with 1000+ contexts

**Why it's fast:**
```sql
-- Uses index on prediction_score DESC
SELECT * FROM context_snapshots
WHERE project = ?
  AND prediction_score >= ?
ORDER BY prediction_score DESC
LIMIT ?
```

---

## Best Practices

### 1. Tune minScore for Your Use Case

```typescript
// ✅ Critical paths: High threshold
get_high_value_contexts({
  project: "production-api",
  minScore: 0.8
});

// ✅ Exploratory: Lower threshold
get_high_value_contexts({
  project: "research",
  minScore: 0.4
});
```

### 2. Update Predictions First

```typescript
// ✅ Good: Fresh predictions
update_predictions({ project: "my-project" });
get_high_value_contexts({ project: "my-project" });

// ❌ Bad: Stale predictions
get_high_value_contexts({ project: "my-project" });
// Predictions might be days old
```

### 3. Measure Effectiveness

Track if predictions are accurate:

```typescript
const predicted = get_high_value_contexts({ project: "my-project" });

// Log when these are actually accessed
logCacheHit(contextId);

// Analyze hit rate
const hitRate = cacheHits / totalPredictions;
// If hitRate < 0.5, consider adjusting minScore
```

### 4. Combine with Load Context

```typescript
// High-value contexts (predicted)
const predicted = get_high_value_contexts({
  project: "my-project",
  minScore: 0.7
});

// Recent contexts (chronological)
const recent = load_context({
  project: "my-project",
  limit: 5
});

// Merge both for comprehensive coverage
const combined = [...predicted, ...recent];
```

---

## Comparison with load_context

| Feature | get_high_value_contexts | load_context |
|---------|------------------------|--------------|
| **Order** | By prediction score | By timestamp |
| **Filter** | Score >= minScore | None |
| **Layer** | Layer 3 (Future) | Core |
| **Use** | Pre-fetching | Recent history |

---

## See Also

- [update_predictions](/tools/update-predictions) - Refresh prediction scores
- [get_propagation_stats](/tools/get-propagation-stats) - Monitor prediction quality
- [load_context](/tools/load-context) - Get recent contexts chronologically
- [Layer 3: Propagation Engine](/development/layer-3-propagation) - Understanding predictions
