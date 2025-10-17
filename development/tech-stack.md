# Technology Stack

WakeIQX is built on **Cloudflare's edge computing platform** with modern TypeScript tooling. Every technology choice prioritizes **performance**, **developer experience**, and **semantic clarity**.

## Platform: Cloudflare Workers

**Why Cloudflare Workers?**

WakeIQX runs on [Cloudflare Workers](https://workers.cloudflare.com/), a serverless platform that executes code at the edge (in datacenters close to users).

**Benefits:**
- ⚡ **Ultra-low latency**: Code runs in 300+ locations worldwide
- 🌍 **Global distribution**: Automatic edge deployment
- 💰 **Cost-effective**: Pay per request, no idle costs
- 🔒 **Secure**: Isolated V8 sandboxes
- 📦 **No cold starts**: Instant execution

**Trade-offs:**
- ⚠️ CPU time limits (50ms on free tier)
- ⚠️ Memory limits (128MB per request)
- ⚠️ No filesystem access (must use KV/D1/R2)

**Deployment:**
```bash
npm run deploy
```

---

## Runtime: Workers Runtime (V8)

Cloudflare Workers use the V8 JavaScript engine (same as Chrome/Node.js) with Web Standards APIs:

- ✅ `fetch()` - HTTP requests
- ✅ `Request`/`Response` - Web API objects
- ✅ `crypto` - Web Crypto API
- ✅ `TextEncoder`/`TextDecoder` - String encoding
- ❌ No Node.js APIs (`fs`, `path`, `http`, etc.)

**Example:**
```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Standard Web APIs
    const url = new URL(request.url);
    const body = await request.json();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

---

## Language: TypeScript 5.8

**Why TypeScript?**

- 🔍 **Type safety**: Catch bugs at compile time
- 📖 **Self-documenting**: Types serve as inline documentation
- 🧪 **Testability**: Easier to mock and test
- 🔧 **Refactoring**: Confident code changes
- 🎯 **Semantic Intent**: Types carry meaning

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "lib": ["ES2021"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noEmit": true
  }
}
```

**Strict mode enabled:**
- `strictNullChecks`: Prevent null/undefined errors
- `strictFunctionTypes`: Type-safe function parameters
- `noImplicitAny`: No implicit `any` types

---

## Database: Cloudflare D1

[Cloudflare D1](https://developers.cloudflare.com/d1/) is SQLite running at the edge.

**Features:**
- 🗃️ **SQL**: Standard SQL syntax (SQLite dialect)
- 🔄 **ACID transactions**: Data integrity
- 📊 **Relational**: Foreign keys, joins, indexes
- 🌍 **Global replication**: Automatic read replicas
- 💾 **Persistent**: Durable storage (not ephemeral like KV)

**Why D1 over other databases?**
- ✅ Co-located with Workers (same edge location = low latency)
- ✅ No connection pooling needed (Workers handle it)
- ✅ Standard SQL (portable to Postgres/MySQL later)
- ✅ Free tier: 100k rows, 25MB per database

**Example query:**
```typescript
const result = await env.DB
  .prepare('SELECT * FROM context_snapshots WHERE project = ? ORDER BY timestamp DESC LIMIT ?')
  .bind(project, limit)
  .all();

const snapshots = result.results;
```

**Connection:**
```typescript
interface Env {
  DB: D1Database;  // Automatically injected by Workers
}
```

---

## AI: Cloudflare Workers AI

[Workers AI](https://developers.cloudflare.com/workers-ai/) provides serverless access to LLMs at the edge.

**Model**: `@cf/meta/llama-3.1-8b-instruct`
- 🧠 **8 billion parameters**: Fast and capable
- 💬 **Instruct-tuned**: Follows instructions well
- ⚡ **Edge inference**: Runs in Workers environment
- 🆓 **Free tier**: 10,000 neurons/day

**Usage in WakeIQX:**
```typescript
const response = await env.AI.run(
  '@cf/meta/llama-3.1-8b-instruct',
  {
    messages: [
      { role: 'system', content: 'You are a helpful assistant...' },
      { role: 'user', content: 'Summarize this conversation...' }
    ]
  }
);

const summary = response.response;
```

**What we use AI for:**
- 📝 Generate context summaries (compress conversation)
- 🏷️ Extract semantic tags (for search)
- 🎯 Rationale generation (explain WHY context was saved)

---

## Protocol: Model Context Protocol (MCP)

[MCP](https://modelcontextprotocol.io/) is an open protocol for connecting AI agents to external data sources.

**MCP SDK**: `@modelcontextprotocol/sdk` v1.19.1

**Key concepts:**
- **Tools**: Functions AI agents can call
- **Resources**: Data AI agents can access
- **Prompts**: Pre-defined conversation starters

**WakeIQX exposes 12 MCP tools:**
- 3 Core tools (save, load, search)
- 3 Layer 1 tools (causality tracking)
- 3 Layer 2 tools (memory management)
- 3 Layer 3 tools (prediction scoring)

**Example tool definition:**
```typescript
{
  name: "save_context",
  description: "Save conversation context with AI enhancement",
  inputSchema: {
    type: "object",
    properties: {
      project: { type: "string", description: "Project identifier" },
      content: { type: "string", description: "Context content to save" }
    },
    required: ["project", "content"]
  }
}
```

**Transport**: HTTP with Server-Sent Events (SSE)

---

## Development Tools

### Build Tool: Wrangler

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) is Cloudflare's CLI for Workers development.

**Key commands:**
```bash
npm run dev        # Start local dev server
npm run deploy     # Deploy to Cloudflare
npm run cf-typegen # Generate TypeScript types
```

**Configuration** (`wrangler.toml`):
```toml
name = "semantic-wake-intelligence-mcp"
main = "src/index.ts"
compatibility_date = "2024-10-01"

[[d1_databases]]
binding = "DB"
database_name = "wake-intelligence"
database_id = "..."

[ai]
binding = "AI"
```

---

### Code Quality: Biome

[Biome](https://biomejs.dev/) replaces ESLint + Prettier with a single fast tool.

**Features:**
- 🎨 **Formatting**: Code style (like Prettier)
- 🔍 **Linting**: Code quality (like ESLint)
- ⚡ **Fast**: Written in Rust (100x faster)
- 🔧 **Auto-fix**: Automatically fix issues

**Commands:**
```bash
npm run format    # Format code
npm run lint:fix  # Fix linting issues
```

**Configuration** (`biome.json`):
```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

---

### Testing: Vitest

[Vitest](https://vitest.dev/) is a fast, modern test framework.

**Features:**
- ⚡ **Fast**: Native ESM, parallel execution
- 🔄 **Watch mode**: Auto-rerun on changes
- 📊 **Coverage**: Built-in code coverage
- 🎨 **UI**: Visual test runner

**Commands:**
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI
npm run test:coverage # Coverage report
```

**Example test:**
```typescript
import { describe, it, expect } from 'vitest';
import { CausalityService } from './CausalityService';

describe('CausalityService', () => {
  it('builds causal chain correctly', async () => {
    const mockRepo = createMockRepository();
    const service = new CausalityService(mockRepo);

    const chain = await service.buildCausalChain('snapshot-id');

    expect(chain).toHaveLength(3);
    expect(chain[0].snapshot.id).toBe('root-id');
  });
});
```

---

### Type Generation: wrangler types

Automatically generate TypeScript types for Workers bindings:

```bash
npm run cf-typegen
```

**Generated** (`worker-configuration.d.ts`):
```typescript
interface Env {
  DB: D1Database;
  AI: Ai;
}
```

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@modelcontextprotocol/sdk` | 1.19.1 | MCP protocol implementation |
| `@cloudflare/agents` | 0.0.16 | Cloudflare agents framework |
| `zod` | 3.25.76 | Runtime type validation |

**Why Zod?**
- Validates API inputs at runtime
- TypeScript types from schema
- User-friendly error messages

**Example:**
```typescript
import { z } from 'zod';

const SaveContextInput = z.object({
  project: z.string().min(1),
  content: z.string().min(1),
  source: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

type SaveContextInput = z.infer<typeof SaveContextInput>;

// Validate at runtime
const input = SaveContextInput.parse(data);
```

---

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.8.3 | TypeScript compiler |
| `wrangler` | 4.42.1 | Cloudflare CLI |
| `vitest` | 3.2.4 | Test framework |
| `@biomejs/biome` | 2.2.5 | Linting & formatting |
| `@cloudflare/vitest-pool-workers` | 0.9.11 | Test Workers locally |
| `@vitest/coverage-v8` | 3.2.4 | Code coverage |

---

## Package Manager: npm

WakeIQX uses **npm** (Node Package Manager):

```bash
npm install           # Install dependencies
npm run dev           # Start dev server
npm run deploy        # Deploy to production
npm test              # Run tests
```

**Why npm over yarn/pnpm?**
- ✅ Default for most projects
- ✅ Works everywhere
- ✅ No extra installation needed

---

## Version Control: Git + GitHub

**Repository**: [semanticintent/semantic-wake-intelligence-mcp](https://github.com/semanticintent/semantic-wake-intelligence-mcp)

**Branching strategy:**
- `main`: Production branch
- Feature branches: `feature/layer-3-propagation`
- Release tags: `v3.0.0`

**Commit conventions:**
```
feat: Add Layer 3 Propagation Engine
fix: Correct memory tier calculation
docs: Update architecture documentation
test: Add causality chain tests
```

---

## Architecture Patterns

### Hexagonal Architecture (Ports & Adapters)

See [Hexagonal Architecture →](/development/hexagonal-architecture)

**Layers:**
- Domain (core business logic)
- Application (orchestration)
- Infrastructure (D1, AI, HTTP)
- Presentation (HTTP endpoints)

---

### Semantic Intent Pattern

See [Semantic Intent Pattern →](/development/semantic-intent)

**Every file/function includes:**
```typescript
/**
 * 🎯 SEMANTIC INTENT: [What this means]
 *
 * PURPOSE: [Why it exists]
 *
 * RESPONSIBILITY: [What it does]
 */
```

---

## Performance Optimizations

### 1. Edge Execution

Code runs in 300+ datacenters worldwide:
- User in Tokyo → Runs in Tokyo
- User in London → Runs in London
- **Result**: 10-50ms latency globally

### 2. Database Indexes

All common queries have indexes:
```sql
CREATE INDEX idx_project_timestamp ON context_snapshots(project, timestamp);
```
**Result**: 10x faster queries

### 3. Batch Operations

Memory tier recalculation processes 100 contexts per batch:
```typescript
const batch = contexts.slice(0, 100);
await Promise.all(batch.map(ctx => updateTier(ctx)));
```
**Result**: Parallel processing

### 4. Prediction Caching

Predictions refresh only when stale (> 24 hours):
```typescript
if (isPredictionStale(context.last_predicted, 24)) {
  await recalculatePrediction(context);
}
```
**Result**: Avoid unnecessary AI calls

---

## Monitoring & Observability

### Cloudflare Analytics

Built-in metrics:
- Request count
- Error rate
- Response time (p50, p95, p99)
- CPU usage

### Logging

Standard console.log:
```typescript
console.log('Context saved:', { id, project });
console.error('Failed to save:', error);
```

Logs visible in:
- `wrangler tail` (live logs)
- Cloudflare dashboard
- Real-time streaming

---

## Security

### 1. CORS Middleware

Controlled cross-origin access:
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

### 2. Input Validation

Zod schemas validate all inputs:
```typescript
const input = SaveContextInput.parse(data);
// Throws if invalid
```

### 3. SQL Injection Prevention

Prepared statements with parameter binding:
```typescript
// ✅ Safe
db.prepare('SELECT * FROM contexts WHERE id = ?').bind(id);

// ❌ Vulnerable (not used)
db.prepare(`SELECT * FROM contexts WHERE id = '${id}'`);
```

### 4. Isolated Execution

Each request runs in isolated V8 sandbox:
- No shared memory between requests
- No filesystem access
- No network access (except via Workers APIs)

---

## Deployment Pipeline

```
1. Code commit to GitHub
     ↓
2. Run tests locally (npm test)
     ↓
3. Type check (npm run type-check)
     ↓
4. Format & lint (npm run format && npm run lint:fix)
     ↓
5. Deploy to Cloudflare (npm run deploy)
     ↓
6. Automatic edge distribution (300+ locations)
     ↓
7. Monitor via Cloudflare Analytics
```

**Manual deployment:**
```bash
npm run deploy
```

**Future**: GitHub Actions CI/CD for automatic deployment

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# Server runs on http://localhost:8787

# 3. Test MCP endpoint
curl http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# 4. Watch for changes (auto-reload)
# Edit files → Wrangler automatically rebuilds
```

**Local bindings:**
- `env.DB`: Local SQLite database (`.wrangler/state/v3/d1`)
- `env.AI`: Remote Workers AI (uses Cloudflare API)

---

## Migration from Node.js

WakeIQX is designed to be **portable**. To run on Node.js instead of Workers:

1. **Replace infrastructure adapters:**
   - `D1ContextRepository` → `PostgresRepository`
   - Workers AI → OpenAI API

2. **Change entry point:**
   - `export default { fetch }` → `app.listen(3000)`

3. **Update dependencies:**
   - Remove `@cloudflare/*` packages
   - Add `express` or `fastify`

**Domain layer stays the same!** (Hexagonal architecture benefit)

---

## Further Reading

- [Architecture Overview →](/development/architecture)
- [Hexagonal Architecture →](/development/hexagonal-architecture)
- [Database Schema →](/development/database-schema)
- [Semantic Intent Pattern →](/development/semantic-intent)
- [Getting Started Guide →](/getting-started)
