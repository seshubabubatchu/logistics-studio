'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { rawEdiSpec, generatedCodeLines, progressSteps } from '@/content/ai-map-demo';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function AiMap() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const codeContainerRef = useRef<HTMLPreElement>(null);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)"
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };

    // Background parallax
    gsap.to('.floating-fragment-slow', {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
    gsap.to('.floating-fragment-med', {
      y: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
    gsap.to('.floating-fragment-fast', {
      y: -300,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    if (codeContainerRef.current) {
      // Create initial content structure (hidden) to maintain layout size or reveal character by character
      const formattedLines = generatedCodeLines.map((line, idx) => {
        // Highlight 2-3 lines by picking lines that contain 'unitPrice' or 'sku'
        const isErrorLine = line.includes('getElement(7)') || line.includes('unitPrice: parseFloat');
        return `<div class="flex leading-relaxed text-sm"><span class="w-8 shrink-0 text-gray-600 select-none text-right pr-4">${idx + 1}</span><span class="code-line-content ${isErrorLine ? 'error-line' : ''}"></span></div>`;
      }).join('');

      codeContainerRef.current.innerHTML = formattedLines;
      const lineElements = codeContainerRef.current.querySelectorAll('.code-line-content');

      // Prepare typing animation using TextPlugin or simple char reveal
      // Since TextPlugin might not be installed, we'll do a simple timeline reveal
      const tl = gsap.timeline({
        scrollTrigger: isMobile ? {
          trigger: sectionRef.current,
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        } : {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: '+=1000',
          pin: true,
          scrub: 1,
        }
      });

      // Simple character typing effect by mapping length
      lineElements.forEach((el, idx) => {
        const text = generatedCodeLines[idx];
        const chars = text.split('');
        const obj = { length: 0 };

        tl.to(obj, {
          length: chars.length,
          duration: chars.length * 0.02,
          ease: 'none',
          onUpdate: () => {
            el.textContent = text.substring(0, Math.floor(obj.length));
          }
        });
      });

      // Validation Step: Red to Green
      const errorLines = codeContainerRef.current.querySelectorAll('.error-line');
      if (errorLines.length > 0) {
        tl.to(errorLines, {
          color: '#EF4444', // Red
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          duration: 0.5,
          stagger: 0.1,
        })
        .to(errorLines, {
          color: '#4ADE80', // Green
          backgroundColor: 'transparent',
          duration: 0.5,
          stagger: 0.1,
        }, "+=0.5");
      }

      // Sync progress rail
      const totalSteps = progressRefs.current.length;
      progressRefs.current.forEach((el, idx) => {
        if (!el) return;
        const stepProgress = idx / (totalSteps - 1);

        tl.to(el.querySelector('.indicator'), {
          backgroundColor: '#A855F7', // purple
          borderColor: '#D8B4FE', // lighter purple
          duration: 0.2,
        }, stepProgress * tl.duration());

        tl.to(el.querySelector('span'), {
          color: '#FFFFFF',
          duration: 0.2,
        }, `<`);
      });
    }
    }); // End matchMedia
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="ai-map"
      ref={sectionRef}
      className="relative min-h-screen bg-background text-foreground overflow-hidden flex flex-col items-center justify-center py-24"
    >
      <div className="absolute top-12 text-center w-full z-10 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">
          Maps that write themselves.
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          AI Map Generator creates perfect data models instantly.
        </p>
      </div>

      {/* Background Floating Fragments */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="floating-fragment-slow absolute top-[20%] left-[10%] text-xs font-mono text-gray-400">{'<BEG>00*SA</BEG>'}</div>
        <div className="floating-fragment-med absolute top-[60%] right-[15%] text-xs font-mono text-gray-400">{'parser.getSegment("N1")'}</div>
        <div className="floating-fragment-fast absolute top-[80%] left-[25%] text-xs font-mono text-gray-400">{'{"status": "valid"}'}</div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-16 md:mt-32 relative z-10 flex flex-col h-full justify-center">
        {/* Progress Rail */}
        <div className="w-full flex justify-between items-center mb-8 relative px-4 md:px-12 max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10 -translate-y-1/2"></div>
          {progressSteps.map((step, idx) => (
            <div
              key={idx}
              ref={el => { progressRefs.current[idx] = el; }}
              className="flex flex-col items-center gap-2 bg-background px-2 progress-step"
            >
              <div className="w-4 h-4 rounded-full bg-background border-2 border-white/20 z-10 indicator transition-colors duration-300"></div>
              <span className="text-xs md:text-sm font-medium text-white/50 transition-colors duration-300 whitespace-nowrap">{step}</span>
            </div>
          ))}
        </div>

        {/* Split Screen / Stacked Layout */}
        <div className="flex flex-col md:flex-row w-full h-[600px] rounded-xl border border-white/10 overflow-hidden shadow-2xl relative bg-[#1E1E1E]">

          {/* Divider with AI Badge (Desktop only visual center) */}
          <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-20 items-center justify-center -translate-x-1/2">
            <div
              className="bg-gray-800 text-purple font-bold font-mono text-xs px-3 py-1 rounded-full border border-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-30 animate-pulse"
            >
              AI
            </div>
          </div>

          {/* Left: Raw EDI Specification (Paper-colored) */}
          <div className="w-full md:w-1/2 bg-[#F4F1EA] text-background p-6 overflow-y-auto font-mono text-xs md:text-sm leading-relaxed border-b md:border-b-0 md:border-r border-white/10">
            <div className="mb-4 text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-background/10 pb-2">
              Raw EDI Specification
            </div>
            <pre className="whitespace-pre-wrap break-all">{rawEdiSpec}</pre>
          </div>

          {/* Right: Dark Code Editor */}
          <div
            className="w-full md:w-1/2 bg-[#1E1E1E] text-gray-300 p-6 overflow-y-auto font-mono text-xs md:text-sm leading-relaxed"
            aria-label="Generated AI Code Editor"
          >
            <div className="mb-4 text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2 flex justify-between">
              <span>mapping.ts</span>
              <span className="text-gray-400 font-normal">Typescript</span>
            </div>
            <div className="code-container h-full">
              {prefersReducedMotion ? (
                // Reduced motion: show full code with validation
                <pre>
                  {generatedCodeLines.map((line, i) => {
                    const isErrorLine = line.includes('getElement(7)') || line.includes('unitPrice: parseFloat');
                    return (
                      <div key={i} className="flex">
                        <span className="w-8 shrink-0 text-gray-600 select-none text-right pr-4">{i + 1}</span>
                        <span className={isErrorLine ? 'text-[#4ADE80]' : ''}>{line}</span>
                      </div>
                    );
                  })}
                </pre>
              ) : (
                // Animated container will be populated via GSAP
                <pre ref={codeContainerRef} className="animated-code h-full" aria-hidden="true"></pre>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
