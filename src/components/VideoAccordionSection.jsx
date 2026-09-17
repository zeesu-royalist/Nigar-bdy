"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Film,
  Play,
  Pause,
} from "lucide-react";
import AccordionGallery from "./AccordionGallery";
import { birthdayGirlVideos } from "../data/birthdayVideos";

export default function VideoAccordionSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [lightboxVideo, setLightboxVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isPlayingModal, setIsPlayingModal] = useState(true);
  const modalVideoRef = useRef(null);

  const totalVideos = birthdayGirlVideos.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalVideos);
  };

  const openLightbox = (item, index) => {
    const idx = index !== undefined ? index : activeIndex;
    setLightboxIndex(idx);
    setLightboxVideo(birthdayGirlVideos[idx]);
    setIsPlayingModal(true);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxVideo(null);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        const next = (lightboxIndex + 1) % totalVideos;
        setLightboxIndex(next);
        setLightboxVideo(birthdayGirlVideos[next]);
      }
      if (e.key === "ArrowLeft") {
        const prev = (lightboxIndex - 1 + totalVideos) % totalVideos;
        setLightboxIndex(prev);
        setLightboxVideo(birthdayGirlVideos[prev]);
      }
      if (e.key === " ") {
        e.preventDefault();
        if (modalVideoRef.current) {
          if (modalVideoRef.current.paused) {
            modalVideoRef.current.play();
            setIsPlayingModal(true);
          } else {
            modalVideoRef.current.pause();
            setIsPlayingModal(false);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, totalVideos]);

  return (
    <section
      id="video-accordion-section"
      className="relative w-full bg-black text-[#ff5a1f] font-hn overflow-hidden py-14 sm:py-24 border-t border-[#ff5a1f]/20 select-none"
    >
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] sm:w-[540px] h-[300px] sm:h-[540px] bg-[#ff5a1f]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[240px] sm:w-[480px] h-[240px] sm:h-[480px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#ff5a1f] font-medium shadow-[0_0_20px_rgba(255,90,31,0.2)]">
                <Film className="w-3.5 h-3.5 text-[#ff5a1f]" />
                Chapter III &bull; Nigar in Motion 🎬
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#efeee9]">
              Candid Chronicles of Nigar
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#efeee9]/75 max-w-xl font-light mt-2 leading-relaxed">
              Every burst of laughter, spontaneous dance, and sweet golden smile captured across 12 live motion reels. Hover or tap to expand each memory of our birthday queen.
            </p>
          </div>

          {/* Interactive Quick Toolbar */}
          <div className="flex items-center flex-wrap gap-2.5 self-start md:self-auto">
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={() => setIsAudioOn((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${isAudioOn
                  ? "bg-[#ff5a1f] text-black border-[#ff5a1f] shadow-[0_0_20px_rgba(255,90,31,0.4)]"
                  : "bg-black/70 text-[#ff5a1f] border-[#ff5a1f]/40 hover:bg-[#ff5a1f]/10"
                }`}
            >
              {isAudioOn ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Sound OFF</span>
                </>
              )}
            </button>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-1 bg-black/60 border border-white/15 rounded-full p-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-full hover:bg-[#ff5a1f] hover:text-black text-[#efeee9] transition-all cursor-pointer"
                title="Previous video"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-[#efeee9]/80 font-medium">
                {String(activeIndex + 1).padStart(2, "0")}/{String(totalVideos).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-full hover:bg-[#ff5a1f] hover:text-black text-[#efeee9] transition-all cursor-pointer"
                title="Next video"
                aria-label="Next video"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Gallery Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <AccordionGallery
          items={birthdayGirlVideos}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          expandRatio={0.48}
          trigger="hover"
          accentColor="#ff5a1f"
          overlayColor="#07020d"
          textColor="#ffffff"
          grayscale={true}
          showLabels={true}
          duration={0.65}
          ease="power3.out"
          parallax={0.45}
          tilt={7}
          stagger={0.05}
          height={520}
          gap={10}
          radius={18}
          orientation="horizontal"
          isAudioOn={isAudioOn}
          onToggleAudio={() => setIsAudioOn((prev) => !prev)}
          onOpenLightbox={openLightbox}
        />
      </div>

      {/* Interactive Bottom Video Scroller & Info Bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Active video pill info */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f] animate-ping" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#efeee9]">
              {birthdayGirlVideos[activeIndex]?.label}
            </span>
            <span className="text-[11px] text-[#ff5a1f]/80 uppercase tracking-wider">
              &bull; {birthdayGirlVideos[activeIndex]?.subtitle}
            </span>
          </div>
        </div>

        {/* Quick jump navigation dot pills */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {birthdayGirlVideos.map((vid, idx) => (
            <button
              key={vid.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`transition-all rounded-full cursor-pointer ${idx === activeIndex
                  ? "w-7 h-2 bg-[#ff5a1f] shadow-[0_0_10px_rgba(255,90,31,0.6)]"
                  : "w-2 h-2 bg-white/25 hover:bg-white/60"
                }`}
              title={`Jump to ${vid.label}`}
              aria-label={`Jump to video ${idx + 1}`}
            />
          ))}
        </div>

        {/* Quick action button: Enlarge Spotlight */}
        <button
          type="button"
          onClick={() => openLightbox(birthdayGirlVideos[activeIndex], activeIndex)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-[#ff5a1f]/40 text-xs text-[#ff5a1f] hover:bg-[#ff5a1f] hover:text-black transition-all shadow-[0_0_15px_rgba(255,90,31,0.2)] cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Cinema View</span>
        </button>
      </div>

      {/* Fullscreen Video Modal (Lightbox) */}
      {lightboxIndex !== null && lightboxVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 anim-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-2xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 text-xs tracking-widest uppercase text-[#ff5a1f]">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#ff5a1f]" />
                <span className="font-semibold">
                  Cinema Reel {lightboxIndex + 1} of {totalVideos}
                </span>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-[#ff5a1f] hover:text-black transition-all text-white cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full max-h-[72vh] rounded-2xl overflow-hidden border border-[#ff5a1f]/50 shadow-[0_0_60px_rgba(255,90,31,0.4)] bg-black flex items-center justify-center">
              <video
                ref={modalVideoRef}
                src={lightboxVideo.video}
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-auto max-h-[72vh] object-contain select-none"
              />

              {/* Prev / Next buttons */}
              <button
                type="button"
                onClick={() => {
                  const prev = (lightboxIndex - 1 + totalVideos) % totalVideos;
                  setLightboxIndex(prev);
                  setLightboxVideo(birthdayGirlVideos[prev]);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 border border-white/20 text-white hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-all cursor-pointer backdrop-blur-md"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = (lightboxIndex + 1) % totalVideos;
                  setLightboxIndex(next);
                  setLightboxVideo(birthdayGirlVideos[next]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 border border-white/20 text-white hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-all cursor-pointer backdrop-blur-md"
                aria-label="Next video"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Bottom Caption */}
            <div className="w-full text-center pt-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-[#efeee9]">
                {lightboxVideo.label}
              </h3>
              <p className="text-xs text-[#ff5a1f] tracking-wider uppercase mt-0.5">
                {lightboxVideo.subtitle} &bull; Happy Birthday Nigar 💖
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
