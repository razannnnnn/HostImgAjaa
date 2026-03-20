import Link from "next/link";

export default function DeleteFailed() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card variant-outlined w-full max-w-sm text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-danger-500/20 bg-danger-500/15">
          <svg
            className="h-8 w-8 text-danger-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <h1 className="text-title mb-2 text-lg font-semibold">
          Penghapusan Gagal
        </h1>
        <p className="text-body mb-6 text-sm">
          Gambar tidak ditemukan atau kode penghapusan tidak valid. Mungkin
          gambar sudah dihapus sebelumnya.
        </p>

        <div className="flex flex-col gap-2">
          <Link href="/upload" className="btn variant-primary sz-md w-full">
            <span>Upload Gambar Baru</span>
          </Link>
          <Link href="/" className="btn variant-ghost sz-md w-full">
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
