// components/Footer.jsx

export default function Footer() {
  return (
    <footer className="mt-10 border-t">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Kiri */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="text-body text-sm">
              © {new Date().getFullYear()}{" "}
              <span className="text-title font-medium">HostImgAjaa</span>
            </span>
            <span className="hidden h-3 w-px bg-gray-300 sm:block dark:bg-gray-700"></span>
            <span className="text-body text-xs">Made with ❤ by Razan</span>
            <span className="hidden h-3 w-px bg-gray-300 sm:block dark:bg-gray-700"></span>
            <a
              href="https://saweria.co/razn"
              target="_blank"
              className="text-xs text-primary-500 transition-colors hover:text-primary-400"
            >
              Support ☕
            </a>
          </div>

          {/* Kanan */}
          <div className="flex items-center gap-3">
            <span className="text-body font-mono text-xs">v1.0.0</span>
            <span className="h-3 w-px bg-gray-300 dark:bg-gray-700"></span>
            <span className="badge variant-success sz-sm">
              <svg
                className="size-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4"
                  fill="currentColor"
                  opacity="0.2"
                  stroke="none"
                />
                <circle cx="6" cy="6" r="4" />
              </svg>
              Semua sistem normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
