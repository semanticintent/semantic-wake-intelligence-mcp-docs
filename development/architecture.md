# 3-Layer Brain Architecture

WakeIQX implements a **temporal intelligence brain** with three specialized layers that work together to provide AI agents with sophisticated context awareness across time dimensions.

## The Three Layers
n::: tip Research Foundation
The 3-layer temporal architecture (Past-Present-Future) implements principles from semantic intent research. This design treats context as a living graph where each node carries semantic meaning about **why** it exists, **how** it remains relevant, and **what** future value it holds.

📚 **Read the foundational research**: [Semantic Intent as Single Source of Truth](https://semanticintent.dev/papers/semantic-intent-ssot)
:::

```
┌─────────────────────────────────────────────────────┐
│  Layer 3: PROPAGATION ENGINE (Future - WHAT)        │
│  Predicts which contexts will be needed next         │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│  Layer 2: MEMORY MANAGER (Present - HOW)            │
│  Manages context relevance and lifecycle            │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│  Layer 1: CAUSALITY ENGINE (Past - WHY)             │
│  Tracks decision history and reasoning chains       │
└─────────────────────────────────────────────────────┘
```

## Overview

Each layer serves a distinct temporal purpose:

### 🔍 Layer 1: Causality Engine (Past)
**Answers: "WHY was this context created?"**

Tracks the causal relationships between contexts, allowing you to:
- Trace decision history backwards through time
- Understand what led to each context being created
- Reconstruct reasoning chains from root causes
- Analyze action types and their dependencies

**Key Features:**
- Causal chain tracking with `causedBy` relationships
- Action type classification (conversation, decision, file_edit, tool_use, research)
- Reasoning reconstruction from any point in time
- Analytics on decision patterns

[Learn more about Layer 1 →](/development/layer-1-causality)

---

### 💾 Layer 2: Memory Manager (Present)
**Answers: "HOW relevant is this context now?"**

Manages the lifecycle and accessibility of contexts using memory tiers:
- **ACTIVE** (< 1 hour): Hot, frequently accessed contexts
- **RECENT** (1-24 hours): Warm, recently used contexts
- **ARCHIVED** (1-30 days): Cold, aging contexts
- **EXPIRED** (> 30 days): Candidates for pruning

**Key Features:**
- Automatic tier classification based on access patterns
- LRU (Least Recently Used) tracking
- Memory pressure management
- Intelligent pruning of expired contexts

[Learn more about Layer 2 →](/development/layer-2-memory)

---

### 🔮 Layer 3: Propagation Engine (Future)
**Answers: "WHAT contexts will be needed next?"**

Predicts future context relevance using multi-factor scoring:
- Temporal momentum (recent access patterns)
- Causal chain position (root causes are more valuable)
- Access frequency (popular contexts are more likely to be reused)

**Key Features:**
- Prediction scoring (0.0 to 1.0)
- Pre-fetching optimization
- High-value context identification
- Propagation reason tracking

[Learn more about Layer 3 →](/development/layer-3-propagation)

---

## How the Layers Work Together

### Example: AI Agent Conversation Flow

```typescript
// User starts a new conversation
save_context({
  project: "user-123",
  content: "I want to refactor the authentication system",
  metadata: {
    actionType: "conversation",
    causedBy: null  // Root cause
  }
})
// → Layer 1: Records as root cause
// → Layer 2: Marks as ACTIVE tier
// → Layer 3: Initializes prediction score

// Agent researches the codebase
save_context({
  project: "user-123",
  content: "Authentication is in src/auth/*.ts with JWT tokens",
  metadata: {
    actionType: "research",
    causedBy: "<previous-context-id>"  // Causal link
  }
})
// → Layer 1: Links to parent context
// → Layer 2: Marks as ACTIVE tier
// → Layer 3: Scores high (recent + causal chain)

// Agent makes a decision
save_context({
  project: "user-123",
  content: "Decision: Use OAuth2 instead of JWT for better security",
  metadata: {
    actionType: "decision",
    causedBy: "<research-context-id>"
  }
})
// → Layer 1: Extends causal chain
// → Layer 2: ACTIVE tier, high access count
// → Layer 3: Very high score (decision nodes are valuable)

// Next day - Agent continues work
load_context({ project: "user-123" })
// → Layer 1: Reconstructs reasoning chain
// → Layer 2: Updates tiers (yesterday's contexts now RECENT)
// → Layer 3: Predicts high-value contexts to pre-fetch

update_predictions({ project: "user-123" })
// → Layer 3: Recalculates all prediction scores

get_high_value_contexts({ project: "user-123", minScore: 0.6 })
// → Returns: Decision context (0.85), Research context (0.72)
// → Pre-fetch these for faster access
```

---

## Design Principles

### 1. **Temporal Separation of Concerns**
Each layer focuses on one time dimension:
- Layer 1: Historical causality (past)
- Layer 2: Current relevance (present)
- Layer 3: Predictive value (future)

### 2. **Observable Operations**
All layer operations are:
- **Deterministic**: Same input → same output
- **Traceable**: Full audit trail
- **Testable**: Unit tests for all components

### 3. **Performance Optimization**
- Layer 1: Lazy chain building (only when needed)
- Layer 2: Efficient tier recalculation
- Layer 3: Cached predictions with staleness tracking

### 4. **Scalability**
- Layers operate independently
- Async operations for heavy computations
- Efficient database queries with proper indexing

---

## Architecture Patterns

WakeIQX uses **Hexagonal Architecture** (Ports & Adapters) to maintain clean separation:

```
┌───────────────────────────────────────────────┐
│           Presentation Layer                   │
│  (MCP Protocol, HTTP Endpoints)                │
└───────────────┬───────────────────────────────┘
                │
┌───────────────▼───────────────────────────────┐
│           Application Layer                    │
│  (ToolExecutionHandler, MCPProtocolHandler)    │
└───────────────┬───────────────────────────────┘
                │
┌───────────────▼───────────────────────────────┐
│             Domain Layer                       │
│  ┌─────────────────────────────────────────┐  │
│  │  ContextService (Orchestrator)          │  │
│  └──┬────────────┬────────────┬────────────┘  │
│     │            │            │                │
│  ┌──▼──────┐ ┌──▼────────┐ ┌─▼────────────┐  │
│  │ Layer 1 │ │  Layer 2  │ │   Layer 3    │  │
│  │Causality│ │  Memory   │ │ Propagation  │  │
│  └─────────┘ └───────────┘ └──────────────┘  │
└───────────────┬───────────────────────────────┘
                │
┌───────────────▼───────────────────────────────┐
│        Infrastructure Layer                    │
│  (D1Repository, Workers AI, KV Store)          │
└───────────────────────────────────────────────┘
```

[Learn more about Hexagonal Architecture →](/development/hexagonal-architecture)

---

## Technology Stack

- **Runtime**: Cloudflare Workers (Edge computing)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **AI**: Cloudflare Workers AI (llama-3.1-8b-instruct)
- **Protocol**: Model Context Protocol (MCP)
- **Language**: TypeScript with strict typing

[Learn more about the Tech Stack →](/development/tech-stack)

---

## Database Schema

All three layers share a unified `context_snapshots` table with specialized columns:

```sql
CREATE TABLE context_snapshots (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,

  -- Core data
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT,

  -- Layer 1: Causality columns
  action_type TEXT,
  caused_by TEXT,
  rationale TEXT,

  -- Layer 2: Memory columns
  memory_tier TEXT,
  last_accessed TEXT,
  access_count INTEGER DEFAULT 0,

  -- Layer 3: Propagation columns
  prediction_score REAL,
  prediction_reasons TEXT,
  last_predicted TEXT,

  -- Timestamps
  timestamp TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),

  -- Indexes for performance
  INDEX idx_project ON context_snapshots(project),
  INDEX idx_memory_tier ON context_snapshots(memory_tier),
  INDEX idx_prediction_score ON context_snapshots(prediction_score DESC)
);
```

[Learn more about Database Schema →](/development/database-schema)

---

## Next Steps

- [Explore Layer 1: Causality Engine →](/development/layer-1-causality)
- [Explore Layer 2: Memory Manager →](/development/layer-2-memory)
- [Explore Layer 3: Propagation Engine →](/development/layer-3-propagation)
- [Browse MCP Tools →](/tools/overview)
- [View API Reference →](/api/overview)
