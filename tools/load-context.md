# load_context

Load relevant contexts for a project, ordered by recency.

## Overview

The `load_context` tool retrieves previously saved contexts from a project. Contexts are automatically returned in reverse chronological order (most recent first), making it easy to resume work or review conversation history.

**Layer**: Core functionality

**Purpose**: Retrieve preserved contexts for continuation

---

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project` | string | Yes | - | Project identifier to load contexts from |
| `limit` | number | No | 1 | Maximum number of contexts to return |

### Parameter Details

#### `project`
The project identifier used when saving contexts. Must match exactly (case-sensitive).

**Examples:**
- `"authentication-refactor"`
- `"user-dashboard-redesign"`
- `"bug-fix-login"`

#### `limit`
How many contexts to retrieve. Higher limits return more history but take longer.

**Recommendations:**
- `1`: Just the most recent (default, fastest)
- `5`: Recent conversation history
- `10-20`: Extended work session
- `50+`: Full project history

---

## Returns

Returns a `ToolResult` with formatted text containing a list of contexts. Each context includes:
- Project name
- Timestamp (when it was created)
- AI-generated summary
- AI-generated tags

**Example response:**
```
Found 2 context(s):

**mobile-app-auth** (2025-10-17T15:30:00Z)
Decision to use OAuth2 with PKCE for mobile app authentication due to enhanced security over basic JWT
Tags: oauth, security, mobile, authentication, pkce

**mobile-app-auth** (2025-10-17T14:15:00Z)
Research findings on mobile authentication best practices and security considerations
Tags: mobile, authentication, security, research, best-practices
```

If no contexts found:
```
No context found for project: mobile-app-auth
```

---

## Examples

### Basic Usage

```typescript
load_context({
  project: "api-redesign"
})
```

**Result:**
```
Found 1 context(s):

**api-redesign** (2025-10-17T16:00:00Z)
Decision: Use REST API with versioning. Keep it simple for now, migrate to GraphQL only if needed later
Tags: rest, api, versioning, architecture, decision
```

---

### Load Recent History

```typescript
load_context({
  project: "feature-dashboard",
  limit: 5
})
```

**Result:**
```
Found 5 context(s):

**feature-dashboard** (2025-10-17T16:30:00Z)
Completed dashboard layout component with responsive grid
Tags: ui, frontend, dashboard, responsive, component

**feature-dashboard** (2025-10-17T15:45:00Z)
Implemented data fetching logic using React Query
Tags: react, data-fetching, react-query, hooks

**feature-dashboard** (2025-10-17T14:20:00Z)
Designed dashboard wireframe with 3 main sections
Tags: design, wireframe, dashboard, ui, planning

**feature-dashboard** (2025-10-17T13:00:00Z)
Started dashboard feature - planning component structure
Tags: planning, architecture, dashboard, component

**feature-dashboard** (2025-10-17T12:15:00Z)
User requirements gathered for dashboard feature
Tags: requirements, user-story, dashboard, planning
```

---

### Resume Multi-Session Work

```typescript
// Day 1: Save progress
save_context({
  project: "authentication-refactor",
  content: "Completed user login flow. Next: implement password reset."
});

// Day 2: Load and continue
const contexts = load_context({
  project: "authentication-refactor",
  limit: 1
});

// AI sees: "Completed user login flow. Next: implement password reset."
// Continue from where you left off
```

---

### Review Entire Project History

```typescript
load_context({
  project: "bug-investigation",
  limit: 100
})
```

This loads the complete history, useful for:
- Post-mortem analysis
- Documentation generation
- Progress tracking
- Knowledge transfer

---

## Integration with Layers

### Layer 1: Causality Engine

After loading contexts, use causality tools to understand relationships:

```typescript
// Load recent context
const contexts = load_context({ project: "my-project", limit: 1 });

// Get the ID from the loaded context
const contextId = extractId(contexts); // You'd parse this from the result

// Build causal chain to see how we got here
build_causal_chain({ snapshotId: contextId });
```

---

### Layer 2: Memory Manager

`load_context` automatically:
- Updates `last_accessed` timestamp (LRU tracking)
- Increments `access_count` (frequency tracking)
- May trigger memory tier recalculation

**Behind the scenes:**
```sql
UPDATE context_snapshots
SET last_accessed = datetime('now'),
    access_count = access_count + 1
WHERE id = ?
```

This data feeds into Layer 2's memory tier classification.

---

### Layer 3: Propagation Engine

Contexts loaded frequently get higher prediction scores:

```typescript
// Load context
load_context({ project: "my-project" });

// This context now has higher access_count
// Which increases its prediction score

// Later, it shows up in high-value contexts
get_high_value_contexts({ project: "my-project" });
```

---

## Use Cases

### 1. Session Continuity

Resume work from a previous session:

```typescript
// Start of work session
const recent = load_context({
  project: "feature-x",
  limit: 3
});

// Review what was done last time
// Continue from there
```

---

### 2. Context for AI Agents

Provide context to AI agents before asking questions:

```typescript
// Load project history
const history = load_context({
  project: "user-auth",
  limit: 10
});

// Now AI has full context of:
// - What's been discussed
// - Decisions made
// - Current status
```

---

### 3. Progress Tracking

Review work completed over time:

```typescript
// Load all contexts from this week
const thisWeek = load_context({
  project: "sprint-12",
  limit: 50
});

// Analyze:
// - Features completed
// - Decisions made
// - Blockers encountered
```

---

### 4. Knowledge Transfer

Help new team members understand project:

```typescript
// Load complete project history
const fullHistory = load_context({
  project: "payment-service",
  limit: 200
});

// New team member can read:
// - Why decisions were made
// - What approaches were tried
// - Current architecture
```

---

## Ordering & Filtering

### Automatic Ordering

Contexts are **always** returned in reverse chronological order:
- Index 0: Most recent
- Index 1: Second most recent
- Index 2: Third most recent
- ...

**SQL query used:**
```sql
SELECT * FROM context_snapshots
WHERE project = ?
ORDER BY timestamp DESC
LIMIT ?
```

### Memory Tier Priority

While not explicitly filtered, contexts are implicitly prioritized by memory tier:
- **ACTIVE** contexts (< 1 hour) appear first (most recent)
- **RECENT** contexts (1-24 hours) appear next
- **ARCHIVED** contexts (1-30 days) appear later
- **EXPIRED** contexts (> 30 days) appear last

This happens naturally because tier is based on `last_accessed`, which correlates with `timestamp`.

---

## Performance

| Contexts | Latency | Notes |
|----------|---------|-------|
| 1 | 10-50ms | Fastest (single DB query) |
| 10 | 20-100ms | Reasonable for most use cases |
| 50 | 50-200ms | Full conversation history |
| 100+ | 100-500ms | Large history, consider pagination |

**Optimization tips:**
- Use smallest `limit` that meets your needs
- Cache results if loading repeatedly
- Consider search_context if looking for specific topics

---

## Pagination Pattern

For large projects, load in batches:

```typescript
// Page 1: Most recent 20
const page1 = load_context({ project: "my-project", limit: 20 });

// If you need more, load next batch
// Note: WakeIQX doesn't have built-in pagination yet
// This is a future enhancement
```

**Current limitation:**
- No `offset` parameter (yet)
- Load all at once or use smaller limits

**Workaround:**
- Filter by date in your application code
- Use `search_context` for specific topics

---

## Best Practices

### 1. Start with Small Limits

```typescript
// ✅ Good: Load only what you need
load_context({ project: "my-project", limit: 5 });

// ❌ Bad: Load everything by default
load_context({ project: "my-project", limit: 1000 });
```

### 2. Cache Loaded Contexts

```typescript
// ✅ Good: Cache and reuse
const cache = new Map();
let contexts = cache.get(project);
if (!contexts) {
  contexts = load_context({ project, limit: 10 });
  cache.set(project, contexts);
}

// ❌ Bad: Load repeatedly
load_context({ project: "my-project" }); // Call 1
load_context({ project: "my-project" }); // Call 2 (unnecessary)
load_context({ project: "my-project" }); // Call 3 (unnecessary)
```

### 3. Use Appropriate Limits

```typescript
// Quick check: limit 1
const latest = load_context({ project: "...", limit: 1 });

// Recent history: limit 5-10
const recent = load_context({ project: "...", limit: 5 });

// Full session: limit 20-50
const session = load_context({ project: "...", limit: 20 });

// Complete history: limit 100+
const all = load_context({ project: "...", limit: 100 });
```

### 4. Combine with Search

If you need specific contexts, use `search_context` instead:

```typescript
// ✅ Good: Search for specific topic
search_context({
  query: "authentication OAuth",
  project: "my-project"
});

// ❌ Bad: Load all and filter manually
const all = load_context({ project: "my-project", limit: 100 });
// Then filter in code for "authentication"
```

---

## Error Handling

### Project Not Found

```typescript
load_context({ project: "non-existent-project" });

// Result:
// "No context found for project: non-existent-project"
```

This is **not an error** - it's a valid empty result. Projects are created implicitly when first context is saved.

### Invalid Limit

```typescript
// ❌ Negative limit
load_context({ project: "my-project", limit: -1 });
// Error or defaults to 1

// ❌ Limit of 0
load_context({ project: "my-project", limit: 0 });
// Error or defaults to 1
```

---

## Comparison with Other Tools

### load_context vs search_context

| Feature | load_context | search_context |
|---------|--------------|----------------|
| **Order** | By timestamp (recent first) | By relevance (best match first) |
| **Filter** | Project only | Project + keyword query |
| **Use case** | Recent history | Find specific topics |
| **Speed** | Fast (simple query) | Slower (text search) |

**Example:**
```typescript
// Get recent contexts
load_context({ project: "my-project", limit: 5 });

// Find contexts about authentication
search_context({ query: "authentication", project: "my-project" });
```

---

### load_context vs get_high_value_contexts

| Feature | load_context | get_high_value_contexts |
|---------|--------------|-------------------------|
| **Order** | By timestamp | By prediction score |
| **Filter** | Project only | Project + minimum score |
| **Layer** | Core | Layer 3 (Propagation) |
| **Use case** | See recent work | Pre-fetch likely contexts |

**Example:**
```typescript
// Get recent contexts
load_context({ project: "my-project", limit: 5 });

// Get contexts likely to be accessed soon
get_high_value_contexts({ project: "my-project", minScore: 0.7 });
```

---

## Advanced Usage

### Extracting Context IDs

The response is text, but you can parse IDs for further operations:

```typescript
const result = load_context({ project: "my-project", limit: 1 });

// Parse the result to extract ID
// (This assumes you're processing the text output)
const contextId = parseIdFromResult(result);

// Use ID for causality tracking
build_causal_chain({ snapshotId: contextId });
```

**Note:** Future versions may return structured JSON instead of text.

---

### Loading Multiple Projects

```typescript
const projects = ["feature-a", "feature-b", "feature-c"];

for (const project of projects) {
  const contexts = load_context({ project, limit: 1 });
  console.log(`${project}:`, contexts);
}
```

---

## See Also

- [save_context](/tools/save-context) - Save new contexts
- [search_context](/tools/search-context) - Search by keyword
- [get_high_value_contexts](/tools/get-high-value-contexts) - Get predicted contexts
- [Layer 2: Memory Manager](/development/layer-2-memory) - Understanding memory tiers
