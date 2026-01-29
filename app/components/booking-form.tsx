"use client";

import { useEffect, useRef, useState } from "react";

type LQSuggestion = {
  display_place?: string;
  display_address?: string;
  display_name: string;
  lat: string;
  lon: string;
};

type Toast = { id: string; message: string; tone: "success" | "danger" };

// ✅ Set to true only if you WANT the LocationIQ API call
const ENABLE_ADDRESS_AUTOCOMPLETE = false;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayYMDLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function minutesFromHHMM(t: string) {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    address: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const minDate = todayYMDLocal();

  // ✅ Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  function pushToast(message: string, tone: Toast["tone"]) {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }

  // Autocomplete state
  const [results, setResults] = useState<LQSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceId = useRef<number | null>(null);

  useEffect(() => {
    if (!ENABLE_ADDRESS_AUTOCOMPLETE) return;

    if (debounceId.current) window.clearTimeout(debounceId.current);

    const q = formData.address;

    if (!q || q.trim().length < 6) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceId.current = window.setTimeout(async () => {
      try {
        const data = await fetchLocationIq(q);
        setResults(data || []);
        setOpen((data?.length ?? 0) > 0);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (debounceId.current) window.clearTimeout(debounceId.current);
    };
  }, [formData.address]);

  const selectSuggestion = (s: LQSuggestion) => {
    setFormData((prev) => ({ ...prev, address: s.display_name }));
    setResults([]);
    setOpen(false);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "address" && !ENABLE_ADDRESS_AUTOCOMPLETE) {
      setResults([]);
      setOpen(false);
    }

    if (name === "address" && ENABLE_ADDRESS_AUTOCOMPLETE) {
      if (value.length <= 2) {
        setResults([]);
        setOpen(false);
      }
    }
  };

  async function fetchLocationIq(q: string) {
    const key = process.env.NEXT_PUBLIC_LOCATION_IQ_API_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_LOCATION_IQ_API_KEY");

    const url = new URL("https://us1.locationiq.com/v1/autocomplete");
    url.search = new URLSearchParams({
      key,
      q: q.trim(),
      limit: "5",
      countrycodes: "us",
      dedupe: "1",
    }).toString();

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    return res.json();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) return pushToast("Name is required.", "danger");
    if (!formData.address.trim())
      return pushToast("Address is required.", "danger");
    if (!formData.email.trim())
      return pushToast("Email is required.", "danger");
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      return pushToast("Please enter a valid email.", "danger");
    if (!formData.phone.trim())
      return pushToast("Phone is required.", "danger");
    if (!formData.service.trim())
      return pushToast("Please select a service.", "danger");
    if (!formData.date) return pushToast("Date is required.", "danger");
    if (!formData.time) return pushToast("Time is required.", "danger");

    // ✅ Date cannot be in the past
    if (formData.date < minDate) {
      return pushToast("Please choose a date from today onward.", "danger");
    }

    // ✅ Optional (recommended): if booking is today, time must not be in the past
    if (formData.date === minDate) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const chosenMinutes = minutesFromHHMM(formData.time);
      if (chosenMinutes < nowMinutes) {
        return pushToast("Please choose a time later today.", "danger");
      }
    }

    // staging payload (not sent anywhere)
    const payload = {
      ...formData,
      time: formData.time.length === 5 ? `${formData.time}:00` : formData.time,
    };

    console.log("STAGING BOOKING (not saved):", payload);

    pushToast("Booking submitted! We’ll confirm by email or phone.", "success");

    setFormData({
      name: "",
      street: "",
      address: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      notes: "",
    });

    setResults([]);
    setOpen(false);
  };

  return (
    <>
      {/* Toast container */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[320px] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur",
              t.tone === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-200"
                : "border-red-500/30 bg-red-500/10 text-red-200",
            ].join(" ")}
          >
            {t.message}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-gray-800/60 p-6 shadow-sm backdrop-blur"
      >
        <h2 className="text-2xl font-semibold text-white">Book Your Service</h2>
        <p className="mt-1 text-sm text-gray-400">
          We’ll confirm by email or phone.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleFieldChange}
              required
              className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white placeholder-gray-400 outline-none ring-0 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Full name"
            />
          </div>

          {/* Street */}
          <div>
            <label
              htmlFor="street"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Street
            </label>
            <input
              id="street"
              name="street"
              type="text"
              value={formData.street}
              onChange={handleFieldChange}
              placeholder="Street / House no. (optional)"
              className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleFieldChange}
              onFocus={() =>
                ENABLE_ADDRESS_AUTOCOMPLETE && results.length > 0 && setOpen(true)
              }
              onBlur={() =>
                ENABLE_ADDRESS_AUTOCOMPLETE && setTimeout(() => setOpen(false), 150)
              }
              required
              placeholder="Start typing address…"
              className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
              aria-autocomplete={ENABLE_ADDRESS_AUTOCOMPLETE ? "list" : "none"}
              aria-controls={
                ENABLE_ADDRESS_AUTOCOMPLETE ? "address-suggestions" : undefined
              }
              aria-expanded={ENABLE_ADDRESS_AUTOCOMPLETE ? open : undefined}
            />

            {ENABLE_ADDRESS_AUTOCOMPLETE && open && results.length > 0 && (
              <ul
                id="address-suggestions"
                role="listbox"
                className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-white/10 bg-gray-900 shadow-lg"
              >
                {results.map((r, i) => (
                  <li
                    key={`${r.display_name}-${i}`}
                    role="option"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(r)}
                    className="cursor-pointer px-3 py-2 hover:bg-white/5"
                  >
                    <div className="text-sm text-white">
                      {r.display_place || r.display_name}
                    </div>
                    {r.display_address && (
                      <div className="text-xs text-gray-400">
                        {r.display_address}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFieldChange}
              required
              className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleFieldChange}
              required
              className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
              placeholder="(555) 123-4567"
            />
          </div>
          {/* Gloss sweep animation */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-full top-0 h-full w-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl animate-[gloss_12s_ease-in-out_infinite]" />
          </div>

          {/* Service */}
          <div>
            <label
              htmlFor="service"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Service
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleFieldChange}
              required
              className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="">Select a service</option>
              <option value="Exterior Wash">Exterior Wash</option>
              <option value="Interior Detail">Interior Detail</option>
              <option value="Full Detail">Full Detail</option>
              <option value="Engine Bay Clean">Engine Bay Clean</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFieldChange}
                required
                min={minDate} // ✅ prevents selecting past dates in the UI
                className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                step="60"
                value={formData.time}
                onChange={handleFieldChange}
                required
                min={
                  formData.date === minDate
                    ? `${pad2(new Date().getHours())}:${pad2(new Date().getMinutes())}`
                    : undefined
                }
                className="block w-full rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
              />

            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Additional Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleFieldChange}
              rows={4}
              placeholder="Any special requests, gate codes, pets, etc."
              className="block w-full resize-y rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 active:bg-indigo-600"
          >
            Book Now
          </button>
        </div>
      </form>
    </>
  );
}
