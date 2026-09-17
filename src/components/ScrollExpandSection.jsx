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
        title="BUILT TO SHINE"
        scrollHint="Scroll down to unfold the story ↓"
        useWindowScroll={true}
        objectFit="contain"
        ambientBackdrop={true}
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

        <div className="max-w-xl mx-auto px-6 py-8 rounded-2xl bg-black/75 border border-[#ff5a1f]/40 backdrop-blur-md shadow-[0_0_50px_rgba(255,90,31,0.3)]">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#ff5a1f] font-semibold block mb-2">
            Chapter II &bull; Pure Radiance
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-[#efeee9] tracking-tight mb-3">
            Every Smile, Everywhere
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#efeee9]/80 leading-relaxed font-light">
            The frame opens up as you scroll, handing the entire spotlight to your unforgettable grace, boundless joy, and magnetic charm.
          </p>
        </div>
      </ScrollExpand>
    </section>
  );
}
