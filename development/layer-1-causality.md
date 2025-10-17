# Layer 1: Causality Engine (Past - WHY)

The **Causality Engine** is the foundation of WakeIQX's temporal intelligence. It tracks the **causal relationships** between contexts, allowing you to understand **why** decisions were made and **how** contexts are connected through time.

n::: tip Semantic Intent Research
The Causality Engine implements backward causal reasoning - understanding not just **what** happened, but **why** it happened. This follows semantic intent principles where every context carries its creation rationale as intrinsic metadata.

📚 [Explore the research →](https://semanticintent.dev/papers/semantic-intent-ssot)
:::
## Core Concept

Every context in WakeIQX can be linked to a **parent context** that caused it to be created. This creates a **causal chain** that traces decision history backwards through time.

```
Root Cause (User asks question)
    ↓
Research (Agent searches codebase)
    ↓
Decision (Agent chooses approach)
    ↓
Implementation (Agent writes code)
    ↓
Testing (Agent verifies changes)
```

## Key Features

### 1. Causal Chain Tracking

Each context can store:
- **`causedBy`**: ID of the parent context
- **`actionType`**: What type of action created this context
- **`rationale`**: Why this context was created

**Example:**
```typescript
save_context({
  project: "refactor-auth",
  content: "Decision: Use OAuth2 with PKCE flow for mobile app authentication",
  metadata: {
    actionType: "decision",
    causedBy: "research-context-id",
    rationale: "OAuth2 with PKCE is more secure than basic JWT for mobile apps"
  }
})
```

### 2. Action Types

The Causality Engine classifies contexts into 5 action types:

| Action Type | Description | Example |
|------------|-------------|---------|
| **conversation** | User interaction or dialogue | User asks a question |
| **decision** | Strategic choice or determination | Choosing an architecture pattern |
| **file_edit** | Code or document modification | Updating a function |
| **tool_use** | External tool invocation | Running tests, deploying code |
| **research** | Information gathering | Reading documentation, analyzing code |

These types help understand **what kind of work** produced each context.

### 3. Reasoning Reconstruction

The `reconstruct_reasoning` tool explains **why** a context was created by analyzing its causality metadata.

**Example:**
```typescript
reconstruct_reasoning({
  snapshotId: "decision-context-id"
})

// Returns:
// **Action Type**: decision
//
// **Rationale**: OAuth2 with PKCE is more secure than basic JWT for mobile apps
//
// **Context Summary**: Decision: Use OAuth2 with PKCE flow for mobile app authentication
```

### 4. Causal Chain Building

The `build_causal_chain` tool traces the entire history backwards from any context to its root cause.

**Example:**
```typescript
build_causal_chain({
  snapshotId: "implementation-context-id"
})

// Returns:
// Causal Chain (4 steps):
//
// 1. **conversation** (2025-10-17T10:00:00Z)
//    User: "I want to improve our mobile app authentication"
//
//   2. **research** (2025-10-17T10:05:00Z)
//      Research findings: OAuth2 with PKCE is industry standard for mobile
//
//     3. **decision** (2025-10-17T10:15:00Z)
//        Decision: Use OAuth2 with PKCE flow for mobile app authentication
//
//       4. **implementation** (2025-10-17T10:30:00Z)
//          Implemented OAuth2 PKCE flow in AuthService.ts
```

Notice how the chain shows increasing **depth** (indentation) as it traces backwards.

---

## Use Cases

### 1. Debugging Decision History

When an AI agent makes a surprising decision, trace back to understand its reasoning:

```typescript
// Agent made an unusual choice
const context = load_context({ project: "my-project", limit: 1 })[0];

// What led to this?
const chain = build_causal_chain({ snapshotId: context.id });

// Now you can see the entire reasoning path
```

### 2. Accountability & Auditability

Maintain a complete audit trail of all decisions:

```typescript
// Get causality stats for a project
get_causality_stats({ project: "my-project" })

// Returns:
// - How many contexts have causal links
// - Distribution of action types
// - Number of root causes vs. derived contexts
// - Average chain length
```

### 3. Context Continuity

When resuming work, understand the current state by reviewing the causal chain:

```typescript
// Load recent context
const contexts = load_context({ project: "my-project", limit: 1 });

// See how we got here
const history = build_causal_chain({ snapshotId: contexts[0].id });
```

---

## MCP Tools

### [`reconstruct_reasoning`](/tools/reconstruct-reasoning)
Explain WHY a specific context was created.

**Input:**
- `snapshotId` (string): ID of context to analyze

**Returns:** Human-readable explanation including:
- Action type
- Rationale
- Context summary

**Example:**
```typescript
reconstruct_reasoning({
  snapshotId: "abc-123-def"
})
```

---

### [`build_causal_chain`](/tools/build-causal-chain)
Trace decision history backwards from a context to its root cause.

**Input:**
- `snapshotId` (string): Starting point for chain traversal

**Returns:** Ordered list of contexts from root (index 0) to target, with:
- Action type
- Timestamp
- Summary
- Increasing depth/indentation

**Example:**
```typescript
build_causal_chain({
  snapshotId: "xyz-789-uvw"
})
```

---

### [`get_causality_stats`](/tools/get-causality-stats)
Get analytics on causal relationships for a project.

**Input:**
- `project` (string): Project to analyze

**Returns:** Statistics including:
- Total contexts with causality data
- Action type distribution
- Number of root causes
- Average chain length

**Example:**
```typescript
get_causality_stats({
  project: "my-project"
})
```

---

## Implementation Details

### Database Schema

Layer 1 uses these columns in `context_snapshots`:

```sql
-- Causality columns
action_type TEXT,      -- conversation|decision|file_edit|tool_use|research
caused_by TEXT,        -- Parent context ID (NULL for root causes)
rationale TEXT         -- Why this context was created
```

### Causal Chain Algorithm

```typescript
async buildCausalChain(snapshotId: string): Promise<CausalChainNode[]> {
  const chain: CausalChainNode[] = [];
  const visited = new Set<string>();

  let currentId = snapshotId;
  let depth = 0;

  // Traverse backwards to root
  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);

    const snapshot = await repository.findById(currentId);
    if (!snapshot) break;

    chain.unshift({  // Add to front (root at index 0)
      snapshot,
      depth,
      causedBy: snapshot.causality?.causedBy || null
    });

    currentId = snapshot.causality?.causedBy || null;
    depth++;
  }

  return chain;
}
```

The algorithm:
1. Starts at the target snapshot
2. Follows `causedBy` links backwards
3. Prevents infinite loops with `visited` set
4. Returns chain with root at index 0

---

## Design Philosophy

### Observable Operations

All causality operations are:
- **Deterministic**: Same input always produces same output
- **Auditable**: Every causal link is explicitly stored
- **Traceable**: Can reconstruct full history at any time

### Performance Considerations

- **Lazy evaluation**: Chains are only built when requested
- **Depth limiting**: Prevents runaway chain traversal
- **Caching**: Repeated chain builds use cached results

### Error Handling

- **Broken chains**: If a parent context is deleted, chain stops at that point
- **Circular references**: Detected and prevented by `visited` set
- **Missing contexts**: Gracefully handled, chain continues with available data

---

## Best Practices

### 1. Always Link Related Contexts

When one context directly leads to another, set `causedBy`:

```typescript
// ✅ Good: Links contexts
save_context({
  content: "Implementation based on previous decision",
  metadata: {
    causedBy: decisionContextId,
    actionType: "file_edit"
  }
})

// ❌ Bad: Orphaned context
save_context({
  content: "Implementation based on previous decision"
  // No causal link!
})
```

### 2. Use Appropriate Action Types

Choose the action type that best describes what created the context:

- **conversation**: User input or dialogue
- **research**: Gathering information
- **decision**: Making a choice
- **file_edit**: Writing code
- **tool_use**: Running external tools

### 3. Provide Clear Rationale

The `rationale` field helps future readers understand your thinking:

```typescript
// ✅ Good: Clear rationale
metadata: {
  rationale: "Chose Redis over Memcached because we need data persistence"
}

// ❌ Bad: Vague rationale
metadata: {
  rationale: "Seems better"
}
```

---

## Next Steps

- [Learn about Layer 2: Memory Manager →](/development/layer-2-memory)
- [Learn about Layer 3: Propagation Engine →](/development/layer-3-propagation)
- [See causality tools in action →](/tools/overview)
- [View API Reference →](/api/causality-service)
