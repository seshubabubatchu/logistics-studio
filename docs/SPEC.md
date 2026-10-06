Build a premium, Awwwards-style marketing website for "Logistics Studio", a logistics technology engineering company (EDI, integrations, AI automation, staff augmentation, QA, data/BI) serving US freight forwarders, 3PLs, carriers and warehouses. Audience: CIOs, CTOs, VPs of Engineering and Integration heads. The site must feel premium and also prove technical competence.

REFERENCE
docs/reference/overview.mp4 and the frames in docs/reference/frames/ show the intended visual direction. Text inside the video is garbled by the video model; ignore it and use the copy in this spec.

VISUAL DIRECTION
- Dark near-black background (#07090C), off-white text (#F2EFE8), electric cyan accent (#22D3EE), amber accent (#F5A524), error red (#EF4444), success green (#22C55E), AI purple (#A855F7).
- Giant bold sans-serif headlines (e.g. Inter Tight / Space Grotesk, weight 700-800), monospace (JetBrains Mono) for code/data.
- Editorial, high contrast, generous spacing. Custom magnetic cursor on desktop.

GLOBAL BEHAVIOR
- Lenis smooth scroll integrated with GSAP ScrollTrigger.
- Fixed minimal nav: logo, Services, Resources, About, "Get in Touch" button (amber).
- Section transitions: background theme shifts are scroll-scrubbed.

SECTIONS (build in this order)

1. LOADER
 Black screen, monospace counter 0 to 100, then a vertical curtain wipe reveals the hero. Plays once per session (sessionStorage). Skippable.

2. HERO
 Headline "INNOVATE. AUTOMATE. PREDICT." at ~12-15vw, each word slides up from a mask, staggered. Subtext: "Technology solutions for transportation & logistics." CTAs: "Get Started" (amber, magnetic) and "See How We Work" (outline).
 Background: a Three.js wireframe/dotted globe with glowing cyan arcs that slowly rotates. Over it, three labeled nodes (Shipper, Carrier, Warehouse) with glowing EDI packets (small rounded rectangles labeled 850/856/214/810) traveling along curved paths between them. Packets are attracted toward the cursor within a radius. Globe rotation is tied slightly to scroll.

3. MARQUEE + EDI FLOW ("Chaos to order")
 Infinite marquee "EDI • API • AI • QA • BI" whose speed increases with scroll velocity.
 Below it a pinned scene: packets jam into queues with red error nodes, a counter shows "Partner onboarding: 6 weeks". On scroll the jam clears, red nodes turn green, packets flow smoothly, and the counter rolls like a slot machine to "6 days". (Placeholder numbers; keep them in site.ts so they can be changed.)

4. LEGACY TO CLOUD
 Pinned section, 4 scroll steps. Starts desaturated and grainy: a container yard with a crane lowering a shipping container labeled "Legacy EDI (BizTalk / Sterling)". Scrolling dissolves the container into particles (canvas) that rise and form a blue cloud while the scene saturation animates from grayscale to full color. Final line: "Modernize without disruption." Use SVG/canvas illustration, not video.

5. AI MAP GENERATOR (signature section)
 Pinned, split screen. Left: a paper-colored panel "Raw EDI specification" with monospace text. Right: dark code editor where a mapping function is typed out as the user scrolls (characters revealed by scroll progress, not time). Four steps shown on a progress rail: Upload spec, AI analyzes, Map generated, Validated. Error lines highlight red then auto-fix to green. A purple glowing "AI" badge pulses at the divider. Floating code fragments drift in the background at different parallax speeds.
 Caption: "Maps that write themselves."

6. CONTROL TOWER (proof + services)
 Grid of glass panels that boot up in a staggered sequence: two line charts whose paths draw on scroll, a large "13+ years" stat, a rolling-digit counter, and a test grid where red cells flip to green in a wave. Panels tilt toward the mouse (max 6 degrees) with inner content at a different depth.
 Include a "Trusted by" row of client logos (from public/assets/logos) with a subtle marquee.

7. SERVICES RAIL (horizontal scroll)
 Pinned horizontal scroll driven by vertical scroll on desktop. A freight train moves through five parallax layers (mountains 0.1x, hills 0.3x, trees 0.6x, track 1x, signal posts 1.5x). Each wagon is a service; its door slides open when it reaches center, revealing title and 2 lines:
 - EDI Modernization & Support
 - Middleware & Integration Development
 - AI-Driven Automation
 - Staff Augmentation (.NET, Java, Python, AI/ML)
 - Quality Engineering
 - Data & BI Dashboards
 Wheels rotate with scroll progress. On mobile, replace with a vertical stack of cards with simple fade-up.

8. FINALE + FOOTER
 Scattered document icons snap into a clean grid; globe returns. Huge text "Let's deliver." with a magnetic email link and a pulsing "Start a project" button that opens a contact form (name, work email, company, message; validate; POST to /api/contact).
 Footer: phone +1 (216) 293 7917, email info@logisticsstudio.com, 609 SW 8th Street 6th Floor, Bentonville, AR 72712, LinkedIn link, newsletter signup, "Scroll to top".

QUALITY BAR
- Lighthouse performance 85+ desktop, accessibility 95+.
- Semantic HTML, keyboard-navigable, visible focus states, alt text.
- SEO: title "Logistics Studio | Supply Chain Innovation & Solutions", meta description, Open Graph tags.
- No console errors. All animations cleaned up on unmount.

WORKFLOW
First produce a plan and wait for approval. Implement ONLY the sections requested in each task. Open a PR per task.
