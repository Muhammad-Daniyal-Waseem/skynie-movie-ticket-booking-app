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

    // Extract genres
    const genreIds = movie.movie_genres.map(
      (mg: any) => mg.genres.id
    );

    const { data: related, error: relatedError } = await supabase
      .from("movie_genres")
      .select(`
        movie_id,
        movies (
          *,
          movie_genres (
            genres (*)
          )
        )
      `)
      .in("genre_id", genreIds)
      .neq("movie_id", movieId);

    if (relatedError) {
      return new Response(
        JSON.stringify({ error: relatedError.message }),
        { status: 500 }
      );
    }

    // Deduplicate movies
    const uniqueMap = new Map();

    related.forEach((item: any) => {
      uniqueMap.set(item.movies.id, item.movies);
    });

    const relatedMovies = Array.from(uniqueMap.values());

    const formattedMovie = {
      ...movie,
      genres: movie.movie_genres.map((mg: any) => mg.genres),
    };

    return new Response(
      JSON.stringify({
        movie: formattedMovie,
        relatedMovies,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});