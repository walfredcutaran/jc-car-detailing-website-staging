"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
    id: string;
    name: string;
    street: string;
    address: string;
    email: string;
    phone: string;
    service: string;
    date: Date;
    time: string; // "HH:MM"
    notes?: string;
    status: "pending" | "confirmed" | "rejected"; // ✅ include rejected
};

type Toast = { id: string; message: string; tone: "success" | "danger" };

function toYMD(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function minutesFromHHMM(t: string) {
    const [h, m] = t.split(":").map((n) => Number(n));
    return (h || 0) * 60 + (m || 0);
}

function statusClass(status: Booking["status"]) {
    if (status === "confirmed")
        return "bg-green-500/10 text-green-300 ring-green-500/30";
    if (status === "rejected")
        return "bg-red-500/10 text-red-300 ring-red-500/30";
    return "bg-yellow-500/10 text-yellow-300 ring-yellow-500/30";
}

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
    // ✅ Local copy of bookings (staging updates only)
    const [rows, setRows] = useState<Booking[]>(bookings);

    // if parent sends new bookings, refresh local rows
    useEffect(() => setRows(bookings), [bookings]);

    // Pagination
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Filters
    const [status, setStatus] = useState<"all" | Booking["status"]>("all");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [timeFrom, setTimeFrom] = useState<string>("");
    const [timeTo, setTimeTo] = useState<string>("");
    const [q, setQ] = useState("");

    // ✅ Simple toast system
    const [toasts, setToasts] = useState<Toast[]>([]);

    function pushToast(message: string, tone: Toast["tone"]) {
        const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
        setToasts((prev) => [...prev, { id, message, tone }]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
    }

    function acceptBooking(id: string) {
        setRows((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b))
        );
        pushToast("Booking accepted (confirmed).", "success");
    }

    function rejectBooking(id: string) {
        setRows((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
        );
        pushToast("Booking rejected.", "danger");
    }

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        const fromOk = (b: Booking) => (!dateFrom ? true : toYMD(b.date) >= dateFrom);
        const toOk = (b: Booking) => (!dateTo ? true : toYMD(b.date) <= dateTo);

        const timeOk = (b: Booking) => {
            if (!timeFrom && !timeTo) return true;
            const t = minutesFromHHMM(b.time);
            if (timeFrom && t < minutesFromHHMM(timeFrom)) return false;
            if (timeTo && t > minutesFromHHMM(timeTo)) return false;
            return true;
        };

        return rows.filter((b) => {
            const matchStatus = status === "all" ? true : b.status === status;

            const matchQuery =
                query === ""
                    ? true
                    : [
                        b.name,
                        b.email,
                        b.phone,
                        b.street,
                        b.address,
                        b.service,
                        b.notes ?? "",
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(query);

            return matchStatus && matchQuery && fromOk(b) && toOk(b) && timeOk(b);
        });
    }, [rows, status, dateFrom, dateTo, timeFrom, timeTo, q]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    // reset page on filter changes
    useEffect(() => {
        setPage(1);
    }, [status, dateFrom, dateTo, timeFrom, timeTo, q]);

    return (
        <section className="relative mt-6 rounded-2xl border border-white/10 bg-gray-800/60 p-4 sm:p-6 shadow-sm backdrop-blur">
            {/* ✅ Toast container */}
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Bookings</h2>
                    <p className="text-sm text-gray-400">
                        Showing <span className="text-gray-200">{filtered.length}</span> of{" "}
                        <span className="text-gray-200">{rows.length}</span>
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Search</label>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Name, email, phone, notes…"
                            className="w-full sm:w-64 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-400/50"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Status</label>
                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as "all" | "pending" | "confirmed" | "rejected")
                            }
                            className="rounded-lg border border-white/10 
  bg-gray-900 text-white 
  px-3 py-2 text-sm 
  outline-none focus:ring-2 focus:ring-indigo-400/50
  [&>option]:bg-gray-900 
  [&>option]:text-white"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                        </select>

                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">From date</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400/50"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">To date</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400/50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">From time</label>
                            <input
                                type="time"
                                value={timeFrom}
                                onChange={(e) => setTimeFrom(e.target.value)}
                                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400/50"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">To time</label>
                            <input
                                type="time"
                                value={timeTo}
                                onChange={(e) => setTimeTo(e.target.value)}
                                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400/50"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setQ("");
                            setStatus("all");
                            setDateFrom("");
                            setDateTo("");
                            setTimeFrom("");
                            setTimeTo("");
                            setPage(1);
                            setRows(bookings); // optional: reset local staging changes too
                            pushToast("Filters reset.", "success");
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-100 hover:bg-white/10"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-white/5">
                            <Th>Name</Th>
                            <Th>Street</Th>
                            <Th>Address</Th>
                            <Th>Email</Th>
                            <Th>Phone</Th>
                            <Th>Service</Th>
                            <Th>Date</Th>
                            <Th>Time</Th>
                            <Th>Notes</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                        {paginated.map((b) => (
                            <tr key={b.id}>
                                <Td>{b.name}</Td>
                                <Td>{b.street}</Td>
                                <Td className="whitespace-pre-wrap">{b.address}</Td>
                                <Td>{b.email}</Td>
                                <Td>{b.phone}</Td>
                                <Td>{b.service}</Td>
                                <Td>{formatDate(b.date)}</Td>
                                <Td>{formatTime(b.time)}</Td>
                                <Td className="max-w-xs truncate" title={b.notes || ""}>
                                    {b.notes}
                                </Td>

                                <Td>
                                    <span
                                        className={[
                                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 capitalize",
                                            statusClass(b.status),
                                        ].join(" ")}
                                    >
                                        {b.status}
                                    </span>
                                </Td>

                                <Td>
                                    {b.status === "pending" ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => acceptBooking(b.id)}
                                                className="rounded-lg bg-green-500/20 px-3 py-1.5 text-xs font-semibold text-green-200 hover:bg-green-500/30"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => rejectBooking(b.id)}
                                                className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/30"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </Td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={11} className="px-3 py-6 text-center text-gray-400">
                                    No results. Try changing filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {filtered.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Page <span className="text-gray-200">{page}</span> of{" "}
                        <span className="text-gray-200">{totalPages}</span>
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Prev
                        </button>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

/* ---------- tiny helpers ---------- */
function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-3 py-2 text-left font-semibold text-gray-200">
            {children}
        </th>
    );
}
function Td({
    children,
    className = "",
    title,
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
}) {
    return (
        <td className={`px-3 py-2 text-gray-100 ${className}`} title={title}>
            {children}
        </td>
    );
}
function formatDate(d: Date) {
    return new Date(d).toLocaleDateString();
}
function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const date = new Date();
    date.setHours(h || 0, m || 0, 0, 0);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
