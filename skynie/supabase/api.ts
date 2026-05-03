import { Database } from "./types"

// This tells the compiler that 'carousel' must match the 'movies' table structure
export type Movie = Database['public']['Tables']['movies']['Row']
export type Genre = Database['public']['Tables']['genres']['Row']

export interface MovieWithGenres extends Movie {
  genres: Genre[]
}

export interface HomeDataResponse {
  carousel: Movie[]
  activeMovies: Movie[]
  upcomingMovies: Movie[]
  allGenres: Genre[]
  ourPick: MovieWithGenres | null
}