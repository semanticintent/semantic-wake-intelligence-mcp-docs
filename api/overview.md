# API Reference Overview

WakeIQX provides a comprehensive API organized around the 3-layer temporal intelligence architecture. This reference documents all services, entities, and interfaces.

## Architecture Layers

### Domain Layer (Core Business Logic)

The domain layer contains pure business logic with zero external dependencies:

```
src/domain/
├── models/
│   └── ContextSnapshot.ts      - Core entity
├── services/
│   ├── ContextService.ts       - Main orchestrator
│   ├── CausalityService.ts     - Layer 1: Past (WHY)
│   ├── MemoryManagerService.ts - Layer 2: Present (HOW)
│   └── PropagationService.ts   - Layer 3: Future (WHAT)
└── repositories/
    └── IContextRepository.ts   - Repository interface
```

---

## Core Services

### [ContextService](/api/context-service)

**Purpose**: Main orchestrator that coordinates all three layers

**Responsibilities:**
- Save and load contexts
- Delegate to specialized services (causality, memory, propagation)
- Coordinate cross-layer operations

**Key Methods:**
- `saveContext()` - Persist new context with AI enhancement
- `loadContext()` - Retrieve contexts for a project
- `searchContext()` - Find contexts by keyword

---

### [CausalityService](/api/causality-service)

**Purpose**: Layer 1 - Track decision causality (Past)

**Responsibilities:**
- Build causal chains backwards through time
- Reconstruct reasoning from metadata
- Track action types and dependencies

**Key Methods:**
- `buildCausalChain()` - Trace decision history
- `reconstructReasoning()` - Explain why context was created
- `getCausalityStats()` - Analytics on causal relationships

---

### [MemoryManagerService](/api/memory-manager-service)

**Purpose**: Layer 2 - Manage context lifecycle (Present)

**Responsibilities:**
- Classify contexts into memory tiers (ACTIVE/RECENT/ARCHIVED/EXPIRED)
- Track access patterns (LRU)
- Prune expired contexts

**Key Methods:**
- `calculateMemoryTier()` - Determine tier based on access time
- `getMemoryStats()` - Get tier distribution
- `pruneExpiredContexts()` - Clean up old contexts

---

### [PropagationService](/api/propagation-service)

**Purpose**: Layer 3 - Predict future relevance (Future)

**Responsibilities:**
- Calculate prediction scores (0.0-1.0)
- Identify high-value contexts for pre-fetching
- Track propagation reasons (why score is high/low)

**Key Methods:**
- `calculatePredictionScore()` - Multi-factor scoring algorithm
- `updateProjectPredictions()` - Refresh stale predictions
- `getHighValueContexts()` - Get likely-to-be-accessed contexts

---

## Core Entities

### [ContextSnapshot](/api/context-snapshot)

**Purpose**: Represents a preserved conversation context

**Properties:**
- Core: `id`, `project`, `summary`, `tags`, `timestamp`
- Layer 1: `actionType`, `causedBy`, `rationale`
- Layer 2: `memoryTier`, `lastAccessed`, `accessCount`
- Layer 3: `predictionScore`, `propagationReason`

**Methods:**
- `isExpired()` - Check if context is older than 30 days
- `isRootCause()` - Check if this is a root of causal chain

---

## Repository Interface

### IContextRepository

**Purpose**: Abstract database operations

**Why an interface?**
- Hexagonal architecture (domain doesn't depend on infrastructure)
- Testability (easy to mock)
- Swappable implementations (D1, Postgres, MongoDB)

**Key Methods:**
- `findById()` - Get context by ID
- `findByProject()` - Get all contexts for a project
- `save()` - Persist a context
- `updateAccessTracking()` - Update LRU metadata

**Implementations:**
- `D1ContextRepository` - Cloudflare D1 (current)
- Future: `PostgresRepository`, `MongoRepository`

---

## Type Definitions

### ActionType

```typescript
type ActionType =
  | 'conversation'  // User dialogue
  | 'decision'      // Strategic choice
  | 'file_edit'     // Code modification
  | 'tool_use'      // External tool invocation
  | 'research';     // Information gathering
```

### MemoryTier

```typescript
enum MemoryTier {
  ACTIVE = 'active',       // < 1 hour
  RECENT = 'recent',       // 1-24 hours
  ARCHIVED = 'archived',   // 1-30 days
  EXPIRED = 'expired'      // > 30 days
}
```

### CausalChainNode

```typescript
interface CausalChainNode {
  snapshot: IContextSnapshot;
  causedBy: CausalChainNode | null;
  children: CausalChainNode[];
  depth: number;
}
```

---

## Common Patterns

### Dependency Injection

All services use constructor injection:

```typescript
export class ContextService {
  constructor(
    private readonly repository: IContextRepository,
    private readonly causalityService: CausalityService,
    private readonly memoryManager: MemoryManagerService,
    private readonly propagationEngine: PropagationService
  ) {}
}
```

### Observable Operations

All domain operations are:
- **Deterministic**: Same input → same output
- **Traceable**: Full audit trail
- **Testable**: Pure functions with no side effects

### Error Handling

Services throw descriptive errors:

```typescript
if (!snapshot) {
  throw new Error(
    `Context not found: ${snapshotId}. ` +
    `It may have been pruned or never existed.`
  );
}
```

---

## Usage Examples

### Initialize Services

```typescript
// Infrastructure layer
const repository = new D1ContextRepository(env.DB);
const aiService = new SemanticEnhancementService(env.AI);

// Domain layer
const causalityService = new CausalityService(repository);
const memoryManager = new MemoryManagerService(repository);
const propagationEngine = new PropagationService(repository);

const contextService = new ContextService(
  repository,
  causalityService,
  memoryManager,
  propagationEngine,
  aiService
);
```

### Save Context with Full Metadata

```typescript
const snapshot = await contextService.saveContext({
  project: 'api-redesign',
  content: 'Decision: Use REST API with versioning',
  source: 'mcp',
  metadata: {
    actionType: 'decision',
    causedBy: 'research-context-id',
    rationale: 'REST is simpler for current requirements'
  }
});
```

### Build Complete Context Picture

```typescript
// Get context
const context = await repository.findById(snapshotId);

// Reconstruct reasoning (Layer 1)
const reasoning = await causalityService.reconstructReasoning(snapshotId);

// Check memory tier (Layer 2)
const tier = memoryManager.calculateMemoryTier(context.lastAccessed, new Date());

// Get prediction score (Layer 3)
const score = await propagationEngine.calculatePredictionScore(context);

console.log({
  context,
  reasoning,
  tier,
  score
});
```

---

## Performance Considerations

### Async Operations

All service methods are async for non-blocking I/O:

```typescript
async saveContext(input: SaveContextInput): Promise<ContextSnapshot>
async buildCausalChain(snapshotId: string): Promise<CausalChainNode[]>
async calculatePredictionScore(context: IContextSnapshot): Promise<number>
```

### Batching

When processing multiple contexts, use Promise.all:

```typescript
const contexts = await repository.findByProject(project);
const predictions = await Promise.all(
  contexts.map(ctx => propagationEngine.calculatePredictionScore(ctx))
);
```

### Caching

Repository implementations should cache frequently accessed data:

```typescript
private cache = new Map<string, IContextSnapshot>();

async findById(id: string): Promise<IContextSnapshot | null> {
  if (this.cache.has(id)) {
    return this.cache.get(id)!;
  }

  const snapshot = await this.db.query(...);
  this.cache.set(id, snapshot);
  return snapshot;
}
```

---

## Testing

### Unit Tests

Test services in isolation with mocks:

```typescript
describe('CausalityService', () => {
  it('builds causal chain correctly', async () => {
    const mockRepo = {
      findById: jest.fn()
        .mockResolvedValueOnce({ id: '2', causedBy: '1' })
        .mockResolvedValueOnce({ id: '1', causedBy: null })
    };

    const service = new CausalityService(mockRepo);
    const chain = await service.buildCausalChain('2');

    expect(chain).toHaveLength(2);
    expect(chain[0].snapshot.id).toBe('1');
  });
});
```

### Integration Tests

Test with real database:

```typescript
describe('D1ContextRepository', () => {
  it('saves and retrieves context', async () => {
    const repo = new D1ContextRepository(testDb);

    await repo.save(testSnapshot);
    const result = await repo.findById(testSnapshot.id);

    expect(result).toEqual(testSnapshot);
  });
});
```

---

## Further Reading

- [ContextSnapshot Entity](/api/context-snapshot) - Core entity reference
- [CausalityService](/api/causality-service) - Layer 1 API
- [MemoryManagerService](/api/memory-manager-service) - Layer 2 API
- [PropagationService](/api/propagation-service) - Layer 3 API
- [Hexagonal Architecture](/development/hexagonal-architecture) - Architecture pattern
- [Database Schema](/development/database-schema) - Data model
