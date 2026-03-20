import Link from "next/link";

export default function DeleteSuccess({ searchParams }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card variant-outlined w-full max-w-sm text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/15">
          <svg
            className="h-8 w-8 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </div>

        <h1 className="text-title mb-2 text-lg font-semibold">
          Gambar Berhasil Dihapus
        </h1>
        <p className="text-body mb-2 text-sm">
          Gambar telah dihapus secara permanen dari server kami.
        </p>

        <div className="flex flex-col gap-2">
          <Link href="/upload" className="btn variant-primary sz-md w-full">
            <svg
              className="size-4"
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
