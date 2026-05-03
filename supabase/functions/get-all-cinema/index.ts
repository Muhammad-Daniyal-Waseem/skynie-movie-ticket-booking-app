import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 1. Fetch cinemas with their halls
    const { data: cinemasData, error: cinemaError } = await supabase
      .from('cinemas')
      .select(`
        *,
        halls (
          hall_type
        )
      `)

    if (cinemaError) throw cinemaError

    // 2. Process the data to format hall_types as a unique array of strings
    const formattedCinemas = cinemasData.map((cinema) => {
      // Extract hall_types and filter out nulls/duplicates
      const types = cinema.halls
        .map((h: any) => h.hall_type)
        .filter((type: string | null) => type !== null)
      
      return {
        ...cinema,
        hall_types: [...new Set(types)] // Removes duplicates for this specific cinema
      }
    })

    // 3. Extract all unique hall types across all cinemas
    const allHallTypes = [...new Set(
      formattedCinemas.flatMap((c) => c.hall_types)
    )].sort()

    return new Response(
      JSON.stringify({
        cinemas: formattedCinemas,
        allHallTypes: allHallTypes
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})