# save_context

Save conversation context with AI-powered semantic enhancement.

## Overview

The `save_context` tool preserves conversational context for future retrieval. It automatically enhances the raw content with AI-generated summaries and tags, making it easier to find and understand later.

**Layer**: Core functionality

**Purpose**: Persist conversational state across sessions

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | Project identifier for context grouping |
| `content` | string | Yes | The conversation content to save |
| `source` | string | No | Source of the context (default: "mcp") |
| `metadata` | object | No | Additional metadata as key-value pairs |

### Parameter Details

#### `project`
Groups related contexts together. Use consistent project names for contexts that belong to the same work session or topic.

**Examples:**
- `"authentication-refactor"`
- `"user-dashboard-redesign"`
- `"bug-fix-login"`

#### `content`
The raw conversational content to preserve. Can be:
- User questions
- Agent responses
- Code snippets
- Documentation
- Decision records

**Best practices:**
- Include enough context to understand later
- Don't worry about length - AI will summarize
- Include timestamps if relevant

#### `source`
Optional provenance marker indicating where this context came from.

**Common values:**
- `"mcp"` (default)
- `"api"`
- `"manual"`
- `"cli"`

#### `metadata`
Optional extensible key-value pairs for custom data.

**Example:**
```json
{
  "sessionId": "abc-123",
  "userId": "user-456",
  "tags": ["urgent", "backend"]
}
```

---

## Returns

Returns a `ToolResult` with formatted text containing:
- Context ID (UUID)
- AI-generated summary
- AI-generated tags

**Example response:**
```
Context saved!
ID: 550e8400-e29b-41d4-a716-446655440000
Summary: Decision to use OAuth2 with PKCE for mobile app authentication due to enhanced security over basic JWT
Tags: oauth, security, mobile, authentication, pkce
```

---

## Examples

### Basic Usage

```typescript
save_context({
  project: "mobile-app-auth",
  content: "We need to implement OAuth2 with PKCE flow for the mobile app. Basic JWT tokens aren't secure enough for mobile devices because they can't safely store client secrets."
})
```

**Result:**
```
Context saved!
ID: 550e8400-e29b-41d4-a716-446655440000
Summary: Decision to use OAuth2 with PKCE for mobile app authentication due to enhanced security over basic JWT
Tags: oauth, security, mobile, authentication, pkce
```

---

### With Causality Tracking (Layer 1)

```typescript
// First, save the initial question
const userQuestion = save_context({
  project: "api-redesign",
  content: "User asks: How should we structure the new REST API? Should we use GraphQL instead?",
  metadata: {
    actionType: "conversation"
  }
});

// Then, save research findings with causal link
save_context({
  project: "api-redesign",
  content: "Research shows REST is simpler for our use case. GraphQL adds complexity we don't need since we don't have deeply nested data.",
  metadata: {
    actionType: "research",
    causedBy: userQuestion.id  // Links to previous context
  }
});

// Finally, save the decision
save_context({
  project: "api-redesign",
  content: "Decision: Use REST API with versioning (/v1/, /v2/). Keep it simple for now, migrate to GraphQL only if needed later.",
  metadata: {
    actionType: "decision",
    causedBy: userQuestion.id,
    rationale: "REST is simpler and sufficient for current requirements"
  }
});
```

This creates a causal chain: conversation → research → decision

---

### With Custom Metadata

```typescript
save_context({
  project: "customer-support-bot",
  content: "Customer complained about slow response times during peak hours (2-4 PM). Need to investigate database query performance.",
  metadata: {
    priority: "high",
    customerId: "cust-789",
    ticketId: "TICKET-1234",
    reportedBy: "sarah@example.com"
  }
});
```

---

### Saving Code Context

```typescript
save_context({
  project: "authentication-service",
  content: `
Implemented new password hashing function:

\`\`\`typescript
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}
\`\`\`

Using bcrypt with 12 rounds for security. Tested with 1000 passwords, avg time: 150ms.
`,
  metadata: {
    actionType: "file_edit",
    fileName: "auth.service.ts",
    lineNumber: 42
  }
});
```

---

## AI Enhancement

When you save a context, WakeIQX automatically:

### 1. Generates Summary

Uses `@cf/meta/llama-3.1-8b-instruct` to create a concise 2-3 sentence summary.

**Example:**
```
Input: "We need to migrate from MySQL to PostgreSQL because we need better JSON support and JSONB indexing. The migration will take 2 weeks and require downtime. We'll schedule it for next month."

Summary: "Decision to migrate from MySQL to PostgreSQL for improved JSON support and JSONB indexing, with a planned 2-week migration scheduled for next month requiring downtime."
```

### 2. Extracts Tags

AI identifies 3-5 relevant semantic tags for searchability.

**Example:**
```
Input: "Implemented rate limiting on the login endpoint to prevent brute force attacks. Using Redis to track attempts."

Tags: "rate-limiting, security, redis, authentication, brute-force-prevention"
```

---

## Integration with Layers

### Layer 1: Causality Engine

Set `metadata.actionType` and `metadata.causedBy` to enable causal tracking:

```typescript
save_context({
  project: "feature-x",
  content: "...",
  metadata: {
    actionType: "decision",  // conversation|decision|file_edit|tool_use|research
    causedBy: "parent-context-id",
    rationale: "Explanation of why this was saved"
  }
});
```

Later, use `build_causal_chain` to trace the decision history.

---

### Layer 2: Memory Manager

Newly saved contexts automatically:
- Start in `ACTIVE` memory tier (< 1 hour)
- Track `access_count` (starts at 0)
- Record `last_accessed` (null until first load)

Use `get_memory_stats` to monitor tier distribution.

---

### Layer 3: Propagation Engine

After saving, use `update_predictions` to calculate prediction scores:

```typescript
// Save context
save_context({ project: "my-project", content: "..." });

// Update predictions for this project
update_predictions({ project: "my-project" });

// Get high-value contexts
const highValue = get_high_value_contexts({ project: "my-project" });
```

---

## Use Cases

### 1. Multi-Session Workflows

Save progress at the end of each work session:

```typescript
// End of day 1
save_context({
  project: "feature-dashboard",
  content: "Completed user authentication flow. Next: implement dashboard layout components."
});

// Start of day 2
const contexts = load_context({ project: "feature-dashboard" });
// Resume where you left off
```

---

### 2. Decision Tracking

Record important decisions with rationale:

```typescript
save_context({
  project: "architecture-review",
  content: "Decision: Use microservices instead of monolith. Reason: Team is distributed across timezones, need independent deployment.",
  metadata: {
    actionType: "decision",
    decisionMaker: "tech-lead",
    stakeholders: ["backend-team", "devops-team"]
  }
});
```

---

### 3. Knowledge Base Building

Create a searchable knowledge base:

```typescript
// Save tips and tricks
save_context({
  project: "team-knowledge",
  content: "How to debug Workers AI timeout: Check CPU time with wrangler tail. Typical cause: model loading delay on cold start."
});

// Later, search for it
search_context({
  query: "Workers AI timeout",
  project: "team-knowledge"
});
```

---

### 4. Bug Investigation Trail

Track debugging steps:

```typescript
// Initial bug report
save_context({
  project: "bug-login-500",
  content: "Users reporting 500 error on login endpoint. Occurs intermittently during peak hours.",
  metadata: { actionType: "conversation", bugId: "BUG-123" }
});

// Investigation findings
save_context({
  project: "bug-login-500",
  content: "Found database connection pool exhaustion. Max connections: 10, peak requests: 50/sec.",
  metadata: { actionType: "research", causedBy: "previous-context-id" }
});

// Solution
save_context({
  project: "bug-login-500",
  content: "Increased connection pool to 50. Added connection retry logic. Bug resolved.",
  metadata: { actionType: "file_edit", causedBy: "research-context-id" }
});
```

---

## Best Practices

### 1. Use Descriptive Project Names

```typescript
// ✅ Good: Clear and specific
save_context({ project: "user-auth-refactor", content: "..." });

// ❌ Bad: Vague
save_context({ project: "work", content: "..." });
```

### 2. Include Context in Content

```typescript
// ✅ Good: Self-contained
save_context({
  content: "Decision: Use Redis for session storage instead of database because we need sub-10ms latency for session lookups."
});

// ❌ Bad: Lacks context
save_context({
  content: "Use Redis"
});
```

### 3. Save at Logical Checkpoints

```typescript
// ✅ Good: Save after completing a logical unit of work
completeFeature();
save_context({ project: "...", content: "Completed feature X. Next: feature Y" });

// ❌ Bad: Save every minor change
writeOneLine();
save_context({ project: "...", content: "Wrote one line" });
```

### 4. Use Metadata for Filtering

```typescript
// Save with metadata
save_context({
  project: "api-v2",
  content: "...",
  metadata: {
    component: "authentication",
    priority: "high",
    sprint: "sprint-12"
  }
});

// Later, load and filter by metadata in your application code
```

---

## Error Handling

### Missing Required Parameters

```typescript
// ❌ Error: Missing project
save_context({ content: "Hello world" });
// Error: "project" is required

// ❌ Error: Missing content
save_context({ project: "test" });
// Error: "content" is required
```

### AI Enhancement Failure

If AI summarization fails (rare), the system:
1. Falls back to truncated content as summary
2. Generates empty tags
3. Still saves the context successfully

---

## Performance

- **Average latency**: 200-500ms (includes AI processing)
- **AI processing**: 100-300ms
- **Database write**: 50-100ms
- **Edge execution**: Runs in datacenter closest to you

**Optimization tips:**
- Save in batches when possible
- Don't save trivial updates (use judgment)
- Use async/await - don't block on save

---

## See Also

- [load_context](/tools/load-context) - Retrieve saved contexts
- [search_context](/tools/search-context) - Search contexts by keyword
- [Layer 1: Causality Engine](/development/layer-1-causality) - Track decision history
- [Architecture Overview](/development/architecture) - Understand the system
