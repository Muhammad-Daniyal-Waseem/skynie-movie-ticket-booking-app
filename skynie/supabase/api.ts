import { Database } from "./types"

export type Movie = Database['public']['Tables']['movies']['Row']
export type Genre = Database['public']['Tables']['genres']['Row']
export type Cinema = Database['public']['Tables']['cinemas']['Row'];
export type Hall = Database['public']['Tables']['halls']['Row'];
export type Shows = Database['public']['Tables']['shows']['Row'];
export type Seat = Database['public']['Tables']['seats']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type BookedSeat = Database['public']['Tables']['booked_seats']['Row'];

export interface MovieWithGenres extends Movie {
  genres: Genre[]
}

export interface UserBooking {
  id: string;
  movieTitle: string;
  moviePoster: string | null;
  movieClassification: string | null;
  cinemaName: string;
  cinemaAddress: string | null;
  hallName: string;
  hallType: string | null;
  startTime: string;
  basePrice: number;
  totalAmount: number;
  seats: Array<{
    id: string;
    rowLabel: string;
    seatNumber: number;
  }>;
  bookedAt: string;
}

export interface GetUserBookingsResponse {
  bookings: UserBooking[];
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
  ticketPrice: string;
}

export type OrderDetailsScreenParams = ChooseSeatScreenParams & {
  selectedSeats: string
}