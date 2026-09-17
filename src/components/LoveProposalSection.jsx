"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Heart, Sparkles, PartyPopper, RotateCcw } from "lucide-react";

// Web Audio API romantic chord synthesizer for zero external audio dependencies
function playRomanticChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Sweet romantic harp arpeggio: C5, E5, G5, B5, C6, E6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Volume envelope
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (err) {
    console.debug("Audio play skipped:", err);
  }
}

// Gentle haptic feedback for mobile phones
function triggerHaptic(pattern = 25) {
  try {
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Ignore unsupported devices
  }
}

// Static ambient floating hearts across the background
const FLOATING_HEARTS = [
  { id: 1, x: 5, size: 20, duration: 9, delay: 0, opacity: 0.22, symbol: "💖" },
  { id: 2, x: 16, size: 24, duration: 12, delay: 2, opacity: 0.18, symbol: "✨" },
  { id: 3, x: 30, size: 18, duration: 8, delay: 4, opacity: 0.25, symbol: "❤️" },
  { id: 4, x: 45, size: 22, duration: 11, delay: 1, opacity: 0.16, symbol: "💕" },
  { id: 5, x: 62, size: 26, duration: 13, delay: 3, opacity: 0.2, symbol: "🌸" },
  { id: 6, x: 76, size: 16, duration: 7, delay: 5, opacity: 0.24, symbol: "💖" },
  { id: 7, x: 90, size: 22, duration: 10, delay: 2.5, opacity: 0.18, symbol: "✨" },
  { id: 8, x: 22, size: 22, duration: 14, delay: 6, opacity: 0.14, symbol: "❤️" },
  { id: 9, x: 52, size: 18, duration: 9, delay: 3.5, opacity: 0.22, symbol: "💕" },
  { id: 10, x: 84, size: 20, duration: 11.5, delay: 0.5, opacity: 0.18, symbol: "✨" },
];

export default function LoveProposalSection() {
  const [accepted, setAccepted] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [evasionCount, setEvasionCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const arenaRef = useRef(null);
  const noBtnRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const particlesRef = useRef([]);

  // Responsive runaway logic: keeps the "No" button strictly inside mobile or desktop boundaries
  const dodgeNoButton = useCallback(() => {
    if (!arenaRef.current || !noBtnRef.current) return;

    triggerHaptic(30);

    const arena = arenaRef.current.getBoundingClientRect();
    const btn = noBtnRef.current.getBoundingClientRect();

    // Mobile-friendly safe padding
    const padding = 16;
    const maxX = arena.width - btn.width - padding * 2;
    const maxY = arena.height - btn.height - padding * 2;

    if (maxX <= 0 || maxY <= 0) return;

    // Pick a new position
    let newX = Math.floor(Math.random() * maxX) - maxX / 2;
    let newY = Math.floor(Math.random() * maxY) - maxY / 2;

    // Ensure noticeable leap distance (responsive hop)
    const minHopX = Math.min(65, maxX * 0.35);
    const minHopY = Math.min(50, maxY * 0.35);

    if (Math.abs(newX - noPos.x) < minHopX) {
      newX = newX >= 0 ? newX + minHopX : newX - minHopX;
    }
    if (Math.abs(newY - noPos.y) < minHopY) {
      newY = newY >= 0 ? newY + minHopY : newY - minHopY;
    }

    // Clamp tightly inside arena bounds so it NEVER causes horizontal scroll or clips on mobile
    const halfX = Math.max(10, maxX / 2);
    const halfY = Math.max(10, maxY / 2);
    newX = Math.max(-halfX, Math.min(halfX, newX));
    newY = Math.max(-halfY, Math.min(halfY, newY));

    setNoPos({ x: newX, y: newY });
    setHasMoved(true);
    setEvasionCount((c) => c + 1);
  }, [noPos]);

  // Proximity detection for desktop mouse
  const handleMouseMove = useCallback(
    (e) => {
      if (accepted || !noBtnRef.current) return;

      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // Desktop proximity evasion
      if (dist < 85) {
        dodgeNoButton();
      }
    },
    [accepted, dodgeNoButton]
  );

  // Proximity detection for mobile touch drag
  const handleTouchMove = useCallback(
    (e) => {
      if (accepted || !noBtnRef.current || !e.touches || e.touches.length === 0) return;

      const touch = e.touches[0];
      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);

      // Mobile finger proximity evasion
      if (dist < 75) {
        dodgeNoButton();
      }
    },
    [accepted, dodgeNoButton]
  );

  // Confetti and celebration particles with Retina (High-DPI) scaling support
  const triggerCelebrationBurst = useCallback((clickX = null, clickY = null) => {
    playRomanticChime();
    triggerHaptic([50, 70, 110]);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const colors = [
      "#ff5a1f",
      "#ff2a5f",
      "#ff758c",
      "#ffd166",
      "#ff8fab",
      "#efeee9",
      "#ff4d6d",
    ];
    const heartSymbols = ["❤️", "💖", "💕", "✨", "🌸", "💍", "🥰"];

    const newParticles = [];
    // Adjust particle count for mobile performance
    const isMobile = w < 640;
    const count = isMobile ? 95 : 150;
    const originX = clickX !== null ? clickX : w / 2;
    const originY = clickY !== null ? clickY : h * (isMobile ? 0.4 : 0.45);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (isMobile ? 4 : 5) + Math.random() * (isMobile ? 12 : 16);
      const isEmoji = Math.random() > 0.4;

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (3 + Math.random() * 5),
        gravity: 0.18 + Math.random() * 0.08,
        friction: 0.985,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        size: isEmoji ? (isMobile ? 15 : 18) + Math.random() * 12 : (isMobile ? 5 : 6) + Math.random() * 7,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        isEmoji,
        emoji: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
        decay: (isMobile ? 0.007 : 0.005) + Math.random() * 0.007,
      });
    }

    particlesRef.current = newParticles;

    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      let alive = false;
      const list = particlesRef.current;

      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.isEmoji) {
            ctx.font = `${p.size}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.emoji, 0, 0);
          } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          }
          ctx.restore();
        }
      }

      if (alive) {
        animFrameId.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    animFrameId.current = requestAnimationFrame(render);
  }, []);

  // Cleanup canvas animation
  useEffect(() => {
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Handle "Yes" click
  const handleYesClick = () => {
    setExploding(true);
    setAccepted(true);
    triggerCelebrationBurst();

    setTimeout(() => {
      setExploding(false);
    }, 1200);
  };

  // Reset function
  const handleReset = () => {
    triggerHaptic(20);
    setAccepted(false);
    setExploding(false);
    setEvasionCount(0);
    setNoPos({ x: 0, y: 0 });
    setHasMoved(false);
  };

  // Interactive tap anywhere on screen in celebration mode to trigger mini bursts!
  const handleScreenCelebrationClick = (e) => {
    if (!accepted) return;
    triggerCelebrationBurst(e.clientX, e.clientY);
  };

  // Scale of YES button grows progressively (capped on mobile to fit nicely)
  const yesScale = Math.min(1.35, 1 + evasionCount * 0.05);

  return (
    <section
      id="love-proposal"
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center bg-black text-[#efeee9] font-hn overflow-hidden px-4 sm:px-8 py-10 sm:py-20 border-t border-[#ff5a1f]/20 select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleScreenCelebrationClick}
    >
      {/* Full Screen High-DPI Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
      />

      {/* Ambient glowing romantic full-screen gradient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] md:w-[900px] h-[320px] sm:h-[650px] md:h-[900px] bg-gradient-to-tr from-[#ff5a1f]/25 via-[#ff2a5f]/20 to-transparent rounded-full blur-[100px] sm:blur-[180px] md:blur-[220px] pointer-events-none -z-10" />
      <div className="absolute bottom-6 right-6 w-[200px] sm:w-[450px] h-[200px] sm:h-[450px] bg-[#ff2a5f]/15 rounded-full blur-[110px] sm:blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-6 left-6 w-[180px] sm:w-[400px] h-[180px] sm:h-[400px] bg-[#ff5a1f]/15 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -z-10" />

      {/* Ambient rising romantic floating symbols across the whole screen */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        {FLOATING_HEARTS.map((item) => (
          <span
            key={item.id}
            className="absolute transition-opacity"
            style={{
              left: `${item.x}%`,
              bottom: "-25px",
              fontSize: `${item.size}px`,
              opacity: item.opacity,
              animation: `floatUp ${item.duration}s linear infinite`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>

      {/* Main Full-Screen Content */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center relative z-10 my-auto">
        {!accepted ? (
          /* ============================================================== */
          /* FULL-SCREEN QUESTION (Mobile-Optimized)                         */
          /* ============================================================== */
          <div className="w-full flex flex-col items-center justify-center transition-all duration-500">
            {/* Romantic Top Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/35 text-[11px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#ff5a1f] font-semibold mb-4 sm:mb-8 shadow-[0_0_20px_rgba(255,90,31,0.25)]">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#ff5a1f] animate-pulse" />
              <span>A Special Question From My Heart 💖</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-[#ff5a1f] text-[#ff5a1f] animate-bounce" />
            </div>

            {/* Grand Question Headline - Fully Responsive */}
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#efeee9] mb-3 sm:mb-6 uppercase drop-shadow-[0_4px_30px_rgba(255,90,31,0.4)] leading-tight px-2">
              Do You Love Me, Nigar? <span className="inline-block animate-pulse">❤️</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base md:text-xl text-[#efeee9]/75 max-w-sm sm:max-w-xl mx-auto mb-6 sm:mb-12 leading-relaxed font-light px-3">
              Choose carefully, birthday girl... one answer unlocks pure celebration, and the other might just refuse to be caught! 😉✨
            </p>

            {/* Spacious Runaway Interactive Arena */}
            <div
              ref={arenaRef}
              className="relative w-full max-w-md sm:max-w-3xl md:max-w-4xl h-[200px] xs:h-[220px] sm:h-[280px] md:h-[320px] flex items-center justify-center gap-5 sm:gap-10 select-none overflow-hidden touch-none"
            >
              {/* YES BUTTON */}
              <button
                type="button"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesScale})`,
                }}
                className="relative group px-6 xs:px-8 sm:px-12 py-3 xs:py-3.5 sm:py-4.5 rounded-full font-black text-sm xs:text-base sm:text-xl uppercase tracking-wider text-white transition-transform duration-300 ease-out cursor-pointer shadow-[0_0_30px_rgba(255,90,31,0.6)] hover:shadow-[0_0_55px_rgba(255,42,95,0.9)] active:scale-95 z-20"
              >
                {/* Radiant animated gradient background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff5a1f] via-[#ff2a5f] to-[#ff5a1f] bg-[length:200%_auto] animate-gradient-shift" />

                {/* Shimmer sweep */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                </div>

                {/* Button Text & Heart Icon */}
                <span className="relative flex items-center gap-2 sm:gap-3 drop-shadow-md">
                  <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-white text-white animate-pulse" />
                  Yes! 🥰
                </span>
              </button>

              {/* NO BUTTON (Kept strictly as 'No', instantly flees on touch or cursor proximity) */}
              <button
                ref={noBtnRef}
                type="button"
                onMouseEnter={dodgeNoButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  dodgeNoButton();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dodgeNoButton();
                }}
                style={{
                  transform: hasMoved
                    ? `translate3d(${noPos.x}px, ${noPos.y}px, 0)`
                    : "translate3d(0, 0, 0)",
                  transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                className={`relative px-6 xs:px-7 sm:px-10 py-2.5 xs:py-3 sm:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base tracking-wider text-white/80 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/25 backdrop-blur-md cursor-pointer select-none transition-colors z-20 ${
                  hasMoved ? "shadow-[0_0_20px_rgba(255,255,255,0.25)]" : ""
                }`}
              >
                <span className="pointer-events-none">No</span>
              </button>
            </div>

            {/* Subtle Evasion Hint */}
            {evasionCount > 0 && (
              <p className="mt-3 sm:mt-5 text-[11px] sm:text-sm text-[#ff5a1f]/90 font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 px-2">
                <span>🏃‍♂️ Evasions: {evasionCount}</span>
                <span className="text-white/60">
                  {evasionCount >= 3
                    ? "(The universe really wants you to tap YES, Nigar! 😉)"
                    : "(Notice how YES keeps getting bigger for you? ✨)"}
                </span>
              </p>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* FULL-SCREEN CELEBRATION (Mobile-Optimized)                      */
          /* ============================================================== */
          <div
            className={`w-full flex flex-col items-center justify-center text-center transform transition-all duration-700 ease-out px-2 ${
              exploding ? "scale-95 opacity-90" : "scale-100 opacity-100"
            }`}
          >
            {/* Shockwave expanding ring */}
            {exploding && (
              <div className="fixed inset-0 rounded-full border-4 border-[#ff2a5f] animate-ping pointer-events-none" />
            )}

            {/* Celebration Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1 sm:py-2 rounded-full bg-[#ff2a5f]/20 border border-[#ff2a5f]/45 text-[10px] xs:text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#ff758c] font-bold mb-4 sm:mb-8 shadow-[0_0_25px_rgba(255,42,95,0.4)]">
              <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff2a5f]" />
              <span>Happy Birthday Nigar &bull; Forever &amp; Always 🎂</span>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd166]" />
            </div>

            {/* Grand Pulsing 3D Heart */}
            <div className="relative mx-auto my-2 sm:my-4 w-20 h-20 sm:w-36 sm:h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff5a1f] to-[#ff2a5f] blur-2xl opacity-80 animate-pulse" />
              <div className="relative z-10 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#ff5a1f] via-[#ff2a5f] to-[#ff758c] p-0.5 sm:p-1 shadow-[0_0_45px_rgba(255,42,95,0.8)] flex items-center justify-center animate-bounce">
                <Heart className="w-9 h-9 sm:w-16 sm:h-16 fill-white text-white drop-shadow-xl" />
              </div>
            </div>

            {/* Grand Celebration Title */}
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-3 sm:mb-6 uppercase drop-shadow-[0_0_35px_rgba(255,42,95,0.85)] leading-tight px-2">
              I Love You Too, Nigar! <span className="inline-block animate-pulse">❤️</span>
            </h1>

            {/* Romantic message personalized for Nigar */}
            <p className="text-sm xs:text-base sm:text-xl md:text-2xl text-[#efeee9] max-w-xl mx-auto mb-3 sm:mb-6 font-medium leading-relaxed px-3">
              Happy Birthday, <span className="text-[#ff5a1f] font-bold">Nigar</span>! 🌹 You make every single day brighter, sweeter, and infinitely more joyful. Here&apos;s to your special day and endless happiness!
            </p>

            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-4">
              May your year be as radiant as your smile, filled with laughter, sweet surprises, and all the love in the world. You are truly one of a kind. 💕✨
            </p>

            {/* Mobile-friendly Action buttons (comfortable thumb layout) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-xs sm:max-w-none px-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCelebrationBurst();
                }}
                className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-base uppercase tracking-wider text-white bg-gradient-to-r from-[#ff5a1f] to-[#ff2a5f] hover:brightness-110 active:scale-95 shadow-[0_0_30px_rgba(255,90,31,0.55)] hover:shadow-[0_0_50px_rgba(255,42,95,0.85)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#ffd166] fill-[#ffd166]" />
                Send Love Burst! 💖
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-4 rounded-full font-medium text-xs sm:text-sm tracking-wider text-white/70 hover:text-white active:bg-white/10 bg-white/5 border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ask Again, Birthday Queen 🙈
              </button>
            </div>

            {/* Tap screen hint on celebration */}
            <p className="mt-5 text-[11px] sm:text-xs text-white/40 tracking-wider">
              ✨ Tap anywhere on the screen for extra love bursts!
            </p>
          </div>
        )}
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.25;
          }
          85% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(-1100px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-shift {
          animation: gradientShift 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
