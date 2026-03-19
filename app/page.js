"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationModal from "@/components/DonationModal";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Analytics />
      <Navbar />
      <main className="flex-1 overflow-hidden pt-24 lg:pt-28">
        <section className="relative">
          <div className="relative z-10">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                {/* Annonce Badge */}
                <a
                  href="/"
                  className="annonce variant-outlined sz-sm group mx-auto w-fit gap-2 border-white/20 bg-white/10 backdrop-blur-3xl dark:bg-white/5"
                >
                  <span className="text-title ml-4 line-clamp-1 text-nowrap text-sm">
                    Hosting Image Free With HostImgAjaa
                  </span>
                  <div className="ml-4 flex scale-75 items-center -space-x-3 transition-transform duration-300 group-hover:-translate-x-1">
                    <span className="h-[1.5px] w-2.5 origin-left -translate-x-px translate-y-[-0.3px] scale-x-0 rounded bg-gray-950 opacity-0 transition duration-300 group-hover:scale-x-100 group-hover:opacity-100 dark:bg-white"></span>
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 -translate-x-2 text-gray-950 transition duration-300 group-hover:translate-x-px dark:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </a>

                {/* Hero Title */}
                <h1 className="text-title mt-8 text-wrap text-4xl font-semibold uppercase md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                  Upload, Simpan, dan Bagikan Gambar dengan Mudah
                </h1>

                {/* Hero Description */}
                <p className="text-body mx-auto mt-8 max-w-2xl text-wrap text-lg">
                  HostImgAja memudahkan kamu mengunggah, menyimpan, dan
                  membagikan gambar secara cepat. Cukup upload gambarmu, dan
                  langsung dapatkan link yang bisa dibagikan ke mana saja.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {/* Mulai Upload */}
                  <Link href="/upload" className="btn variant-primary sz-lg">
                    <svg
                      className="size-5"
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
                    <span className="btn-label">Mulai Upload</span>
                  </Link>

                  {/* Support Developer */}
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="btn variant-outlined sz-lg"
                  >
                    <svg
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M10 17s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z"
                        fill="currentColor"
                        opacity="0.15"
                      />
                      <path d="M10 17s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z" />
                    </svg>
                    <span className="btn-label">Support Developer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
