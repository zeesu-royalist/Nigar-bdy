"use client";

import React from "react";
import ScrollExpand from "./ScrollExpand";

export default function ScrollExpandSection() {
  return (
    <section
      id="scroll-expand-section"
      className="relative w-full bg-black text-[#ff5a1f] font-hn select-none overflow-visible"
    >

      <ScrollExpand
        src="/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.38 PM-3.jpeg"
        alt="Nigar - Birthday Tribute"
        title="HAPPY BIRTHDAY NIGAR"
        scrollHint="Scroll down to unfold Nigar's story ↓"
        useWindowScroll={true}
        objectFit="contain"
        ambientBackdrop={true}
        ambientBlur="blur-sm"
        ambientOpacity="opacity-55"
        startWidth={50}
        startHeight={68}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.05}
        scrollDistance={1.1}
        holdDistance={0.3}
        smoothing={0.1}
        overlayScrim={0.5}
        enabled={true}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 text-center">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#ff5a1f] font-semibold block mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            Chapter II &bull; The Birthday Queen
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-[#efeee9] tracking-tight mb-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Every Smile, Pure Radiance
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#efeee9]/90 leading-relaxed font-light max-w-lg mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            The frame expands as you scroll, dedicating the entire screen to your unforgettable grace, infectious laughter, and magnetic charm. Wishing you the happiest birthday, dearest Nigar!
          </p>
        </div>
      </ScrollExpand>
    </section>
  );
}
