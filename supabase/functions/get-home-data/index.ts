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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 1. Setup Date Window (Today to 5 days from now)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 5);
    fiveDaysFromNow.setHours(23, 59, 59, 999);

    // 2. Run parallel queries
    const [
      activeMoviesRes,
      upcomingMoviesRes,
      genresRes
    ] = await Promise.all([
      // Query 1: Active Movies via many-to-many genre join
      supabase
        .from('movies')
        .select(`
          *,i
          movie_genres (
            genres (*)
          ),
          shows!inner (start_time)
        `)
        .gte('shows.start_time', today.toISOString())
        .lte('shows.start_time', fiveDaysFromNow.toISOString()),

      // Query 2: Upcoming
      supabase
        .from('movies')
        .select('*')
        .gt('release_date', new Date().toISOString())
        .order('release_date', { ascending: true }),

      // Query 3: All Genres
      supabase.from('genres').select('*')
    ])

    if (activeMoviesRes.error) throw activeMoviesRes.error

    // 3. Process Data: De-duplicate and Flatten Genres
    const movieMap = new Map();
    
    activeMoviesRes.data?.forEach(movie => {
      if (!movieMap.has(movie.id)) {
        // Flatten the complex many-to-many genre structure into a simple array
        const flattenedGenres = movie.movie_genres?.map((mg: any) => mg.genres) || [];
        
        // Remove the join-table and shows-filter data from the final object
        const { movie_genres, shows, ...cleanMovie } = movie;
        
        movieMap.set(movie.id, {
          ...cleanMovie,
          genres: flattenedGenres // Now movies have a direct 'genres' array
        });
      }
    });

    const activeMovies = Array.from(movieMap.values());
    
    // 4. Random Selections
    const shuffled = [...activeMovies].sort(() => 0.5 - Math.random());
    const carouselMovies = shuffled.slice(0, 3);
    const ourPick = shuffled[shuffled.length - 1] || null;

    return new Response(
      JSON.stringify({
        carousel: carouselMovies,
        activeMovies: activeMovies,
        upcomingMovies: upcomingMoviesRes.data || [],
        allGenres: genresRes.data || [],
        ourPick: ourPick
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})