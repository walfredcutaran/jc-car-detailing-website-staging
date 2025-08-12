import React from "react";

// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <a href="#" className="-m-1.5 p-1.5 inline-flex items-center">
            <span className="sr-only">JuCee Detailing Service</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
            <span className="ml-3 text-sm/6 font-semibold text-white">
              JuCee Detailing Service
            </span>
          </a>

          <nav className="flex items-center gap-x-8">
            <a
              href="#services"
              className="text-sm/6 font-semibold text-white hover:text-gray-300"
            >
              Services
            </a>
            <a
              href="#book"
              className="text-sm/6 font-semibold text-white hover:text-gray-300"
            >
              Book Now
            </a>
            <a
              href="#contact"
              className="text-sm/6 font-semibold text-white hover:text-gray-300"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="border-t border-white/10 py-6">
          <p className="text-center text-xs/6 text-gray-400">
            © {new Date().getFullYear()} JuCee Detailing Service. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
