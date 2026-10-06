"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useSmoothScroll } from "@/components/ui/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export default function EdiFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const lenis = useSmoothScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  const directionRef = useRef(1);
  const xPercentRef = useRef(0);

  // Marquee Animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    let requestAnimationFrameId: number;

    const animateMarquee = () => {
      if (!marqueeInnerRef.current) return;

      let velocity = 0;
      if (lenis) {
        velocity = lenis.velocity;
      }

      if (velocity > 0) {
        directionRef.current = -1;
      } else if (velocity < 0) {
        directionRef.current = 1;
      }

      const speed = 0.05 + Math.abs(velocity) * 0.01;
      xPercentRef.current += speed * directionRef.current;

      if (xPercentRef.current <= -50) {
        xPercentRef.current = 0;
      } else if (xPercentRef.current > 0) {
        xPercentRef.current = -50;
      }

      gsap.set(marqueeInnerRef.current, { xPercent: xPercentRef.current });
      requestAnimationFrameId = requestAnimationFrame(animateMarquee);
    };

    requestAnimationFrameId = requestAnimationFrame(animateMarquee);

    return () => cancelAnimationFrame(requestAnimationFrameId);
  }, [lenis, prefersReducedMotion]);

  // ScrollTrigger Animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1,
        },
      });

      tl.to(".jam-line", { opacity: 0, duration: 0.1 }, 0)
        .to(".mid-node", { fill: "#22c55e", duration: 0.2 }, 0)
        .to(".flow-line", { opacity: 1, duration: 0.1 }, 0)
        .to(".flow-line", { strokeDashoffset: -1000, duration: 1, ease: "none" }, 0)
        .to(".slot-text", { yPercent: -50, duration: 0.5, ease: "power2.inOut" }, 0.2);

      return () => tl.kill();
    });

    mm.add("(max-width: 767px)", () => {
      gsap.to(".mobile-card-1", {
        scrollTrigger: {
          trigger: ".mobile-card-1",
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
      });

      gsap.to(".mobile-card-2", {
        scrollTrigger: {
          trigger: ".mobile-card-2",
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.2,
      });
    });

    return () => mm.revert();
  }, [prefersReducedMotion]);

  const marqueeTexts = Array(12).fill(siteContent.marquee.text);

  return (
    <section id="edi-flow" ref={sectionRef} className="min-h-screen flex flex-col justify-center border-b border-white/10 overflow-hidden relative">

      {/* Marquee Background */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-40 z-0">
        <div className="overflow-hidden flex w-full h-[200px] items-center">
          <div
            ref={marqueeInnerRef}
            className="flex w-max items-center"
            style={{ transform: prefersReducedMotion ? "translateX(-25%)" : "translateX(0%)" }}
          >
            {marqueeTexts.map((text, i) => (
              <span key={i} className="px-8 whitespace-nowrap text-[10rem] font-bold tracking-tight text-white/5 uppercase select-none font-sans leading-none">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 pt-20">

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-sans tracking-tight">Partner Onboarding</h2>
            <div className="flex justify-center text-4xl md:text-6xl font-mono font-medium text-amber-500">
              <div className="h-[1.2em] overflow-hidden relative w-[8ch]">
                <div
                  className="slot-text absolute top-0 left-0 flex flex-col w-full"
                  style={{
                    transform: prefersReducedMotion ? "translateY(-50%)" : "translateY(0%)"
                  }}
                >
                  <span className="h-[1.2em] flex items-center justify-center">{siteContent.ediFlow.partnerOnboardingStart}</span>
                  <span className="h-[1.2em] flex items-center justify-center text-green-500">{siteContent.ediFlow.partnerOnboardingEnd}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full relative h-[450px]">
            <svg viewBox="0 0 1000 450" className="w-full h-full overflow-visible">
              <defs>
                <mask id="jam-mask">
                  <rect x="0" y="0" width="480" height="450" fill="white" />
                </mask>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="12" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base Path */}
              <path
                d="M 100 225 C 300 225 400 125 500 225 C 600 325 700 225 900 225"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="4"
                fill="none"
              />

              {/* Flow Line (Success) */}
              <path
                className="flow-line"
                d="M 100 225 C 300 225 400 125 500 225 C 600 325 700 225 900 225"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray="20 40"
                fill="none"
                style={{
                  opacity: prefersReducedMotion ? 1 : 0
                }}
              />

              {/* Jam Line (Error) */}
              <path
                className="jam-line"
                d="M 100 225 C 300 225 400 125 500 225 C 600 325 700 225 900 225"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray="15 8"
                fill="none"
                mask="url(#jam-mask)"
                style={{
                  opacity: prefersReducedMotion ? 0 : 1
                }}
              />

              {/* Nodes */}
              <g transform="translate(100, 225)">
                <circle cx="0" cy="0" r="16" fill="#f59e0b" />
                <text x="0" y="40" fill="white" textAnchor="middle" className="text-sm font-mono opacity-60">Shipper</text>
              </g>

              <g transform="translate(500, 225)">
                <circle
                  className="mid-node"
                  cx="0"
                  cy="0"
                  r="32"
                  fill={prefersReducedMotion ? "#22c55e" : "#ef4444"}
                  filter="url(#glow)"
                />
                <text x="0" y="55" fill="white" textAnchor="middle" className="text-sm font-mono font-bold tracking-widest">EDI</text>
              </g>

              <g transform="translate(900, 225)">
                <circle cx="0" cy="0" r="16" fill="#3b82f6" />
                <text x="0" y="40" fill="white" textAnchor="middle" className="text-sm font-mono opacity-60">Carrier</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold font-sans tracking-tight mb-2">Partner Onboarding</h2>
            <p className="text-white/60 text-sm">Transform your supply chain integration speed.</p>
          </div>

          <div
            className="mobile-card-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
            style={{
              opacity: prefersReducedMotion ? 1 : 0,
              transform: prefersReducedMotion ? "translateY(0)" : "translateY(2rem)"
            }}
          >
            <div className="text-red-500 font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Legacy EDI
            </div>
            <div className="text-5xl font-mono text-white mb-2">{siteContent.ediFlow.partnerOnboardingStart}</div>
            <p className="text-white/60 text-sm">Manual mapping, brittle connections, constant back-and-forth.</p>
          </div>

          <div className="flex justify-center">
            <div className="w-1 h-12 bg-gradient-to-b from-red-500/20 to-green-500/20 rounded-full"></div>
          </div>

          <div
            className="mobile-card-2 bg-green-500/10 border border-green-500/20 rounded-2xl p-6"
            style={{
              opacity: prefersReducedMotion ? 1 : 0,
              transform: prefersReducedMotion ? "translateY(0)" : "translateY(2rem)"
            }}
          >
            <div className="text-green-500 font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Logistics Studio
            </div>
            <div className="text-5xl font-mono text-white mb-2">{siteContent.ediFlow.partnerOnboardingEnd}</div>
            <p className="text-white/60 text-sm">Automated AI mapping, instant validation, seamless flow.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
