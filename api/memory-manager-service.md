# MemoryManagerService

Layer 2 service that manages context lifecycle and memory tier classification.

## Overview

`MemoryManagerService` is the implementation of Layer 2 (Memory Manager). It tracks HOW relevant contexts are right now by classifying them into memory tiers based on access patterns and age.

**Location**: `src/domain/services/MemoryManagerService.ts`

**Layer**: Layer 2 - Present (HOW)

**Purpose**: Manage context relevance and lifecycle

---

## Constructor

```typescript
constructor(private readonly repository: IContextRepository)
```

**Parameters:**
- `repository`: Database abstraction for context storage

---

## Methods

### `calculateMemoryTier(lastAccessed: Date | null, now: Date): MemoryTier`

Determine memory tier based on time since last access.

**Parameters:**
- `lastAccessed`: When context was last retrieved (null = never accessed)
- `now`: Current timestamp

**Returns**: `MemoryTier` enum value

**Algorithm:**
```typescript
const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);

if (hoursSinceAccess < 1) return MemoryTier.ACTIVE;
if (hoursSinceAccess < 24) return MemoryTier.RECENT;
if (hoursSinceAccess < 24 * 30) return MemoryTier.ARCHIVED;
return MemoryTier.EXPIRED;
```

**Example:**
```typescript
const tier = memoryManager.calculateMemoryTier(
  new Date('2025-10-17T14:00:00Z'),
  new Date('2025-10-17T14:30:00Z')
);
// Returns: MemoryTier.ACTIVE (30 minutes old)
```

**Tier Thresholds:**
- **ACTIVE**: < 1 hour (hot, frequently accessed)
- **RECENT**: 1-24 hours (warm, recently used)
- **ARCHIVED**: 1-30 days (cold, aging)
- **EXPIRED**: > 30 days (frozen, pruning candidate)

---

### `getMemoryStats(project: string): Promise<MemoryStats>`

Get aggregate statistics on memory tier distribution for a project.

**Parameters:**
- `project`: Project to analyze

**Returns**: Statistics object

**Return Type:**
```typescript
interface MemoryStats {
  total: number;
  active: number;
  recent: number;
  archived: number;
  expired: number;
}
```

**Example:**
```typescript
const stats = await memoryManager.getMemoryStats('my-project');

// Returns:
// {
//   total: 48,
//   active: 5,
//   recent: 12,
//   archived: 28,
//   expired: 3
// }
```

**Implementation:**
```typescript
async getMemoryStats(project: string): Promise<MemoryStats> {
  const contexts = await this.repository.findByProject(project, 1000);

  const stats = { total: contexts.length, active: 0, recent: 0, archived: 0, expired: 0 };

  for (const context of contexts) {
    switch (context.memory?.tier) {
      case MemoryTier.ACTIVE: stats.active++; break;
      case MemoryTier.RECENT: stats.recent++; break;
      case MemoryTier.ARCHIVED: stats.archived++; break;
      case MemoryTier.EXPIRED: stats.expired++; break;
    }
  }

  return stats;
}
```

---

### `trackAccess(snapshotId: string): Promise<void>`

Update access tracking metadata when a context is retrieved.

**Parameters:**
- `snapshotId`: ID of context being accessed

**Side Effects:**
- Updates `lastAccessed` to current timestamp
- Increments `accessCount`
- May trigger tier recalculation

**Example:**
```typescript
// When loading a context
const context = await repository.findById(id);
await memoryManager.trackAccess(id);  // Update LRU metadata
```

**Database Update:**
```sql
UPDATE context_snapshots
SET last_accessed = datetime('now'),
    access_count = access_count + 1
WHERE id = ?
```

---

### `recalculateAllTiers(project?: string): Promise<number>`

Recalculate memory tiers for all contexts (or specific project).

**Parameters:**
- `project`: Optional project filter (if omitted, processes all projects)

**Returns**: Number of contexts updated

**Example:**
```typescript
// Recalculate for one project
const updated = await memoryManager.recalculateAllTiers('my-project');
console.log(`Updated ${updated} contexts`);

// Recalculate for all projects
const updated = await memoryManager.recalculateAllTiers();
```

**Use Cases:**
- Scheduled maintenance (daily/weekly)
- After long periods of inactivity
- Before querying by tier

**Performance**: O(n) where n = context count, batched for efficiency

---

### `pruneExpiredContexts(limit?: number): Promise<number>`

Delete expired contexts that are no longer needed.

**Parameters:**
- `limit`: Optional maximum contexts to delete (for safety)

**Returns**: Number of contexts deleted

**Example:**
```typescript
// Prune up to 50 expired contexts
const deleted = await memoryManager.pruneExpiredContexts(50);
console.log(`Deleted ${deleted} expired contexts`);

// Prune all expired contexts (use with caution)
const deleted = await memoryManager.pruneExpiredContexts();
```

**Safety:**
- Only deletes contexts in EXPIRED tier
- Respects limit parameter
- Idempotent (safe to run multiple times)

**Query:**
```sql
DELETE FROM context_snapshots
WHERE memory_tier = 'expired'
ORDER BY last_accessed ASC NULLS FIRST
LIMIT ?
```

---

### `findLeastRecentlyUsed(tier: MemoryTier, limit: number): Promise<IContextSnapshot[]>`

Find least recently used contexts in a specific tier.

**Parameters:**
- `tier`: Memory tier to search within
- `limit`: Maximum contexts to return

**Returns**: Array of contexts sorted by access time (oldest first)

**Example:**
```typescript
// Find oldest archived contexts
const lru = await memoryManager.findLeastRecentlyUsed(
  MemoryTier.ARCHIVED,
  10
);

// These are candidates for archival or pruning
```

**Use Cases:**
- Identify contexts to move to lower tier
- Find candidates for pruning
- Analyze access patterns

---

## Types

### `MemoryTier`

```typescript
enum MemoryTier {
  ACTIVE = 'active',       // < 1 hour since access
  RECENT = 'recent',       // 1-24 hours
  ARCHIVED = 'archived',   // 1-30 days
  EXPIRED = 'expired'      // > 30 days
}
```

### `MemoryStats`

```typescript
interface MemoryStats {
  total: number;      // Total contexts
  active: number;     // Count in ACTIVE tier
  recent: number;     // Count in RECENT tier
  archived: number;   // Count in ARCHIVED tier
  expired: number;    // Count in EXPIRED tier
}
```

---

## Usage Examples

### Monitor Memory Health

```typescript
const stats = await memoryManager.getMemoryStats('my-project');

// Alert if too many expired
if (stats.expired > 100) {
  console.warn('High expired count - consider pruning');
  await memoryManager.pruneExpiredContexts(50);
}

// Alert if no activity
if (stats.active === 0 && stats.recent === 0) {
  console.warn('Project appears inactive');
}
```

### Scheduled Maintenance

```typescript
// Daily tier recalculation
cron.schedule('0 0 * * *', async () => {
  const updated = await memoryManager.recalculateAllTiers();
  console.log(`Recalculated ${updated} context tiers`);
});

// Weekly pruning
cron.schedule('0 0 * * 0', async () => {
  const deleted = await memoryManager.pruneExpiredContexts(100);
  console.log(`Pruned ${deleted} expired contexts`);
});
```

### Context Loading with Tracking

```typescript
async function loadContextWithTracking(id: string): Promise<IContextSnapshot> {
  const context = await repository.findById(id);

  if (context) {
    // Update access metadata
    await memoryManager.trackAccess(id);

    // Optionally recalculate tier
    const tier = memoryManager.calculateMemoryTier(
      context.memory?.lastAccessed || null,
      new Date()
    );

    if (tier !== context.memory?.tier) {
      // Tier changed - update in database
      await repository.updateTier(id, tier);
    }
  }

  return context;
}
```

---

## Best Practices

### 1. Always Track Access

```typescript
// ✅ Good: Track every load
const context = await repository.findById(id);
await memoryManager.trackAccess(id);

// ❌ Bad: Load without tracking
const context = await repository.findById(id);
// LRU data becomes stale
```

### 2. Regular Tier Recalculation

```typescript
// ✅ Good: Scheduled updates
cron.schedule('0 * * * *', async () => {
  await memoryManager.recalculateAllTiers();
});

// ❌ Bad: Never recalculating
// Contexts stay in wrong tiers
```

### 3. Safe Pruning

```typescript
// ✅ Good: Limit pruning
await memoryManager.pruneExpiredContexts(100);

// ⚠️ Risky: Unlimited pruning
await memoryManager.pruneExpiredContexts();
// Could delete thousands of contexts
```

---

## Testing

### Unit Test Example

```typescript
describe('MemoryManagerService', () => {
  it('calculates ACTIVE tier for recent access', () => {
    const service = new MemoryManagerService(mockRepo);

    const lastAccessed = new Date('2025-10-17T14:00:00Z');
    const now = new Date('2025-10-17T14:30:00Z');

    const tier = service.calculateMemoryTier(lastAccessed, now);

    expect(tier).toBe(MemoryTier.ACTIVE);
  });

  it('calculates EXPIRED tier for old contexts', () => {
    const service = new MemoryManagerService(mockRepo);

    const lastAccessed = new Date('2024-09-01T00:00:00Z');
    const now = new Date('2025-10-17T00:00:00Z');

    const tier = service.calculateMemoryTier(lastAccessed, now);

    expect(tier).toBe(MemoryTier.EXPIRED);
  });
});
```

---

## Integration with Other Layers

### With Layer 1 (Causality)

Memory tier affects causal chain importance:
- ACTIVE contexts are likely involved in current work
- ARCHIVED contexts are historical reference

### With Layer 3 (Propagation)

Memory tier is a key factor in prediction scoring:
- ACTIVE tier: +0.3 score boost
- RECENT tier: +0.1 score boost
- EXPIRED tier: -0.2 score penalty

---

## See Also

- [API Overview](/api/overview) - Service architecture
- [ContextSnapshot](/api/context-snapshot) - Entity with memory metadata
- [Layer 2: Memory Manager](/development/layer-2-memory) - Concepts and design
- [get_memory_stats tool](/tools/get-memory-stats) - MCP tool usage
- [Database Schema](/development/database-schema) - Memory tier columns
