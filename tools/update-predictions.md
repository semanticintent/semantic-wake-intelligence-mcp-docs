# update_predictions

Refresh prediction scores for a project's contexts.

## Overview

The `update_predictions` tool is part of Layer 3 (Propagation Engine). It recalculates prediction scores for contexts that have stale predictions or no predictions yet.

**Layer**: Layer 3 - Propagation Engine (Future)

**Purpose**: Keep prediction scores fresh and accurate

**Temporal Focus**: Future - predicting what will be needed

---

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project` | string | Yes | - | Project to update predictions for |
| `staleThreshold` | number | No | 24 | Hours before prediction is considered stale |

### Parameter Details

#### `project`
The project identifier to update predictions for.

#### `staleThreshold`
How old (in hours) a prediction can be before it's refreshed. Lower values = more aggressive updates.

**Examples:**
- `6`: Refresh predictions older than 6 hours (aggressive)
- `24`: Refresh daily (default, balanced)
- `168`: Refresh weekly (conservative)

---

## Returns

Formatted text with update count:

```
🔮 Updated predictions for authentication-refactor

Refreshed 15 prediction(s) (stale threshold: 24 hours)
```

---

## Examples

### Basic Usage

```typescript
update_predictions({
  project: "api-service"
})
```

Updates predictions older than 24 hours.

---

### Aggressive Updates

```typescript
update_predictions({
  project: "critical-project",
  staleThreshold: 6
})
```

Refresh predictions every 6 hours for maximum accuracy.

---

### After Heavy Activity

```typescript
// After saving many contexts
save_context({ project: "my-project", content: "..." });
save_context({ project: "my-project", content: "..." });
save_context({ project: "my-project", content: "..." });

// Refresh predictions to reflect new access patterns
update_predictions({ project: "my-project" });
```

---

## Use Cases

### 1. Scheduled Maintenance

Keep predictions fresh automatically:

```typescript
// Every 12 hours
cron.schedule('0 */12 * * *', async () => {
  update_predictions({
    project: "main-project",
    staleThreshold: 12
  });
});
```

### 2. After Major Changes

Refresh after significant activity:

```typescript
// Completed a big feature
completeFeature();

// Update predictions to reflect new patterns
update_predictions({ project: "feature-x" });
```

### 3. Pre-Loading Optimization

Update before querying high-value contexts:

```typescript
// Refresh predictions
update_predictions({ project: "my-project" });

// Then get high-value contexts
get_high_value_contexts({ project: "my-project" });
```

---

## Prediction Scoring

When predictions are updated, each context gets a score (0.0-1.0) based on:

### Temporal Score (40% weight)
- Recently accessed → High score
- Not accessed in weeks → Low score

### Causal Score (30% weight)
- Root causes → High score
- Leaf nodes → Lower score
- Decision nodes → Bonus points

### Frequency Score (30% weight)
- High access count → High score
- Rarely accessed → Low score

**Combined:**
```
prediction_score = (
  temporal_score * 0.4 +
  causal_score * 0.3 +
  frequency_score * 0.3
)
```

---

## Staleness Detection

A prediction is **stale** if:
```
hours_since_prediction >= staleThreshold
```

**Why predictions become stale:**
- Access patterns changed
- New contexts added
- Time passed (temporal score decays)

---

## Performance

| Contexts | Latency | Notes |
|----------|---------|-------|
| 10 | 50-100ms | Fast |
| 50 | 200-500ms | Moderate |
| 100+ | 500ms-2s | Batch processing |

**Optimization:**
- Only updates stale predictions (not all contexts)
- Processes in batches
- Runs async (non-blocking)

---

## Integration with Layer 3

### Before Get High-Value Contexts

```typescript
// Ensure predictions are fresh
update_predictions({ project: "my-project" });

// Get accurate high-value contexts
get_high_value_contexts({
  project: "my-project",
  minScore: 0.7
});
```

### After Access Pattern Changes

```typescript
// User accessed many old contexts
load_context({ project: "my-project", limit: 50 });

// This changed access patterns
// Update predictions to reflect new patterns
update_predictions({ project: "my-project" });
```

### Monitor Prediction Quality

```typescript
// Update predictions
update_predictions({ project: "my-project" });

// Check quality
get_propagation_stats({ project: "my-project" });

// Shows average prediction score, coverage, etc.
```

---

## Best Practices

### 1. Run Regularly

```typescript
// ✅ Good: Scheduled updates
cron.schedule('0 0 * * *', () => {
  update_predictions({ project: "my-project" });
});

// ❌ Bad: Never updating
// Predictions become stale and inaccurate
```

### 2. Balance Freshness vs Performance

```typescript
// ✅ Good: Daily updates (balanced)
update_predictions({ project: "my-project", staleThreshold: 24 });

// ⚠️ Aggressive: Hourly (high cost)
update_predictions({ project: "my-project", staleThreshold: 1 });

// ⚠️ Conservative: Weekly (stale data)
update_predictions({ project: "my-project", staleThreshold: 168 });
```

### 3. Update After Bulk Operations

```typescript
// Batch save
for (const item of items) {
  save_context({ project: "my-project", content: item });
}

// Update predictions once after batch
update_predictions({ project: "my-project" });
```

---

## Metadata Updated

When predictions are updated, these fields are set:

```sql
UPDATE context_snapshots SET
  prediction_score = <calculated_score>,
  last_predicted = datetime('now'),
  propagation_reason = <json_array_of_reasons>
WHERE ...
```

**Fields:**
- `prediction_score`: 0.0 to 1.0
- `last_predicted`: ISO timestamp
- `propagation_reason`: JSON array like `["recently_accessed", "causal_chain_root"]`

---

## See Also

- [get_high_value_contexts](/tools/get-high-value-contexts) - Use predictions
- [get_propagation_stats](/tools/get-propagation-stats) - Monitor prediction quality
- [Layer 3: Propagation Engine](/development/layer-3-propagation) - Understanding predictions
- [Database Schema](/development/database-schema) - Prediction columns
