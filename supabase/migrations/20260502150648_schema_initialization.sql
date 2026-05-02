CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  language_preference TEXT DEFAULT 'en',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- e.g., 'Adventure', 'Comedy', 'Mystery'
  icon_url TEXT -- To store the emoji or icon shown in the UI
);

CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  classification TEXT, -- e.g., 'PG-13'
  release_date DATE,
  
  -- Ratings from UI
  rating_imdb NUMERIC(3,1),
  rating_rotten_tomatoes INTEGER, -- Store as percentage (e.g., 96)
  rating_compass NUMERIC(3,1), -- The 9.5/10 rating in your design
  
  -- Creative Team
  directors TEXT[], -- Array format: ['Christopher Nolan']
  writers TEXT[],   -- Array format: ['Christopher Nolan', 'Kai Bird']
  stars TEXT[],     -- Array format: ['Cillian Murphy', 'Emily Blunt']
  
  -- Metadata
  languages TEXT[], -- e.g., ['EN', 'SP', 'TH']
  poster_url TEXT, -- portrait
  banner_url TEXT, -- landscape
  trailer_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE movie_genres (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE cinemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  location_lat NUMERIC,
  location_long NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cinema_id UUID REFERENCES cinemas(id) ON DELETE CASCADE,
  hall_name TEXT NOT NULL, -- e.g., 'Hall 1', 'Hall 7'
  hall_type TEXT, -- e.g., 'ScreenX', 'Dolby Atmos', 'Gold'
  total_capacity INTEGER Default 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Shows (Linking Movie to Hall/Time)
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  hall_id UUID REFERENCES halls(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  base_price_usd NUMERIC(10,2) DEFAULT 16.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Seats
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  row_label CHAR(1) NOT NULL, -- e.g., 'E'
  seat_number INTEGER NOT NULL,
  UNIQUE(row_label, seat_number)
);

-- 6. Bookings & Snacks
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  show_id UUID REFERENCES shows(id) ON DELETE RESTRICT,
  total_amount NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE booked_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID REFERENCES seats(id) ON DELETE RESTRICT,
  UNIQUE(booking_id, seat_id)
);