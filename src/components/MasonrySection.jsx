/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Compass } from "lucide-react";
import DriftWall from "./DriftWall";
import { birthdayGirlImages } from "../data/birthdayImages";

export default function MasonrySection() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [direction, setDirection] = useState("up");
  const [speed, setSpeed] = useState(36);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % birthdayGirlImages.length);
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex(
          (prev) => (prev - 1 + birthdayGirlImages.length) % birthdayGirlImages.length
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const openLightbox = (photo) => {
    const idx = birthdayGirlImages.findIndex((p) => p.image === photo.image);
    setLightboxIndex(idx !== -1 ? idx : 0);
  };

  return (
    <section
      id="moments-wall"
      className="relative w-full bg-black text-[#ff5a1f] font-hn overflow-hidden py-10 sm:py-20 border-t border-[#ff5a1f]/20"
    >
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] bg-[#ff5a1f]/10 rounded-full blur-[110px] sm:blur-[160px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#ff5a1f] font-medium">
              <Sparkles className="w-3 h-3 text-[#ff5a1f]" />
              Chapter IV &bull; Picture Perfect ✨
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#efeee9]">
            Timeless Moments &amp; Memories
          </h2>
        </div>

        {/* Desktop description & Mobile quick controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-xs sm:text-sm text-[#ff5a1f]/80 max-w-sm font-light leading-relaxed hidden sm:block">
            An endless 3D spatial retrospective honoring every smile, style, and golden memory of the birthday queen, Nigar.
          </p>

          {/* Quick interactive speed & direction controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDirection((d) => (d === "up" ? "down" : "up"))}
              className="px-2.5 py-1 rounded-full border border-[#ff5a1f]/40 bg-black/60 text-[10px] sm:text-xs text-[#ff5a1f] hover:bg-[#ff5a1f] hover:text-black transition-all flex items-center gap-1 cursor-pointer"
              title="Toggle drift direction"
            >
              <span>{direction === "up" ? "↑ Up" : "↓ Down"}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpeed((s) => (s === 36 ? 20 : 36))}
              className="px-2.5 py-1 rounded-full border border-[#ff5a1f]/40 bg-black/60 text-[10px] sm:text-xs text-[#ff5a1f] hover:bg-[#ff5a1f] hover:text-black transition-all cursor-pointer"
              title="Toggle drift speed"
            >
              <span>{speed === 36 ? "⚡ Normal" : "🌙 Calm"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DriftWall 3D Perspective Container - Scaled for mobile screens */}
      <div className="relative w-full h-[490px] sm:h-[620px] lg:h-[700px]">
        <DriftWall
          items={birthdayGirlImages}
          columns={5}
          tileWidth={210}
          tileHeight={140}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={speed}
          direction={direction}
          variance={0.45}
          parallax={0.65}
          lift={70}
          fade={0.6}
          dim={0.6}
          overlayColor="#07020d"
          radius={14}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
          onTileSelect={(photo) => setSelectedPhoto(photo)}
        />
      </div>

      {/* Mobile-First Interactive Bottom Bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 mt-4 sm:mt-6">
        {selectedPhoto ? (
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-black/80 border border-[#ff5a1f]/50 shadow-[0_0_25px_rgba(255,90,31,0.25)] backdrop-blur-md anim-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-[#ff5a1f]/40 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] tracking-wider uppercase text-[#ff5a1f]/70 block font-medium">
                  Spotlighted Photo
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#efeee9] truncate">
                  {selectedPhoto.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openLightbox(selectedPhoto)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff5a1f] text-black font-semibold text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(255,90,31,0.4)] cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors"
                aria-label="Deselect"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#ff5a1f]/70 tracking-wider uppercase font-medium">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#ff5a1f]" />
              <span className="sm:hidden">Drag to tilt &bull; Tap photo to spotlight</span>
              <span className="hidden sm:inline">Move cursor to tilt &bull; Hover or tap any portrait to spotlight</span>
            </span>
            <span className="text-[#efeee9]/60">{birthdayGirlImages.length} Photos</span>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal (Specially tuned for mobile tap & view) */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 anim-fade-in select-none"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Modal Container */}
          <div
            className="relative max-w-xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Counter & Close */}
            <div className="w-full flex items-center justify-between pb-3 text-xs tracking-widest uppercase text-[#ff5a1f]">
              <span className="font-medium">
                Photo {lightboxIndex + 1} of {birthdayGirlImages.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-[#ff5a1f] hover:text-black transition-all text-white cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Frame */}
            <div className="relative w-full max-h-[68vh] rounded-2xl overflow-hidden border border-[#ff5a1f]/40 shadow-[0_0_50px_rgba(255,90,31,0.35)] bg-black/80 flex items-center justify-center">
              <img
                src={birthdayGirlImages[lightboxIndex].image}
                alt={birthdayGirlImages[lightboxIndex].title}
                className="w-full h-auto max-h-[68vh] object-contain select-none"
              />

              {/* Prev / Next buttons */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (prev) =>
                      (prev - 1 + birthdayGirlImages.length) %
                      birthdayGirlImages.length
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (prev) => (prev + 1) % birthdayGirlImages.length
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Caption */}
            <div className="w-full text-center pt-3">
              <h3 className="text-base sm:text-lg font-bold text-[#efeee9]">
                {birthdayGirlImages[lightboxIndex].title}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#ff5a1f]/80 tracking-wider uppercase mt-0.5">
                Happy Birthday Nigar &bull; Cherished Forever 💖
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
