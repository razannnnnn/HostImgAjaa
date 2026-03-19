// app/upload/page.jsx

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadBox from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden pt-24 lg:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-8 text-center">
            <h1 className="text-title text-3xl font-semibold md:text-4xl">
              Upload Gambar
            </h1>
            <p className="text-body mt-1 text-sm">
              Upload gambarmu dan dapatkan link permanen secara gratis
            </p>
          </div>
          <UploadBox />
        </div>
      </main>
      <Footer />
    </>
  );
}
