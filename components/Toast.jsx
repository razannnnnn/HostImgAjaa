"use client";

import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
    const timer = setTimeout(() => {
      setAnimate(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: (
      <svg
        className="size-4 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="6" className="fill-emerald-500/20" />
        <path d="M5 8l2 2 4-4" />
      </svg>
    ),
    error: (
      <svg
        className="size-4 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="6" className="fill-danger-500/20" />
        <path d="M5 5l6 6M11 5l-6 6" />
      </svg>
    ),
  };

  const colors = {
    success: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    error: "text-danger-400 border-danger-500/20 bg-danger-500/10",
  };

  return (
    <div
      className="fixed left-1/2 top-6 z-[100]"
      style={{
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: animate ? 1 : 0,
        transform: animate
          ? "translateX(-50%) translateY(0) scale(1)"
          : "translateX(-50%) translateY(16px) scale(0.95)",
      }}
    >
      <div
        className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 backdrop-blur-md ${colors[type]}`}
      >
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
