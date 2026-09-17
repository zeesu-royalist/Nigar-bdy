/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";

// 12 Curated cinematic portraits matching the floating screens in the reference image
const cardData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    name: "Aria",
    role: "Voice Guide",
    yOffset: -50,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    name: "Elena",
    role: "Advisor",
    yOffset: 25,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    name: "Maya",
    role: "Companion",
    yOffset: -20,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    name: "Liam",
    role: "Storyteller",
    yOffset: 45,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    name: "Sophia",
    role: "Mentor",
    yOffset: -60,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    name: "Lucas",
    role: "Philosopher",
    yOffset: 15,
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    name: "Clara",
    role: "Historian",
    yOffset: -35,
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    name: "Ethan",
    role: "Creator",
    yOffset: 40,
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
    name: "Mira",
    role: "Artist",
    yOffset: -15,
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    name: "Oliver",
    role: "Explorer",
    yOffset: 30,
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
    name: "Zara",
    role: "Visionary",
    yOffset: -45,
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    name: "Noah",
    role: "Thinker",
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
        {/* Apple-style Featured Pick Badge */}
        <div className="flex items-center gap-1.5 mb-2 sm:mb-3 text-[#f59e0b] text-xs sm:text-sm font-medium tracking-wide">
          <svg className="w-3.5 h-3.5 fill-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.19-9.35-11.1-20.12-14.75-32.31-3.64-12.18-5.46-23.71-5.46-34.58 0-15.02 3.8-27.42 11.41-37.2 7.6-9.78 17.06-14.77 28.38-14.97 4.13 0 9.17 1.25 15.12 3.75 5.95 2.5 9.87 3.86 11.76 4.08 2.29-.33 6.42-1.8 12.39-4.42 5.97-2.61 11.03-3.83 15.18-3.65 14.15.65 25.13 5.98 32.94 15.99-12.85 7.84-19.16 18.5-18.93 31.98.22 10.45 4.25 19.37 12.09 26.76 7.84 7.39 17.41 11.75 28.71 13.07-2.39 7.4-5.33 14.7-8.81 21.9zM119.22 33.64c0-7.84 2.83-15.35 8.49-22.53 5.66-7.18 12.63-11.75 20.91-13.71.22 1.3.33 2.5.33 3.6 0 7.84-3.05 15.67-9.14 23.49-6.09 7.82-13.27 12.29-21.54 13.4-.11-1.3-.22-2.5-.22-3.6z" />
          </svg>
          <span className="font-sans font-medium tracking-normal text-[#f59e0b]">Featured Pick</span>
        </div>

        {/* Large Elegant Editorial Headline */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-['Playfair_Display',Georgia,serif] text-[#f4f3ef] tracking-tight leading-[1.18] font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          Speak with <span className="italic font-['Playfair_Display',Georgia,serif] font-normal text-white">voices</span> that once only lived in your imagination.
        </h2>

        {/* Subtitle */}
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-[15px] text-[#b4afa7] max-w-xl leading-relaxed font-sans font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Meet AI guides, advisors, or friends whenever the moment calls.
          <br className="hidden sm:inline" /> Simply pick the voice you need, and begin your dialogue.
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
          Drag to rotate &bull; Hover to pause
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
          <span>Birthday Tribute</span>
          <span className="animate-bounce text-xs leading-none">↓</span>
        </button>
      </div>
    </section>
  );
}
