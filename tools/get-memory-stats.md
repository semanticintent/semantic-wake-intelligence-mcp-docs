# get_memory_stats

View memory tier distribution and access patterns for a project.

## Overview

The `get_memory_stats` tool is part of Layer 2 (Memory Manager). It provides analytics on how contexts are distributed across memory tiers and their access patterns.

**Layer**: Layer 2 - Memory Manager (Present)

**Purpose**: Monitor context lifecycle and memory health

**Temporal Focus**: Present - understanding current relevance

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | Project to analyze |

### Parameter Details

#### `project`
The project identifier to get memory statistics for.

---

## Returns

Formatted text showing memory tier distribution:

```
**Memory Statistics for authentication-refactor**

📊 **Memory Tier Distribution:**
  - 🔥 ACTIVE (< 1 hour): 5
  - ⚡ RECENT (1-24 hours): 12
  - 📦 ARCHIVED (1-30 days): 28
  - ❄️  EXPIRED (> 30 days): 3

📈 **Total Contexts:** 48
```

---

## Examples

### Basic Usage

```typescript
get_memory_stats({
  project: "api-service"
})
```

**Result:**
```
**Memory Statistics for api-service**

📊 **Memory Tier Distribution:**
  - 🔥 ACTIVE (< 1 hour): 8
  - ⚡ RECENT (1-24 hours): 15
  - 📦 ARCHIVED (1-30 days): 42
  - ❄️  EXPIRED (> 30 days): 5

📈 **Total Contexts:** 70
```

---

### Monitor Multiple Projects

```typescript
const projects = ["frontend", "backend", "mobile"];

for (const project of projects) {
  get_memory_stats({ project });
}
```

---

## Use Cases

### 1. Health Monitoring

Check if contexts are aging properly:

```typescript
const stats = get_memory_stats({ project: "my-project" });

// Alert if too many EXPIRED
if (stats.expired > 50) {
  console.warn("Consider pruning expired contexts");
}

// Alert if no ACTIVE contexts
if (stats.active === 0) {
  console.warn("No recent activity");
}
```

### 2. Cleanup Planning

Decide when to prune:

```typescript
get_memory_stats({ project: "old-project" });

// If most contexts are EXPIRED, safe to prune
// If many are ACTIVE/RECENT, still in use
```

### 3. Project Activity Tracking

Understand project engagement:

```typescript
// Active project: Many ACTIVE/RECENT
// Dormant project: Mostly ARCHIVED/EXPIRED
get_memory_stats({ project: "project-name" });
```

---

## Memory Tier Thresholds

| Tier | Time Since Last Access | Indicator | Use Case |
|------|----------------------|-----------|----------|
| 🔥 ACTIVE | < 1 hour | Hot | Currently working on |
| ⚡ RECENT | 1-24 hours | Warm | Today's work |
| 📦 ARCHIVED | 1-30 days | Cold | Past month |
| ❄️ EXPIRED | > 30 days | Frozen | Pruning candidate |

---

## Integration with Layer 2

### Before Pruning

```typescript
// Check what you're pruning
get_memory_stats({ project: "my-project" });

// If EXPIRED count is high, safe to prune
prune_expired_contexts({ limit: 50 });

// Verify
get_memory_stats({ project: "my-project" });
```

### After Tier Recalculation

```typescript
// Recalculate tiers
recalculate_memory_tiers({ project: "my-project" });

// See updated distribution
get_memory_stats({ project: "my-project" });
```

---

## Interpreting Results

### Healthy Project
```
ACTIVE: 10-20 (active work)
RECENT: 20-50 (recent sessions)
ARCHIVED: 50-200 (history)
EXPIRED: < 50 (minimal old data)
```

### Dormant Project
```
ACTIVE: 0 (no current work)
RECENT: 0 (no recent work)
ARCHIVED: 20-50 (aging)
EXPIRED: 100+ (needs cleanup)
```

### New Project
```
ACTIVE: 5-10
RECENT: 10-20
ARCHIVED: 0 (no history yet)
EXPIRED: 0
```

---

## Best Practices

### 1. Regular Monitoring

```typescript
// Daily health check
cron.schedule('0 9 * * *', async () => {
  const stats = get_memory_stats({ project: "main-project" });
  logStats(stats);
});
```

### 2. Set Alert Thresholds

```typescript
const stats = get_memory_stats({ project: "my-project" });

// Too many expired
if (stats.expired > 100) {
  alert("High expired context count");
}

// No activity
if (stats.active + stats.recent === 0) {
  alert("Project appears inactive");
}
```

### 3. Compare Over Time

Track trends:
- EXPIRED count increasing → Need cleanup
- ACTIVE count stable → Consistent usage
- All tiers empty → Project abandoned

---

## Performance

- **Latency**: 10-50ms (single database query with GROUP BY)
- **Scalability**: Efficient even with 1000+ contexts per project

---

## See Also

- [recalculate_memory_tiers](/tools/recalculate-memory-tiers) - Update tier classifications
- [prune_expired_contexts](/tools/prune-expired-contexts) - Clean up old contexts
- [Layer 2: Memory Manager](/development/layer-2-memory) - Understanding memory tiers
- [Database Schema](/development/database-schema) - Memory tier columns
