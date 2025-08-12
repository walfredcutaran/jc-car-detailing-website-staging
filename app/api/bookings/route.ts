import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const booking = await prisma.booking.create({
      data: {
        name: body.name,
        street: body.street,
        address: body.address,
        email: body.email,
        phone: body.phone,
        service: body.service,
        date: new Date(body.date),
        time: body.time,
        notes: body.notes,
      },
    });

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
