import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: corsHeaders, status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Missing environment variables' }),
        { headers: corsHeaders, status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { headers: corsHeaders, status: 401 }
      )
    }

    // Fetch user's bookings with full details
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        total_amount,
        created_at,
        shows!inner(
          id,
          start_time,
          base_price_usd,
          movies(id, title, poster_url, classification),
          halls!inner(id, hall_name, hall_type, cinemas!inner(id, name, address))
        ),
        booked_seats(id, seat_id, seats(id, row_label, seat_number))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (bookingsError) {
      console.error('Bookings error:', bookingsError)
      throw bookingsError
    }

    // Transform the data to match frontend expectations
    const transformedBookings = (bookings || []).map((booking: any) => ({
      id: booking.id,
      movieTitle: booking.shows?.movies?.title || 'Unknown Movie',
      moviePoster: booking.shows?.movies?.poster_url || null,
      movieClassification: booking.shows?.movies?.classification || 'N/A',
      cinemaName: booking.shows?.halls?.cinemas?.name || 'Unknown Cinema',
      cinemaAddress: booking.shows?.halls?.cinemas?.address || null,
      hallName: booking.shows?.halls?.hall_name || 'N/A',
      hallType: booking.shows?.halls?.hall_type || null,
      startTime: booking.shows?.start_time,
      basePrice: booking.shows?.base_price_usd || 0,
      totalAmount: booking.total_amount || 0,
      seats: (booking.booked_seats || []).map((bs: any) => ({
        id: bs.seat_id,
        rowLabel: bs.seats?.row_label || 'N/A',
        seatNumber: bs.seats?.seat_number || 0
      })),
      bookedAt: booking.created_at
    }))

    return new Response(
      JSON.stringify({ bookings: transformedBookings }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: any) {
    console.error('Error in get-user-bookings:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch bookings',
        details: error?.message || 'Unknown error'
      }),
      { headers: corsHeaders, status: 500 }
    )
  }
})
