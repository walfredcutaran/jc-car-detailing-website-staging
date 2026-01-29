import BookingsTable from "./BookingsTable";
import { staticBookings } from "./staticBookings"; // or wherever you keep it

export default async function AdminPage() {
  const bookings = staticBookings.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10 text-white">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">
        Welcome! Here you can view bookings.
      </p>

      <BookingsTable bookings={bookings} />
    </main>
  );
}
