"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useToast } from "@/components/ToastProvider";

// ===== ELECTRIC BORDER =====
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
        if (i === 0) octaveAmplitude *= baseFlatness;
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

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + radius + progress * straightWidth, y: top };
      }
      accumulated += straightWidth;

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

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left + width, y: top + radius + progress * straightHeight };
      }
      accumulated += straightHeight;

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

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return {
          x: left + width - radius - progress * straightWidth,
          y: top + height,
        };
      }
      accumulated += straightWidth;

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

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return {
          x: left,
          y: top + height - radius - progress * straightHeight,
        };
      }
      accumulated += straightHeight;

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
        if (i === 0) ctx.moveTo(displacedX, displacedY);
        else ctx.lineTo(displacedX, displacedY);
      }
      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);
    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  return (
    <div
      ref={containerRef}
      className={`electric-border ${className ?? ""}`}
      style={{ "--electric-border-color": color, borderRadius, ...style }}
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

// ===== RESULT MODAL =====
const ResultModal = ({ isOpen, onClose, result }) => {
  const { showToast } = useToast();

  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedDelete, setCopiedDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setVisible(false), 400);
    }
  }, [isOpen]);

  if (!visible) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(result?.url || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteUrl = `${window.location.origin}/api/delete/${result?.deleteCode}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        transition: "all 400ms ease",
        backgroundColor: animate ? "rgba(3,7,18,0.7)" : "transparent",
        backdropFilter: animate ? "blur(12px)" : "blur(0px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card variant-outlined mx-auto w-full max-w-sm"
        style={{
          transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: animate ? 1 : 0,
          transform: animate
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.95)",
        }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow shadow-emerald-400"></span>
            <h2 className="text-title text-base font-semibold">
              Upload Berhasil!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn variant-ghost icon-only sz-sm"
          >
            <svg
              className="size-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* URL Gambar */}
        <div className="mb-4">
          <p className="text-body mb-2 text-xs font-medium uppercase tracking-widest">
            Link Gambar
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
            <span className="flex-1 truncate font-mono text-xs text-primary-500">
              {result?.url}
            </span>
            <button
              onClick={handleCopyUrl}
              className="btn variant-ghost sz-xs shrink-0"
            >
              <span>{copied ? "Tersalin!" : "Salin"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          <a
            href={result?.url}
            target="_blank"
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-transparent bg-gray-100 p-3 transition-all duration-200 dark:bg-gray-800"
          >
            <svg
              className="h-4 w-4 text-primary-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 3h3v3M13 3l-6 6M6 4H3v9h9v-3" />
            </svg>
            <span className="text-body text-xs font-medium">Buka</span>
          </a>

          <button
            onClick={() =>
              navigator.clipboard.writeText(`![image](${result?.url})`)
            }
            className="flex flex-col items-center gap-1.5 rounded-xl border border-transparent bg-gray-100 p-3 transition-all duration-200 dark:bg-gray-800"
          >
            <svg
              className="h-4 w-4 text-primary-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="9" height="9" rx="1.5" />
              <path d="M5 5V3.5A1.5 1.5 0 016.5 2h6A1.5 1.5 0 0114 3.5v6A1.5 1.5 0 0112.5 11H11" />
            </svg>
            <span className="text-body text-xs font-medium">Markdown</span>
          </button>

          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `<img src="${result?.url}" alt="image" />`,
              )
            }
            className="flex flex-col items-center gap-1.5 rounded-xl border border-transparent bg-gray-100 p-3 transition-all duration-200 dark:bg-gray-800"
          >
            <svg
              className="h-4 w-4 text-primary-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 4L2 8l3 4M11 4l3 4-3 4M8 3l-1.5 10" />
            </svg>
            <span className="text-body text-xs font-medium">HTML</span>
          </button>
        </div>

        {/* Delete URL */}
        <div className="card variant-soft rounded-xl p-3">
          <p className="text-body mb-1 text-xs font-medium uppercase tracking-widest">
            Link Penghapusan
          </p>
          <p className="mb-2 text-xs text-gray-400">
            Akses link ini untuk menghapus gambar secara permanen
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 dark:bg-gray-700">
            <span className="flex-1 truncate font-mono text-xs text-danger-400">
              {deleteUrl}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(deleteUrl);
                setCopiedDelete(true);
                setTimeout(() => setCopiedDelete(false), 2000);
              }}
              className="btn variant-ghost sz-xs shrink-0"
            >
              <span>{copiedDelete ? "Tersalin!" : "Salin"}</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Gambar dapat diakses kapan saja melalui link di atas
        </p>
      </div>
    </div>
  );
};

// ===== UPLOAD BOX =====
export default function UploadBox() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleUpload = async (file) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.limitReached) {
          showToast("Limit Harian Anda Sudah Tercapai", "error");
        } else {
          showToast(data.error || "Terjadi kesalahan saat upload", "error");
        }
        return;
      }
      setResult(data);
      setModalOpen(true);
    } catch {
      showToast("Terjadi kesalahan koneksi", "error"); // ← ganti ini
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim()) return;
    setError(null);
    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.limitReached) {
          showToast("Limit Harian Anda Sudah Tercapai", "error");
        } else {
          showToast(data.error || "Terjadi kesalahan saat upload", "error");
        }
        return;
      }
      setResult(data);
      setModalOpen(true);
      setUrlInput("");
    } catch {
      showToast("Terjadi kesalahan koneksi", "error"); // ← ganti ini
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <>
      <div className="mx-auto mb-8 mt-6 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
        {/* Header Label */}
        <div className="mb-2 flex items-center justify-between"></div>

        {/* Electric Border */}
        <ElectricBorder
          color="#5c5fd6"
          speed={1}
          chaos={0.12}
          borderRadius={16}
          className="w-full"
        >
          <div
            onClick={() => !uploading && fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl p-8 text-center transition-all duration-200 sm:p-10 ${
              dragOver ? "bg-primary-500/10" : " dark:bg-gray-900"
            } ${uploading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {/* Cloud Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              {uploading ? (
                <svg
                  className="h-10 w-10 animate-spin text-primary-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
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
              )}
            </div>

            <p className="text-title mb-1 text-base font-semibold">
              {uploading
                ? "Sedang mengupload..."
                : "Seret & lepas gambarmu di sini"}
            </p>
            <p className="text-body mb-5 text-sm">
              {uploading ? (
                "Mohon tunggu sebentar"
              ) : (
                <>
                  atau klik untuk{" "}
                  <span className="text-primary-500">browse file</span>
                </>
              )}
            </p>

            {!uploading && (
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
            )}

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
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlUpload()}
                placeholder="https://contoh.com/gambar.png"
                className="input variant-mixed sz-sm flex-1 font-mono text-xs"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={handleUrlUpload}
                disabled={uploading || !urlInput.trim()}
                className="btn variant-ghost sz-sm"
              >
                {uploading ? "..." : "Upload URL"}
              </button>
            </div>

            {/* Info Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
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
                  <circle cx="6" cy="6" r="4" />
                  <path d="M6 4v2l1.5 1.5" />
                </svg>
                Link permanen
              </span>
            </div>
          </div>
        </ElectricBorder>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Result Modal */}
      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={result}
      />
    </>
  );
}
