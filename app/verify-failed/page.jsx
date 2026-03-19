import Link from "next/link";

export default function VerifyFailed() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card variant-outlined w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-500/15">
          <svg
            className="h-7 w-7 text-danger-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-title mb-2 text-lg font-semibold">
          Verifikasi Gagal
        </h1>
        <p className="text-body mb-6 text-sm">
          Link verifikasi tidak valid atau sudah kadaluarsa. Silakan daftar
          ulang.
        </p>
        <Link href="/" className="btn variant-outlined sz-md w-full">
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
