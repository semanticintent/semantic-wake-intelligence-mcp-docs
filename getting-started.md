# Getting Started with Wake Intelligence

Welcome to **WakeIQX** - the temporal intelligence MCP server that gives your AI agent a brain with memory of the Past, awareness of the Present, and vision of the Future.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20.x or higher** - [Download here](https://nodejs.org/)
- **Cloudflare account** - [Sign up free](https://dash.cloudflare.com/sign-up)
- **Wrangler CLI** - Install with `npm install -g wrangler`
- **Claude Desktop** (optional) - For MCP integration

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/semanticintent/semantic-wake-intelligence-mcp.git
cd semantic-wake-intelligence-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create D1 Database

```bash
# Create the database
wrangler d1 create wake-intelligence

# This will output your database ID - copy it!
```

### 4. Configure Wrangler

Update `wrangler.jsonc` with your database ID:

```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "wake-intelligence",
    "database_id": "YOUR-DATABASE-ID-HERE"  // ← Paste your ID here
  }]
}
```

### 5. Run Database Migrations

Wake Intelligence requires 4 migrations (one for each layer + initial schema):

```bash
# Migration 0001: Core context table
wrangler d1 execute wake-intelligence --local --file=migrations/0001_initial_schema.sql

# Migration 0002: Layer 1 - Causality Engine (Past)
wrangler d1 execute wake-intelligence --local --file=migrations/0002_add_causality_engine.sql

# Migration 0003: Layer 2 - Memory Manager (Present)
wrangler d1 execute wake-intelligence --local --file=migrations/0003_add_memory_manager.sql

# Migration 0004: Layer 3 - Propagation Engine (Future)
wrangler d1 execute wake-intelligence --local --file=migrations/0004_add_propagation_engine.sql
```

**For production deployment**, remove `--local`:

```bash
wrangler d1 execute wake-intelligence --file=migrations/0001_initial_schema.sql
wrangler d1 execute wake-intelligence --file=migrations/0002_add_causality_engine.sql
wrangler d1 execute wake-intelligence --file=migrations/0003_add_memory_manager.sql
wrangler d1 execute wake-intelligence --file=migrations/0004_add_propagation_engine.sql
```

### 6. Start Development Server

```bash
npm run dev
```

Your MCP server is now running at `http://localhost:8787` 🎉

## Verify Installation

### Test with curl

```bash
# Health check
curl http://localhost:8787/

# List available tools
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

You should see a list of 12+ MCP tools including:
- `save_context`
- `load_context`
- `search_context`
- `reconstruct_reasoning`
- `update_predictions`
- And more...

## Deploy to Production

When you're ready to deploy to Cloudflare Workers:

```bash
# Deploy to production
npm run deploy
```

Your MCP server will be available at:
```
https://semantic-wake-intelligence-mcp.YOUR-ACCOUNT.workers.dev
```

## Connect to Claude Desktop

To use Wake Intelligence with Claude Desktop:

### 1. Install mcp-remote

```bash
npm install -g mcp-remote
```

### 2. Configure Claude Desktop

Edit your Claude Desktop configuration file:

**macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "wake-intelligence": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"
      ]
    }
  }
}
```

**For production deployment:**

```json
{
  "mcpServers": {
    "wake-intelligence": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://semantic-wake-intelligence-mcp.YOUR-ACCOUNT.workers.dev/sse"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

Close and reopen Claude Desktop. You should see Wake Intelligence tools available in the tool palette.

## First Steps with Wake Intelligence

### Save Your First Context

```
Claude, save this context:
"Started Wake Intelligence setup. Database created and migrations successful. Ready to build temporal intelligence features."

Use action type: implementation
Project: wake-intelligence-setup
```

### Load Contexts

```
Claude, load contexts for project "wake-intelligence-setup"
```

### Reconstruct Reasoning

```
Claude, reconstruct the reasoning for context [context-id]
```

### Check Memory Stats

```
Claude, show me memory statistics for project "wake-intelligence-setup"
```

## Understanding the 3 Layers

Now that Wake Intelligence is running, let's understand what each layer does:

### Layer 1: Causality Engine (Past - WHY)

Automatically tracks WHY contexts were created:

```typescript
// Every save can include causality metadata
{
  actionType: "decision",  // What kind of action
  rationale: "Chose Redis for caching because...",  // WHY
  dependencies: ["context-123", "context-456"]  // Related contexts
}
```

**Use it to:**
- Understand decision history
- Build causal chains
- Reconstruct reasoning

### Layer 2: Memory Manager (Present - HOW)

Automatically classifies contexts by relevance:

- **ACTIVE** - Accessed < 1 hour ago
- **RECENT** - Accessed 1-24 hours ago
- **ARCHIVED** - Accessed 1-30 days ago
- **EXPIRED** - Accessed > 30 days ago

**Use it to:**
- Prioritize recent contexts
- Automatically prune old data
- Track access patterns

### Layer 3: Propagation Engine (Future - WHAT)

Predicts what contexts you'll need next:

```typescript
// Composite prediction score
score = 0.4 * temporal + 0.3 * causal + 0.3 * frequency

// Reasons: ["recently_accessed", "causal_chain_root", "high_frequency"]
```

**Use it to:**
- Pre-fetch likely-needed contexts
- Optimize cache strategy
- Identify patterns

## Next Steps

Now that you have Wake Intelligence running:

1. **Explore the Architecture** - [3-Layer Brain Architecture](/development/architecture)
2. **Learn the Tools** - [MCP Tools Reference](/tools/overview)
3. **Dive into APIs** - [API Documentation](/api/overview)
4. **Understand the Pattern** - [Semantic Intent](/development/semantic-intent)

## Troubleshooting

### Database Connection Issues

**Problem:** `Error: D1 database not found`

**Solution:** Ensure your `wrangler.jsonc` has the correct database ID:

```bash
# List your databases
wrangler d1 list

# Verify the ID matches your configuration
```

### Migration Errors

**Problem:** `Error: table already exists`

**Solution:** Migrations are idempotent. If a table exists, the migration will skip creation. Check which migrations have run:

```bash
wrangler d1 execute wake-intelligence --local --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### Local Development Port Conflicts

**Problem:** `Error: Address already in use (port 8787)`

**Solution:** Either stop the other process using port 8787, or change the port in `wrangler.jsonc`:

```jsonc
{
  "dev": {
    "port": 8788  // Use a different port
  }
}
```

### Claude Desktop Not Seeing Tools

**Problem:** Tools don't appear in Claude Desktop

**Solutions:**
1. Verify your `claude_desktop_config.json` path is correct
2. Restart Claude Desktop completely (quit and reopen)
3. Check that the MCP server is running: `curl http://localhost:8787/`
4. Verify `mcp-remote` is installed: `npm list -g mcp-remote`

## Getting Help

- **Documentation:** [wakeiqx.com](https://wakeiqx.com)
- **GitHub Issues:** [Report bugs](https://github.com/semanticintent/semantic-wake-intelligence-mcp/issues)
- **Discussions:** [Ask questions](https://github.com/semanticintent/semantic-wake-intelligence-mcp/discussions)

## What's Next?

You're now ready to use Wake Intelligence! Here are some suggested next steps:

- ✅ [Architecture Deep Dive](/development/architecture) - Understand the 3-layer brain
- ✅ [Tool Reference](/tools/overview) - Learn all available MCP tools
- ✅ [Database Schema](/development/database-schema) - Explore the data model
- ✅ [Semantic Intent Pattern](/development/semantic-intent) - Learn the design philosophy

**Welcome to temporal intelligence! 🧠**

The wake persists. 🐦
