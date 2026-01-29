"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gray-950/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <span className="text-sm font-semibold text-white">JC</span>
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  JuCee Detailing Service
                </span>
                <span className="text-xs text-gray-400">
                  Staging build • Static demo for UI testing
                </span>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-6 text-gray-300">
              Premium detailing experience — built for speed, clarity, and a clean
              booking flow.
            </p>

            {/* “chips” */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
                Mobile detailing
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
                Ceramic-safe products
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
                Quick turnaround
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Navigation">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/admin">Admin</FooterLink>
            </FooterCol>


            <FooterCol title="Social">
              <FooterLink href="#">Instagram</FooterLink>
              <FooterLink href="#">Facebook</FooterLink>
              <FooterLink href="#">TikTok</FooterLink>
            </FooterCol>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            <strong>DISCLAIMER:</strong> This is a staging environment. All data displayed is simulated for testing and demonstration purposes only and does not represent real customers, bookings, or transactions.

          </p>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-yellow-500/25 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">
              STAGING
            </span>
            <span className="text-xs text-gray-500">
              This build uses static demo data.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={href}
        className="text-sm text-gray-300 hover:text-white transition"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="text-sm text-gray-300 hover:text-white transition">
      {children}
    </Link>
  );
}
