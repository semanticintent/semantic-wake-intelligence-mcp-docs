# Cookie Policy

**Last Updated**: October 17, 2025

**Effective Date**: October 17, 2025

## Overview

This Cookie Policy explains how WakeIQX uses cookies and similar tracking technologies.

## Short Answer: We Don't Use Cookies

**WakeIQX does NOT use cookies** for the following reasons:

- ✅ We're an MCP server, not a website
- ✅ No user authentication (no session cookies)
- ✅ No analytics tracking
- ✅ No advertising
- ✅ No third-party tracking
- ✅ Stateless API design

## What About the Documentation Site?

The WakeIQX documentation site (built with VitePress) may use:

### Essential Cookies (If Any)

- **Theme preference**: Remember dark/light mode (localStorage, not cookies)
- **Search state**: Temporary search UI state (session storage, not cookies)

These are **local storage only** and never sent to servers.

### No Tracking Cookies

We do NOT use:
- ❌ Google Analytics
- ❌ Facebook Pixel
- ❌ Advertising cookies
- ❌ Social media tracking
- ❌ Third-party analytics

## MCP Server (No Cookies)

The WakeIQX MCP server is **completely stateless**:

### No Session Management

- No login/logout (no session cookies)
- No user tracking
- No persistent sessions
- Each request is independent

### HTTP Headers Only

All communication via:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (if you add auth)
- Standard HTTP headers

**No cookies** in request or response headers.

## Browser Storage

If you use WakeIQX via web interface (future feature), we may use:

### Local Storage

```javascript
// Example: Store theme preference
localStorage.setItem('theme', 'dark');
```

**Characteristics**:
- Stored locally in your browser
- Never sent to server
- You control via browser settings
- Not "cookies" in legal sense

### Session Storage

```javascript
// Example: Temporary UI state
sessionStorage.setItem('searchQuery', 'authentication');
```

**Characteristics**:
- Cleared when browser closes
- Never sent to server
- Tab-specific

## Third-Party Services

### Cloudflare

If using Cloudflare infrastructure:

**Cloudflare may use**:
- `__cflb` - Load balancing cookie (essential)
- `__cf_bm` - Bot management (security)

**Duration**: Session or short-lived

**Purpose**: Essential service delivery

**Control**: Managed by Cloudflare, not WakeIQX

**Cloudflare Cookie Policy**: https://www.cloudflare.com/cookie-policy/

### VitePress (Documentation)

The documentation site may use:
- No cookies by default
- Possible future analytics (opt-in only)

## Your Choices

### Browser Settings

Control cookies via browser:
- Chrome: Settings → Privacy → Cookies
- Firefox: Settings → Privacy → Cookies
- Safari: Preferences → Privacy → Cookies
- Edge: Settings → Privacy → Cookies

### Opt-Out

Since we don't use cookies, there's nothing to opt out of!

If we add analytics in the future:
- Opt-in model (not opt-out)
- Clear notice before enabling
- Documented in this policy

## Do Not Track (DNT)

We respect Do Not Track browser signals:
- We don't track anyway
- No behavioral profiling
- No cross-site tracking

## GDPR Compliance (EU Users)

### Legal Basis

We don't use cookies, so no legal basis needed.

If we add cookies in the future:
- **Consent**: Opt-in for non-essential
- **Legitimate interest**: Essential only
- **Transparency**: Clear documentation

### Your Rights

- Right to access cookie data (none stored)
- Right to delete cookies (use browser settings)
- Right to object (not applicable)

## CCPA Compliance (California Users)

### Do Not Sell

We do NOT:
- ❌ Sell personal information
- ❌ Share data with third parties for advertising
- ❌ Track for behavioral profiling

## Children's Privacy

WakeIQX does not:
- Target children under 13
- Use cookies to track children
- Collect personal data from children

## Changes to This Policy

We will update this policy if we:
- Add cookies in the future
- Change third-party services
- Introduce tracking (with your consent)

**Notification**:
- Documentation update
- GitHub release notes
- Prominent notice on site

## Self-Hosting

If you self-host WakeIQX:

- **You control cookies**: Add/remove as needed
- **Your policy applies**: Not this one
- **Recommended**: Document your cookie usage

## Contact

Questions about cookies:
- **GitHub Issues**: https://github.com/semanticintent/semantic-wake-intelligence-mcp/issues
- **Email**: privacy@semanticintent.dev
- **Documentation**: https://docs.wakeiqx.com

---

## Summary (Plain English)

**Quick Facts:**

✅ **No cookies**: WakeIQX doesn't use cookies
✅ **No tracking**: No analytics or ads
✅ **Local storage only**: Theme preference (optional)
✅ **Cloudflare only**: May use essential cookies for infrastructure
✅ **Your privacy**: We respect it

**Questions?** We don't use cookies, so you're good! 🍪❌

---

## Technical Details

### Request Example

```http
POST /mcp HTTP/1.1
Host: your-wakeiqx-instance.com
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "save_context",
    "arguments": { ... }
  }
}
```

**Notice**: No `Cookie:` header!

### Response Example

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { ... }
}
```

**Notice**: No `Set-Cookie:` header!

---

*WakeIQX is cookie-free by design. We believe in privacy-first development.*
