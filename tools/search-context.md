# search_context

Search contexts using keyword matching across summaries and tags.

## Overview

The `search_context` tool finds relevant contexts by searching through AI-generated summaries and tags. Unlike `load_context` which returns recent contexts chronologically, `search_context` returns the best matches for your query.

**Layer**: Core functionality

**Purpose**: Discover contexts by semantic keyword matching

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search keywords or phrase |
| `project` | string | No | Limit search to specific project |

### Parameter Details

#### `query`
Keywords or phrases to search for. The search is case-insensitive and matches against:
- AI-generated summaries
- AI-generated tags
- Project names

**Examples:**
- `"authentication OAuth"`
- `"database performance"`
- `"bug login"`

#### `project`
Optional project filter. If provided, only searches within that project.

**When to use:**
- Leave empty: Search across all projects
- Specify project: Narrow results to one project

---

## Returns

Formatted text with matching contexts, ordered by relevance:

```
Found 2 context(s) for "authentication":

**mobile-app-auth** (2025-10-17T15:30:00Z)
Decision to use OAuth2 with PKCE for mobile app authentication
Tags: oauth, security, mobile, authentication, pkce

**api-gateway** (2025-10-17T14:20:00Z)
Implemented JWT token validation in API gateway middleware
Tags: jwt, authentication, api-gateway, middleware, security
```

---

## Examples

### Global Search

```typescript
search_context({
  query: "OAuth authentication"
})
```

Searches across all projects for OAuth-related contexts.

---

### Project-Specific Search

```typescript
search_context({
  query: "performance optimization",
  project: "api-service"
})
```

Only searches within the "api-service" project.

---

### Multi-Word Queries

```typescript
search_context({
  query: "database connection pool"
})
```

Finds contexts mentioning databases, connections, and pooling.

---

## Use Cases

### 1. Find Related Work

```typescript
// Working on authentication
search_context({ query: "authentication" });

// Returns all auth-related contexts across projects
```

### 2. Knowledge Discovery

```typescript
// "How did we handle this before?"
search_context({ query: "rate limiting" });

// Find previous implementations
```

### 3. Bug Investigation

```typescript
// Similar bug happened before
search_context({ query: "timeout error database" });

// Find related incidents
```

---

## Best Practices

### Use Specific Terms

```typescript
// ✅ Good: Specific
search_context({ query: "OAuth2 PKCE mobile" });

// ❌ Bad: Too vague
search_context({ query: "auth" });
```

### Combine with Project Filter

```typescript
// ✅ Good: Narrow scope
search_context({
  query: "performance",
  project: "api-service"
});

// ❌ Less efficient: Too broad
search_context({ query: "performance" });
```

---

## See Also

- [load_context](/tools/load-context) - Get recent contexts
- [save_context](/tools/save-context) - Save new contexts
