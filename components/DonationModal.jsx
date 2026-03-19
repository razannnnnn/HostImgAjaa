"use client";

import { useEffect, useState } from "react";

export default function DonationModal({ isOpen, onClose }) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setVisible(false), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        transition: "all 400ms ease",
        backgroundColor: animate ? "rgba(3,7,18,0.6)" : "transparent",
        backdropFilter: animate ? "blur(12px)" : "blur(0px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card variant-outlined mx-auto w-full max-w-sm"
        style={{
          transition: "all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: animate ? 1 : 0,
          transform: animate
            ? "translateY(0) scale(1)"
            : "translateY(64px) scale(0.95)",
        }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-title text-base font-semibold">
            Dukung Pengembang
          </h2>
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

        {/* Saweria Card */}
        <div className="card variant-soft mb-5 flex items-center gap-4 rounded-xl p-4">
          <img
            src="https://saweria.co/favicon.ico"
            className="h-10 w-10 rounded-lg"
            alt="Saweria"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div>
            <p className="text-title text-sm font-medium">Saweria</p>
            <p className="text-body text-xs">saweria.co/razn</p>
          </div>
        </div>

        <p className="text-body mb-5 text-center text-sm leading-relaxed">
          Bantu kami tetap gratis untuk semua orang.
          <br />
          Setiap donasi sekecil apapun sangat berarti ❤
        </p>

        {/* CTA */}
        <a
          href="https://saweria.co/razn"
          target="_blank"
          className="btn variant-primary sz-md w-full"
          onClick={onClose}
        >
          <svg
            className="size-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M8 14s-6-3.8-6-7.5a3.5 3.5 0 017 0 3.5 3.5 0 017 0C16 10.2 8 14 8 14z"
              fill="currentColor"
              opacity="0.15"
            />
            <path d="M8 14s-6-3.8-6-7.5a3.5 3.5 0 017 0 3.5 3.5 0 017 0C16 10.2 8 14 8 14z" />
          </svg>
          <span>Donasi via Saweria</span>
        </a>

        <p className="mt-3 text-center text-xs text-gray-400">
          Kamu akan diarahkan ke halaman Saweria
        </p>
      </div>
    </div>
  );
}
