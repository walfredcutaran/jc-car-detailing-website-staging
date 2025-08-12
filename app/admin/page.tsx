// app/admin/page.tsx
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: "desc" },
  });

  // Server action to update booking status
  async function confirmBooking(id: string) {
    "use server";
    await prisma.booking.update({
      where: { id },
      data: { status: "confirmed" },
    });
    revalidatePath("/admin");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">
        Welcome! Here you can view bookings.
      </p>

      <section className="mt-6 rounded-2xl border border-white/10 bg-gray-800/60 p-4 sm:p-6 shadow-sm backdrop-blur">
        <h2 className="text-lg font-semibold">Bookings</h2>

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
              {bookings.map((b) => (
                <tr key={b.id} className="">
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
                        b.status === "confirmed"
                          ? "bg-green-500/10 text-green-300 ring-green-500/30"
                          : "bg-yellow-500/10 text-yellow-300 ring-yellow-500/30",
                      ].join(" ")}
                    >
                      {b.status}
                    </span>
                  </Td>
                  <Td>
                    {b.status !== "confirmed" && (
                      <form action={confirmBooking.bind(null, b.id)}>
                        <button
                          type="submit"
                          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                          Confirm
                        </button>
                      </form>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* ---------- tiny helpers to keep markup clean ---------- */
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
