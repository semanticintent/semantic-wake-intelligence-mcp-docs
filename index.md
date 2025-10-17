---
layout: home

hero:
  name: "Wake Intelligence"
  text: "Temporal Intelligence MCP"
  tagline: Past → Present → Future | 3-Layer Brain for AI Agents
  image:
    src: /logo.png
    alt: Wake Intelligence - Cormorant Mascot
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View Architecture
      link: /development/architecture
    - theme: alt
      text: Explore Tools
      link: /tools/overview

features:
  - icon: 🧠
    title: 3-Layer Brain Architecture
    details: Complete temporal intelligence system that learns from the past, optimizes the present, and predicts the future. Causality tracking + Memory management + Predictive pre-fetching.

  - icon: ⏮️
    title: Layer 1 - Causality Engine (Past)
    details: Track WHY contexts were created. Automatic dependency detection, causal chain building, and reasoning reconstruction. Understand the history behind every decision.

  - icon: ⏸️
    title: Layer 2 - Memory Manager (Present)
    details: Manage HOW relevant contexts are NOW. 4-tier memory classification (ACTIVE, RECENT, ARCHIVED, EXPIRED) with LRU tracking and automatic pruning.

  - icon: ⏭️
    title: Layer 3 - Propagation Engine (Future)
    details: Predict WHAT contexts will be needed next. Composite scoring with temporal decay, causal strength, and frequency patterns. Proactive pre-fetching optimization.

  - icon: 🎯
    title: Observable Reasoning
    details: Every prediction is explainable. Human-readable reasons for all decisions. No black-box AI - deterministic algorithms you can understand and trust.

  - icon: 🏗️
    title: Hexagonal Architecture
    details: Clean domain-driven design with clear separation of concerns. Pure business logic, infrastructure-agnostic code, and easy testability.

  - icon: 🔌
    title: MCP Integration
    details: Model Context Protocol server for seamless Claude AI integration. Bring temporal intelligence directly into your AI workflows with comprehensive tool suite.

  - icon: ⚡
    title: Production Ready
    details: Deployed on Cloudflare Workers with D1 database. Comprehensive test coverage (109 tests), TypeScript strict mode, and semantic intent patterns throughout.
---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/semanticintent/semantic-wake-intelligence-mcp.git
cd semantic-wake-intelligence-mcp

# Install dependencies
npm install

# Configure Wrangler (create D1 database)
wrangler d1 create wake-intelligence

# Run database migrations
wrangler d1 execute wake-intelligence --local --file=migrations/0001_initial_schema.sql
wrangler d1 execute wake-intelligence --local --file=migrations/0002_add_causality_engine.sql
wrangler d1 execute wake-intelligence --local --file=migrations/0003_add_memory_manager.sql
wrangler d1 execute wake-intelligence --local --file=migrations/0004_add_propagation_engine.sql

# Start development server
npm run dev

# Deploy to production
npm run deploy
```

## What is Wake Intelligence?

**Wake Intelligence (WakeIQX)** is a Model Context Protocol (MCP) server that gives AI agents **temporal intelligence** - the ability to understand the past, manage the present, and predict the future.

Named after the "wake" left by a cormorant (a diving bird that creates ripples in water), Wake Intelligence tracks the **ripple effects** of decisions through time:

- **🕐 Past (Layer 1):** Causality Engine tracks WHY contexts were created
- **🕑 Present (Layer 2):** Memory Manager determines HOW relevant contexts are NOW
- **🕒 Future (Layer 3):** Propagation Engine predicts WHAT will be needed next

### The Cormorant Trinity

Wake Intelligence is the **Time dimension** of the Cormorant Trinity:

| System | Dimension | Layers | Purpose |
|--------|-----------|--------|---------|
| **ChirpIQX** | Sound (Communication) | 7 | Fantasy sports breakout analysis |
| **PerchIQX** | Space (Structure) | 4 | Database schema intelligence |
| **WakeIQX** | Time (Memory) | 3 | AI context temporal intelligence |

Learn more: [The Cormorant Trinity](https://github.com/semanticintent/the-cormorant-trinity)

## Why 3 Layers?

The Wake Intelligence brain is designed around the fundamental structure of time:

1. **Past** - What happened and why (causality)
2. **Present** - What matters now (relevance)
3. **Future** - What comes next (prediction)

Each layer builds on the previous:
- **Layer 2** uses **Layer 1** data (access patterns inform memory tiers)
- **Layer 3** uses **Layer 1 + 2** data (causality + memory → predictions)

This creates a complete temporal intelligence system that's both powerful and comprehensible.

## Key Features

### 🎯 Observable Property Anchoring
Every decision based on measurable data - no subjective interpretation. Memory tiers classified by observable time since access. Predictions scored with transparent algorithms.

### 🏗️ Semantic Intent Pattern
Code organized by **meaning**, not technical characteristics. Each layer has a clear semantic purpose (Past/Present/Future). Architecture reflects business intent at every level.

### 🔒 Immutable Domain Entities
All domain models return new instances instead of mutating state. Predictable behavior, easy testing, and functional programming benefits.

### ⚡ Production Deployment
- **Backend:** Cloudflare Workers (serverless edge compute)
- **Database:** Cloudflare D1 (SQLite at the edge)
- **AI:** Cloudflare Workers AI (text summarization & tagging)
- **Protocol:** MCP (Model Context Protocol)

## Use Cases

### For AI Developers
- **Context Management:** Save and retrieve conversation context across sessions
- **Causal Tracking:** Understand decision history and dependencies
- **Memory Optimization:** Automatic tier management and pruning
- **Predictive Caching:** Pre-fetch contexts most likely needed next

### For AI Agents (Claude, etc.)
- **Long-Term Memory:** Persistent context across conversations
- **Reasoning Reconstruction:** "Why did we decide this?"
- **Pattern Recognition:** Learn from access patterns over time
- **Proactive Assistance:** Anticipate user needs based on predictions

### For Enterprise Applications
- **Audit Trail:** Complete causal history of decisions
- **Performance Optimization:** Memory tier management reduces query load
- **Intelligent Caching:** Prediction-based pre-fetching
- **Observable Reasoning:** Explainable AI decisions for compliance

## Architecture Highlights

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer                     │
│              (MCPRouter)                         │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│          Application Layer                       │
│    (ToolExecutionHandler, MCPProtocolHandler)   │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│            Domain Layer                          │
│  ┌──────────────────────────────────────────┐   │
│  │  Wake Intelligence Brain (3 Layers)      │   │
│  │  • PropagationService (Layer 3)          │   │
│  │  • MemoryManagerService (Layer 2)        │   │
│  │  • CausalityService (Layer 1)            │   │
│  └──────────────────────────────────────────┘   │
│        ContextService (Orchestration)            │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│       Infrastructure Layer                       │
│  • D1ContextRepository → IContextRepository     │
│  • CloudflareAIProvider → IAIProvider           │
└─────────────────────────────────────────────────┘
```

### Database Schema Evolution

**4 Migrations = 3 Brain Layers:**

1. **Migration 0001:** Core context table (id, project, summary, tags, timestamp)
2. **Migration 0002:** Layer 1 - Causality columns (action_type, rationale, dependencies, caused_by)
3. **Migration 0003:** Layer 2 - Memory columns (memory_tier, last_accessed, access_count)
4. **Migration 0004:** Layer 3 - Propagation columns (prediction_score, last_predicted, predicted_next_access, propagation_reason)

Each migration adds semantic intelligence to the system.

## What Makes This Different?

Unlike traditional context management systems, Wake Intelligence is:

1. **Temporal-First:** Designed around Past/Present/Future, not just storage/retrieval
2. **Observable:** Every score, tier, and prediction based on measurable data
3. **Explainable:** Human-readable reasons for all decisions
4. **Semantic:** Code organized by meaning (causality, memory, propagation)
5. **Production-Ready:** Not a prototype - deployed and tested with 109 passing tests

## Learn More

- [Getting Started Guide](/getting-started) - Installation and setup
- [3-Layer Architecture](/development/architecture) - Deep dive into the brain
- [MCP Tools Reference](/tools/overview) - Complete tool documentation
- [API Documentation](/api/overview) - TypeScript API reference
- [GitHub Repository](https://github.com/semanticintent/semantic-wake-intelligence-mcp) - Source code

## The Wake Persists 🐦

Like a cormorant diving beneath the surface, Wake Intelligence tracks the hidden patterns of time - the ripples of cause and effect, the ebb and flow of relevance, and the currents that shape the future.

**Ready to give your AI agent a memory that remembers, understands, and anticipates?**

[Get Started →](/getting-started)
