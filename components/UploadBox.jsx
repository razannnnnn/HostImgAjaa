// components/UploadBox.jsx
"use client";

import { useRef, useEffect, useCallback } from "react";

const ElectricBorder = ({
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  // Noise functions
  const random = useCallback((x) => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x, y) => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return (
        a * (1 - ux) * (1 - uy) +
        b * ux * (1 - uy) +
        c * (1 - ux) * uy +
        d * ux * uy
      );
    },
    [random],
  );

  const octavedNoise = useCallback(
    (
      x,
      octaves,
      lacunarity,
      gain,
      baseAmplitude,
      baseFrequency,
      time,
      seed,
      baseFlatness,
    ) => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i++) {
        let octaveAmplitude = amplitude;
        if (i === 0) {
          octaveAmplitude *= baseFlatness;
        }
        y +=
          octaveAmplitude *
          noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D],
  );

  const getCornerPoint = useCallback(
    (centerX, centerY, radius, startAngle, arcLength, progress) => {
      const angle = startAngle + progress * arcLength;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    },
    [],
  );

  const getRoundedRectPoint = useCallback(
    (t, left, top, width, height, radius) => {
      const straightWidth = width - 2 * radius;
      const straightHeight = height - 2 * radius;
      const cornerArc = (Math.PI * radius) / 2;
      const totalPerimeter =
        2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
      const distance = t * totalPerimeter;

      let accumulated = 0;

      // Top edge
      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + radius + progress * straightWidth, y: top };
      }
      accumulated += straightWidth;

      // Top-right corner
      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(
          left + width - radius,
          top + radius,
          radius,
          -Math.PI / 2,
          Math.PI / 2,
          progress,
        );
      }
      accumulated += cornerArc;

      // Right edge
      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left + width, y: top + radius + progress * straightHeight };
      }
      accumulated += straightHeight;

      // Bottom-right corner
      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(
          left + width - radius,
          top + height - radius,
          radius,
          0,
          Math.PI / 2,
          progress,
        );
      }
      accumulated += cornerArc;

      // Bottom edge
      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return {
          x: left + width - radius - progress * straightWidth,
          y: top + height,
        };
      }
      accumulated += straightWidth;

      // Bottom-left corner
      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(
          left + radius,
          top + height - radius,
          radius,
          Math.PI / 2,
          Math.PI / 2,
          progress,
        );
      }
      accumulated += cornerArc;

      // Left edge
      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return {
          x: left,
          y: top + height - radius - progress * straightHeight,
        };
      }
      accumulated += straightHeight;

      // Top-left corner
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(
        left + radius,
        top + radius,
        radius,
        Math.PI,
        Math.PI / 2,
        progress,
      );
    },
    [getCornerPoint],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = chaos;
    const frequency = 10;
    const baseFlatness = 0;
    const displacement = 60;
    const borderOffset = 60;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;

      // Use device pixel ratio for sharp rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateSize();

    const drawElectricBorder = (currentTime) => {
      if (!canvas || !ctx) return;

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      // Clear canvas
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const scale = displacement;
      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const maxRadius = Math.min(borderWidth, borderHeight) / 2;
      const radius = Math.min(borderRadius, maxRadius);

      const approximatePerimeter =
        2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;

        const point = getRoundedRectPoint(
          progress,
          left,
          top,
          borderWidth,
          borderHeight,
          radius,
        );

        const xNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          0,
          baseFlatness,
        );

        const yNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          1,
          baseFlatness,
        );

        const displacedX = point.x + xNoise * scale;
        const displacedY = point.y + yNoise * scale;

        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else {
          ctx.lineTo(displacedX, displacedY);
        }
      }

      ctx.closePath();
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);

    // Start animation
    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  const vars = {
    "--electric-border-color": color,
    borderRadius: borderRadius,
  };

  return (
    <div
      ref={containerRef}
      className={`electric-border ${className ?? ""}`}
      style={{ ...vars, ...style }}
    >
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
};

// ===== UPLOAD BOX =====
export default function UploadBox() {
  const fileInputRef = useRef(null);

  return (
    <div className="mx-auto mb-6 mt-6 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
      {/* Header Label */}
      <div className="mb-2 flex items-center justify-between"></div>

      {/* Electric Border wrapping Drop Zone */}
      <ElectricBorder
        color="#5c5fd6"
        speed={1}
        chaos={0.12}
        borderRadius={16}
        className="w-full"
      >
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer p-8 text-center transition-all duration-200 sm:p-10"
        >
          {/* Cloud Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
            <svg
              className="h-10 w-10 text-primary-400"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M36 30c3.3-1.2 5-4.2 5-7 0-4.4-3.6-8-8-8-.3 0-.6 0-.9.1C30.8 12.1 27.6 10 24 10c-5.5 0-10 4.5-10 10 0 .3 0 .6.1.9C11.2 21.8 9 24.7 9 28c0 3.9 3.1 7 7 7" />
              <path d="M20 33l4-4 4 4M24 29v10" />
            </svg>
          </div>

          <p className="text-title mb-1 text-base font-semibold">
            Seret & lepas gambarmu di sini
          </p>
          <p className="text-body mb-5 text-sm">
            atau klik tombol di bawah untuk{" "}
            <span className="text-primary-500">browse file</span>
          </p>

          <button
            type="button"
            className="btn variant-primary sz-sm mx-auto"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current.click();
            }}
          >
            <span>Pilih Gambar</span>
          </button>

          {/* Format Pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["PNG", "JPG", "WEBP", "GIF", "SVG"].map((fmt) => (
              <span
                key={fmt}
                className="rounded border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800"
              >
                {fmt}
              </span>
            ))}
          </div>

          {/* Divider + URL Input */}
          <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
            atau upload dari URL
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="https://contoh.com/gambar.png"
              className="input variant-mixed sz-sm flex-1 font-mono text-xs"
            />
            <button type="button" className="btn variant-ghost sz-sm">
              Upload URL
            </button>
          </div>

          {/* Info Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-blue-500">
              <svg
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
              Gratis selamanya
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-blue-500">
              <svg
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <rect x="2" y="5" width="8" height="6" rx="1" />
                <path d="M4 5V3.5a2 2 0 114 0V5" />
              </svg>
              Tidak perlu akun
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-blue-500">
              <svg
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="6" cy="6" r="4" />
                <path d="M6 4v2l1.5 1.5" />
              </svg>
              Link permanen
            </span>
          </div>
        </div>
      </ElectricBorder>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
