// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Security headers (production build only – nitro applies routeRules at deploy time).
// The page scripts/styles are injected inline by the app shell, hence 'unsafe-inline'.
// Everything else is locked to same-origin plus the few third parties the site uses.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://plausible.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https://images.unsplash.com https://www.google-analytics.com https://*.googletagmanager.com",
  "media-src 'self'",
  "connect-src 'self' https://micwhngfzcmkwbmhzixn.supabase.co wss://micwhngfzcmkwbmhzixn.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://plausible.io",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy": csp,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

const longCache = { "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400" };
const shortCache = { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" };

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Use Vercel Edge preset so nitro outputs the correct format for Vercel deployment
  // routeRules is a valid nitro option; the wrapper's type just does not declare it, hence the cast.
  nitro: {
    preset: "vercel",
    routeRules: {
      "/**": { headers: securityHeaders },
      "/media/**": { headers: longCache },
      "/images/**": { headers: longCache },
      "/industries/assets/**": { headers: longCache },
      "/careers/assets/**": { headers: longCache },
      "/shell/**": { headers: shortCache },
      "/industries/*.css": { headers: shortCache },
      "/industries/*.js": { headers: shortCache },
      "/api/**": { headers: { "Cache-Control": "no-store" } },
    },
  } as { preset?: string },
});
