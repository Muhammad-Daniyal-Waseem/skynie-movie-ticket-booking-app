import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const movieId = url.searchParams.get("id");

    if (!movieId) {
      return new Response(
        JSON.stringify({ error: "movie id is required" }),
        { status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔥 Single query with nested joins
    const { data: shows, error } = await supabase
      .from("shows")
      .select(`
        id,
        start_time,
        base_price_usd,

        halls (
          id,
          hall_name,
          hall_type,
          total_capacity,

          cinemas (
            id,
            name,
            address,
            location_lat,
            location_long
          )
        ),

        bookings (
          id,
          booked_seats (
            id
          )
        )
      `)
      .eq("movie_id", movieId);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    if (!shows) {
      return new Response(JSON.stringify({ shows: [] }));
    }

    const formattedShows = shows.map((show: any) => {
      const hall = show.halls;
      const cinema = hall?.cinemas;

      const bookedSeatsCount =
        show.bookings?.reduce((acc: number, b: any) => {
          return acc + (b.booked_seats?.length || 0);
        }, 0) || 0;

      return {
        ...show,
        booked_seats_count: bookedSeatsCount,
      };
    });

    const { data: movie, error: movieError } = await supabase
      .from("movies")
      .select(`
        *,
        movie_genres (
          genres (*)
        )
      `)
      .eq("id", movieId)
      .single();

    if (movieError || !movie) {
      return new Response(
        JSON.stringify({ error: "Movie not found" }),
        { status: 404 }
      );
    }

    const formattedMovie = {
      ...movie,
      genres: movie.movie_genres.map((mg: any) => mg.genres),
    };

    return new Response(
      JSON.stringify({
        shows: formattedShows,
        movie: formattedMovie
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});