# CLAUDE.md — Frontend Website Rules

## Always Do First

Invoke the frontend-design skill before writing any frontend code, every session, no exceptions.

## Reference Images

If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via https://placehold.co/, generic copy). Do not improve or add to the design.

If no reference image: design from scratch with high craft (see guardrails below).

Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server

Always serve on localhost — never screenshot a file:/// URL.

Start the dev server: `node serve.mjs` (serves the project root at http://localhost:3000)

serve.mjs lives in the project root. Start it in the background before taking any screenshots.

If the server is already running, do not start a second instance.

## Screenshot Workflow

Puppeteer is installed at C:/Users/nateh/AppData/Local/Temp/puppeteer-test/. Chrome cache is at C:/Users/nateh/.cache/puppeteer/.

Always screenshot from localhost: `node screenshot.mjs http://localhost:3000`

Screenshots are saved automatically to ./temporary_screenshots/screenshot-N.png (auto-incremented, never overwritten).

Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as screenshot-N-label.png

screenshot.mjs lives in the project root. Use it as-is.

After screenshotting, read the PNG from temporary_screenshots/ with the Read tool — Claude can see and analyze the image directly.

User-provided screenshots: when the user says "look at my screenshots" (or "my screenshot(s)"), they mean the files in /home/mic/coding/foto-website/temporary_screenshots/mine/. Read from that folder unless a different path is given.

When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"

Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults

Single index.html file, all styles inline, unless user says otherwise

Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`

Placeholder images: https://placehold.co/WIDTHxHEIGHT

Mobile-first responsive

## Brand Assets

Always check the brand_assets/ folder before designing. It may contain logos, color guides, style guides, or images.

If assets exist there, use them. Do not use placeholders where real assets are available.

If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails

Colors: Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.

Shadows: Never use flat shadow-md. Use layered, color-tinted shadows with low opacity.

Typography: Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (-0.03em) on large headings, generous line-height (1.7) on body.

Gradients: Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.

Animations: Only animate transform and opacity. Never transition-all. Use spring-style easing.

Interactive states: Every clickable element needs hover, focus-visible, and active states. No exceptions.

Images: Add a gradient overlay (bg-gradient-to-t from-black/60) and a color treatment layer with mix-blend-multiply.

Spacing: Use intentional, consistent spacing tokens — not random Tailwind steps.

Depth: Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Platform Portability

The site is deployed on Vercel but is deliberately kept close to vanilla static hosting so it can move to Netlify, Cloudflare Pages, or a plain Node.js host without a rewrite. Do not erode this.

Never install @vercel/* packages (@vercel/analytics, @vercel/og, @vercel/kv, @vercel/edge-config, @vercel/blob, etc.). Use the portable equivalents already in the stack: Plausible for analytics, Sentry for monitoring, Supabase for storage/DB/config.

Never read VERCEL_* env vars (VERCEL_URL, VERCEL_ENV, VERCEL_GIT_*) in app or build code. If deployment-context info is needed, thread it through build.mjs as a generic env var.

Keep middleware.js thin. It must only be an adapter around portable logic (see rate-limit.js for the pattern). Cross-cutting rules (auth, geo, feature flags) should live in portable modules that the middleware imports, not inline.

vercel.json rewrites: if the list grows past ~15 entries, group related rewrites together (clean URLs vs. dashboards vs. legacy redirects) and add a sibling ROUTES.md documenting each group's purpose, since JSON doesn't allow comments.

## Hard Rules

Do not add sections, features, or content not in the reference

Do not "improve" a reference design — match it

Do not stop after one screenshot pass

Do not use transition-all

Do not use default Tailwind blue/indigo as primary color
