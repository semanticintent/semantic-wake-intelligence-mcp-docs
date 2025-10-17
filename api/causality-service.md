# CausalityService

Layer 1 service that tracks decision causality and enables reasoning reconstruction.

## Overview

`CausalityService` is the implementation of Layer 1 (Causality Engine). It tracks WHY contexts were created by maintaining causal relationships and enabling backwards traversal through decision history.

**Location**: `src/domain/services/CausalityService.ts`

**Layer**: Layer 1 - Past (WHY)

**Purpose**: Understand historical causality and decision chains

---

## Constructor

```typescript
constructor(private readonly repository: IContextRepository)
```

**Parameters:**
- `repository`: Database abstraction for context storage

**Dependency Injection**: Repository is injected, not created internally (testable, swappable)

---

## Methods

### `buildCausalChain(snapshotId: string): Promise<CausalChainNode[]>`

Trace decision history backwards from a context to its root cause.

**Parameters:**
- `snapshotId`: Starting context ID to trace from

**Returns**: Array of `CausalChainNode` with root at index 0

**Algorithm:**
```typescript
1. Start at target snapshot
2. Look up snapshot in repository
3. Check if it has causedBy parent
4. If yes, fetch parent and add to chain
5. Repeat until causedBy is null (root found)
6. Return chain with root first
```

**Example:**
```typescript
const chain = await causalityService.buildCausalChain('decision-id');

// Returns:
// [
//   { snapshot: {...}, depth: 0 },  // Root (conversation)
//   { snapshot: {...}, depth: 1 },  // Research
//   { snapshot: {...}, depth: 2 }   // Decision
// ]
```

**Edge Cases:**
- Circular references: Prevented by `visited` set
- Broken chains: Stops at missing parent
- Single node: Returns array with one element

**Performance**: O(n) where n = chain length (typically 3-10)

---

### `reconstructReasoning(snapshotId: string): Promise<string>`

Generate human-readable explanation of why a context was created.

**Parameters:**
- `snapshotId`: Context to explain

**Returns**: Formatted markdown string

**Example:**
```typescript
const reasoning = await causalityService.reconstructReasoning('abc-123');

// Returns:
// **Action Type**: decision
//
// **Rationale**: OAuth2 with PKCE is more secure than JWT
//
// **Context Summary**: Decision to use OAuth2 for mobile app
```

**Format:**
```
**Action Type**: {actionType}

**Rationale**: {rationale}

**Context Summary**: {summary}
```

**Edge Cases:**
- No causality metadata: Returns summary only
- Missing rationale: Shows "No rationale provided"

---

### `getCausalityStats(project: string): Promise<CausalityStats>`

Get aggregate statistics on causal relationships for a project.

**Parameters:**
- `project`: Project to analyze

**Returns**: Statistics object

**Return Type:**
```typescript
interface CausalityStats {
  totalWithCausality: number;
  averageChainLength: number;
  actionTypeCounts: Record<ActionType, number>;
  rootCauses: number;
}
```

**Example:**
```typescript
const stats = await causalityService.getCausalityStats('my-project');

// Returns:
// {
//   totalWithCausality: 42,
//   averageChainLength: 3.5,
//   actionTypeCounts: {
//     conversation: 10,
//     research: 15,
//     decision: 12,
//     file_edit: 5,
//     tool_use: 0
//   },
//   rootCauses: 10
// }
```

**Performance**:
- Queries all contexts for project
- Samples 10 chains for average length calculation
- O(n) where n = context count

---

## Types

### `CausalChainNode`

```typescript
interface CausalChainNode {
  snapshot: IContextSnapshot;
  causedBy: CausalChainNode | null;
  children: CausalChainNode[];
  depth: number;  // Distance from root (0 = root)
}
```

### `ActionType`

```typescript
type ActionType =
  | 'conversation'  // User dialogue
  | 'decision'      // Strategic choice
  | 'file_edit'     // Code modification
  | 'tool_use'      // External tool
  | 'research';     // Information gathering
```

---

## Usage Examples

### Build and Display Chain

```typescript
const chain = await causalityService.buildCausalChain('decision-id');

console.log(`Chain has ${chain.length} steps:`);
for (const node of chain) {
  const indent = '  '.repeat(node.depth);
  console.log(`${indent}- ${node.snapshot.causality?.actionType}: ${node.snapshot.summary}`);
}

// Output:
// Chain has 3 steps:
// - conversation: User asks about authentication
//   - research: OAuth2 best practices research
//     - decision: Use OAuth2 with PKCE
```

### Find Root Causes

```typescript
const stats = await causalityService.getCausalityStats('my-project');
console.log(`Project has ${stats.rootCauses} root causes`);

// Root causes are entry points - user questions, external events
```

### Explain Decision

```typescript
const reasoning = await causalityService.reconstructReasoning('decision-id');
console.log(reasoning);

// Shows:
// - What type of action created it
// - Why it was created (rationale)
// - What the context is about (summary)
```

---

## Best Practices

### 1. Always Set causedBy When Relevant

```typescript
// ✅ Good: Links to parent
save_context({
  content: 'Implementation...',
  metadata: {
    causedBy: decisionId,
    actionType: 'file_edit'
  }
});

// ❌ Bad: Orphaned context
save_context({
  content: 'Implementation...'
});
```

### 2. Use Appropriate Action Types

Choose the type that best describes what happened:
- User asked question → `conversation`
- You researched → `research`
- You made choice → `decision`
- You wrote code → `file_edit`
- You ran tool → `tool_use`

### 3. Provide Clear Rationale

```typescript
// ✅ Good: Clear reasoning
metadata: {
  rationale: 'OAuth2 with PKCE prevents auth code interception on mobile'
}

// ❌ Bad: Vague
metadata: {
  rationale: 'Better security'
}
```

---

## Testing

### Unit Test Example

```typescript
describe('CausalityService', () => {
  it('builds 3-level causal chain', async () => {
    const mockRepo = {
      findById: jest.fn()
        .mockResolvedValueOnce({
          id: '3',
          causality: { causedBy: '2' }
        })
        .mockResolvedValueOnce({
          id: '2',
          causality: { causedBy: '1' }
        })
        .mockResolvedValueOnce({
          id: '1',
          causality: { causedBy: null }  // Root
        })
    };

    const service = new CausalityService(mockRepo);
    const chain = await service.buildCausalChain('3');

    expect(chain).toHaveLength(3);
    expect(chain[0].snapshot.id).toBe('1');  // Root first
    expect(chain[2].snapshot.id).toBe('3');  // Target last
  });
});
```

---

## Error Handling

### Context Not Found

```typescript
try {
  const chain = await causalityService.buildCausalChain('invalid-id');
} catch (error) {
  // Handle: Context doesn't exist or was pruned
}
```

### Circular Chain Detection

The algorithm prevents infinite loops:

```typescript
const visited = new Set<string>();

while (currentId && !visited.has(currentId)) {
  visited.add(currentId);
  // Process...
}
```

If a circular reference exists, the chain stops at the cycle point.

---

## Integration with Other Layers

### With Layer 2 (Memory)

Causal position affects memory importance:
- Root causes often stay in ACTIVE/RECENT tiers longer
- Leaf nodes may be archived faster

### With Layer 3 (Propagation)

Causal position affects prediction score:
- Root causes get +0.3 score boost
- Decision nodes get +0.2 boost
- Branch points get +0.1 boost

---

## See Also

- [API Overview](/api/overview) - Service architecture
- [ContextSnapshot](/api/context-snapshot) - Entity with causality metadata
- [Layer 1: Causality Engine](/development/layer-1-causality) - Concepts and design
- [build_causal_chain tool](/tools/build-causal-chain) - MCP tool usage
- [reconstruct_reasoning tool](/tools/reconstruct-reasoning) - MCP tool usage
