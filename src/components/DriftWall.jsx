/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { birthdayGirlImages } from "../data/birthdayImages";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DEFAULT_ITEMS =
  birthdayGirlImages && birthdayGirlImages.length > 0
    ? birthdayGirlImages
    : Array.from({ length: 15 }, (_, i) => {
        const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
        return {
          image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
          title: `Tile ${i + 1}`,
          href: undefined,
        };
      });

const cx = (...parts) => parts.filter(Boolean).join(" ");

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

export const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  className = "",
  style,
  onTileSelect,
  activeTileIndex,
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerDimensions, setContainerDimensions] = useState({
    width: 1200,
    height: 600,
  });
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width =
        entry.contentRect.width ||
        (typeof window !== "undefined" ? window.innerWidth : 1200);
      const height = entry.contentRect.height || 600;
      setContainerDimensions({ width, height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Responsive Breakpoints: Mobile (< 640px), Tablet (< 1024px), Desktop (>= 1024px)
  const isMobile = containerDimensions.width < 640;
  const isTablet =
    containerDimensions.width >= 640 && containerDimensions.width < 1024;

  const effectiveColumns = useMemo(() => {
    if (isMobile) return Math.min(columns, 3);
    if (isTablet) return Math.min(columns, 4);
    return columns;
  }, [columns, isMobile, isTablet]);

  const effectiveTileWidth = useMemo(() => {
    if (isMobile) {
      const avail = containerDimensions.width || 360;
      // Proportional width calculated for 3 mobile columns with gentle margins
      const targetW = Math.floor((avail * 0.76) / effectiveColumns);
      return Math.min(tileWidth, Math.max(120, targetW));
    }
    if (isTablet) {
      return Math.min(tileWidth, 160);
    }
    return tileWidth;
  }, [containerDimensions.width, effectiveColumns, isMobile, isTablet, tileWidth]);

  const effectiveTileHeight = useMemo(() => {
    const ratio = tileHeight / tileWidth;
    return Math.round(effectiveTileWidth * ratio);
  }, [effectiveTileWidth, tileHeight, tileWidth]);

  const effectiveGap = useMemo(() => {
    if (isMobile) return Math.min(gap, 10);
    if (isTablet) return Math.min(gap, 14);
    return gap;
  }, [gap, isMobile, isTablet]);

  const effectiveLift = useMemo(() => {
    if (isMobile) return Math.min(lift, 36);
    return lift;
  }, [lift, isMobile]);

  const effectiveTilt = useMemo(() => {
    if (isMobile) return tilt * 0.72; // Gentler tilt on phones for great readability
    return tilt;
  }, [tilt, isMobile]);

  const effectiveTurn = useMemo(() => {
    if (isMobile) return turn * 0.72;
    return turn;
  }, [turn, isMobile]);

  const effectiveParallax = useMemo(() => {
    if (isMobile) return parallax * 0.75;
    return parallax;
  }, [parallax, isMobile]);

  const effectiveFade = useMemo(() => {
    if (isMobile) return Math.min(fade, 0.4); // Softer vignette edge on mobile so outer columns remain visible
    return fade;
  }, [fade, isMobile]);

  const effectiveScale = isMobile ? 1.06 : 1.18;

  const columnItems = useMemo(() => {
    const list = items && items.length > 0 ? items : DEFAULT_ITEMS;
    const cols = Array.from({ length: effectiveColumns }, () => []);
    list.forEach((item, i) => cols[i % effectiveColumns].push(item));
    return cols.map((col) => (col.length ? col : list.slice(0, 1)));
  }, [items, effectiveColumns]);

  const columnMeta = useMemo(() => {
    const unit = effectiveTileHeight + effectiveGap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(
        2,
        Math.ceil((containerDimensions.height * 1.6) / copyHeight) + 1
      );
      return { copyHeight, copies };
    });
  }, [columnItems, effectiveTileHeight, effectiveGap, containerDimensions.height]);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (meta, c) => meta.copyHeight * ((c * 0.37) % 1)
    );
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(${effectiveScale}) ` +
        `rotateX(${effectiveTilt + py}deg) rotateY(${effectiveTurn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [effectiveScale, effectiveTilt, effectiveTurn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = effectiveParallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta)
            el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    baseVelocities,
    columnMeta,
    pauseOnHover,
    effectiveParallax,
    reduced,
    applyPlaneTransform,
  ]);

  const activate = useCallback(
    (id, colIndex, item) => {
      activeIdRef.current = id;
      hoveredColRef.current = colIndex;
      setActiveId(id);
      if (onTileSelect && item) {
        onTileSelect(item);
      }
    },
    [onTileSelect]
  );

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
    if (onTileSelect) {
      onTileSelect(null);
    }
  }, [onTileSelect]);

  const handlePointerMove = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (effectiveParallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }

      // On mouse pointer, auto-detect hover
      if (e.pointerType !== "touch") {
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        const tile = hit && hit.closest ? hit.closest("[data-tile-id]") : null;
        if (!tile) {
          if (activeIdRef.current !== null) {
            release();
          }
          return;
        }
        const id = tile.dataset.tileId ?? null;
        if (id === activeIdRef.current) return;
        activeIdRef.current = id;
        hoveredColRef.current = Number(tile.dataset.col);
        setActiveId(id);
      }
    },
    [effectiveParallax, reduced, release]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  // Touch drag support for mobile: smoothly tilts 3D perspective without blocking vertical scroll
  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 1 && containerRef.current) {
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        pointerRef.current = {
          x: (touch.clientX - rect.left) / rect.width - 0.5,
          y: (touch.clientY - rect.top) / rect.height - 0.5,
        };
      }
    },
    []
  );

  const maskStyle = isMobile
    ? "radial-gradient(ellipse 92% 88% at 50% 50%, #000 var(--dw-edge), transparent 100%), " +
      "linear-gradient(to top, #000 var(--dw-edge), transparent 100%)"
    : "radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), " +
      "linear-gradient(to top, #000 var(--dw-edge), transparent 100%)";

  const cssVars = useMemo(
    () => ({
      "--dw-tile-w": `${effectiveTileWidth}px`,
      "--dw-tile-h": `${effectiveTileHeight}px`,
      "--dw-gap": `${effectiveGap}px`,
      "--dw-radius": `${radius}px`,
      "--dw-lift": `${effectiveLift}px`,
      "--dw-dim": isMobile ? Math.max(dim, 0.7) : dim,
      "--dw-gray": grayscale ? 1 : 0,
      "--dw-overlay": overlayColor,
      "--dw-edge": `${Math.max(0, (1 - effectiveFade) * 100)}%`,
      perspective: `${perspective}px`,
      perspectiveOrigin: "50% 50%",
      WebkitMaskImage: maskStyle,
      maskImage: maskStyle,
      WebkitMaskComposite: "source-in",
      maskComposite: "intersect",
      ...style,
    }),
    [
      effectiveTileWidth,
      effectiveTileHeight,
      effectiveGap,
      radius,
      effectiveLift,
      isMobile,
      dim,
      grayscale,
      overlayColor,
      effectiveFade,
      perspective,
      maskStyle,
      style,
    ]
  );

  const tileClass = cx(
    "driftwall-tile group/tile relative block flex-none cursor-pointer outline-none touch-manipulation",
    "w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]"
  );

  const innerClass = cx(
    "driftwall-inner pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0b0b12]",
    "rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]",
    "transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]",
    "group-[.is-active]/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]",
    "group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]",
    "group-focus-visible/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_2px_rgba(255,255,255,0.9)]"
  );

  const imgClass = cx(
    "driftwall-img block h-full w-full select-none object-cover",
    "[filter:grayscale(var(--dw-gray))_saturate(0.94)]",
    "transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.08)] group-focus-visible/tile:[filter:grayscale(0)_saturate(1.08)]"
  );

  const overlayClass = cx(
    "driftwall-overlay pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.38]",
    "transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:opacity-0 group-focus-visible/tile:opacity-0"
  );

  const renderTile = (item, id, colIndex) => {
    const isActive = activeId === id;
    const inner = (
      <span
        className={innerClass}
        style={
          isActive
            ? {
                opacity: 1,
                transform: `translateZ(${effectiveLift}px)`,
                boxShadow:
                  "0 20px 50px -15px rgba(0,0,0,0.85), 0 0 25px rgba(255,90,31,0.35)",
              }
            : undefined
        }
      >
        <img
          src={item.image}
          alt={item.title ?? "photo"}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={imgClass}
          style={
            isActive
              ? { filter: "grayscale(0) saturate(1.08)" }
              : undefined
          }
        />
        <span
          className={overlayClass}
          aria-hidden="true"
          style={isActive ? { opacity: 0 } : undefined}
        />

        {/* Title badge */}
        {item.title && (
          <span
            className={cx(
              "absolute bottom-0 inset-x-0 p-2 sm:p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent",
              "text-[10px] sm:text-xs font-hn tracking-wide text-[#efeee9] transition-opacity duration-300 pointer-events-none",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="block truncate font-medium">{item.title}</span>
          </span>
        )}

        {/* Mobile Spotlight Indicator icon */}
        {isActive && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f] animate-ping" />
        )}
      </span>
    );

    const commonProps = {
      className: cx(tileClass, isActive && "is-active"),
      "data-tile-id": id,
      "data-col": colIndex,
      onClick: () => {
        if (activeIdRef.current === id) {
          release();
        } else {
          activate(id, colIndex, item);
        }
      },
      onFocus: () => activate(id, colIndex, item),
      onBlur: release,
    };

    if (item.href) {
      return (
        <a
          key={id}
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          {...commonProps}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={item.title ?? "tile"}
        {...commonProps}
      >
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx(
        "relative h-full w-full overflow-hidden select-none touch-pan-y",
        className
      )}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta?.copies || 2 });
          return (
            <div
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              key={`col-${c}`}
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) =>
                    renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
