# Hexagonal Architecture (Ports & Adapters)

WakeIQX is built using **Hexagonal Architecture**, also known as **Ports and Adapters**. This pattern ensures clean separation between business logic and infrastructure, making the codebase maintainable, testable, and adaptable.

## What is Hexagonal Architecture?

Hexagonal Architecture organizes code into concentric layers, with the **domain** (business logic) at the center, completely isolated from external concerns like databases, HTTP, or UI frameworks.

```
┌─────────────────────────────────────────────────────┐
│           INFRASTRUCTURE LAYER (Adapters)           │
│  HTTP, Database, AI, MCP Protocol, Workers Runtime  │
└────────────────────┬────────────────────────────────┘
                     │ (Adapts external to internal)
┌────────────────────▼────────────────────────────────┐
│            APPLICATION LAYER (Ports)                │
│  ToolExecutionHandler, MCPProtocolHandler           │
└────────────────────┬────────────────────────────────┘
                     │ (Orchestrates domain operations)
┌────────────────────▼────────────────────────────────┐
│              DOMAIN LAYER (Core)                    │
│  ContextService, CausalityService, MemoryManager,   │
│  PropagationService, ContextSnapshot (Entity)       │
└─────────────────────────────────────────────────────┘
```

---

## The Four Layers

### 1. Domain Layer (Core Business Logic)

**Location**: `src/domain/`

**Purpose**: Contains pure business logic with **zero dependencies** on external frameworks.

**Components**:
- **Entities**: `ContextSnapshot`, `CausalChainNode`
- **Services**: `CausalityService`, `MemoryManagerService`, `PropagationService`
- **Orchestrator**: `ContextService`
- **Repositories (Interfaces)**: `IContextRepository`

**Rules**:
- ✅ Pure TypeScript/JavaScript
- ✅ No database code
- ✅ No HTTP code
- ✅ No framework dependencies
- ✅ 100% testable with unit tests

**Example**:
```typescript
// src/domain/services/CausalityService.ts
export class CausalityService {
  constructor(private readonly repository: IContextRepository) {}

  async buildCausalChain(snapshotId: string): Promise<CausalChainNode[]> {
    // Pure business logic - no database details
    const chain: CausalChainNode[] = [];
    let currentId = snapshotId;

    while (currentId) {
      const snapshot = await this.repository.findById(currentId);
      if (!snapshot) break;

      chain.unshift({ snapshot, depth: chain.length });
      currentId = snapshot.causality?.causedBy || null;
    }

    return chain;
  }
}
```

---

### 2. Application Layer (Orchestration)

**Location**: `src/application/`

**Purpose**: Coordinates between domain logic and external interfaces. Maps external requests to domain operations.

**Components**:
- **Handlers**: `ToolExecutionHandler`, `MCPProtocolHandler`
- **DTOs**: Input/output type definitions

**Rules**:
- ✅ Delegates to domain services
- ✅ Formats results for external consumers
- ✅ No business logic (only coordination)
- ✅ Thin translation layer

**Example**:
```typescript
// src/application/handlers/ToolExecutionHandler.ts
export class ToolExecutionHandler {
  constructor(private readonly contextService: ContextService) {}

  async execute(toolName: string, args: unknown): Promise<ToolResult> {
    switch (toolName) {
      case 'build_causal_chain':
        return this.handleBuildCausalChain(args as { snapshotId: string });
      // ... other tools
    }
  }

  private async handleBuildCausalChain(args: { snapshotId: string }): Promise<ToolResult> {
    // Delegate to domain
    const chain = await this.contextService.buildCausalChain(args.snapshotId);

    // Format for MCP protocol
    return {
      content: [{
        type: "text",
        text: this.formatChain(chain)
      }]
    };
  }
}
```

---

### 3. Infrastructure Layer (Adapters)

**Location**: `src/infrastructure/`

**Purpose**: Implements technical details like database access, HTTP, AI integrations. Adapts external systems to domain interfaces.

**Components**:
- **Repositories**: `D1ContextRepository` (implements `IContextRepository`)
- **AI Integration**: `SemanticEnhancementService`
- **Middleware**: `CORSMiddleware`
- **Protocol Adapters**: SSE streaming, MCP protocol

**Rules**:
- ✅ Implements domain interfaces
- ✅ Contains framework-specific code
- ✅ Can be swapped without affecting domain
- ✅ Database, HTTP, AI details live here

**Example**:
```typescript
// src/infrastructure/repositories/D1ContextRepository.ts
export class D1ContextRepository implements IContextRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<IContextSnapshot | null> {
    // D1-specific SQL query
    const result = await this.db
      .prepare('SELECT * FROM context_snapshots WHERE id = ?')
      .bind(id)
      .first();

    return result ? this.mapToSnapshot(result) : null;
  }

  // Domain only sees IContextRepository interface
  // It doesn't know about D1, SQL, or Cloudflare Workers
}
```

---

### 4. Presentation Layer (Entry Points)

**Location**: `src/index.ts`

**Purpose**: HTTP endpoints, routing, request/response handling.

**Components**:
- **Main handler**: `fetch()` function
- **Routing**: URL path matching
- **Protocol handling**: MCP, SSE, health checks

**Rules**:
- ✅ Minimal logic - just routing
- ✅ Delegates to application layer
- ✅ Handles HTTP concerns (CORS, headers, status codes)

**Example**:
```typescript
// src/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route to appropriate handler
    if (url.pathname === '/mcp') {
      return mcpProtocolHandler.handle(await request.json());
    }

    if (url.pathname === '/sse') {
      return sseHandler.handle(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
```

---

## Benefits of Hexagonal Architecture

### 1. **Testability**

Domain logic can be tested in isolation:

```typescript
// Test domain logic without database or HTTP
describe('CausalityService', () => {
  it('builds causal chain correctly', async () => {
    // Mock repository (no real database needed)
    const mockRepo = {
      findById: jest.fn()
        .mockResolvedValueOnce({ id: '2', causedBy: '1' })
        .mockResolvedValueOnce({ id: '1', causedBy: null })
    };

    const service = new CausalityService(mockRepo);
    const chain = await service.buildCausalChain('2');

    expect(chain).toHaveLength(2);
    expect(chain[0].snapshot.id).toBe('1'); // Root
    expect(chain[1].snapshot.id).toBe('2'); // Leaf
  });
});
```

### 2. **Adaptability**

Swap infrastructure without touching business logic:

```typescript
// Today: Cloudflare D1
const repository = new D1ContextRepository(env.DB);

// Tomorrow: PostgreSQL
const repository = new PostgresContextRepository(pgClient);

// Next week: MongoDB
const repository = new MongoContextRepository(mongoClient);

// Domain services don't change!
const causalityService = new CausalityService(repository);
```

### 3. **Maintainability**

Clear separation of concerns:
- **Domain experts** work on `src/domain/` (business rules)
- **Infrastructure engineers** work on `src/infrastructure/` (database, performance)
- **Frontend/API developers** work on `src/application/` and `src/index.ts` (endpoints)

No one steps on each other's toes.

### 4. **Framework Independence**

Domain layer has **zero dependencies** on:
- ❌ Cloudflare Workers
- ❌ D1 Database
- ❌ MCP Protocol
- ❌ HTTP frameworks

This means:
- ✅ Can run on Node.js, Deno, Bun, or browsers
- ✅ Can use any database (SQLite, Postgres, MongoDB)
- ✅ Can expose via REST, GraphQL, gRPC, or MCP
- ✅ Business logic is portable

---

## Directory Structure

```
src/
├── domain/                    # Core business logic (pure)
│   ├── models/
│   │   └── ContextSnapshot.ts
│   ├── services/
│   │   ├── CausalityService.ts
│   │   ├── MemoryManagerService.ts
│   │   ├── PropagationService.ts
│   │   └── ContextService.ts
│   └── repositories/
│       └── IContextRepository.ts (interface)
│
├── application/               # Orchestration & coordination
│   └── handlers/
│       ├── ToolExecutionHandler.ts
│       └── MCPProtocolHandler.ts
│
├── infrastructure/            # Technical implementation
│   ├── repositories/
│   │   └── D1ContextRepository.ts
│   ├── ai/
│   │   └── SemanticEnhancementService.ts
│   └── middleware/
│       └── CORSMiddleware.ts
│
├── types.ts                   # Shared type definitions
└── index.ts                   # Entry point (HTTP handler)
```

---

## Dependency Flow

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑            ↑
   HTTP          MCP Tools   Entities   Database
   Routing      Formatting   Services   AI APIs
```

**Key principle**: Dependencies point **inward** toward the domain.

- Infrastructure **implements** domain interfaces
- Application **uses** domain services
- Presentation **delegates** to application
- Domain **depends on nothing** (zero external dependencies)

---

## Ports & Adapters

### Ports (Interfaces)

Define **what** the domain needs, not **how** it's implemented:

```typescript
// src/domain/repositories/IContextRepository.ts
export interface IContextRepository {
  findById(id: string): Promise<IContextSnapshot | null>;
  findByProject(project: string, limit?: number): Promise<IContextSnapshot[]>;
  save(snapshot: IContextSnapshot): Promise<void>;
  // Domain defines the contract
}
```

### Adapters (Implementations)

Provide **how** the domain's needs are fulfilled:

```typescript
// src/infrastructure/repositories/D1ContextRepository.ts
export class D1ContextRepository implements IContextRepository {
  // Adapter translates domain operations to D1 SQL queries
  async findById(id: string): Promise<IContextSnapshot | null> {
    const result = await this.db
      .prepare('SELECT * FROM context_snapshots WHERE id = ?')
      .bind(id)
      .first();
    return this.mapToSnapshot(result);
  }
}
```

**Benefits**:
- Domain defines contracts via interfaces
- Infrastructure adapts external systems to those contracts
- Easy to swap implementations (D1 → Postgres → MongoDB)

---

## Real-World Example: Adding a New Database

Let's say you want to switch from D1 to PostgreSQL:

### Step 1: Create new adapter

```typescript
// src/infrastructure/repositories/PostgresContextRepository.ts
export class PostgresContextRepository implements IContextRepository {
  constructor(private readonly client: PostgresClient) {}

  async findById(id: string): Promise<IContextSnapshot | null> {
    const result = await this.client.query(
      'SELECT * FROM context_snapshots WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapToSnapshot(result.rows[0]) : null;
  }

  // Implement other IContextRepository methods...
}
```

### Step 2: Update dependency injection

```typescript
// src/index.ts
const repository = new PostgresContextRepository(pgClient); // Changed!
const causalityService = new CausalityService(repository);
const memoryManager = new MemoryManagerService(repository);
const propagationEngine = new PropagationService(repository);
const contextService = new ContextService(
  repository,
  causalityService,
  memoryManager,
  propagationEngine,
  enhancementService
);
```

### Step 3: Done!

**No changes needed to**:
- ✅ Domain services (CausalityService, MemoryManager, etc.)
- ✅ Application handlers (ToolExecutionHandler)
- ✅ MCP protocol
- ✅ Business logic

Only the infrastructure adapter changed.

---

## Best Practices

### 1. Keep Domain Pure

```typescript
// ❌ Bad: Domain depends on infrastructure
import { D1Database } from '@cloudflare/workers-types';

export class CausalityService {
  constructor(private db: D1Database) {}
}

// ✅ Good: Domain depends on interface
export class CausalityService {
  constructor(private repository: IContextRepository) {}
}
```

### 2. Use Dependency Injection

```typescript
// ✅ Good: Dependencies injected via constructor
export class ContextService {
  constructor(
    private readonly repository: IContextRepository,
    private readonly causalityService: CausalityService,
    private readonly memoryManager: MemoryManagerService
  ) {}
}
```

### 3. Domain Entities Own Business Rules

```typescript
// ✅ Good: Business logic in domain entity
export class ContextSnapshot {
  isExpired(): boolean {
    const age = Date.now() - this.timestamp.getTime();
    return age > 30 * 24 * 60 * 60 * 1000; // 30 days
  }
}

// ❌ Bad: Business logic in infrastructure
// Don't put this in D1ContextRepository!
```

### 4. Application Layer is Thin

```typescript
// ✅ Good: Thin handler that delegates
async handleBuildCausalChain(args) {
  const chain = await this.contextService.buildCausalChain(args.snapshotId);
  return this.formatResult(chain);
}

// ❌ Bad: Handler contains business logic
async handleBuildCausalChain(args) {
  // Don't build the chain here!
  // Don't calculate scores here!
  // Delegate to domain!
}
```

---

## Testing Strategy

### Unit Tests (Domain Layer)

Test pure business logic with mocks:

```typescript
// Fast, isolated, no database needed
describe('MemoryManagerService', () => {
  it('calculates ACTIVE tier for recent contexts', () => {
    const tier = calculateMemoryTier(new Date(), new Date());
    expect(tier).toBe(MemoryTier.ACTIVE);
  });
});
```

### Integration Tests (Infrastructure Layer)

Test database adapters with real database:

```typescript
// Test D1 repository with actual D1 database
describe('D1ContextRepository', () => {
  it('saves and retrieves context', async () => {
    const repo = new D1ContextRepository(testDb);
    await repo.save(testSnapshot);
    const result = await repo.findById(testSnapshot.id);
    expect(result).toEqual(testSnapshot);
  });
});
```

### End-to-End Tests (Full Stack)

Test complete flow via HTTP:

```typescript
// Test entire system
describe('MCP Tools E2E', () => {
  it('builds causal chain via MCP', async () => {
    const response = await fetch('/mcp', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { name: 'build_causal_chain', arguments: { snapshotId: 'test' } }
      })
    });
    const result = await response.json();
    expect(result.result.content[0].text).toContain('Causal Chain');
  });
});
```

---

## Further Reading

- [Architecture Overview →](/development/architecture)
- [Semantic Intent Pattern →](/development/semantic-intent)
- [Database Schema →](/development/database-schema)
- [Technology Stack →](/development/tech-stack)
