"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { siteContent } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Split words conceptually for the headline
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word-wrapper");
        tl.fromTo(
          words,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
          }
        );
      }

      tl.fromTo(
        [subtextRef.current, buttonsRef.current],
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=0.6"
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const words = siteContent.hero.headline.split(" "); // "INNOVATE. AUTOMATE. PREDICT."

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090C] pt-20"
    >
      {/* 3D Scene / Fallback */}
      <div className="absolute inset-0 z-0">
        {!prefersReducedMotion && (
          <div className="hidden md:block absolute inset-0">
            <HeroScene />
          </div>
        )}

        {/* Mobile / Fallback SVG globe */}

        <div className="md:hidden absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <svg
            className="w-full h-full max-w-lg"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="90" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 4">
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
            </circle>
            <ellipse cx="100" cy="100" rx="90" ry="30" stroke="#22D3EE" strokeWidth="0.5" />
            <ellipse cx="100" cy="100" rx="30" ry="90" stroke="#22D3EE" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="90" fill="url(#grad)" />

            {/* Animated Packets */}
            <rect x="-4" y="-2" width="8" height="4" rx="2" fill="#22D3EE">
              <animateMotion dur="4s" repeatCount="indefinite" path="M 100,10 A 90,90 0 0,1 190,100" />
            </rect>
            <rect x="-4" y="-2" width="8" height="4" rx="2" fill="#22D3EE">
              <animateMotion dur="5s" repeatCount="indefinite" path="M 190,100 A 90,90 0 0,1 100,190" />
            </rect>
            <rect x="-4" y="-2" width="8" height="4" rx="2" fill="#22D3EE">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 10,100 A 90,90 0 0,1 100,10" />
            </rect>

            <defs>
              <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#07090C" stopOpacity="0.8" />
              </radialGradient>
            </defs>
          </svg>
        </div>

      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center text-[#F2EFE8]">
        <h1
          ref={headlineRef}
          className="font-sans text-[12vw] font-extrabold leading-none tracking-tight sm:text-[10vw] md:text-[8vw] lg:text-[7vw]"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block overflow-hidden pb-2 mr-4 last:mr-0"
            >
              <span className="word-wrapper inline-block">{word}</span>
            </span>
          ))}
        </h1>

        <p
          ref={subtextRef}
          className="mx-auto mt-6 max-w-2xl text-lg text-[#F2EFE8]/70 sm:text-xl md:text-2xl"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {siteContent.hero.subtext}
        </p>

        <div
          ref={buttonsRef}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <a
            href="#contact"
            className="magnetic-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#F5A524] px-8 py-4 font-semibold text-[#07090C] transition-transform hover:scale-105"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              gsap.to(e.currentTarget, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.3 });
            }}
          >
            <span className="relative z-10">{siteContent.hero.ctaPrimary}</span>
            <div className="absolute inset-0 z-0 h-full w-full scale-0 rounded-full bg-white transition-transform duration-300 group-hover:scale-100" />
          </a>
          <a
            href="#edi-flow"
            className="inline-flex items-center justify-center rounded-full border border-[#F2EFE8]/30 px-8 py-4 font-semibold text-[#F2EFE8] transition-colors hover:bg-[#F2EFE8]/10"
          >
            {siteContent.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
