import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WakeIQX",
  description: "Temporal Intelligence for AI Agents - 3-Layer Brain Architecture (Past/Present/Future)",

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    // Premium typography: Outfit + JetBrains Mono
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],

  // Ignore dead links during build (pages to be created later)
  ignoreDeadLinks: true,

  // Markdown configuration with Shiki syntax highlighting
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro'
    },
    lineNumbers: true
  },

  themeConfig: {
    // Logo and site title - Wake Cormorant mascot!
    logo: '/logo.png',
    siteTitle: 'WakeIQX',

    // Enable local search functionality
    search: {
      provider: 'local',
      options: {
        placeholder: 'Search docs...'
      }
    },

    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Architecture', link: '/development/architecture' },
      { text: 'API Reference', link: '/api/overview' },
      { text: 'Tools', link: '/tools/overview' },
      { text: '🔬 Research', link: 'https://semanticintent.dev/papers/semantic-intent-ssot' },
      { text: 'About', link: '/about-mascot' }
    ],

    // Sidebar navigation
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is WakeIQX?', link: '/index' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Meet the Mascot', link: '/about-mascot' }
        ]
      },
      {
        text: '3-Layer Brain Architecture',
        items: [
          { text: 'Overview', link: '/development/architecture' },
          { text: 'Layer 1: Causality Engine', link: '/development/layer-1-causality' },
          { text: 'Layer 2: Memory Manager', link: '/development/layer-2-memory' },
          { text: 'Layer 3: Propagation Engine', link: '/development/layer-3-propagation' }
        ]
      },
      {
        text: 'MCP Tools',
        items: [
          { text: 'Tools Overview', link: '/tools/overview' },
          { text: 'save_context', link: '/tools/save-context' },
          { text: 'load_context', link: '/tools/load-context' },
          { text: 'search_context', link: '/tools/search-context' },
          { text: 'reconstruct_reasoning', link: '/tools/reconstruct-reasoning' },
          { text: 'build_causal_chain', link: '/tools/build-causal-chain' },
          { text: 'get_memory_stats', link: '/tools/get-memory-stats' },
          { text: 'update_predictions', link: '/tools/update-predictions' },
          { text: 'get_high_value_contexts', link: '/tools/get-high-value-contexts' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'API Overview', link: '/api/overview' },
          { text: 'ContextSnapshot', link: '/api/context-snapshot' },
          { text: 'CausalityService', link: '/api/causality-service' },
          { text: 'MemoryManagerService', link: '/api/memory-manager-service' },
          { text: 'PropagationService', link: '/api/propagation-service' }
        ]
      },
      {
        text: 'Development',
        items: [
          { text: 'Hexagonal Architecture', link: '/development/hexagonal-architecture' },
          { text: 'Semantic Intent Pattern', link: '/development/semantic-intent' },
          { text: 'Database Schema', link: '/development/database-schema' },
          { text: 'Technology Stack', link: '/development/tech-stack' }
        ]
      },
      {
        text: 'Legal',
        items: [
          { text: 'Privacy Policy', link: '/privacy-policy' },
          { text: 'Terms of Service', link: '/terms-of-service' },
          { text: 'Cookie Policy', link: '/cookie-policy' },
          { text: 'Disclaimer', link: '/disclaimer' }
        ]
      }
    ],

    // Footer
    footer: {
      message: 'Past → Present → Future | Temporal Intelligence for AI Agents',
      copyright: 'Built on research from <a href="https://semanticintent.dev/papers/semantic-intent-ssot" target="_blank">semanticintent.dev</a> | Part of the Cormorant Trinity | MIT License | <a href="/privacy-policy">Privacy</a> • <a href="/terms-of-service">Terms</a> • <a href="/cookie-policy">Cookies</a> • <a href="/disclaimer">Disclaimer</a>'
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/semanticintent/semantic-wake-intelligence-mcp' }
    ]
  }
})
