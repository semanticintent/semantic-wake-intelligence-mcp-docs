# Database Schema

WakeIQX uses a **single unified table** (`context_snapshots`) with columns specialized for each of the three temporal intelligence layers. This design enables efficient querying while maintaining semantic clarity.

## Philosophy: Unified Schema

Rather than separate tables for each layer, WakeIQX uses **specialized columns** within a single table:

```
context_snapshots
├── Core columns (identity, content)
├── Layer 1 columns (causality tracking)
├── Layer 2 columns (memory management)
└── Layer 3 columns (prediction scoring)
```

**Benefits:**
- ✅ Single source of truth
- ✅ Efficient joins (no cross-table queries)
- ✅ Atomic updates (all layers in one transaction)
- ✅ Simple migrations (add columns, not tables)

---

## Complete Schema

```sql
CREATE TABLE context_snapshots (
  -- ========================================
  -- CORE COLUMNS (Identity & Content)
  -- ========================================
  id TEXT PRIMARY KEY,              -- UUID for this context
  project TEXT NOT NULL,            -- Project/domain grouping
  summary TEXT NOT NULL,            -- AI-generated summary
  source TEXT DEFAULT 'unknown',   -- Origin (mcp, api, manual)
  metadata TEXT,                    -- JSON extensible data
  tags TEXT DEFAULT '',             -- AI-generated search tags
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- ========================================
  -- LAYER 1: CAUSALITY ENGINE (Past - WHY)
  -- ========================================
  action_type TEXT,                 -- conversation|decision|file_edit|tool_use|research
  rationale TEXT,                   -- WHY this context was created
  dependencies TEXT,                -- JSON array of related context IDs
  caused_by TEXT,                   -- Parent context ID (causal link)

  -- ========================================
  -- LAYER 2: MEMORY MANAGER (Present - HOW)
  -- ========================================
  memory_tier TEXT NOT NULL DEFAULT 'active',  -- ACTIVE|RECENT|ARCHIVED|EXPIRED
  last_accessed TEXT,               -- ISO timestamp of last access
  access_count INTEGER NOT NULL DEFAULT 0,      -- How many times accessed

  -- ========================================
  -- LAYER 3: PROPAGATION ENGINE (Future - WHAT)
  -- ========================================
  prediction_score REAL DEFAULT NULL,           -- 0.0-1.0 prediction score
  last_predicted TEXT DEFAULT NULL,             -- When prediction was updated
  predicted_next_access TEXT DEFAULT NULL,      -- Estimated next access time
  propagation_reason TEXT DEFAULT NULL          -- JSON array of prediction reasons
);
```

---

## Indexes

Optimized for common query patterns:

```sql
-- Core indexes
CREATE INDEX idx_project ON context_snapshots(project);
CREATE INDEX idx_timestamp ON context_snapshots(timestamp);
CREATE INDEX idx_project_timestamp ON context_snapshots(project, timestamp);

-- Layer 1: Causality indexes
CREATE INDEX idx_contexts_caused_by ON context_snapshots(caused_by);
CREATE INDEX idx_contexts_action_type ON context_snapshots(action_type);

-- Layer 2: Memory indexes
CREATE INDEX idx_contexts_memory_tier ON context_snapshots(memory_tier);
CREATE INDEX idx_contexts_tier_accessed ON context_snapshots(memory_tier, last_accessed DESC);
CREATE INDEX idx_contexts_access_count ON context_snapshots(access_count DESC);

-- Layer 3: Propagation indexes
CREATE INDEX idx_context_snapshots_prediction_score
  ON context_snapshots(prediction_score DESC)
  WHERE prediction_score IS NOT NULL;

CREATE INDEX idx_context_snapshots_project_prediction
  ON context_snapshots(project, prediction_score DESC)
  WHERE prediction_score IS NOT NULL;
```

---

## Column Details

### Core Columns

| Column | Type | Nullable | Default | Purpose |
|--------|------|----------|---------|---------|
| `id` | TEXT | No | - | Unique identifier (UUID) |
| `project` | TEXT | No | - | Project/domain grouping for context isolation |
| `summary` | TEXT | No | - | AI-compressed semantic essence of content |
| `source` | TEXT | Yes | 'unknown' | Provenance marker (mcp, api, manual) |
| `metadata` | TEXT | Yes | NULL | JSON-encoded extensible properties |
| `tags` | TEXT | Yes | '' | AI-generated search/discovery tags |
| `timestamp` | DATETIME | Yes | CURRENT_TIMESTAMP | When context was created |

**Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "project": "authentication-refactor",
  "summary": "Decision to use OAuth2 with PKCE for mobile app authentication",
  "source": "mcp",
  "metadata": "{}",
  "tags": "oauth, security, mobile, authentication",
  "timestamp": "2025-10-17T14:30:00Z"
}
```

---

### Layer 1: Causality Columns

| Column | Type | Nullable | Default | Purpose |
|--------|------|----------|---------|---------|
| `action_type` | TEXT | Yes | NULL | What action created this context |
| `rationale` | TEXT | Yes | NULL | WHY this context was saved |
| `dependencies` | TEXT | Yes | NULL | JSON array of related context IDs |
| `caused_by` | TEXT | Yes | NULL | Parent context ID (enables causal chains) |

**Action Types:**
- `conversation`: User dialogue or question
- `decision`: Strategic choice
- `file_edit`: Code/document modification
- `tool_use`: External tool invocation
- `research`: Information gathering

**Example:**
```json
{
  "action_type": "decision",
  "rationale": "OAuth2 with PKCE is more secure than basic JWT for mobile apps",
  "dependencies": "[\"research-context-id-1\", \"research-context-id-2\"]",
  "caused_by": "conversation-context-id"
}
```

---

### Layer 2: Memory Columns

| Column | Type | Nullable | Default | Purpose |
|--------|------|----------|---------|---------|
| `memory_tier` | TEXT | No | 'active' | Current relevance classification |
| `last_accessed` | TEXT | Yes | NULL | ISO timestamp of last retrieval |
| `access_count` | INTEGER | No | 0 | How many times this context was accessed |

**Memory Tiers:**
- `ACTIVE`: < 1 hour since last access (hot)
- `RECENT`: 1-24 hours since last access (warm)
- `ARCHIVED`: 1-30 days since last access (cold)
- `EXPIRED`: > 30 days since last access (pruning candidate)

**Example:**
```json
{
  "memory_tier": "ACTIVE",
  "last_accessed": "2025-10-17T14:45:00Z",
  "access_count": 12
}
```

---

### Layer 3: Propagation Columns

| Column | Type | Nullable | Default | Purpose |
|--------|------|----------|---------|---------|
| `prediction_score` | REAL | Yes | NULL | 0.0-1.0 likelihood of future access |
| `last_predicted` | TEXT | Yes | NULL | When prediction was last calculated |
| `predicted_next_access` | TEXT | Yes | NULL | Estimated next access time |
| `propagation_reason` | TEXT | Yes | NULL | JSON array explaining prediction |

**Propagation Reasons:**
- `recently_accessed`: Temporal momentum
- `causal_chain_root`: Root cause position
- `high_access_frequency`: Frequently used
- `active_memory_tier`: Currently hot
- `decision_node`: Decision action type

**Example:**
```json
{
  "prediction_score": 0.85,
  "last_predicted": "2025-10-17T14:30:00Z",
  "predicted_next_access": "2025-10-17T15:00:00Z",
  "propagation_reason": "[\"recently_accessed\", \"causal_chain_root\", \"decision_node\"]"
}
```

---

## Migration History

WakeIQX schema evolved through 4 migrations:

### Migration 0001: Initial Schema (v1.0.0)

Created the foundational `context_snapshots` table:
- Core columns: id, project, summary, source, metadata, tags, timestamp
- Indexes: project, timestamp, project+timestamp

**Purpose:** Basic context preservation and retrieval.

---

### Migration 0002: Add Causality (v2.0.0 - Layer 1)

Added causal tracking columns:
- `action_type`: Classify what created the context
- `rationale`: Explain WHY it was saved
- `dependencies`: Track related contexts
- `caused_by`: Link to parent context

**Purpose:** Enable causal chain reconstruction and decision tracing.

---

### Migration 0003: Add Memory Manager (v2.0.0 - Layer 2)

Added memory management columns:
- `memory_tier`: ACTIVE/RECENT/ARCHIVED/EXPIRED classification
- `last_accessed`: LRU tracking
- `access_count`: Usage frequency

**Purpose:** Enable intelligent lifecycle management and pruning.

---

### Migration 0004: Add Propagation Engine (v3.0.0 - Layer 3)

Added prediction columns:
- `prediction_score`: 0.0-1.0 future access likelihood
- `last_predicted`: Staleness tracking
- `predicted_next_access`: Estimated access time
- `propagation_reason`: Explainability

**Purpose:** Enable pre-fetching and intelligent prioritization.

---

## Query Patterns

### Common Queries

**1. Load recent contexts for a project:**
```sql
SELECT * FROM context_snapshots
WHERE project = ?
ORDER BY timestamp DESC
LIMIT ?;
```
*Uses index: `idx_project_timestamp`*

---

**2. Build causal chain backwards:**
```sql
-- Recursive CTE to traverse causal links
WITH RECURSIVE causal_chain AS (
  -- Start with target snapshot
  SELECT * FROM context_snapshots WHERE id = ?

  UNION ALL

  -- Follow causedBy links backwards
  SELECT cs.* FROM context_snapshots cs
  JOIN causal_chain cc ON cs.id = cc.caused_by
)
SELECT * FROM causal_chain;
```
*Uses index: `idx_contexts_caused_by`*

---

**3. Get memory tier statistics:**
```sql
SELECT
  memory_tier,
  COUNT(*) as count
FROM context_snapshots
WHERE project = ?
GROUP BY memory_tier;
```
*Uses index: `idx_contexts_memory_tier`*

---

**4. Find expired contexts for pruning:**
```sql
SELECT * FROM context_snapshots
WHERE memory_tier = 'EXPIRED'
ORDER BY last_accessed ASC NULLS FIRST
LIMIT ?;
```
*Uses index: `idx_contexts_tier_accessed`*

---

**5. Get high-value contexts for pre-fetching:**
```sql
SELECT * FROM context_snapshots
WHERE project = ?
  AND prediction_score >= ?
ORDER BY prediction_score DESC
LIMIT ?;
```
*Uses index: `idx_context_snapshots_project_prediction`*

---

**6. Find stale predictions:**
```sql
SELECT * FROM context_snapshots
WHERE project = ?
  AND (last_predicted IS NULL
       OR last_predicted < datetime('now', '-24 hours'))
ORDER BY last_predicted ASC NULLS FIRST;
```
*Uses index: `idx_context_snapshots_last_predicted`*

---

## Data Types

### TEXT (String)

Used for:
- IDs (UUIDs as strings)
- Timestamps (ISO 8601 strings)
- JSON data (stringified objects)
- Human-readable text

**Why TEXT over VARCHAR?**
- SQLite treats TEXT and VARCHAR identically
- No arbitrary length limits
- Semantic clarity (TEXT = textual data)

---

### REAL (Float)

Used for:
- `prediction_score`: 0.0 to 1.0 decimal values

**Why REAL?**
- Fractional scores need decimal precision
- INTEGER (0-100) would lose granularity

---

### INTEGER

Used for:
- `access_count`: Whole number counts

**Why INTEGER?**
- Counts are always whole numbers
- Efficient storage and indexing

---

### DATETIME

Used for:
- `timestamp`: Creation time (default CURRENT_TIMESTAMP)

**Note:** In SQLite, DATETIME is stored as TEXT in ISO 8601 format internally.

---

## JSON Columns

Several columns store JSON-encoded data:

### metadata (Extensible Properties)
```json
{
  "userAgent": "Claude Desktop/1.0",
  "sessionId": "session-xyz",
  "customField": "custom value"
}
```

### dependencies (Related Context IDs)
```json
["context-id-1", "context-id-2", "context-id-3"]
```

### propagation_reason (Prediction Explanations)
```json
["recently_accessed", "causal_chain_root", "high_access_frequency"]
```

**Why JSON strings instead of separate tables?**
- Flexible schema (no migration needed for new fields)
- Simple queries (no joins required)
- Atomic updates (single row update)

**Trade-off:**
- ❌ Can't query inside JSON efficiently
- ✅ But these fields are for storage, not filtering

---

## Best Practices

### 1. Always Set Project

```typescript
// ✅ Good: Explicit project
await save({ project: "my-project", content: "..." });

// ❌ Bad: No project (violates NOT NULL)
await save({ content: "..." });
```

### 2. Update Access Tracking

```typescript
// ✅ Good: Track every access
await repository.updateAccessTracking(snapshotId);

// ❌ Bad: Load without tracking
const snapshot = await repository.findById(snapshotId);
// (Doesn't update last_accessed or access_count)
```

### 3. Recalculate Tiers Regularly

```typescript
// ✅ Good: Regular tier updates
cron.schedule('0 * * * *', async () => {
  await memoryManager.recalculateAllTiers();
});

// ❌ Bad: Stale tiers
// Contexts remain ACTIVE forever
```

### 4. Refresh Predictions

```typescript
// ✅ Good: Keep predictions fresh
await propagationEngine.updateProjectPredictions(project, 24);

// ❌ Bad: Stale predictions
// prediction_score based on week-old data
```

---

## Database Technology: Cloudflare D1

WakeIQX uses **Cloudflare D1** (SQLite at the edge):

**Benefits:**
- ✅ Distributed at edge locations (low latency)
- ✅ SQLite compatibility (standard SQL)
- ✅ ACID transactions
- ✅ Automatic backups

**Limitations:**
- ⚠️ Max 100,000 rows/database (free tier)
- ⚠️ Max 25 MB/database (free tier)
- ⚠️ Read-heavy workloads preferred

**Migration Path:**
- Can switch to PostgreSQL, MySQL, or any SQL database
- Schema is portable (standard SQL)
- Only adapter layer (`D1ContextRepository`) needs changes

---

## Further Reading

- [Architecture Overview →](/development/architecture)
- [Hexagonal Architecture →](/development/hexagonal-architecture)
- [Technology Stack →](/development/tech-stack)
- [Layer 1: Causality Engine →](/development/layer-1-causality)
- [Layer 2: Memory Manager →](/development/layer-2-memory)
- [Layer 3: Propagation Engine →](/development/layer-3-propagation)
