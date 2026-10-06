"use client";

import { useEffect, useState, useRef } from "react";
import { useSmoothScroll } from "../ui/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import gsap from "gsap";

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const lenis = useSmoothScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  const counterRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const getStorage = () => {
    try { return sessionStorage.getItem("hasSeenLoader"); } catch { return null; }
  };
  const setStorage = () => {
    try { sessionStorage.setItem("hasSeenLoader", "true"); } catch {}
  };


  useEffect(() => {
    setHasMounted(true);

    if (getStorage() === "true") {
      setIsVisible(false);
      return;
    }

    if (prefersReducedMotion) {
      setStorage();
      setIsVisible(false);
      return;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isVisible || !hasMounted) {
      lenis?.start();
      return;
    }

    // Stop scrolling when loader is visible
    lenis?.stop();

    return () => {
      lenis?.start();
    };
  }, [isVisible, hasMounted, lenis]);

  useEffect(() => {
    if (!isVisible || !hasMounted || prefersReducedMotion) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setStorage();
        setIsVisible(false);
      }
    });

    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = Math.round(counter.val).toString();
        }
      }
    });

    tl.to(loaderRef.current, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1,
      ease: "power4.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [isVisible, hasMounted, prefersReducedMotion]);

  const handleSkip = () => {
    gsap.killTweensOf(loaderRef.current);
    setStorage();
    setIsVisible(false);
  };

  if (!hasMounted || !isVisible) {
    return null;
  }

  return (
    <div
      ref={loaderRef}
      id="loader-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090C] text-[#F2EFE8]"
    >
      <div className="font-mono text-4xl mb-8">
        <span ref={counterRef}>0</span>%
      </div>
      <button
        onClick={handleSkip}
        className="absolute bottom-10 px-4 py-2 text-sm uppercase tracking-widest text-[#F2EFE8] border border-[#F2EFE8]/30 rounded hover:bg-[#F2EFE8]/10 transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
