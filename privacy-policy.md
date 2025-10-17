# Privacy Policy

**Last Updated**: October 17, 2025

**Effective Date**: October 17, 2025

## Introduction

WakeIQX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use the WakeIQX MCP server.

## Information We Collect

### Context Data You Provide

When using WakeIQX, you explicitly save conversation contexts that may include:

- **Project identifiers**: Names you assign to group related work
- **Content**: Conversation text, code snippets, decisions, and notes you choose to save
- **Metadata**: Optional information like source, action types, and causal relationships
- **Timestamps**: Automatic recording of when contexts are created and accessed

### Automatically Collected Data

WakeIQX automatically generates and stores:

- **AI-generated summaries**: Compressed versions of your content
- **AI-generated tags**: Keywords extracted from your content
- **Access patterns**: Last accessed timestamps and access counts
- **Memory tiers**: Automatically calculated relevance classifications
- **Prediction scores**: Calculated likelihood of future access

### Technical Data

The following technical data may be collected:

- **Request metadata**: Timestamps, response times, error logs
- **Usage statistics**: Tool invocation counts, database query patterns
- **Performance metrics**: Latency measurements, cache hit rates

## How We Use Your Information

### Primary Purposes

- **Context Preservation**: Store your conversation contexts for future retrieval
- **AI Enhancement**: Generate summaries and tags to improve searchability
- **Intelligent Retrieval**: Calculate prediction scores for optimization
- **Service Improvement**: Analyze usage patterns to enhance WakeIQX

### We Do NOT

- ❌ Share your contexts with third parties
- ❌ Use your data to train AI models (beyond per-request summarization)
- ❌ Sell your information
- ❌ Track you across other websites or services
- ❌ Use cookies or browser tracking

## Data Storage

### Infrastructure

- **Platform**: Cloudflare Workers (edge computing)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **AI Processing**: Cloudflare Workers AI (llama-3.1-8b-instruct)
- **Location**: Data is replicated across Cloudflare's global network

### Data Retention

- **Active contexts**: Retained indefinitely unless you delete them
- **Expired contexts**: Marked as EXPIRED after 30 days of inactivity
- **Pruned contexts**: Permanently deleted when you run pruning operations

You control retention through:
- `prune_expired_contexts` tool - Delete old contexts
- Manual deletion via API calls
- Project-level deletion

## Data Processing

### AI Processing

When you save a context, we use Cloudflare Workers AI to:

1. **Generate summaries**: 2-3 sentence compressed version of your content
2. **Extract tags**: 3-5 keywords for searchability

**Important**:
- AI processing happens in real-time per request
- Your data is NOT used to train AI models
- AI requests are processed by Cloudflare's infrastructure
- No AI model fine-tuning occurs on your data

### Prediction Scoring

WakeIQX calculates prediction scores based on:
- Access patterns (how often you access contexts)
- Temporal patterns (when you access them)
- Causal relationships (how contexts are linked)

This is **purely computational** - no external services or AI training involved.

## Your Rights

### Access Your Data

You have full access to all your contexts via:
- `load_context` tool - Retrieve your contexts
- `search_context` tool - Search your contexts
- Direct database queries (if self-hosting)

### Delete Your Data

You can delete your data:
- `prune_expired_contexts` - Delete old contexts
- Manual deletion via repository methods
- Complete database deletion (if self-hosting)

### Export Your Data

All contexts are stored in standard SQL format and can be exported:
- Via Cloudflare D1 export tools
- Via API queries
- Direct database dumps (if self-hosting)

### Modify Your Data

Currently, contexts are immutable once created. To update:
- Save a new context with updated information
- Delete the old context if needed
- Link new context to old via `causedBy` (maintain history)

## Security

### Data Protection Measures

- **Encryption in transit**: All API requests use HTTPS/TLS
- **Encryption at rest**: Cloudflare D1 encrypts stored data
- **Isolated execution**: Each request runs in isolated V8 sandbox
- **No shared state**: No cross-request data leakage
- **SQL injection prevention**: All queries use prepared statements

### Access Control

WakeIQX does not currently implement authentication or authorization. If you deploy your own instance:

- **Recommended**: Implement authentication at the edge (Cloudflare Access)
- **Recommended**: Use project names as access control boundaries
- **Recommended**: Deploy separate instances for different users/teams

## Third-Party Services

### Cloudflare

We use Cloudflare for:
- **Workers**: Code execution
- **D1**: Database storage
- **Workers AI**: AI summarization

**Cloudflare's Privacy Policy**: https://www.cloudflare.com/privacypolicy/

### No Other Third Parties

We do NOT use:
- ❌ Analytics services (Google Analytics, etc.)
- ❌ Advertising networks
- ❌ Social media integrations
- ❌ Third-party AI services (beyond Cloudflare)

## Children's Privacy

WakeIQX is not directed to individuals under 13 years of age. We do not knowingly collect personal information from children.

## International Users

WakeIQX is deployed globally via Cloudflare's edge network. Your data may be processed in any of Cloudflare's 300+ datacenters worldwide.

**For EU users**: Data processing occurs in compliance with GDPR principles of data minimization and purpose limitation.

## Changes to This Policy

We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date.

**Notification**: Major changes will be announced via:
- GitHub repository updates
- Documentation site banner
- Release notes

## Self-Hosting

If you self-host WakeIQX:

- **You are the data controller**: You control all data processing
- **Your infrastructure, your rules**: Use your own database, AI, etc.
- **This policy may not apply**: Adapt to your own privacy practices
- **Recommended**: Publish your own privacy policy

## Contact

For privacy-related questions or requests:

- **GitHub Issues**: https://github.com/semanticintent/semantic-wake-intelligence-mcp/issues
- **Email**: privacy@semanticintent.dev (if available)
- **Documentation**: https://docs.wakeiqx.com

## Open Source

WakeIQX is open source (MIT License). You can:
- Review all source code
- Audit data handling practices
- Deploy your own instance
- Modify privacy practices

**Repository**: https://github.com/semanticintent/semantic-wake-intelligence-mcp

---

## Summary

**In plain English:**

✅ **We collect**: Conversation contexts you explicitly save
✅ **We use AI**: Only for summarization (not training)
✅ **We store**: Your data in Cloudflare D1 (encrypted)
✅ **You control**: What to save, when to delete
✅ **We don't**: Share, sell, or track you

**Questions?** Open an issue on GitHub or consult the documentation.

---

*This privacy policy is designed to be transparent and user-friendly. WakeIQX is built with privacy-by-design principles.*
