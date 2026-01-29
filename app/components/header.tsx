"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-950/70 backdrop-blur border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="sr-only">JuCee Detailing Service</span>

            {/* simple badge */}
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm font-semibold text-white">J</span>
              <span className="text-sm font-semibold text-white">C</span>
            </span>
            <span className="text-sm font-semibold text-white">
              JuCee Detailing Service
            </span>
          </Link>
          <span className="inline-flex items-center rounded-full border border-yellow-500/25 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">
            STAGING
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/admin"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            Admin
          </Link>
        </div>

        {/* Mobile button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:bg-white/5"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-950 p-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <span className="text-sm font-semibold text-white">J</span>
              </span>
              <span className="text-sm font-semibold text-white">
                JuCee Detailing
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:bg-white/5"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-8">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow hover:bg-indigo-400"
            >
              Go to Admin
            </Link>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
