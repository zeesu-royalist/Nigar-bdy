/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useEffect, useRef } from "react";

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

export const ScrollExpand = ({
  src = "/birthday girl images/WhatsApp Image 2026-09-17 at 9.11.39 PM.jpeg",
  mediaType = "image",
  poster = "",
  alt = "Scroll expand showcase",
  title = "Built to scale",
  scrollHint = "Scroll inside the frame",
  startWidth = 46,
  startHeight = 62,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.08,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  objectFit = "contain",
  ambientBackdrop = true,
  children,
  className = "",
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  });

  useEffect(() => {
    propsRef.current = {
      startWidth,
      startHeight,
      startRadius,
      endRadius,
      mediaZoom,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
      useWindowScroll,
      enabled,
    };
  }, [
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  ]);

  const applyProgress = useCallback((p) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    const clipStr = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
    frame.style.clipPath = clipStr;
    frame.style.webkitClipPath = clipStr;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) {
      scrimRef.current.style.opacity = `${c.overlayScrim * e}`;
    }

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = typeof window !== "undefined" ? window.innerHeight : 800;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll
        ? (typeof window !== "undefined" ? window.innerHeight : 800)
        : (root.clientHeight || 500);
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      const totalTrackH = stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance));
      track.style.height = `${totalTrackH}px`;

      const w = root.clientWidth || (typeof window !== "undefined" ? window.innerWidth : stageH);
      stage.style.setProperty(
        "--se-title-size",
        `${clamp(w * 0.075, 20, 84)}px`
      );
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        if (!track) return 0;
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k =
        c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const cleanSrc =
    src && !src.startsWith("http") && !src.startsWith("/")
      ? `/${src}`
      : src;

  const media =
    mediaType === "video" ? (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {ambientBackdrop && (
          <video
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
            src={cleanSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        )}
        <video
          ref={mediaRef}
          className={`relative z-10 w-full h-full ${
            objectFit === "contain"
              ? "object-contain max-h-full max-w-full p-2"
              : "object-cover"
          } origin-center select-none [will-change:transform]`}
          src={cleanSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    ) : (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {ambientBackdrop && (
          <img
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-110 pointer-events-none select-none"
            src={cleanSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        )}
        <img
          ref={mediaRef}
          className={`relative z-10 w-full h-full ${
            objectFit === "contain"
              ? "object-contain max-h-full max-w-full p-1 sm:p-3"
              : "object-cover"
          } origin-center select-none [will-change:transform]`}
          src={cleanSrc}
          alt={alt}
          draggable={false}
        />
      </div>
    );

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${
        useWindowScroll
          ? "overflow-visible"
          : "h-full overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      } ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div
        ref={trackRef}
        className="relative w-full"
        style={{
          minHeight: useWindowScroll ? "220vh" : "auto",
          width: "100%",
        }}
      >
        <div
          ref={stageRef}
          className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center [--se-title-size:4rem] z-20"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            willChange: "transform",
          }}
        >
          <div
            ref={frameRef}
            className="absolute inset-0 [clip-path:inset(21%_29%_21%_29%_round_24px)] [will-change:clip-path]"
          >
            {media}
            <div
              ref={scrimRef}
              className="absolute inset-0 opacity-0 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.85),rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.45))]"
            />
            {children ? (
              <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-[6%] opacity-0 [will-change:opacity,transform] z-20"
              >
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div
              ref={titleRef}
              className="absolute inset-0 flex items-center justify-center m-0 px-[6%] text-center font-bold leading-none tracking-[-0.03em] text-[#efeee9] [font-size:var(--se-title-size)] [text-shadow:0_4px_30px_rgba(0,0,0,0.8)] pointer-events-none [will-change:opacity,transform] z-20"
            >
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div
              ref={hintRef}
              className="absolute inset-x-0 bottom-8 text-center text-xs sm:text-sm tracking-[0.2em] uppercase text-[#ff5a1f] font-medium pointer-events-none [will-change:opacity,transform] z-20 flex items-center justify-center gap-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            >
              <span>{scrollHint}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
