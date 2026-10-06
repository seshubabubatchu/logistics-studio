# Project rules
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS. Animation: GSAP + ScrollTrigger, Lenis smooth scroll, Three.js for the globe. No other animation libraries.
- Only animate `transform` and `opacity` (plus clip-path/filter where specified). Target 60fps.
- Every animation must respect `prefers-reduced-motion` (show final state, no motion).
- Create GSAP animations inside `useGSAP`/`gsap.context` and clean up on unmount.
- Mobile: below 768px use simplified versions (no pinned horizontal scroll, no 3D, fewer particles).
- Keep sections as separate components in `src/components/sections/`. Copy lives only in `src/content/site.ts`.
- Lazy-load Three.js (dynamic import, ssr: false). Initial JS under 250 KB gzipped excluding the lazy chunk.
- Run `npm run lint` and `npm run build` before finishing every task.
- Reference images are in `docs/reference/frames/`. They show the intended look; the written spec in `docs/SPEC.md` is the source of truth for text and behavior.
