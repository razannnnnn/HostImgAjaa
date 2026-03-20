"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
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
                {session ? (
                  <div className="relative">
                    {/* Options Button */}
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="btn variant-outlined sz-sm flex items-center gap-2"
                    >
                      <span>Account</span>
                      <svg
                        className={`size-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M2 4l4 4 4-4" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <>
                        <div className="card variant-outlined absolute right-0 top-11 z-20 w-56 shadow-lg">
                          {/* Signed in as */}
                          <div className="mb-1 border-b border-gray-200 pb-3 dark:border-gray-800">
                            <p className="text-body px-1 text-xs">
                              Signed in as
                            </p>
                            <p className="text-title truncate px-1 text-sm font-semibold">
                              {session.user.email}
                            </p>
                          </div>

                          {/* Menu */}
                          <div className="space-y-0.5 py-1">
                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                router.push("/account");
                              }}
                              className="text-body flex w-full items-center rounded-lg px-1 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              Account settings
                            </button>
                          </div>

                          {/* Sign out */}
                          <div className="border-gray-200 dark:border-gray-800">
                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                signOut();
                              }}
                              className="text-body flex w-full items-center rounded-lg px-1 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthTab("login");
                        setAuthOpen(true);
                      }}
                      className="btn variant-neutral sz-sm"
                    >
                      <span className="btn-label">Login</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}
