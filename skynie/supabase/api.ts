import { Database } from "./types"

export type Movie = Database['public']['Tables']['movies']['Row']
export type Genre = Database['public']['Tables']['genres']['Row']
export type Cinema = Database['public']['Tables']['cinemas']['Row'];
export type Hall = Database['public']['Tables']['halls']['Row'];
export type Shows = Database['public']['Tables']['shows']['Row'];
export type Seat = Database['public']['Tables']['seats']['Row'];

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

export type CinemaWithHallTypes = Cinema & {
  hall_types: string[];
};

export interface SearchDataResponse {
  cinemas: CinemaWithHallTypes[];
  allHallTypes: string[];
}

export interface GetMovieByIdResponse {
  movie: MovieWithGenres;
  relatedMovies: MovieWithGenres[];
}

export type HallWithCinema = Hall & {
  cinemas: Cinema;
}

export type ShowsWithCinemaAndHall = Shows & {
  halls: HallWithCinema;
  booked_seats_count: number;
}

export interface GetMovieShowsResponse {
  movie: MovieWithGenres;
  shows: ShowsWithCinemaAndHall[];
}

export interface GetBookedSeatsResponse {
  seats: Seat[];
}


export type ChooseSeatScreenParams = {
  id: string;
  title: string;
  poster: string;
  langs: string;
  hallName: string;
  hallType: string;
  dateTime: string;
  cinema: string;
}