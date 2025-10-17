# build_causal_chain

Trace decision history backwards through time to see how contexts influenced each other.

## Overview

The `build_causal_chain` tool is part of Layer 1 (Causality Engine). It follows `causedBy` links backwards from a target context to its root cause, revealing the complete decision history.

**Layer**: Layer 1 - Causality Engine (Past)

**Purpose**: Visualize how decisions led to outcomes

**Temporal Focus**: Past - tracing historical causality

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `snapshotId` | string | Yes | Starting context ID to trace backwards from |

### Parameter Details

#### `snapshotId`
The UUID of the context where you want to start tracing. The tool will follow `causedBy` links backwards until it reaches a root cause (context with no parent).

---

## Returns

Formatted text showing the causal chain with increasing indentation:

```
Causal Chain (4 steps):

1. **conversation** (2025-10-17T10:00:00Z)
   User: "I want to improve our mobile app authentication"

  2. **research** (2025-10-17T10:05:00Z)
     Research findings: OAuth2 with PKCE is industry standard for mobile

    3. **decision** (2025-10-17T10:15:00Z)
       Decision: Use OAuth2 with PKCE flow for mobile app authentication

      4. **file_edit** (2025-10-17T10:30:00Z)
         Implemented OAuth2 PKCE flow in AuthService.ts
```

**Indentation indicates depth:**
- Root cause (index 0): No indentation
- Direct child (index 1): 2 spaces
- Grandchild (index 2): 4 spaces
- Great-grandchild (index 3): 6 spaces

---

## Examples

### Basic Usage

```typescript
// Save contexts with causal links
const q = save_context({
  project: "feature-x",
  content: "User asks: Should we use GraphQL?",
  metadata: { actionType: "conversation" }
});

const r = save_context({
  project: "feature-x",
  content: "Research: GraphQL adds complexity we don't need",
  metadata: {
    actionType: "research",
    causedBy: q.id
  }
});

const d = save_context({
  project: "feature-x",
  content: "Decision: Stick with REST API",
  metadata: {
    actionType: "decision",
    causedBy: r.id
  }
});

// Build chain from decision back to question
build_causal_chain({ snapshotId: d.id });
```

**Result:**
```
Causal Chain (3 steps):

1. **conversation** (2025-10-17T10:00:00Z)
   User asks: Should we use GraphQL?

  2. **research** (2025-10-17T10:05:00Z)
     Research: GraphQL adds complexity we don't need

    3. **decision** (2025-10-17T10:10:00Z)
       Decision: Stick with REST API
```

---

### Trace Bug Investigation

```typescript
// Bug report (root)
const bug = save_context({
  project: "bug-500",
  content: "Users reporting 500 errors on login",
  metadata: { actionType: "conversation" }
});

// Investigation (child)
const investigation = save_context({
  project: "bug-500",
  content: "Found: Database connection pool exhaustion",
  metadata: {
    actionType: "research",
    causedBy: bug.id
  }
});

// Fix (grandchild)
const fix = save_context({
  project: "bug-500",
  content: "Increased pool size from 10 to 50 connections",
  metadata: {
    actionType: "file_edit",
    causedBy: investigation.id
  }
});

// Build chain
build_causal_chain({ snapshotId: fix.id });
```

Shows the complete bug investigation trail.

---

## Use Cases

### 1. Post-Mortem Analysis

After an incident, trace back to understand what led to it:

```typescript
build_causal_chain({ snapshotId: "incident-context-id" });

// See the full sequence:
// Initial symptom → Investigation → Root cause → Fix
```

### 2. Decision Justification

Explain to stakeholders why a decision was made:

```typescript
build_causal_chain({ snapshotId: "architecture-decision-id" });

// Shows:
// User requirement → Research → Technical analysis → Decision
```

### 3. Knowledge Transfer

Help new team members understand project history:

```typescript
// "Why did we build it this way?"
build_causal_chain({ snapshotId: "implementation-context-id" });

// Reveals the original reasoning
```

### 4. Debugging Incorrect Outcomes

When something went wrong, trace back to find where:

```typescript
build_causal_chain({ snapshotId: "current-state-id" });

// Identify which decision led to the problem
```

---

## Algorithm

The tool uses a **backwards traversal** algorithm:

```
1. Start at target snapshot
2. Look up snapshot in database
3. Check if it has a `causedBy` parent
4. If yes, fetch parent and repeat
5. If no, this is the root cause - stop
6. Return chain with root at index 0
```

**Cycle prevention:**
- Maintains a `visited` set
- Stops if same ID seen twice
- Prevents infinite loops

---

## Chain Properties

### Root Causes
Contexts with `causedBy: null` are **root causes**:
- User questions
- External events
- Initial bug reports
- Project kickoffs

### Leaf Nodes
The snapshot you pass to `build_causal_chain` is the **leaf node**:
- Final implementation
- End result
- Current state

### Branch Points
Some contexts have **multiple children** (not shown in chain):
- One research finding → Multiple implementation approaches
- One decision → Multiple sub-tasks

To see branches, use `get_causality_stats`.

---

## Integration with Other Tools

### With reconstruct_reasoning

```typescript
// Get the chain structure
const chain = build_causal_chain({ snapshotId: "decision-id" });

// Then get detailed reasoning for each step
// (Parse chain and iterate)
reconstruct_reasoning({ snapshotId: "step-1-id" });
reconstruct_reasoning({ snapshotId: "step-2-id" });
```

Combines structure + semantics.

---

### With get_causality_stats

```typescript
// See overall causality metrics
get_causality_stats({ project: "my-project" });

// Then drill down into specific chains
build_causal_chain({ snapshotId: "interesting-context-id" });
```

---

## Best Practices

### 1. Always Set causedBy

```typescript
// ✅ Good: Links contexts
save_context({
  content: "Implementation of feature X",
  metadata: {
    causedBy: decisionContextId,
    actionType: "file_edit"
  }
});

// ❌ Bad: Orphaned context
save_context({
  content: "Implementation of feature X"
  // No causal link!
});
```

### 2. Use Meaningful Action Types

The chain is more readable when action types are accurate:
- conversation → research → decision → file_edit (logical flow)

### 3. Keep Chains Focused

Don't link unrelated contexts just because they're temporal neighbors:
```typescript
// ✅ Good: Causal link
decision → implementation (caused by decision)

// ❌ Bad: Coincidental link
lunch break → bug fix (not causally related)
```

---

## Limitations

### No Forward Traversal
Currently only goes **backwards** (child → parent). To see children of a context, use database queries.

### No Branch Visualization
Shows one path through the tree. Doesn't show sibling branches.

**Example:**
```
Root
├── Branch A → Decision A
└── Branch B → Decision B
```

`build_causal_chain` shows only one branch.

### Chain Length Limits
Very long chains (100+ steps) may timeout. Most chains are 3-10 steps.

---

## See Also

- [reconstruct_reasoning](/tools/reconstruct-reasoning) - Get reasoning for each step
- [get_causality_stats](/tools/get-causality-stats) - Causality analytics
- [Layer 1: Causality Engine](/development/layer-1-causality) - Learn about causal tracking
- [save_context](/tools/save-context) - How to save with causality metadata
