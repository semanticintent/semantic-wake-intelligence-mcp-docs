# MCP Tools Overview

Wake Intelligence provides a comprehensive suite of Model Context Protocol (MCP) tools for managing temporal intelligence. All tools are accessible through Claude Desktop or any MCP-compatible client.

## Tool Categories

### Core Context Management

Essential tools for saving, loading, and searching contexts.

| Tool | Purpose | Layer |
|------|---------|-------|
| [save_context](/tools/save-context) | Save conversation context with AI enhancement | All 3 |
| [load_context](/tools/load-context) | Retrieve contexts for a project | Layer 2 |
| [search_context](/tools/search-context) | Search contexts by keywords | Layer 2 |

### Layer 1: Causality (Past - WHY)

Tools for understanding decision history and causal relationships.

| Tool | Purpose |
|------|---------|
| [reconstruct_reasoning](/tools/reconstruct-reasoning) | Explain WHY a context was created |
| [build_causal_chain](/tools/build-causal-chain) | Trace decision history backwards |
| [get_causality_stats](/tools/get-causality-stats) | Analytics on causal relationships |

### Layer 2: Memory (Present - HOW)

Tools for managing memory tiers and access patterns.

| Tool | Purpose |
|------|---------|
| [get_memory_stats](/tools/get-memory-stats) | View memory tier distribution |
| [recalculate_memory_tiers](/tools/recalculate-memory-tiers) | Update tier classifications |
| [prune_expired_contexts](/tools/prune-expired-contexts) | Clean up old contexts |

### Layer 3: Propagation (Future - WHAT)

Tools for prediction and pre-fetching optimization.

| Tool | Purpose |
|------|---------|
| [update_predictions](/tools/update-predictions) | Refresh prediction scores |
| [get_high_value_contexts](/tools/get-high-value-contexts) | Retrieve likely-needed contexts |
| [get_propagation_stats](/tools/get-propagation-stats) | Analytics on predictions |

## Quick Examples

### Save a Context

```
Claude, save this context:
"Completed database migration 0004 for Layer 3. All prediction columns added successfully."

Project: wake-intelligence
Action type: implementation
```

### Load Recent Contexts

```
Claude, load contexts for project "wake-intelligence"
```

### Reconstruct Reasoning

```
Claude, why did we create context [context-id]?
```

### Check Memory Stats

```
Claude, show me memory statistics for "wake-intelligence"
```

### Update Predictions

```
Claude, update predictions for project "wake-intelligence"
```

### Get High-Value Contexts

```
Claude, what contexts am I most likely to need next for "wake-intelligence"?
```

## Tool Design Principles

All Wake Intelligence tools follow these principles:

### 1. **Observable Inputs**
Every parameter is based on observable, measurable data:
- Project names (strings)
- Context IDs (UUIDs)
- Time windows (hours, days)
- Score thresholds (0.0-1.0)

### 2. **Semantic Outputs**
Results include human-readable explanations:
- Memory tier names (ACTIVE, RECENT, ARCHIVED, EXPIRED)
- Action types (decision, implementation, refactor)
- Prediction reasons (recently_accessed, causal_chain_root)

### 3. **Composable Operations**
Tools can be chained together:
```
1. get_high_value_contexts → [list of IDs]
2. load_context → [context details]
3. reconstruct_reasoning → [decision history]
```

### 4. **Bounded Results**
All queries have sensible limits to prevent overwhelming responses:
- Default limit: 10 results
- Maximum limit: 100 results
- Pagination support (coming soon)

## Integration Examples

### Claude Desktop Workflow

```markdown
## Daily Standup

Claude, do these in sequence:

1. Load contexts for project "daily-standup" from the last 24 hours
2. Show me memory stats to see what's ACTIVE
3. Update predictions so we can prefetch tomorrow's likely contexts
4. Get high-value contexts (score > 0.7) to prepare for tomorrow
```

### Automated Context Management

```markdown
## Weekly Cleanup

Claude:

1. Show memory stats for all projects
2. Prune expired contexts (older than 30 days)
3. Recalculate memory tiers for all contexts
4. Update predictions for active projects
```

### Causal Analysis

```markdown
## Decision Audit Trail

Claude:

1. Search for contexts with tag "architecture-decision"
2. For each result, build the causal chain
3. Reconstruct reasoning to understand WHY decisions were made
4. Show causality stats to identify patterns
```

## Advanced Usage

### Prediction-Based Workflow

Use Layer 3 predictions to optimize your AI workflows:

```markdown
# Morning Routine

Claude:

1. Get high-value contexts (score > 0.8) for today's projects
2. Load those contexts proactively
3. Check propagation stats to see prediction accuracy
4. If accuracy is low, update predictions with fresh data
```

### Memory Tier Management

Leverage automatic tier classification:

```markdown
# Optimize Storage

Claude:

1. Get memory stats for all projects
2. Identify projects with > 50 EXPIRED contexts
3. Prune expired contexts for those projects
4. Recalculate tiers to refresh classifications
```

### Causal Chain Navigation

Trace decision history:

```markdown
# Architecture Review

Claude:

1. Search for "database-migration" contexts
2. Build causal chain from latest migration
3. Reconstruct reasoning for each step
4. Identify which decisions led to current architecture
```

## Tool Response Format

All tools return structured JSON responses following MCP protocol:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Human-readable summary"
    },
    {
      "type": "text",
      "text": "Detailed results in markdown"
    }
  ]
}
```

## Error Handling

Wake Intelligence provides clear error messages:

```json
{
  "error": {
    "code": "CONTEXT_NOT_FOUND",
    "message": "Context with ID 'abc-123' does not exist",
    "details": {
      "contextId": "abc-123",
      "searchedIn": "wake-intelligence"
    }
  }
}
```

## Performance Considerations

### Tool Execution Time

| Tool Category | Typical Response Time |
|---------------|----------------------|
| Simple queries (load, search) | < 100ms |
| Layer 1 analysis (causal chains) | 100-300ms |
| Layer 2 stats (memory analytics) | 200-500ms |
| Layer 3 predictions (batch updates) | 500ms-2s |

### Rate Limits

- **Per minute:** 60 requests
- **Per hour:** 1000 requests
- **Concurrent:** 5 simultaneous requests

## Next Steps

- Explore individual tool documentation for detailed parameters
- Learn about the [3-Layer Architecture](/development/architecture)
- Check out [API Reference](/api/overview) for programmatic access

---

**Ready to dive deep?** 🐦

[Explore Individual Tools →](/tools/save-context)
