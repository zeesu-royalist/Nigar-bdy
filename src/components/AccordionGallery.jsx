/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Volume2, VolumeX, Maximize2, Sparkles } from "lucide-react";

export default function AccordionGallery({
  items = [],
  defaultIndex = 2,
  activeIndex: controlledActive,
  onActiveChange,
  accentColor = "#ff5a1f",
  overlayColor = "#060010",
  textColor = "#ffffff",
  height = 500,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 7,
  stagger = 0.05,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  className = "",
  isAudioOn = false,
  onToggleAudio,
  onOpenLightbox,
}) {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const videoRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const tlRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(360);

  const vertical = orientation === "vertical";
  const count = items.length;

  // Uncontrolled or controlled active index
  const [internalActive, setInternalActive] = useState(
    Math.min(Math.max(defaultIndex, 0), Math.max(0, count - 1))
  );
  const active =
    controlledActive !== undefined ? controlledActive : internalActive;

  const setActive = useCallback(
    (index) => {
      const clamped = Math.min(Math.max(index, 0), count - 1);
      if (controlledActive === undefined) {
        setInternalActive(clamped);
      }
      if (onActiveChange) {
        onActiveChange(clamped);
      }
    },
    [controlledActive, count, onActiveChange]
  );

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const overlayBg = `linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${overlayColor} 75%, transparent) 100%), color-mix(in srgb, ${overlayColor} calc(var(--ag-dim, 0.35) * 100%), transparent)`;

  // Synchronize video playback and audio mute state
  // Only the active video plays so mobile hardware video decoders never get overwhelmed
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      const isActive = i === active;
      vid.muted = !isAudioOn || !isActive;
      if (isActive) {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy fallback: play muted if unmuted is blocked
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
      } else {
        vid.pause();
      }
    });
  }, [active, isAudioOn]);

  // Smoothly center active panel horizontally in the scrollable container without moving window
  useEffect(() => {
    const container = rootRef.current;
    const activePanel = panelRefs.current[active];
    if (container && activePanel) {
      if (container.scrollWidth > container.clientWidth) {
        const targetLeft =
          activePanel.offsetLeft -
          (container.clientWidth - activePanel.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: "smooth",
        });
      }
    }
  }, [active]);

  // GSAP Accordion expansion & 3D tilt animation
  const applyLayout = useCallback(
    (animate) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(
          panel,
          {
            flexGrow: isActive ? grow : 1,
            ...rotProp,
            duration: dur,
            ease,
          },
          0
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 0.85) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              "--ag-gray": gray,
              "--ag-dim": isActive ? 0 : 0.4,
              duration: dur,
              ease,
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
                stagger: prefersReduced ? 0 : stagger,
              },
              0
            );
          } else {
            tl.to(
              [bar, text],
              {
                opacity: 0,
                x: -12,
                duration: dur * 0.5,
                ease,
              },
              0
            );
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced,
    ]
  );

  // ResizeObserver for dynamic media sizing
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 160);
      const size = Math.max(
        300,
        usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.35
      );
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i) => {
    if (trigger === "hover") setActive(i);
  };

  const handleClick = (i, e) => {
    e.preventDefault();
    setActive(i);
  };

  const handlePointerDown = (i) => {
    setActive(i);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`flex ${
        vertical ? "flex-col" : "flex-row"
      } w-full max-w-full [perspective:1400px] overflow-x-auto no-scrollbar py-2.5 px-2 sm:px-0 ${className}`}
      style={{
        gap: `${gap}px`,
        height: vertical ? `${Math.round(height * 1.5)}px` : `${height}px`,
        WebkitOverflowScrolling: "touch",
      }}
      role="list"
      aria-label="Interactive Video and Image Accordion Gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const videoSrc =
          item.video || (item.image?.endsWith(".mp4") ? item.image : null);
        const imageSrc = item.image || item.poster;

        return (
          <div
            key={item.id || i}
            data-accordion-index={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={`group relative block min-h-0 flex-[1_1_0] cursor-pointer overflow-hidden bg-[#07020d] no-underline outline-none [transform-style:preserve-3d] [transform-origin:center] border border-white/10 transition-colors duration-300 ${
              isActive
                ? "border-[#ff5a1f]/75 shadow-[0_15px_40px_-10px_rgba(255,90,31,0.5)] min-w-[260px] sm:min-w-[300px] md:min-w-0"
                : "hover:border-[#ff5a1f]/40 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] min-w-[48px] sm:min-w-[55px] md:min-w-0"
            } focus-visible:[box-shadow:0_0_0_2px_var(--ag-accent),0_10px_30px_-18px_rgba(0,0,0,0.8)]`}
            style={{
              borderRadius: `${radius}px`,
              "--ag-accent": accentColor,
              willChange: "flex-grow, transform",
            }}
            onPointerDown={() => handlePointerDown(i)}
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={item.label || `Video ${i + 1}`}
          >
            {/* Inner media wrapper */}
            <span className="absolute inset-0 overflow-hidden [border-radius:inherit]">
              <span
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                className="absolute top-1/2 left-1/2 [filter:grayscale(var(--ag-gray,0.85))]"
                style={{
                  width: vertical
                    ? "100%"
                    : "max(100%, var(--ag-media-size, 360px))",
                  height: vertical
                    ? "max(100%, var(--ag-media-size, 360px))"
                    : "100%",
                  willChange: "transform, filter",
                }}
              >
                {videoSrc ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={videoSrc}
                    poster={imageSrc}
                    playsInline
                    webkit-playsinline="true"
                    muted={!isAudioOn || !isActive}
                    loop
                    preload="auto"
                    className="block h-full w-full min-w-full min-h-full select-none object-cover pointer-events-none"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt={item.alt || item.label || ""}
                    draggable={false}
                    className="block h-full w-full min-w-full min-h-full select-none object-cover [-webkit-user-drag:none]"
                  />
                )}
              </span>

              {/* Atmospheric Gradient Scrim Overlay */}
              <span
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{ background: overlayBg }}
                aria-hidden="true"
              />
            </span>

            {/* Top Bar for Active Card (Tag, Sound Toggle, Lightbox Button) */}
            {isActive && (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-center justify-between pointer-events-auto anim-fade-in">
                {item.tag ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#ff5a1f]/40 text-[10px] sm:text-xs text-[#ff5a1f] font-medium tracking-wider uppercase shadow-[0_0_15px_rgba(255,90,31,0.25)] truncate max-w-[130px] sm:max-w-[150px]">
                    <Sparkles className="w-3 h-3 text-[#ff5a1f] shrink-0" />
                    <span className="truncate">{item.tag}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs text-[#efeee9]/80 font-medium tracking-wider uppercase">
                    {String(i + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  {/* Sound Toggle Button */}
                  {onToggleAudio && (
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAudio();
                      }}
                      className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                        isAudioOn
                          ? "bg-[#ff5a1f] text-black border-[#ff5a1f] shadow-[0_0_15px_rgba(255,90,31,0.5)] scale-105"
                          : "bg-black/75 text-white/80 border-white/20 hover:border-[#ff5a1f] hover:text-[#ff5a1f]"
                      }`}
                      title={isAudioOn ? "Mute audio" : "Unmute audio"}
                      aria-label={
                        isAudioOn ? "Mute video audio" : "Unmute video audio"
                      }
                    >
                      {isAudioOn ? (
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  )}

                  {/* Lightbox / Enlarge Button */}
                  {onOpenLightbox && (
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLightbox(item, i);
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white/80 hover:bg-[#ff5a1f] hover:text-black hover:border-[#ff5a1f] transition-all cursor-pointer"
                      title="Enlarge Video"
                      aria-label="Enlarge Video"
                    >
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Inactive Card Index Indicator Pill */}
            {!isActive && (
              <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[2] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] sm:text-[10px] font-mono text-[#efeee9]/75 tracking-widest bg-black/70 px-1 sm:px-2 py-0.5 rounded-full border border-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            )}

            {/* Bottom Label & Animated Accent Bar */}
            {showLabels && (
              <span
                className="pointer-events-none absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-[2] flex flex-col gap-1"
                aria-hidden="true"
              >
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="h-[20px] sm:h-[22px] w-[3px] sm:w-[3.5px] flex-none rounded-full opacity-0"
                    style={{
                      background: accentColor,
                      boxShadow: `0 0 14px color-mix(in srgb, ${accentColor} 70%, transparent)`,
                    }}
                  />
                  <div
                    ref={(el) => {
                      textRefs.current[i] = el;
                    }}
                    className="min-w-0 opacity-0"
                  >
                    <h3
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-sm sm:text-base md:text-lg font-bold tracking-[0.02em] [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] leading-tight"
                      style={{ color: textColor }}
                    >
                      {item.label}
                    </h3>
                    {item.subtitle && (
                      <p className="text-[9px] sm:text-[11px] text-[#ff5a1f]/90 tracking-wider uppercase font-medium mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
