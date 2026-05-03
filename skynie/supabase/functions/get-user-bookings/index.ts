import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

type BookingRow = {
  id: string;
  created_at: string | null;
  total_amount: number | null;
  shows: {
    start_time: string;
    base_price_usd: number | null;
    movies: {
      title: string;
      poster_url: string | null;
      classification: string | null;
    } | null;
    halls: {
      hall_name: string;
      hall_type: string | null;
      cinemas: {
        name: string;
        address: string | null;
      } | null;
    } | null;
  } | null;
  booked_seats: Array<{
    seats: {
      id: string;
      row_label: string;
      seat_number: number;
    } | null;
  }> | null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const authHeader = req.headers.get('Authorization');

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: 'Missing Supabase function environment variables.' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!authHeader) {
      return Response.json(
        { error: 'Missing Authorization header.' },
        { status: 401, headers: corsHeaders }
      );
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const dataClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey || supabaseAnonKey
    );

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(token);

    if (userError || !user) {
      return Response.json(
        { error: userError?.message || 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { data, error } = await dataClient
      .from('bookings')
      .select(`
        id,
        created_at,
        total_amount,
        shows (
          start_time,
          base_price_usd,
          movies (
            title,
            poster_url,
            classification
          ),
          halls (
            hall_name,
            hall_type,
            cinemas (
              name,
              address
            )
          )
        ),
        booked_seats (
          seats (
            id,
            row_label,
            seat_number
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json(
        { error: error.message, details: error.details, hint: error.hint },
        { status: 500, headers: corsHeaders }
      );
    }

    const bookings = ((data ?? []) as BookingRow[]).map((booking) => ({
      id: booking.id,
      movieTitle: booking.shows?.movies?.title ?? 'Unknown Movie',
      moviePoster: booking.shows?.movies?.poster_url ?? null,
      movieClassification: booking.shows?.movies?.classification ?? null,
      cinemaName: booking.shows?.halls?.cinemas?.name ?? 'Unknown Cinema',
      cinemaAddress: booking.shows?.halls?.cinemas?.address ?? null,
      hallName: booking.shows?.halls?.hall_name ?? 'Unknown Hall',
      hallType: booking.shows?.halls?.hall_type ?? null,
      startTime: booking.shows?.start_time ?? booking.created_at ?? new Date().toISOString(),
      basePrice: booking.shows?.base_price_usd ?? 0,
      totalAmount: booking.total_amount ?? 0,
      seats: (booking.booked_seats ?? [])
        .map((entry) => entry.seats)
        .filter((seat): seat is NonNullable<typeof seat> => Boolean(seat))
        .sort((a, b) => {
          if (a.row_label === b.row_label) {
            return a.seat_number - b.seat_number;
          }

          return a.row_label.localeCompare(b.row_label);
        }),
      bookedAt: booking.created_at ?? booking.shows?.start_time ?? new Date().toISOString(),
    }));

    return Response.json({ bookings }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';

    return Response.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
});
