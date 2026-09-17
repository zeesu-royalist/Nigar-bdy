/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const navItems = ["Memories", "Reels", "Wishes"];
const socialItems = ["Instagram", "TikTok", "YouTube"];

export default function Hero() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <section
      id="birthday-hero"
      className="relative h-[100dvh] w-full overflow-hidden bg-black text-[#ff5a1f] font-hn select-none"
    >
      {/* Component Fill: Solid pure black */}
      <div className="absolute inset-0 bg-black -z-10" />

      {/* Layer 2 (z-10): Marquee name in classic editorial cream */}
      <div
        className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden anim-fade-up pointer-events-none"
        style={{ animationDelay: "500ms" }}
      >
        <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-[#efeee9] tracking-tight font-medium">
          <span className="pr-[6vw] shrink-0">Nigar &mdash; Birthday Queen&nbsp;</span>
          <span className="pr-[6vw] shrink-0">Nigar &mdash; Birthday Queen&nbsp;</span>
        </div>
      </div>

      {/* Layer 3 (z-10): Horizontal orange rule */}
      <div
        className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-[#ff5a1f] anim-line shadow-[0_0_12px_rgba(255,90,31,0.3)]"
        style={{ animationDelay: "1200ms" }}
      />

      {/* Layer 4 (sm:z-10 / mobile z-30): Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-[#ff5a1f]">
        <div
          className="anim-fade-up flex flex-col"
          style={{ animationDelay: "1400ms" }}
        >
          <span>Birthday Queen</span>
          <span>Pure Radiance</span>
          <span>Forever Loved</span>
        </div>
        {/* Center scroll indicator to 3D Showcase (now above) */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("voices-showcase");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="anim-fade-up flex flex-col items-center gap-1 text-[11px] sm:text-xs tracking-widest uppercase text-[#ff5a1f] hover:text-white transition-all focus:outline-none cursor-pointer z-40 bg-black/60 px-3.5 py-1.5 rounded-full border border-[#ff5a1f]/40 hover:border-[#ff5a1f] shadow-[0_0_15px_rgba(255,90,31,0.25)]"
          style={{ animationDelay: "1500ms" }}
          aria-label="Scroll up to 3D Voices showcase"
        >
          <span className="animate-bounce text-xs leading-none">↑</span>
          <span>Back to 3D Showcase</span>
        </button>

        <div
          className="anim-fade-up flex flex-col text-right"
          style={{ animationDelay: "1550ms" }}
        >
          <span>Celebrating</span>
          <span>Nigar&apos;s Special Day</span>
        </div>
      </footer>

      {/* Layer 5 (z-20): Front portrait (cutout overlay, above marquee, pointer-events none) */}
      <img
        src="/images/ChatGPT Image Sep 17, 2026 at 11_50_32 PM.png"
        alt="Portrait"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-20 anim-rise-in"
        style={{ animationDelay: "300ms" }}
      />

      {/* Birthday Greeting Section (center se thoda niche) */}
      <div
        className="absolute inset-x-0 top-[52%] sm:top-[54%] z-[25] flex flex-col items-center justify-center text-center px-4 sm:px-6 anim-fade-up pointer-events-auto select-text"
        style={{ animationDelay: "1000ms" }}
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-hn font-black tracking-tight uppercase text-[#ff5a1f] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight">
          HAPPY BIRTHDAY NIGAR
        </h1>
        <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm md:text-base text-[#ff5a1f]/90 max-w-sm sm:max-w-xl md:max-w-2xl font-light tracking-wide leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
          Wishing you an extraordinary year filled with boundless happiness, unforgettable adventures, and dreams that turn into reality. May every moment bring magic, joy, and endless reasons to smile!
        </p>
      </div>

      {/* Layer 6 (z-30): Header chrome */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Left: brand Nigar */}
        <a
          href="#"
          className="font-hn text-lg tracking-wide anim-fade-up text-[#ff5a1f] hover:opacity-80 transition-opacity duration-300 font-medium"
          style={{ animationDelay: "800ms" }}
        >
          Nigar ✦
        </a>

        {/* Right cluster (desktop sm: and up) */}
        <div className="hidden sm:flex items-center gap-12 lg:gap-16">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("voices-showcase");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="anim-fade-up px-3.5 py-1 rounded-full border border-[#ff5a1f]/50 text-xs text-[#ff5a1f] hover:bg-[#ff5a1f] hover:text-black transition-all duration-300 tracking-wider uppercase font-medium cursor-pointer shadow-[0_0_12px_rgba(255,90,31,0.2)]"
            style={{ animationDelay: "850ms" }}
          >
            ↑ 3D Showcase
          </button>

          <span
            className="text-sm anim-fade-up text-[#ff5a1f]"
            style={{ animationDelay: "900ms" }}
          >
            2025
          </span>

          {/* Nav: vertical stack */}
          <nav className="flex flex-col gap-0.5 text-sm">
            {navItems.map((item, idx) => (
              <a
                key={item}
                href="#"
                className="anim-fade-up text-[#ff5a1f] hover:opacity-60 transition-opacity duration-300"
                style={{ animationDelay: `${1000 + idx * 80}ms` }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Social: vertical stack */}
          <div className="flex flex-col gap-0.5 text-sm">
            {socialItems.map((item, idx) => (
              <a
                key={item}
                href="#"
                className="anim-fade-up text-[#ff5a1f] hover:opacity-60 transition-opacity duration-300"
                style={{ animationDelay: `${1150 + idx * 80}ms` }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile hamburger button (sm:hidden, z-50 always on top) */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
          className="sm:hidden h-10 w-10 flex flex-col justify-center items-center z-50 anim-fade-up focus:outline-none"
          style={{ animationDelay: "900ms" }}
        >
          <div className="h-4 w-6 relative flex flex-col justify-between items-center pointer-events-none">
            <span
              className={`h-[1.5px] w-6 bg-[#ff5a1f] rounded-full transition-transform origin-center ${isDrawerOpen ? "translate-y-[7px] rotate-45" : "translate-y-0 rotate-0"
                }`}
              style={{
                transitionDuration: "500ms",
                transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
              }}
            />
            <span
              className={`h-[1.5px] w-6 bg-[#ff5a1f] rounded-full transition-opacity ${isDrawerOpen ? "opacity-0" : "opacity-100"
                }`}
              style={{ transitionDuration: "300ms" }}
            />
            <span
              className={`h-[1.5px] w-6 bg-[#ff5a1f] rounded-full transition-transform origin-center ${isDrawerOpen ? "-translate-y-[7.5px] -rotate-45" : "translate-y-0 rotate-0"
                }`}
              style={{
                transitionDuration: "500ms",
                transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
              }}
            />
          </div>
        </button>
      </header>

      {/* Layer 7 (z-40): Mobile drawer backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`sm:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* Layer 8 (z-40): Mobile drawer panel */}
      <div
        className={`sm:hidden fixed top-0 right-0 bottom-0 h-full w-[80%] max-w-sm bg-[#0a0a0a] border-l border-[#ff5a1f]/20 px-8 py-10 z-40 flex flex-col justify-between shadow-2xl transition-transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{
          transitionDuration: "600ms",
          transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      >
        {/* Close button inside drawer: Lucide X */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close menu"
          className={`absolute right-6 top-6 text-[#ff5a1f] focus:outline-none transition-all duration-300 ${isDrawerOpen
              ? "rotate-0 opacity-100"
              : "rotate-90 opacity-0 pointer-events-none"
            }`}
          style={{ transitionDelay: isDrawerOpen ? "300ms" : "0ms" }}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* Site Index Section */}
        <div className="pt-12">
          <p
            className="text-xs uppercase tracking-[0.2em] text-[#ff5a1f]/50 mb-6 transition-all duration-500 font-medium"
            style={{
              transitionDelay: isDrawerOpen ? "250ms" : "0ms",
              opacity: isDrawerOpen ? 1 : 0,
              transform: isDrawerOpen ? "translateY(0)" : "translateY(16px)",
            }}
          >
            Site Index
          </p>
          <nav className="flex flex-col gap-4">
            <a
              href="#voices-showcase"
              onClick={(e) => {
                e.preventDefault();
                setIsDrawerOpen(false);
                setTimeout(() => {
                  document.getElementById("voices-showcase")?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              className="text-3xl sm:text-4xl font-hn text-[#f59e0b] tracking-tight hover:opacity-60 transition-all duration-500 font-medium"
              style={{
                transitionDelay: isDrawerOpen ? "280ms" : "0ms",
                opacity: isDrawerOpen ? 1 : 0,
                transform: isDrawerOpen ? "translateY(0)" : "translateY(24px)",
              }}
            >
              3D Showcase ✦
            </a>
            {navItems.map((item, idx) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsDrawerOpen(false)}
                className="text-4xl font-hn text-[#ff5a1f] tracking-tight hover:opacity-60 transition-all duration-500 font-medium"
                style={{
                  transitionDelay: isDrawerOpen ? `${300 + idx * 80}ms` : "0ms",
                  opacity: isDrawerOpen ? 1 : 0,
                  transform: isDrawerOpen ? "translateY(0)" : "translateY(24px)",
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Find Me Section */}
        <div className="pb-4">
          <p
            className="text-xs uppercase tracking-[0.2em] text-[#ff5a1f]/50 mb-3 transition-all duration-500 font-medium"
            style={{
              transitionDelay: isDrawerOpen ? "500ms" : "0ms",
              opacity: isDrawerOpen ? 1 : 0,
              transform: isDrawerOpen ? "translateY(0)" : "translateY(16px)",
            }}
          >
            Find Me
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-hn">
            {socialItems.map((item, idx) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#ff5a1f] hover:opacity-60 transition-all duration-400"
                style={{
                  transitionDelay: isDrawerOpen ? `${550 + idx * 60}ms` : "0ms",
                  opacity: isDrawerOpen ? 1 : 0,
                  transform: isDrawerOpen ? "translateY(0)" : "translateY(16px)",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
