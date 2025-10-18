export interface Message {
  role: 'user' | 'system' | 'tool' | 'assistant'
  content: string
  toolName?: string
  toolParams?: any
  toolResult?: any
}

export interface Scenario {
  id: string
  icon: string
  title: string
  description: string
  category: string
  messages: Message[]
}

export const playgroundScenarios: Scenario[] = [
  {
    id: 'causal-chain',
    icon: '🔍',
    title: 'Development Session - Causal Chain',
    description: 'See how Layer 1 (Causality Engine) tracks decision history backwards through time',
    category: 'Layer 1: Past (WHY)',
    messages: [
      {
        role: 'user',
        content: 'I want to trace back why I made certain architecture decisions in my auth system'
      },
      {
        role: 'system',
        content: 'Analyzing causal chain for authentication architecture...'
      },
      {
        role: 'tool',
        content: 'Tool Invocation',
        toolName: 'build_causal_chain',
        toolParams: {
          snapshotId: 'ctx_auth_final_implementation_789'
        }
      },
      {
        role: 'tool',
        content: 'Tool Result - Causal Chain Built',
        toolResult: {
          chain: [
            {
              id: 'ctx_auth_final_implementation_789',
              summary: 'Implemented JWT tokens with refresh token rotation',
              timestamp: '2024-10-17T15:30:00Z',
              causedBy: 'ctx_auth_oauth2_research_456',
              actionType: 'implementation',
              depth: 0
            },
            {
              id: 'ctx_auth_oauth2_research_456',
              summary: 'Researched OAuth2 vs JWT trade-offs',
              timestamp: '2024-10-17T14:15:00Z',
              causedBy: 'ctx_auth_security_discussion_123',
              actionType: 'research',
              depth: 1
            },
            {
              id: 'ctx_auth_security_discussion_123',
              summary: 'Team discussion: security requirements for multi-tenant auth',
              timestamp: '2024-10-17T10:00:00Z',
              causedBy: null,
              actionType: 'conversation',
              depth: 2
            }
          ],
          totalDepth: 2,
          rootCause: {
            id: 'ctx_auth_security_discussion_123',
            summary: 'Team discussion: security requirements for multi-tenant auth'
          }
        }
      },
      {
        role: 'assistant',
        content: `🔍 **Causal Chain Discovered** (3 decisions deep)

**Your Final Implementation:**
→ Implemented JWT tokens with refresh token rotation

**Was Caused By:**
1. **Research Phase** (5 hours ago)
   • Researched OAuth2 vs JWT trade-offs

2. **Original Discussion** (ROOT CAUSE)
   • Team discussion: security requirements for multi-tenant auth
   • This is WHERE IT ALL STARTED

**Insight:** Your JWT implementation traces back to a team security discussion this morning. The research phase evaluated OAuth2 but you chose JWTs with rotation for simplicity + security.

**Memory Status:** All 3 contexts are in RECENT tier (accessed today)`
      }
    ]
  },
  {
    id: 'memory-tiers',
    icon: '💾',
    title: 'Memory Tier Evolution',
    description: 'Watch how Layer 2 (Memory Manager) manages context lifecycle over time',
    category: 'Layer 2: Present (HOW)',
    messages: [
      {
        role: 'user',
        content: 'Show me how my contexts are distributed across memory tiers'
      },
      {
        role: 'system',
        content: 'Analyzing memory tier distribution...'
      },
      {
        role: 'tool',
        content: 'Tool Invocation',
        toolName: 'get_memory_stats',
        toolParams: {
          project: 'ai-consulting-platform'
        }
      },
      {
        role: 'tool',
        content: 'Tool Result - Memory Statistics',
        toolResult: {
          project: 'ai-consulting-platform',
          active: 5,
          recent: 23,
          archived: 67,
          expired: 12,
          total: 107,
          oldestContext: '2024-07-15T08:30:00Z',
          newestContext: '2024-10-17T16:45:00Z'
        }
      },
      {
        role: 'assistant',
        content: `💾 **Memory Statistics for ai-consulting-platform**

📊 **Memory Tier Distribution:**
  - 🔥 ACTIVE (< 1 hour): **5 contexts**
  - ⚡ RECENT (1-24 hours): **23 contexts**
  - 📦 ARCHIVED (1-30 days): **67 contexts**
  - ❄️  EXPIRED (> 30 days): **12 contexts**

📈 **Total Contexts:** 107

**Age Range:**
- Oldest: July 15, 2024 (3 months ago)
- Newest: Today at 4:45 PM

**Health Assessment:**
✅ Good distribution - 28 contexts in hot tiers (ACTIVE + RECENT)
⚠️  12 expired contexts ready for pruning (11% of total)

**Recommendation:** Run \`prune_expired_contexts\` to reclaim space from contexts older than 30 days`
      }
    ]
  },
  {
    id: 'future-prediction',
    icon: '🔮',
    title: 'Future Context Prediction',
    description: 'See Layer 3 (Propagation Engine) predict which contexts you\'ll need next',
    category: 'Layer 3: Future (WHAT)',
    messages: [
      {
        role: 'user',
        content: 'What contexts am I likely to need for my upcoming work?'
      },
      {
        role: 'system',
        content: 'Calculating prediction scores using multi-factor algorithm...'
      },
      {
        role: 'tool',
        content: 'Tool Invocation',
        toolName: 'get_high_value_contexts',
        toolParams: {
          project: 'ai-consulting-platform',
          minScore: 0.6,
          limit: 5
        }
      },
      {
        role: 'tool',
        content: 'Tool Result - High-Value Predictions',
        toolResult: {
          contexts: [
            {
              id: 'ctx_auth_jwt_implementation_789',
              summary: 'JWT token implementation with refresh rotation',
              predictionScore: 0.85,
              predictionReason: 'High temporal momentum (accessed 3x today) + Root cause in active chain + Frequent reference pattern',
              lastAccessed: '2024-10-17T15:30:00Z',
              memoryTier: 'ACTIVE',
              causalDepth: 0,
              accessCount: 8
            },
            {
              id: 'ctx_database_migration_schema_456',
              summary: 'Database migration plan for multi-tenancy',
              predictionScore: 0.78,
              predictionReason: 'Causal dependency (root of 3 decisions) + Recent access spike + Production environment',
              lastAccessed: '2024-10-17T14:20:00Z',
              memoryTier: 'RECENT',
              causalDepth: 0,
              accessCount: 5
            },
            {
              id: 'ctx_api_rate_limiting_design_234',
              summary: 'API rate limiting strategy discussion',
              predictionScore: 0.72,
              predictionReason: 'Part of active causal chain + Medium access frequency + Related to current work',
              lastAccessed: '2024-10-17T11:00:00Z',
              memoryTier: 'RECENT',
              causalDepth: 1,
              accessCount: 4
            },
            {
              id: 'ctx_deployment_cloudflare_workers_123',
              summary: 'Cloudflare Workers deployment configuration',
              predictionScore: 0.68,
              predictionReason: 'Steady access pattern + Infrastructure context + Moderate causal importance',
              lastAccessed: '2024-10-16T16:45:00Z',
              memoryTier: 'RECENT',
              causalDepth: 2,
              accessCount: 6
            },
            {
              id: 'ctx_testing_strategy_e2e_567',
              summary: 'End-to-end testing strategy with Playwright',
              predictionScore: 0.65,
              predictionReason: 'Consistent weekly access + Testing phase approaching + High frequency score',
              lastAccessed: '2024-10-15T09:30:00Z',
              memoryTier: 'ARCHIVED',
              causalDepth: 3,
              accessCount: 7
            }
          ],
          totalEvaluated: 107,
          scoreBreakdown: {
            temporal: 0.40,
            causal: 0.30,
            frequency: 0.30
          }
        }
      },
      {
        role: 'assistant',
        content: `🔮 **High-Value Context Predictions**

Top 5 contexts you'll likely need soon (out of 107 evaluated):

**1. JWT Token Implementation** [Score: 0.85]
   📍 *ACTIVE tier* • Accessed 8 times • Root cause
   🎯 High temporal momentum + Root of active chain

**2. Database Migration Plan** [Score: 0.78]
   📍 *RECENT tier* • Accessed 5 times • Root cause
   🎯 Causal dependency + Recent spike + Production critical

**3. API Rate Limiting Strategy** [Score: 0.72]
   📍 *RECENT tier* • Accessed 4 times • Depth 1
   🎯 Part of active chain + Related to current work

**4. Cloudflare Workers Config** [Score: 0.68]
   📍 *RECENT tier* • Accessed 6 times • Depth 2
   🎯 Steady pattern + Infrastructure context

**5. E2E Testing Strategy** [Score: 0.65]
   📍 *ARCHIVED tier* • Accessed 7 times • Depth 3
   🎯 Weekly access + Testing phase approaching

**Scoring Algorithm:**
• Temporal momentum: 40% (recent access patterns)
• Causal position: 30% (root causes score higher)
• Access frequency: 30% (popularity indicator)

**Recommendation:** Pre-fetch contexts #1-3 for your next work session`
      }
    ]
  },
  {
    id: 'save-and-reconstruct',
    icon: '⚡',
    title: 'Save Context & Reconstruct Reasoning',
    description: 'Create a new context and later understand WHY it was created',
    category: 'Full Cycle Demo',
    messages: [
      {
        role: 'user',
        content: 'Save this context: I decided to use Redis for session storage instead of in-memory, caused by our discussion about horizontal scaling'
      },
      {
        role: 'system',
        content: 'Saving context with causality tracking...'
      },
      {
        role: 'tool',
        content: 'Tool Invocation',
        toolName: 'save_context',
        toolParams: {
          project: 'ai-consulting-platform',
          summary: 'Redis session storage decision',
          context: 'Decided to use Redis for session storage instead of in-memory cache. This enables horizontal scaling across multiple Workers instances and provides persistent sessions.',
          causedBy: 'ctx_scaling_discussion_456',
          actionType: 'decision',
          rationale: 'Need for stateless Workers that can scale horizontally without session loss'
        }
      },
      {
        role: 'tool',
        content: 'Tool Result - Context Saved',
        toolResult: {
          id: 'ctx_redis_session_decision_890',
          project: 'ai-consulting-platform',
          summary: 'Redis session storage decision',
          timestamp: '2024-10-17T16:50:00Z',
          memoryTier: 'ACTIVE',
          causality: {
            causedBy: 'ctx_scaling_discussion_456',
            actionType: 'decision',
            rationale: 'Need for stateless Workers that can scale horizontally without session loss'
          },
          propagation: {
            predictionScore: 0.0,
            lastUpdated: '2024-10-17T16:50:00Z'
          }
        }
      },
      {
        role: 'assistant',
        content: `✅ **Context Saved Successfully**

**ID:** ctx_redis_session_decision_890
**Summary:** Redis session storage decision
**Memory Tier:** ACTIVE (< 1 hour old)

**Layer 1 (Causality):**
• Caused by: Scaling discussion (ctx_scaling_discussion_456)
• Action type: Decision
• Rationale recorded: ✅

**Layer 2 (Memory):**
• Initial tier: ACTIVE
• Will age: RECENT (after 1 hour) → ARCHIVED (after 1 day)

**Layer 3 (Propagation):**
• Prediction score: Not yet calculated (run update_predictions)

Your decision is now part of the temporal intelligence graph!`
      },
      {
        role: 'user',
        content: 'Later that week... why did I choose Redis again?'
      },
      {
        role: 'system',
        content: 'Reconstructing reasoning chain...'
      },
      {
        role: 'tool',
        content: 'Tool Invocation',
        toolName: 'reconstruct_reasoning',
        toolParams: {
          snapshotId: 'ctx_redis_session_decision_890'
        }
      },
      {
        role: 'tool',
        content: 'Tool Result - Reasoning Reconstructed',
        toolResult: {
          snapshot: {
            id: 'ctx_redis_session_decision_890',
            summary: 'Redis session storage decision',
            timestamp: '2024-10-17T16:50:00Z'
          },
          reasoning: {
            actionType: 'decision',
            rationale: 'Need for stateless Workers that can scale horizontally without session loss',
            causedBy: {
              id: 'ctx_scaling_discussion_456',
              summary: 'Horizontal scaling architecture discussion',
              timestamp: '2024-10-17T14:30:00Z'
            }
          },
          explanation: 'This decision was made because you needed stateless Workers that could scale horizontally. It was triggered by the scaling architecture discussion earlier that day.'
        }
      },
      {
        role: 'assistant',
        content: `🔍 **Reasoning Reconstruction**

**Your Decision:** Redis session storage
**When:** October 17, 2024 at 4:50 PM

**WHY You Made This Decision:**
✦ **Rationale:** Need for stateless Workers that can scale horizontally without session loss

**WHAT Triggered It:**
← **Scaling Discussion** (2 hours earlier)
   "Horizontal scaling architecture discussion"

**The Story:**
1. You had a discussion about horizontal scaling (2:30 PM)
2. Realized in-memory sessions wouldn't work across Workers
3. Decided on Redis for persistent, shared session storage (4:50 PM)

**Memory Status:** Still in RECENT tier (accessed this week)

**Insight:** This wasn't a random choice - it solved a specific architectural constraint from your scaling requirements.`
      }
    ]
  },
  {
    id: 'search-patterns',
    icon: '🔎',
    title: 'Semantic Search Across Time',
    description: 'Find contexts by keyword and see how they connect across all 3 layers',
    category: 'Cross-Layer Search',
    messages: [
      {
        role: 'user',
        content: 'Search for all contexts related to "authentication"'
      },
      {
        role: 'system',
        content: 'Searching across temporal intelligence graph...'
      },
      {
        role: 'tool',
        content: 'Tool Invocation',
        toolName: 'search_context',
        toolParams: {
          project: 'ai-consulting-platform',
          keywords: 'authentication'
        }
      },
      {
        role: 'tool',
        content: 'Tool Result - Search Results',
        toolResult: {
          results: [
            {
              id: 'ctx_auth_jwt_implementation_789',
              summary: 'JWT token implementation with refresh rotation',
              timestamp: '2024-10-17T15:30:00Z',
              memoryTier: 'ACTIVE',
              predictionScore: 0.85,
              causedBy: 'ctx_auth_oauth2_research_456',
              actionType: 'implementation'
            },
            {
              id: 'ctx_auth_oauth2_research_456',
              summary: 'Researched OAuth2 vs JWT trade-offs for authentication',
              timestamp: '2024-10-17T14:15:00Z',
              memoryTier: 'RECENT',
              predictionScore: 0.68,
              causedBy: 'ctx_auth_security_discussion_123',
              actionType: 'research'
            },
            {
              id: 'ctx_auth_security_discussion_123',
              summary: 'Team discussion: security requirements for multi-tenant authentication',
              timestamp: '2024-10-17T10:00:00Z',
              memoryTier: 'RECENT',
              predictionScore: 0.52,
              causedBy: null,
              actionType: 'conversation'
            },
            {
              id: 'ctx_auth_middleware_refactor_234',
              summary: 'Refactored authentication middleware for better error handling',
              timestamp: '2024-10-15T09:20:00Z',
              memoryTier: 'ARCHIVED',
              predictionScore: 0.45,
              causedBy: 'ctx_auth_jwt_implementation_789',
              actionType: 'refactor'
            }
          ],
          totalFound: 4,
          searchQuery: 'authentication',
          project: 'ai-consulting-platform'
        }
      },
      {
        role: 'assistant',
        content: `🔎 **Search Results: "authentication"**

Found **4 contexts** in project *ai-consulting-platform*

---

**1. JWT Implementation** (ACTIVE) [Score: 0.85]
   📅 Today at 3:30 PM • Type: Implementation
   🔗 Caused by: OAuth2 Research
   🔮 High prediction score - likely needed soon

**2. OAuth2 Research** (RECENT) [Score: 0.68]
   📅 Today at 2:15 PM • Type: Research
   🔗 Caused by: Security Discussion
   🔮 Medium prediction - moderate priority

**3. Security Discussion** (RECENT) [Score: 0.52]
   📅 Today at 10:00 AM • Type: Conversation
   🔗 ROOT CAUSE (no parent)
   🔮 Lower prediction - original discussion

**4. Middleware Refactor** (ARCHIVED) [Score: 0.45]
   📅 2 days ago • Type: Refactor
   🔗 Caused by: JWT Implementation
   🔮 Lower priority - archived tier

---

**3-Layer Analysis:**

🔍 **Layer 1 (Causality):** Clear chain from discussion → research → implementation → refactor
💾 **Layer 2 (Memory):** 3 in hot tiers (ACTIVE/RECENT), 1 archived
🔮 **Layer 3 (Propagation):** #1 predicted as highest value for future work

**Insight:** Your authentication work shows a logical progression. The JWT implementation (#1) is your most valuable context right now.`
      }
    ]
  }
]
