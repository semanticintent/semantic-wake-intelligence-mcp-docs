# Layer 2: Memory Manager (Present - HOW)

The **Memory Manager** maintains the **present-time relevance** of contexts through intelligent lifecycle management. It answers the question: **"How relevant is this context right now?"**

n::: tip Semantic Intent Research
The Memory Manager treats context relevance as a **present-tense question**: "How valuable is this right now?" This implements semantic intent principles where metadata isn't static - it evolves with usage patterns and temporal decay.

📚 [Explore the research →](https://semanticintent.dev/papers/semantic-intent-ssot)
:::
## Core Concept

Not all contexts are equally relevant at all times. The Memory Manager automatically classifies contexts into **memory tiers** based on their access patterns and age, similar to how a computer's memory hierarchy works (L1 cache → L2 cache → RAM → Disk).

```
🔥 ACTIVE (< 1 hour)      → Hot, frequently accessed
⚡ RECENT (1-24 hours)     → Warm, recently used
📦 ARCHIVED (1-30 days)    → Cold, aging
❄️  EXPIRED (> 30 days)    → Candidates for pruning
```

## Memory Tiers

### 🔥 ACTIVE Tier (< 1 hour)
**Hot contexts** that are currently being worked on.

**Characteristics:**
- Last accessed within the past hour
- High priority for retrieval
- Always returned first by `load_context`
- Never pruned

**Example use case:**
- Ongoing conversation contexts
- Currently open files
- Active debugging sessions

---

### ⚡ RECENT Tier (1-24 hours)
**Warm contexts** from recent work sessions.

**Characteristics:**
- Accessed within the past 24 hours
- Medium priority
- Still readily available
- Good candidates for pre-fetching

**Example use case:**
- Yesterday's work
- Recent decisions that might be referenced
- Code reviewed earlier today

---

### 📦 ARCHIVED Tier (1-30 days)
**Cold contexts** from past work.

**Characteristics:**
- Accessed 1-30 days ago
- Lower priority
- Historical reference material
- May be pruned if space is needed

**Example use case:**
- Last week's feature work
- Old bug investigation
- Previous sprint contexts

---

### ❄️ EXPIRED Tier (> 30 days)
**Expired contexts** that may no longer be relevant.

**Characteristics:**
- Not accessed in over 30 days
- Lowest priority
- Prime candidates for automatic pruning
- Can be manually archived or deleted

**Example use case:**
- Abandoned experiments
- Outdated documentation
- Stale contexts from old projects

---

## Key Features

### 1. Automatic Tier Classification

Contexts are automatically moved between tiers based on:
- **Last accessed timestamp**: When was this context last retrieved?
- **Time elapsed**: How long since last access?
- **Access count**: How frequently has this been accessed?

**Recalculation happens:**
- Automatically when contexts are accessed
- Manually via `recalculate_memory_tiers` tool
- Periodically by background jobs

### 2. LRU (Least Recently Used) Tracking

Every time a context is accessed via `load_context`, the Memory Manager updates:
```typescript
{
  lastAccessed: "2025-10-17T14:30:00Z",  // Current timestamp
  accessCount: accessCount + 1            // Increment counter
}
```

This data powers intelligent caching and pruning decisions.

### 3. Memory Pressure Management

When storage is limited, the Memory Manager can automatically:
- Identify least valuable contexts (EXPIRED tier, low access count)
- Prune them using `prune_expired_contexts`
- Free up space for new, relevant contexts

### 4. Statistics & Observability

Monitor memory health with `get_memory_stats`:
```typescript
get_memory_stats({ project: "my-project" })

// Returns:
// Memory Tier Distribution:
//   - ACTIVE: 15 contexts
//   - RECENT: 42 contexts
//   - ARCHIVED: 128 contexts
//   - EXPIRED: 23 contexts
//
// Total Contexts: 208
```

---

## Use Cases

### 1. Intelligent Context Loading

Prioritize recent, relevant contexts:

```typescript
// Load contexts - automatically returns ACTIVE first, then RECENT, etc.
const contexts = load_context({
  project: "my-project",
  limit: 5
});

// First 5 will be the most recently accessed
```

### 2. Periodic Cleanup

Run regular maintenance to keep storage lean:

```typescript
// Recalculate tiers based on current time
recalculate_memory_tiers({ project: "my-project" });

// Remove expired, unused contexts
prune_expired_contexts({ limit: 100 });
```

### 3. Monitoring Context Health

Track how your contexts age over time:

```typescript
const stats = get_memory_stats({ project: "my-project" });

// Alert if too many EXPIRED contexts
if (stats.expired > 100) {
  console.warn("Consider pruning expired contexts");
}

// Alert if no ACTIVE contexts
if (stats.active === 0) {
  console.warn("No recent activity in this project");
}
```

---

## MCP Tools

### [`get_memory_stats`](/tools/get-memory-stats)
View memory tier distribution and access patterns for a project.

**Input:**
- `project` (string): Project to analyze

**Returns:**
- Tier distribution (ACTIVE, RECENT, ARCHIVED, EXPIRED counts)
- Total contexts
- Memory health indicators

**Example:**
```typescript
get_memory_stats({
  project: "authentication-refactor"
})
```

---

### `recalculate_memory_tiers`
Update tier classifications based on current time.

**Input:**
- `project` (string, optional): Project to recalculate (processes all if omitted)

**Returns:**
- Number of contexts updated

**Example:**
```typescript
// Recalculate for specific project
recalculate_memory_tiers({
  project: "my-project"
})

// Or recalculate all projects
recalculate_memory_tiers({})
```

**When to use:**
- After long periods of inactivity
- Before important queries
- As part of scheduled maintenance

---

### `prune_expired_contexts`
Clean up old, unused contexts that have expired.

**Input:**
- `limit` (number, optional): Maximum contexts to prune

**Returns:**
- Number of contexts deleted

**Example:**
```typescript
// Prune up to 50 expired contexts
prune_expired_contexts({ limit: 50 })

// Or prune all expired contexts
prune_expired_contexts({})
```

**Safety:**
- Only deletes EXPIRED tier contexts
- Never touches ACTIVE, RECENT, or ARCHIVED tiers
- Respects the limit parameter
- Idempotent operation (safe to run multiple times)

---

## Implementation Details

### Database Schema

Layer 2 uses these columns in `context_snapshots`:

```sql
-- Memory Manager columns
memory_tier TEXT,           -- ACTIVE|RECENT|ARCHIVED|EXPIRED
last_accessed TEXT,         -- ISO timestamp of last access
access_count INTEGER DEFAULT 0,  -- How many times accessed

-- Index for efficient queries
CREATE INDEX idx_memory_tier ON context_snapshots(memory_tier);
CREATE INDEX idx_last_accessed ON context_snapshots(last_accessed);
```

### Tier Calculation Algorithm

```typescript
function calculateMemoryTier(lastAccessed: Date | null, now: Date): MemoryTier {
  if (!lastAccessed) return MemoryTier.ARCHIVED;

  const hoursSinceAccess = (now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60);

  if (hoursSinceAccess < 1) return MemoryTier.ACTIVE;
  if (hoursSinceAccess < 24) return MemoryTier.RECENT;
  if (hoursSinceAccess < 24 * 30) return MemoryTier.ARCHIVED;
  return MemoryTier.EXPIRED;
}
```

### Access Tracking

When `load_context` retrieves a context:

```typescript
async trackAccess(snapshotId: string): Promise<void> {
  await repository.updateAccessTracking(snapshotId);

  // SQL:
  // UPDATE context_snapshots
  // SET last_accessed = datetime('now'),
  //     access_count = access_count + 1
  // WHERE id = ?
}
```

---

## Design Philosophy

### Automatic > Manual

The Memory Manager operates **automatically** with minimal user intervention:
- ✅ Tiers update as contexts are accessed
- ✅ Timestamps track access patterns
- ✅ Statistics provide observability
- ❌ No manual tier assignment needed

### Non-Destructive Aging

Contexts don't disappear suddenly:
1. **ACTIVE** → Used in past hour
2. **RECENT** → Used in past day
3. **ARCHIVED** → Used in past month
4. **EXPIRED** → > 30 days old, but **still available**
5. **Pruned** → Only deleted when explicitly requested

This gives users time to rescue valuable old contexts.

### Performance-Aware

- **Indexed queries**: Tier and access time columns are indexed
- **Batch operations**: Recalculation and pruning happen in batches
- **Lazy updates**: Tiers only recalculated when needed

---

## Best Practices

### 1. Run Periodic Maintenance

Add to your scheduled jobs:

```typescript
// Daily: Recalculate tiers
cron.schedule('0 0 * * *', async () => {
  await recalculate_memory_tiers({});
});

// Weekly: Prune expired contexts
cron.schedule('0 0 * * 0', async () => {
  await prune_expired_contexts({ limit: 1000 });
});
```

### 2. Monitor Memory Health

Set up alerts:

```typescript
async function checkMemoryHealth(project: string) {
  const stats = await get_memory_stats({ project });

  // Too many expired contexts?
  if (stats.expired > 100) {
    alert("High number of expired contexts - consider pruning");
  }

  // No recent activity?
  if (stats.active === 0 && stats.recent === 0) {
    alert("Project appears inactive");
  }
}
```

### 3. Respect the Tiers

When querying contexts, respect tier priority:

```typescript
// ✅ Good: Load recent contexts first
const contexts = load_context({ project, limit: 10 });
// Returns ACTIVE first, then RECENT, then ARCHIVED

// ❌ Bad: Loading all contexts regardless of tier
const all = repository.findByProject(project, 10000);
```

### 4. Don't Over-Prune

Keep a safety margin:

```typescript
// ✅ Good: Limit pruning
prune_expired_contexts({ limit: 100 });

// ❌ Risky: Prune everything
prune_expired_contexts({});
```

---

## Integration with Other Layers

### With Layer 1 (Causality)

Memory tiers inform causal chain importance:
- **ACTIVE** tier contexts are likely to be roots of new chains
- **ARCHIVED** tier contexts may be historical reference

### With Layer 3 (Propagation)

Memory tiers are a key factor in prediction scoring:
- **ACTIVE** tier contexts get +0.3 score boost
- **RECENT** tier contexts get +0.1 score boost
- **EXPIRED** tier contexts get -0.2 score penalty

This creates a feedback loop: frequently accessed contexts → higher tier → higher prediction score → more likely to be pre-fetched → easier to access.

---

## Next Steps

- [Learn about Layer 1: Causality Engine →](/development/layer-1-causality)
- [Learn about Layer 3: Propagation Engine →](/development/layer-3-propagation)
- [Explore memory management tools →](/tools/overview)
- [View API Reference →](/api/memory-manager-service)
