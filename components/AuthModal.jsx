"use client";

import { useToast } from "@/components/ToastProvider";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const { showToast } = useToast();

  const [tab, setTab] = useState(defaultTab);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setConfirmPassword(""); // ← tambah ini
  }, [tab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!visible) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      onClose();
      showToast("Login berhasil!");
    }

    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ← tambah validasi ini
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        showToast("Akun berhasil dibuat! Silakan login.");
        setTimeout(() => setTab("login"), 1500);
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title text-base font-semibold">
            {tab === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
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

        {/* Tab Switch */}
        <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all duration-200 ${
              tab === "login"
                ? "text-title bg-white shadow-sm dark:bg-gray-700"
                : "text-body hover:text-title"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all duration-200 ${
              tab === "register"
                ? "text-title bg-white shadow-sm dark:bg-gray-700"
                : "text-body hover:text-title"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={tab === "login" ? handleLogin : handleRegister}>
          <div className="mb-5 space-y-3">
            <div>
              <label className="text-body mb-1.5 block text-xs font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="input variant-mixed sz-md w-full"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-body mb-1.5 block text-xs font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input variant-mixed sz-md w-full"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            {/* ← tambah ini */}
            {tab === "register" && (
              <div>
                <label className="text-body mb-1.5 block text-xs font-medium">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input variant-mixed sz-md w-full"
                  required
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-danger-500/20 bg-danger-500/10 p-3">
              <p className="text-xs text-danger-400">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-400">{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn variant-primary sz-md w-full"
          >
            {loading ? (
              <>
                <svg
                  className="size-4 animate-spin"
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
                <span>{tab === "login" ? "Masuk..." : "Mendaftar..."}</span>
              </>
            ) : (
              <span>{tab === "login" ? "Masuk" : "Daftar"}</span>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          {tab === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => setTab("register")}
                className="text-primary-500 transition-colors hover:text-primary-400"
              >
                Daftar sekarang
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => setTab("login")}
                className="text-primary-500 transition-colors hover:text-primary-400"
              >
                Masuk
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
