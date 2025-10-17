# reconstruct_reasoning

Explain WHY a context was created by analyzing its causality metadata.

## Overview

The `reconstruct_reasoning` tool is part of Layer 1 (Causality Engine). It examines a context's causality metadata to explain the reasoning behind its creation.

**Layer**: Layer 1 - Causality Engine (Past)

**Purpose**: Understand the "why" behind decisions and actions

**Temporal Focus**: Past - reconstructing historical reasoning

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `snapshotId` | string | Yes | ID of the context to analyze |

### Parameter Details

#### `snapshotId`
The unique identifier (UUID) of the context snapshot to analyze.

**How to get IDs:**
- From `save_context` response
- From `load_context` results
- From database queries

---

## Returns

Formatted text explaining the reasoning:

```
**Action Type**: decision

**Rationale**: OAuth2 with PKCE is more secure than basic JWT for mobile apps because it prevents authorization code interception

**Context Summary**: Decision to use OAuth2 with PKCE flow for mobile app authentication
```

**Fields explained:**
- **Action Type**: What kind of action created this (conversation, decision, file_edit, tool_use, research)
- **Rationale**: Explicit reasoning saved with the context
- **Context Summary**: AI-generated summary of the content

---

## Examples

### Basic Usage

```typescript
// First, save a context with rationale
save_context({
  project: "auth-refactor",
  content: "Switch to OAuth2 for better security",
  metadata: {
    actionType: "decision",
    rationale: "OAuth2 provides better token management and security"
  }
});

// Later, reconstruct the reasoning
reconstruct_reasoning({
  snapshotId: "abc-123-def-456"
});
```

**Result:**
```
**Action Type**: decision

**Rationale**: OAuth2 provides better token management and security

**Context Summary**: Switch to OAuth2 for better security
```

---

### Understand Past Decisions

```typescript
// Load a recent context
const contexts = load_context({ project: "my-project", limit: 1 });

// Extract ID (parse from text response)
const contextId = parseId(contexts);

// Understand why this decision was made
reconstruct_reasoning({ snapshotId: contextId });
```

---

## Use Cases

### 1. Decision Auditing

Track why choices were made:

```typescript
reconstruct_reasoning({ snapshotId: "decision-id" });

// Returns the explicit rationale
// Useful for reviews and post-mortems
```

### 2. Knowledge Transfer

Help new team members understand context:

```typescript
// New developer asks: "Why did we choose Redis?"
const contexts = search_context({ query: "Redis" });

// Get the decision context ID
reconstruct_reasoning({ snapshotId: "redis-decision-id" });

// Shows the original rationale
```

### 3. Debugging Decision Chains

Trace back through a series of decisions:

```typescript
// Current state isn't what you expected
// Reconstruct reasoning at each step

reconstruct_reasoning({ snapshotId: "latest-decision" });
reconstruct_reasoning({ snapshotId: "previous-decision" });
reconstruct_reasoning({ snapshotId: "original-decision" });
```

---

## Action Types

The `actionType` field classifies what created the context:

| Type | Description | Example |
|------|-------------|---------|
| `conversation` | User dialogue/question | User asks: "How should we handle auth?" |
| `decision` | Strategic choice | Decision: Use OAuth2 |
| `file_edit` | Code modification | Implemented OAuth2 flow in auth.ts |
| `tool_use` | External tool call | Ran tests, deployed to staging |
| `research` | Information gathering | Researched OAuth2 vs JWT security |

---

## Integration with Layer 1

### Combine with build_causal_chain

```typescript
// Build the full chain
const chain = build_causal_chain({ snapshotId: "decision-id" });

// Then reconstruct reasoning for each step
// (You'd iterate through the chain)
reconstruct_reasoning({ snapshotId: "step-1-id" });
reconstruct_reasoning({ snapshotId: "step-2-id" });
reconstruct_reasoning({ snapshotId: "step-3-id" });
```

This gives you both the **structure** (chain) and **semantics** (reasoning).

---

## Best Practices

### 1. Always Provide Rationale When Saving

```typescript
// ✅ Good: Includes rationale
save_context({
  content: "Decision: Use PostgreSQL",
  metadata: {
    actionType: "decision",
    rationale: "Need JSONB support and better concurrent writes than MySQL"
  }
});

// ❌ Bad: No rationale
save_context({
  content: "Decision: Use PostgreSQL",
  metadata: {
    actionType: "decision"
  }
});
```

### 2. Use Descriptive Action Types

Choose the action type that best describes what happened:
- User asked question → `conversation`
- You gathered info → `research`
- You made choice → `decision`
- You wrote code → `file_edit`
- You ran tool → `tool_use`

### 3. Combine with Search

```typescript
// Find decision contexts
const decisions = search_context({ query: "decision database" });

// Extract ID and reconstruct reasoning
reconstruct_reasoning({ snapshotId: decisionId });
```

---

## See Also

- [build_causal_chain](/tools/build-causal-chain) - Trace full decision history
- [get_causality_stats](/tools/get-causality-stats) - Analytics on causality
- [Layer 1: Causality Engine](/development/layer-1-causality) - Understanding causality tracking
- [save_context](/tools/save-context) - How to save with causality metadata
