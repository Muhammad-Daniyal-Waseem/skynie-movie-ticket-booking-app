import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const body = await req.json();

    const { show_id, user_id, total_amount, seats } = body;

    if (!show_id || !user_id || !Array.isArray(seats) || seats.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Get seat IDs from row_label + seat_number
    const { data: seatRows, error: seatError } = await supabase
      .from("seats")
      .select("id, row_label, seat_number")
      .in(
        "row_label",
        seats.map((s) => s.row_label)
      );

    if (seatError) throw seatError;

    const seatMap = new Map(
      seatRows.map((s) => [`${s.row_label}-${s.seat_number}`, s.id])
    );

    const seatIds = seats.map((s) => {
      const key = `${s.row_label}-${s.seat_number}`;
      const id = seatMap.get(key);
      if (!id) throw new Error(`Seat not found: ${key}`);
      return id;
    });

    // 2. Check already booked seats for this show
    const { data: existing, error: checkError } = await supabase
      .from("bookings")
      .select(`
        id,
        booked_seats(seat_id)
      `)
      .eq("show_id", show_id);

    if (checkError) throw checkError;

    const alreadyBooked = new Set(
      (existing || [])
        .flatMap((b) => b.booked_seats.map((s: any) => s.seat_id))
    );

    const conflict = seatIds.find((id) => alreadyBooked.has(id));

    if (conflict) {
      return new Response(
        JSON.stringify({ error: "Some seats already booked" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        show_id,
        user_id,
        total_amount,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. Insert booked seats
    const bookedSeatRows = seatIds.map((seat_id) => ({
      booking_id: booking.id,
      seat_id,
    }));

    const { error: seatInsertError } = await supabase
      .from("booked_seats")
      .insert(bookedSeatRows);

    if (seatInsertError) throw seatInsertError;

    return new Response(
      JSON.stringify({
        success: true,
        booking_id: booking.id,
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Booking failed",
        details: String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});