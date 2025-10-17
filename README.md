# WakeIQX Documentation

> **Production documentation site for Wake Intelligence MCP Server**
>
> Temporal Intelligence for AI Agents - 3-Layer Brain Architecture (Past/Present/Future)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run docs:dev

# Build for production
npm run docs:build

# Deploy to Cloudflare Workers
npm run deploy
```

## 📚 What's Inside

This is a **VitePress** documentation site for Wake Intelligence, deployed on **Cloudflare Workers**.

### Site Structure

```
.
├── .vitepress/          # VitePress configuration
│   └── config.mts       # Site config (nav, sidebar, theme)
├── public/              # Static assets (logo, images)
├── index.md             # Homepage
├── getting-started.md   # Installation guide
├── about-mascot.md      # Meet the Wake Cormorant
├── development/         # Architecture docs
├── tools/               # MCP tools reference
├── api/                 # API documentation
└── wrangler.jsonc       # Cloudflare Workers config
```

## 🎨 Branding

- **Name:** WakeIQX
- **Tagline:** "Temporal Intelligence for AI Agents - Past → Present → Future"
- **Domain:** wakeiqx.com
- **Colors:**
  - Deep Blue (#1E3A8A) - Past/Memory
  - Teal (#14B8A6) - Present/Activity
  - Sky Blue (#0EA5E9) - Future/Prediction
  - Slate Gray (#475569) - Structure

## 🧠 Core Concepts

Wake Intelligence implements a 3-layer temporal intelligence system:

1. **Layer 1 (Past):** Causality Engine - WHY contexts were created
2. **Layer 2 (Present):** Memory Manager - HOW relevant contexts are NOW
3. **Layer 3 (Future):** Propagation Engine - WHAT will be needed next

## 🛠️ Technology Stack

- **Framework:** VitePress 1.6.4
- **Deployment:** Cloudflare Workers
- **Fonts:** Outfit + JetBrains Mono
- **Syntax Highlighting:** Shiki (GitHub Light / One Dark Pro)
- **Search:** Built-in local search

## 📝 Writing Documentation

### Adding a New Page

1. Create a `.md` file in the appropriate directory
2. Add frontmatter if needed:
   ```markdown
   ---
   title: Page Title
   description: Page description for SEO
   ---
   ```
3. Add to sidebar in `.vitepress/config.mts`
4. Test locally with `npm run docs:dev`

### Code Blocks

Use fenced code blocks with language hints:

````markdown
```typescript
const context = await wakeIntelligence.save({
  project: "my-project",
  content: "Context to save"
});
```
````

### Callouts

VitePress supports callouts:

```markdown
::: tip
This is a helpful tip!
:::

::: warning
This is a warning!
:::

::: danger
This is dangerous!
:::
```

## 🚀 Deployment

### Deploy to Cloudflare Workers

```bash
# Build the VitePress site
npm run docs:build

# Deploy to Cloudflare
npm run deploy
```

### Custom Domain Setup

1. Add domain in Cloudflare dashboard
2. Add DNS record pointing to Workers
3. Enable SSL/TLS

## 🔗 Related Links

- **Main Repository:** [semantic-wake-intelligence-mcp](https://github.com/semanticintent/semantic-wake-intelligence-mcp)
- **Live Docs:** [wakeiqx.com](https://wakeiqx.com)
- **MCP Server:** [semantic-wake-intelligence-mcp.michshat.workers.dev](https://semantic-wake-intelligence-mcp.michshat.workers.dev)

## 📄 License

MIT License - Part of the Cormorant Trinity

---

**The wake persists.** 🐦
