// components/Navbar.jsx
"use client";

import { useState } from "react";

export default function Navbar() {
  return (
    <header>
      <nav className="fixed z-20 w-full border-b bg-white/50 backdrop-blur-2xl dark:bg-gray-950/50">
        <div className="m-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Brand */}
            <a href="/" aria-label="logo">
              <h1 className="text-title text-2xl font-bold">HostImgAjaa</h1>
            </a>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <button className="btn variant-ghost sz-sm">
                <span className="btn-label">Login</span>
              </button>
              <button className="btn variant-neutral sz-sm">
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
