/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";

// 12 Curated celebratory portraits honoring Nigar around her center cutout
const cardData = [
  {
    id: 1,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.08.07 PM.jpeg",
    name: "Golden Glow",
    role: "Birthday Star",
    yOffset: -50,
  },
  {
    id: 2,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.08.08 PM.jpeg",
    name: "Radiant Smile",
    role: "Pure Joy",
    yOffset: 25,
  },
  {
    id: 3,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.08.09 PM.jpeg",
    name: "Timeless Grace",
    role: "Queen of Elegance",
    yOffset: -20,
  },
  {
    id: 4,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.08.10 PM.jpeg",
    name: "Heart of Gold",
    role: "Sweetest Soul",
    yOffset: 45,
  },
  {
    id: 5,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.37 PM.jpeg",
    name: "Starlight Aura",
    role: "Forever Shining",
    yOffset: -60,
  },
  {
    id: 6,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.38 PM-2.jpeg",
    name: "Elegance in Bloom",
    role: "Graceful Charm",
    yOffset: 15,
  },
  {
    id: 7,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.38 PM-3.jpeg",
    name: "Serene Moments",
    role: "Precious Charm",
    yOffset: -35,
  },
  {
    id: 8,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.38 PM-4.jpeg",
    name: "Unstoppable Spirit",
    role: "Magic & Spark",
    yOffset: 40,
  },
  {
    id: 9,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.38 PM.jpeg",
    name: "Cherished Joy",
    role: "Endless Laughter",
    yOffset: -15,
  },
  {
    id: 10,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.39 PM.jpeg",
    name: "Queen of the Day",
    role: "Birthday Royalty",
    yOffset: 30,
  },
  {
    id: 11,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.08.08 PM.jpeg",
    name: "Forever Enchanting",
    role: "Pure Magic",
    yOffset: -45,
  },
  {
    id: 12,
    url: "/birthday girl images/WhatsApp Image 2026-09-17 at 9.08.07 PM.jpeg",
    name: "Infinite Wishes",
    role: "Always Blessed",
    yOffset: 20,
  },
];

export default function VoicesShowcase() {
  const [angle, setAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Responsive radius calculation
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Butter-smooth 60fps circular orbit loop
  useEffect(() => {
    const animate = (time) => {
      if (lastTimeRef.current != null) {
        const delta = time - lastTimeRef.current;
        if (!isPaused && !isDraggingRef.current) {
          // ~38 seconds for one full 360 degree revolution
          const speed = (2 * Math.PI) / 38000;
          setAngle((prev) => (prev + speed * delta) % (2 * Math.PI));
        }
      }
      lastTimeRef.current = time;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused]);

  // Touch / mouse drag controls
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startAngleRef.current = angle;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = currentX - dragStartXRef.current;
    // Drag sensitivity
    const sensitivity = 0.004;
    setAngle(startAngleRef.current + deltaX * sensitivity);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const isMobile = dimensions.width < 640;
  const radiusX = isMobile ? dimensions.width * 0.44 : Math.min(dimensions.width * 0.38, 540);
  const radiusZ = isMobile ? 180 : 300;

  return (
    <section
      id="voices-showcase"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full h-[100dvh] min-h-[580px] sm:min-h-[720px] bg-[#000000] overflow-hidden flex flex-col justify-between items-center select-none cursor-grab active:cursor-grabbing"
    >
      {/* Cinematic theatrical stage background lighting */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        {/* Deep ambient vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/60 to-black" />

        {/* Golden spotlight halo behind center subject */}
        <div
          className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 w-[500px] sm:w-[750px] h-[400px] sm:h-[500px] rounded-full pointer-events-none opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(235, 140, 30, 0.28) 0%, rgba(180, 80, 10, 0.12) 45%, transparent 70%)",
          }}
        />

        {/* Warm floor reflection simulating wood stage perspective */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[28vh] sm:h-[35vh] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(150, 85, 25, 0.22) 20%, rgba(80, 40, 10, 0.12) 65%, transparent 100%)",
          }}
        />

        {/* Floor stage texture line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95vw] max-w-6xl h-[1px] opacity-25"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.6) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* Top Header Section (Exact typography & Apple badge) */}
      <div className="relative z-40 pt-6 sm:pt-12 px-4 sm:px-6 flex flex-col items-center text-center max-w-4xl pointer-events-none">
        {/* Apple-style Birthday Special Badge */}
        <div className="flex items-center gap-1.5 mb-2 sm:mb-3 text-[#f59e0b] text-xs sm:text-sm font-medium tracking-wide">
          <span className="text-sm">✨</span>
          <span className="font-sans font-medium tracking-normal text-[#f59e0b]">Special Birthday Edition &bull; Celebrating Nigar</span>
        </div>

        {/* Large Elegant Editorial Headline */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-['Playfair_Display',Georgia,serif] text-[#f4f3ef] tracking-tight leading-[1.18] font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          Happy Birthday to <span className="italic font-['Playfair_Display',Georgia,serif] font-normal text-white">Nigar</span>, the brightest star in our sky.
        </h2>

        {/* Subtitle */}
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-[15px] text-[#b4afa7] max-w-xl leading-relaxed font-sans font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Today the spotlight shines entirely on you &mdash; celebrating your radiant smile, timeless elegance, and the boundless happiness you bring into every life.
        </p>
      </div>

      {/* 3D Circular Orbit Stage Area */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1100px" }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* 12 Floating Screens orbiting in circular loop */}
          {cardData.map((card, idx) => {
            const cardAngle = angle + (idx * 2 * Math.PI) / cardData.length;
            const x = Math.sin(cardAngle) * radiusX;
            const z = Math.cos(cardAngle) * radiusZ;
            const y = card.yOffset * (isMobile ? 0.65 : 1);

            // Calculate scale & opacity based on 3D depth (Z)
            const normalizedZ = (z + radiusZ) / (2 * radiusZ); // 0 (furthest) to 1 (closest)
            const scale = (isMobile ? 0.65 : 0.7) + normalizedZ * (isMobile ? 0.35 : 0.42);
            const opacity = 0.35 + normalizedZ * 0.65; // 0.35 to 1.0

            // Slight concave angle facing camera/center
            const rotateY = -Math.sin(cardAngle) * 20;

            // Z-index hierarchy:
            // Back cards (z < -20) sit behind center subject (z < 30)
            // On mobile, keep Nigar (z-[30]) unobstructed as primary hero
            const zIndex = z < -20 ? 10 : isMobile ? (z > 40 ? 25 : 18) : z > 30 ? 35 : 20;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="absolute transition-transform duration-75 ease-out pointer-events-auto cursor-pointer"
                style={{
                  transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transformOrigin: "center center",
                }}
              >
                {/* Floating Screen Card Frame */}
                <div className="relative w-32 sm:w-52 md:w-60 aspect-[16/10] rounded-sm overflow-hidden border border-white/20 bg-black/60 shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-[2px] transition-all duration-300 hover:border-[#f59e0b]/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 group">
                  {/* Portrait photo */}
                  <img
                    src={card.url}
                    alt={card.name}
                    className="w-full h-full object-cover brightness-95 contrast-105 group-hover:brightness-110 transition-all duration-300"
                    loading="lazy"
                  />

                  {/* Ambient inner vignette & glass shine */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Subtle info pill on hover */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="font-medium tracking-wide">{card.name}</span>
                    <span className="text-[10px] text-[#f59e0b] tracking-wider uppercase">
                      {card.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Subject: Ladki in center (Nigar's cutout image in center foreground) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[30] pointer-events-none flex flex-col items-center justify-end">
        {/* Soft backlight rim halo right behind her shoulders */}
        <div
          className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.42) 0%, rgba(255, 90, 31, 0.18) 45%, transparent 70%)",
          }}
        />

        {/* The center girl cutout - Enhanced scale and positioning for mobile & desktop */}
        <img
          src="/images/nigar-main-cutout.png"
          alt="Nigar - Birthday Star"
          className="h-[58vh] sm:h-[64vh] md:h-[70vh] min-h-[390px] sm:min-h-[460px] max-h-[530px] sm:max-h-[640px] md:max-h-[720px] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_45px_rgba(0,0,0,0.95)] select-none pointer-events-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.85) 6%, black 14%, black 100%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.85) 6%, black 14%, black 100%)",
          }}
        />
      </div>

      {/* Bottom hint / drag instruction & scroll to birthday card */}
      <div className="relative z-40 pb-4 sm:pb-6 px-4 sm:px-6 flex flex-col items-center gap-2">
        <span className="text-[10px] sm:text-xs text-white/50 tracking-widest uppercase font-sans pointer-events-none">
          Drag to orbit memories &bull; Hover to pause
        </span>
        <button
          type="button"
          onClick={() => {
            const el =
              document.getElementById("scroll-expand-section") ||
              document.getElementById("birthday-hero");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-1.5 text-xs text-[#ff5a1f] hover:text-white transition-all bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#ff5a1f]/40 hover:border-[#ff5a1f] shadow-[0_0_15px_rgba(255,90,31,0.25)] tracking-wider uppercase font-medium cursor-pointer"
        >
          <span>Begin Nigar&apos;s Story</span>
          <span className="animate-bounce text-xs leading-none">↓</span>
        </button>
      </div>
    </section>
  );
}
