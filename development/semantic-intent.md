# Semantic Intent Pattern

The **Semantic Intent Pattern** is a code documentation philosophy used throughout WakeIQX. Every file, class, and function explicitly declares **why it exists** and **what it means** in the larger system.

## What is Semantic Intent?

Traditional code comments explain **what** the code does. Semantic Intent comments explain **why** the code exists and **what semantic meaning** it carries.

```typescript
// ❌ Traditional comment: WHAT
// This function saves data to database
async function save(data) { ... }

// ✅ Semantic Intent: WHY
/**
 * 🎯 SEMANTIC INTENT: Persist conversational context for future retrieval
 *
 * PURPOSE: Enable AI agents to resume work across sessions
 *
 * SEMANTIC MEANING:
 * - "Save" = Make context durable and retrievable
 * - "Context" = Conversational state + metadata + causal links
 * - "Session" = Temporal boundary for agent work
 */
async function saveContext(input: SaveContextInput) { ... }
```

---

## Why Semantic Intent?

### 1. **Clarity of Purpose**

Code should explain **why it exists**, not just what it does:

```typescript
/**
 * 🎯 SEMANTIC INTENT: Track WHY contexts were created
 *
 * PURPOSE: Enable reasoning reconstruction and decision tracing
 *
 * LAYER 1 RESPONSIBILITY:
 * - Build causal chains backwards through time
 * - Identify root causes vs. derived contexts
 * - Classify action types (conversation, decision, file_edit, etc.)
 */
export class CausalityService { ... }
```

Now readers instantly understand:
- ✅ This is Layer 1 (temporal focus: past)
- ✅ It handles causality tracking
- ✅ It's about understanding "why" decisions were made

### 2. **Semantic Boundaries**

Each layer/component has clear semantic boundaries:

```typescript
/**
 * 🎯 SEMANTIC INTENT: MCP Protocol Message Handler
 *
 * PURPOSE: Handle MCP/JSON-RPC protocol semantics
 *
 * APPLICATION RESPONSIBILITY:
 * - Parse and validate MCP requests
 * - Dispatch to appropriate handlers
 * - Format responses per MCP specification
 * - Maintain protocol compliance
 *
 * NOT RESPONSIBLE FOR:
 * - Business logic (that's domain layer)
 * - Database operations (that's infrastructure)
 * - HTTP routing (that's presentation layer)
 */
export class MCPProtocolHandler { ... }
```

### 3. **Onboarding & Maintenance**

New developers can understand the system architecture by reading semantic intent comments:

```typescript
/**
 * 🎯 SEMANTIC INTENT: Temporal Intelligence Brain
 *
 * PURPOSE: Orchestrate past/present/future analysis of contexts
 *
 * LAYER COORDINATION:
 * - Layer 1 (CausalityService): WHY was this created? (past)
 * - Layer 2 (MemoryManager): HOW relevant is this? (present)
 * - Layer 3 (PropagationEngine): WHAT will be needed? (future)
 *
 * ORCHESTRATION PATTERN:
 * - Accept high-level requests
 * - Delegate to specialized services
 * - Aggregate results
 * - Return cohesive answer
 */
export class ContextService { ... }
```

---

## Semantic Intent Template

Every file starts with a header comment:

```typescript
/**
 * 🎯 SEMANTIC INTENT: [What this component means semantically]
 *
 * PURPOSE: [Why it exists]
 *
 * [LAYER] RESPONSIBILITY:
 * - [Key responsibility 1]
 * - [Key responsibility 2]
 * - [Key responsibility 3]
 *
 * [Optional: Integration notes, design patterns, etc.]
 */
```

### Example: Domain Service

```typescript
/**
 * 🎯 SEMANTIC INTENT: Predict future context relevance
 *
 * PURPOSE: Enable pre-fetching and intelligent prioritization
 *
 * LAYER 3 RESPONSIBILITY:
 * - Calculate prediction scores (0.0-1.0)
 * - Track propagation reasons (why score is high/low)
 * - Identify high-value contexts for pre-fetch
 * - Monitor prediction staleness
 *
 * TEMPORAL FOCUS: Future - "What will be needed next?"
 *
 * SCORING ALGORITHM:
 * - 40% temporal (recent access patterns)
 * - 30% causal (position in decision tree)
 * - 30% frequency (historical access patterns)
 */
export class PropagationService { ... }
```

### Example: Infrastructure Adapter

```typescript
/**
 * 🎯 SEMANTIC INTENT: D1 Database Adapter
 *
 * PURPOSE: Translate domain operations to D1 SQL queries
 *
 * INFRASTRUCTURE RESPONSIBILITY:
 * - Implement IContextRepository interface
 * - Map domain entities to/from SQL rows
 * - Handle D1-specific query syntax
 * - Manage database connections
 *
 * HEXAGONAL ARCHITECTURE:
 * - This is an ADAPTER - it translates external (D1) to internal (domain)
 * - Domain services depend on IContextRepository interface
 * - This implementation can be swapped without affecting domain
 */
export class D1ContextRepository implements IContextRepository { ... }
```

---

## Semantic Anchoring

Semantic Intent creates **semantic anchors** - clear reference points that explain the system:

### Anchor 1: Temporal Layers

```typescript
// Layer 1: Past (WHY)
🎯 SEMANTIC INTENT: Track decision causality
TEMPORAL FOCUS: Understanding what led to current state

// Layer 2: Present (HOW)
🎯 SEMANTIC INTENT: Manage context relevance
TEMPORAL FOCUS: Current accessibility and lifecycle

// Layer 3: Future (WHAT)
🎯 SEMANTIC INTENT: Predict future needs
TEMPORAL FOCUS: Pre-fetching and optimization
```

### Anchor 2: Hexagonal Layers

```typescript
// Domain: Core business logic
🎯 SEMANTIC INTENT: Pure business rules
DEPENDENCY DIRECTION: Zero external dependencies

// Application: Orchestration
🎯 SEMANTIC INTENT: Coordinate domain operations
DEPENDENCY DIRECTION: Depends on domain (inward)

// Infrastructure: Technical implementation
🎯 SEMANTIC INTENT: Adapt external systems
DEPENDENCY DIRECTION: Implements domain interfaces (inward)
```

### Anchor 3: Observable Operations

```typescript
/**
 * 🎯 SEMANTIC INTENT: Reconstruct reasoning chain
 *
 * OBSERVABLE OPERATION:
 * - Deterministic: Same input → same output
 * - Traceable: Full audit trail maintained
 * - Testable: Pure function with no side effects
 *
 * INPUT: snapshotId (which context to explain)
 * OUTPUT: Human-readable reasoning explanation
 */
async reconstructReasoning(snapshotId: string): Promise<string>
```

---

## Function-Level Semantic Intent

Even individual functions declare their semantic purpose:

```typescript
/**
 * 🎯 SEMANTIC INTENT: Determine memory tier based on access time
 *
 * PURPOSE: Classify context lifecycle stage
 *
 * TIER SEMANTICS:
 * - ACTIVE (< 1hr): Currently being worked on
 * - RECENT (1-24hr): Recently used, still warm
 * - ARCHIVED (1-30 days): Historical reference
 * - EXPIRED (> 30 days): Pruning candidate
 *
 * @param lastAccessed - When context was last retrieved
 * @param now - Current timestamp
 * @returns Memory tier classification
 */
function calculateMemoryTier(
  lastAccessed: Date | null,
  now: Date
): MemoryTier {
  if (!lastAccessed) return MemoryTier.ARCHIVED;

  const hoursSinceAccess =
    (now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60);

  if (hoursSinceAccess < 1) return MemoryTier.ACTIVE;
  if (hoursSinceAccess < 24) return MemoryTier.RECENT;
  if (hoursSinceAccess < 24 * 30) return MemoryTier.ARCHIVED;
  return MemoryTier.EXPIRED;
}
```

---

## Variable Naming with Semantic Intent

Variable names should carry semantic meaning:

```typescript
// ❌ Bad: Generic names
const data = await repo.find();
const result = calculate(data);
const output = format(result);

// ✅ Good: Semantic names
const contextsWithCausality = await repository.findByProject(project);
const predictionScore = calculatePredictionScore(context);
const highValueContexts = filterByScore(contexts, minScore);
```

### Semantic Prefixes

Use prefixes to indicate semantic type:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `is` | Boolean predicate | `isRootCause`, `isPredictionStale` |
| `has` | Boolean existence | `hasChildren`, `hasCausality` |
| `get` | Retrieve existing data | `getMemoryStats`, `getCausalityStats` |
| `calculate` | Compute new value | `calculatePredictionScore`, `calculateMemoryTier` |
| `build` | Construct complex object | `buildCausalChain`, `buildReasoningText` |
| `update` | Modify existing data | `updatePredictions`, `updateAccessTracking` |
| `prune` | Remove data | `pruneExpiredContexts` |

---

## Type Aliases with Semantic Intent

Create type aliases that carry meaning:

```typescript
// ❌ Bad: Primitive types
type ActionType = string;
type Timestamp = string;

// ✅ Good: Semantic types with documentation
/**
 * 🎯 SEMANTIC INTENT: Classification of what action created a context
 *
 * SEMANTIC MEANING:
 * - conversation: User dialogue or question
 * - decision: Strategic choice or determination
 * - file_edit: Code or document modification
 * - tool_use: External tool invocation
 * - research: Information gathering
 */
type ActionType =
  | 'conversation'
  | 'decision'
  | 'file_edit'
  | 'tool_use'
  | 'research';

/**
 * 🎯 SEMANTIC INTENT: ISO 8601 timestamp representing a point in time
 *
 * FORMAT: "YYYY-MM-DDTHH:mm:ss.sssZ"
 * TIMEZONE: Always UTC
 * USAGE: Event timestamps, access tracking, creation time
 */
type ISO8601Timestamp = string;
```

---

## Error Messages with Semantic Intent

Error messages should explain semantic violations:

```typescript
// ❌ Bad: Technical error
throw new Error('Value is null');

// ✅ Good: Semantic error
throw new Error(
  'Cannot reconstruct reasoning: Context has no causality metadata. ' +
  'This context was created without a "causedBy" link or "actionType".'
);

// ✅ Even better: Semantic error with guidance
throw new Error(
  'Cannot build causal chain: Snapshot not found. ' +
  'The context you\'re trying to trace may have been pruned. ' +
  'Try using a more recent context ID or check if the context exists with load_context.'
);
```

---

## Documentation Consistency

Semantic Intent ensures consistent terminology across:

### 1. Code Comments

```typescript
/**
 * 🎯 SEMANTIC INTENT: Save conversation context
 */
async saveContext(input: SaveContextInput) { ... }
```

### 2. MCP Tool Descriptions

```typescript
{
  name: "save_context",
  description: "Save conversation context with AI enhancement"
}
```

### 3. API Documentation

```markdown
## save_context

Save conversation context for future retrieval.

**Purpose**: Persist conversational state across sessions
```

### 4. User-Facing Messages

```typescript
return {
  content: [{
    type: "text",
    text: "Context saved! Future conversations can reference this."
  }]
};
```

All four use the same semantic vocabulary: "save", "context", "conversation", "future".

---

## Real-World Examples

### Example 1: Layer 1 Service

```typescript
/**
 * 🎯 SEMANTIC INTENT: Causality Engine (Layer 1)
 *
 * PURPOSE: Track WHY contexts were created through causal relationships
 *
 * LAYER 1 RESPONSIBILITY:
 * - Build causal chains backwards through time
 * - Reconstruct reasoning from causality metadata
 * - Classify action types that created contexts
 * - Provide analytics on decision history
 *
 * TEMPORAL FOCUS: Past - understanding historical decisions
 *
 * OBSERVABLE OPERATIONS:
 * - buildCausalChain: Deterministic chain traversal
 * - reconstructReasoning: Idempotent formatting
 * - getCausalityStats: Aggregate statistics
 */
export class CausalityService {
  /**
   * 🎯 SEMANTIC INTENT: Trace decision history backwards
   *
   * PURPOSE: Show how contexts influenced each other over time
   *
   * ALGORITHM:
   * 1. Start at target snapshot
   * 2. Follow causedBy links backwards
   * 3. Stop at root cause (no parent)
   * 4. Return chain with root at index 0
   *
   * OBSERVABLE PROPERTIES:
   * - Deterministic: Same input → same chain
   * - Cycle-safe: Detects and prevents infinite loops
   * - Depth-tracked: Each node knows distance from root
   */
  async buildCausalChain(snapshotId: string): Promise<CausalChainNode[]> {
    // Implementation...
  }
}
```

### Example 2: MCP Tool Handler

```typescript
/**
 * 🎯 SEMANTIC TOOL HANDLER: build_causal_chain
 *
 * PURPOSE: Expose causality chain building via MCP protocol
 *
 * FLOW:
 * - Receive MCP tool call with snapshotId
 * - Delegate to CausalityService.buildCausalChain()
 * - Format result as human-readable markdown
 * - Return MCP ToolResult
 *
 * SEMANTIC TRANSLATION:
 * - MCP args → Domain input
 * - Domain output → User-friendly text
 */
private async handleBuildCausalChain(
  args: { snapshotId: string }
): Promise<ToolResult> {
  // Implementation...
}
```

---

## Best Practices

### 1. Start Every File with Semantic Intent

```typescript
/**
 * 🎯 SEMANTIC INTENT: [Component name]
 *
 * PURPOSE: [Why it exists]
 *
 * RESPONSIBILITY: [What it does]
 */
```

### 2. Use Semantic Vocabulary Consistently

Choose terms and stick with them:
- ✅ "Context" not "data" or "record"
- ✅ "Snapshot" not "version" or "copy"
- ✅ "Causality" not "dependency" or "relationship"

### 3. Explain "Why" Not "What"

```typescript
// ❌ Bad: Explains what code does
// Loops through contexts and increments counter

// ✅ Good: Explains why it's needed
// Count how many contexts belong to each memory tier
// to provide observability into memory health
```

### 4. Link to Architecture

```typescript
/**
 * HEXAGONAL ARCHITECTURE:
 * - This is DOMAIN layer (no infrastructure dependencies)
 * - Pure business logic, 100% testable
 * - Depends only on IContextRepository interface
 */
```

---

## Benefits

1. **Self-Documenting Code**: Architecture is visible in comments
2. **Easier Onboarding**: New developers understand intent quickly
3. **Maintenance**: Changes respect semantic boundaries
4. **Consistency**: Same vocabulary everywhere (code, docs, errors)
5. **Design Clarity**: Forces you to articulate purpose

---

## Further Reading

- [Hexagonal Architecture →](/development/hexagonal-architecture)
- [Architecture Overview →](/development/architecture)
- [Database Schema →](/development/database-schema)
- [Technology Stack →](/development/tech-stack)
