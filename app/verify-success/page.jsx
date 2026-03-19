import Link from "next/link";

export default function VerifySuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card variant-outlined w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <svg
            className="h-7 w-7 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-title mb-2 text-lg font-semibold">
          Email Terverifikasi!
        </h1>
        <p className="text-body mb-6 text-sm">
          Email kamu sudah berhasil diverifikasi. Sekarang kamu bisa login.
        </p>
        <Link href="/" className="btn variant-primary sz-md w-full">
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
