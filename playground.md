---
layout: doc
title: Playground
aside: false
---

<script setup>
import PlaygroundTemporal from './.vitepress/theme/components/PlaygroundTemporal.vue'
</script>

<style>
/* Remove VitePress content constraints for full-width playground */
.vp-doc .container {
  max-width: 100% !important;
  padding: 0 !important;
}

.vp-doc .content {
  max-width: 100% !important;
  padding: 2rem 1rem !important;
}
</style>

# WakeIQX Playground

Experience the **3-layer temporal intelligence architecture** with interactive scenarios. Each demo shows how WakeIQX tracks context across time dimensions: **Past (WHY)**, **Present (HOW)**, and **Future (WHAT)**.

<PlaygroundTemporal />

---

## About These Examples

All scenarios above are based on real MCP tool implementations with:
- **Actual tool schemas** from the WakeIQX codebase
- **Real 3-layer architecture** (Causality, Memory, Propagation)
- **Authentic responses** matching actual tool output format

### What You're Seeing:

1. **User Query** - Natural language question about context
2. **Tool Invocation** - MCP server selects appropriate tool and parameters
3. **Tool Result** - Temporal intelligence analysis across layers
4. **WakeIQX Response** - Actionable insights with causal chains, memory tiers, and predictions

### The 3-Layer Brain Architecture:

```
┌─────────────────────────────────────────────────────┐
│  Layer 3: PROPAGATION ENGINE (Future - WHAT)        │
│  Predicts which contexts will be needed next         │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│  Layer 2: MEMORY MANAGER (Present - HOW)            │
│  Manages context relevance and lifecycle            │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│  Layer 1: CAUSALITY ENGINE (Past - WHY)             │
│  Tracks decision history and reasoning chains       │
└─────────────────────────────────────────────────────┘
```

### Key Features Demonstrated:

- 🔍 **Layer 1: Causality Engine** - Backward causal chain reconstruction
- 💾 **Layer 2: Memory Manager** - Memory tier evolution (ACTIVE → RECENT → ARCHIVED → EXPIRED)
- 🔮 **Layer 3: Propagation Engine** - Multi-factor prediction scoring (40% temporal, 30% causal, 30% frequency)
- ⚡ **Cross-Layer Integration** - How all three layers work together
- 📊 **Temporal Analytics** - Statistics and insights across time dimensions

### Memory Tier System:

| Tier | Age | Purpose | Example |
|------|-----|---------|---------|
| **🔥 ACTIVE** | < 1 hour | Hot, frequently accessed | Current work session |
| **⚡ RECENT** | 1-24 hours | Warm, recently used | Today's context |
| **📦 ARCHIVED** | 1-30 days | Cold, aging | Last week's work |
| **❄️ EXPIRED** | > 30 days | Pruning candidates | Old contexts |

### Prediction Scoring Algorithm:

**Combined Score = (Temporal × 0.4) + (Causal × 0.3) + (Frequency × 0.3)**

- **Temporal (40%):** Recent access patterns and momentum
- **Causal (30%):** Position in causal chain (root causes score higher)
- **Frequency (30%):** Overall popularity and access count

---

## Want to Try the Real Thing?

To use WakeIQX with your own projects:

1. **[Install Claude Desktop](https://claude.ai/download)** - Required for MCP integration
2. **[Clone the Repo](https://github.com/semanticintent/semantic-wake-intelligence-mcp)** - Open source on GitHub
3. **[Follow Setup Guide](/getting-started)** - 5-minute configuration with Cloudflare D1

---

## Real-World Use Cases

### 🔍 Development Session Tracking
```typescript
// Save context with causality
save_context({
  project: "my-app",
  summary: "Implemented OAuth2 authentication",
  context: "Chose OAuth2 over JWT for third-party integrations",
  causedBy: "ctx_security_discussion_123",
  actionType: "implementation",
  rationale: "Need social login providers"
})

// Later: Why did I choose OAuth2?
reconstruct_reasoning({
  snapshotId: "ctx_oauth_implementation_456"
})
// → See the full causal chain back to original discussion
```

### 💾 Memory Management
```typescript
// Check memory health
get_memory_stats({
  project: "my-app"
})
// → See tier distribution, identify expired contexts

// Clean up old contexts
prune_expired_contexts({
  limit: 50
})
// → Remove contexts older than 30 days
```

### 🔮 Proactive Context Loading
```typescript
// Get prediction scores
get_high_value_contexts({
  project: "my-app",
  minScore: 0.6,
  limit: 10
})
// → Pre-fetch likely-needed contexts before starting work

// Update predictions
update_predictions({
  project: "my-app",
  staleThreshold: 3600 // 1 hour
})
// → Recalculate scores for fresh recommendations
```

### ⚡ Full Workflow Example
```typescript
// Morning: Start work session
const recentContexts = await load_context({
  project: "my-app",
  limit: 5
})

// Identify what you were working on
const causalChain = await build_causal_chain({
  snapshotId: recentContexts[0].id
})

// Get predictions for today's work
const predictions = await get_high_value_contexts({
  project: "my-app",
  minScore: 0.7
})

// Work throughout the day, saving contexts...

// Evening: Check memory health
const stats = await get_memory_stats({
  project: "my-app"
})
```

---

## Technical Deep Dive

Interested in how the 3-layer architecture works under the hood?

- **[Architecture Overview](/development/architecture)** - Complete system design
- **[Layer 1: Causality Engine](/development/layer-1-causality)** - Decision history tracking
- **[Layer 2: Memory Manager](/development/layer-2-memory)** - Lifecycle management
- **[Layer 3: Propagation Engine](/development/layer-3-propagation)** - Prediction scoring
- **[Tools Documentation](/tools/overview)** - All 12 MCP tools
- **[API Reference](/api/overview)** - Service interfaces and entities

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--vp-c-bg-soft); border-radius: 12px;">

**Ready to add temporal intelligence to your AI workflows?**

*Past → Present → Future | Temporal Intelligence for AI Agents* 🐦

[Get Started →](/getting-started)

</div>
