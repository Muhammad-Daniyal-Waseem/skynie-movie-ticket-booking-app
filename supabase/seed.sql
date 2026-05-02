-- =============================================================================
-- Cinemas SEED  (10 Cinemas)

INSERT INTO cinemas (name, address, location_lat, location_long) VALUES
('Nueplex Cinemas Rashid Minhas', 'Askari IV, Karachi, Sindh', 24.9128, 67.1215),
('Universal Cinemas Emporium Mall', 'Abdul Haque Rd, Johar Town, Lahore', 31.4676, 74.2662),
('Cinepax Ocean Mall', 'Clifton, Karachi, Sindh', 24.8234, 67.0335),
('CineStar IMAX Township', 'Township, Lahore, Punjab', 31.4533, 74.3102),
('The Centaurus Cineplex', 'F-8, Islamabad, ICT', 33.7077, 73.0501),
('Atrium Cinemas', 'Saddar, Karachi, Sindh', 24.8532, 67.0354),
('Sozo World Cinema', 'Fortress Stadium, Lahore', 31.5422, 74.3725),
('CineGold Plex', 'Phase 7, Bahria Town, Islamabad', 33.5354, 73.0914),
('Raiha CineGold Plex', 'Phase 8, Bahria Town, Karachi', 24.9012, 67.3523),
('Mega Plex Cinemas', 'Mall of Multan, Multan', 30.2215, 71.4921);

-- =============================================================================
-- MOVIES SEED  (45 movies: 40 classics post-1990 + 5 upcoming 2025)
--
-- poster_url  → TMDB w500  (portrait  ~500×750)
-- banner_url  → TMDB w1280 (landscape ~1280×720)
-- trailer_url → YouTube embed URL
--
-- Image CDN base (no API key required for display):
--   https://image.tmdb.org/t/p/w500/<path>      ← poster
--   https://image.tmdb.org/t/p/w1280/<path>     ← banner / backdrop
-- =============================================================================

INSERT INTO movies (
  title, description, duration_minutes, classification, release_date,
  rating_imdb, rating_rotten_tomatoes, rating_compass,
  directors, writers, stars,
  languages, poster_url, banner_url, trailer_url
) VALUES

-- ── 1. The Shawshank Redemption (1994) ──────────────────────────────────────
('The Shawshank Redemption',
 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
 142, 'R', '1994-09-23',
 9.3, 91, 9.5,
 ARRAY['Frank Darabont'],
 ARRAY['Frank Darabont', 'Stephen King'],
 ARRAY['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg',
 'https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
 'https://www.youtube.com/embed/6hB3S9bIaco'),

-- ── 2. Pulp Fiction (1994) ───────────────────────────────────────────────────
('Pulp Fiction',
 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
 154, 'R', '1994-10-14',
 8.9, 92, 9.0,
 ARRAY['Quentin Tarantino'],
 ARRAY['Quentin Tarantino', 'Roger Avary'],
 ARRAY['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
 'https://www.youtube.com/embed/s7EdQ4FqbhY'),

-- ── 3. Forrest Gump (1994) ───────────────────────────────────────────────────
('Forrest Gump',
 'The presidencies of Kennedy and Johnson, the Vietnam War and other historical events unfold from the perspective of an Alabama man with an above-average heart.',
 142, 'PG-13', '1994-07-06',
 8.8, 71, 9.0,
 ARRAY['Robert Zemeckis'],
 ARRAY['Eric Roth', 'Winston Groom'],
 ARRAY['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
 'https://image.tmdb.org/t/p/w1280/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
 'https://www.youtube.com/embed/bLvqoHBptjg'),

-- ── 4. The Lion King (1994) ──────────────────────────────────────────────────
('The Lion King',
 'Lion prince Simba flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.',
 88, 'G', '1994-06-15',
 8.5, 93, 8.8,
 ARRAY['Roger Allers', 'Rob Minkoff'],
 ARRAY['Irene Mecchi', 'Jonathan Roberts', 'Linda Woolverton'],
 ARRAY['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
 'https://image.tmdb.org/t/p/w1280/wXsQvli6tWqja51pYxXNG1LFIGV.jpg',
 'https://www.youtube.com/embed/4sj1MT05lAA'),

-- ── 5. Schindler's List (1993) ───────────────────────────────────────────────
('Schindler''s List',
 'In German-occupied Poland during WWII, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
 195, 'R', '1993-12-15',
 9.0, 98, 9.3,
 ARRAY['Steven Spielberg'],
 ARRAY['Steven Zaillian', 'Thomas Keneally'],
 ARRAY['Liam Neeson', 'Ralph Fiennes', 'Ben Kingsley'],
 ARRAY['EN', 'DE', 'PL'],
 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
 'https://image.tmdb.org/t/p/w1280/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg',
 'https://www.youtube.com/embed/gG22XNhtnoY'),

-- ── 6. The Matrix (1999) ─────────────────────────────────────────────────────
('The Matrix',
 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
 136, 'R', '1999-03-31',
 8.7, 88, 9.0,
 ARRAY['Lana Wachowski', 'Lilly Wachowski'],
 ARRAY['Lana Wachowski', 'Lilly Wachowski'],
 ARRAY['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
 'https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
 'https://www.youtube.com/embed/vKQi3bBA1y8'),

-- ── 7. Gladiator (2000) ──────────────────────────────────────────────────────
('Gladiator',
 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
 155, 'R', '2000-05-05',
 8.5, 80, 8.7,
 ARRAY['Ridley Scott'],
 ARRAY['David Franzoni', 'John Logan', 'William Nicholson'],
 ARRAY['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
 'https://image.tmdb.org/t/p/w1280/hND8m2j9VXRH5YWI79oMvpYNexw.jpg',
 'https://www.youtube.com/embed/owK1qxDselE'),

-- ── 8. The Dark Knight (2008) ────────────────────────────────────────────────
('The Dark Knight',
 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
 152, 'PG-13', '2008-07-18',
 9.0, 94, 9.3,
 ARRAY['Christopher Nolan'],
 ARRAY['Jonathan Nolan', 'Christopher Nolan'],
 ARRAY['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
 'https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
 'https://www.youtube.com/embed/EXeTwQWrcwY'),

-- ── 9. Inception (2010) ──────────────────────────────────────────────────────
('Inception',
 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
 148, 'PG-13', '2010-07-16',
 8.8, 87, 9.0,
 ARRAY['Christopher Nolan'],
 ARRAY['Christopher Nolan'],
 ARRAY['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
 'https://image.tmdb.org/t/p/w1280/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg',
 'https://www.youtube.com/embed/YoHD9XEInc0'),

-- ── 10. Interstellar (2014) ──────────────────────────────────────────────────
('Interstellar',
 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',
 169, 'PG-13', '2014-11-07',
 8.7, 73, 9.0,
 ARRAY['Christopher Nolan'],
 ARRAY['Jonathan Nolan', 'Christopher Nolan'],
 ARRAY['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
 'https://www.youtube.com/embed/zSWdZVtXT7E'),

-- ── 11. Mission: Impossible – The Final Reckoning (UPCOMING 2025) ────────────
('Mission: Impossible – The Final Reckoning',
 'Ethan Hunt and his IMF team must track down a terrifying AI weapon known as the Entity before it falls into the wrong hands — in what may be their most dangerous mission yet.',
 169, 'PG-13', '2025-05-23',
 NULL, NULL, NULL,
 ARRAY['Christopher McQuarrie'],
 ARRAY['Christopher McQuarrie', 'Erik Jendresen'],
 ARRAY['Tom Cruise', 'Hayley Atwell', 'Ving Rhames'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
 'https://image.tmdb.org/t/p/w1280/b4GzGfBXDPm9gJHBrM77FkBKPAi.jpg',
 'https://www.youtube.com/embed/avz_LfW5Ocw'),

-- ── 12. Avatar: Fire and Ash (UPCOMING 2025) ─────────────────────────────────
('Avatar: Fire and Ash',
 'Jake Sully and Neytiri face a new threat on Pandora as a dangerous clan of Na''vi known as the Ash People emerge from the planet''s volcanic regions.',
 NULL, 'PG-13', '2025-12-19',
 NULL, NULL, NULL,
 ARRAY['James Cameron'],
 ARRAY['James Cameron'],
 ARRAY['Sam Worthington', 'Zoe Saldana', 'Oona Chaplin'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/3C5BMhkKSqFkrVMXSXGE5e9ENMS.jpg',
 'https://image.tmdb.org/t/p/w1280/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg',
 'https://www.youtube.com/embed/oFx5MFB7krs'),

-- ── 13. The Fantastic Four: First Steps (UPCOMING 2025) ──────────────────────
('The Fantastic Four: First Steps',
 'Marvel''s First Family — Reed Richards, Sue Storm, Johnny Storm and Ben Grimm — face a world-devouring threat unlike anything the universe has seen.',
 NULL, 'PG-13', '2025-07-25',
 NULL, NULL, NULL,
 ARRAY['Matt Shakman'],
 ARRAY['Josh Friedman', 'Jeff Kaplan', 'Ian Springer'],
 ARRAY['Pedro Pascal', 'Vanessa Kirby', 'Joseph Quinn', 'Ebon Moss-Bachrach'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg',
 'https://image.tmdb.org/t/p/w1280/b4teQIRuqPJTgABkFDtn8I5RkWO.jpg',
 'https://www.youtube.com/embed/qMXLi0QSNEU'),

-- ── 14. Jurassic World Rebirth (UPCOMING 2025) ───────────────────────────────
('Jurassic World Rebirth',
 'Five years after Dominion, a covert mission to a remote tropical island leads an unlikely team of operatives deep into the heart of a new and deadly dinosaur crisis.',
 NULL, 'PG-13', '2025-07-02',
 NULL, NULL, NULL,
 ARRAY['Gareth Edwards'],
 ARRAY['David Koepp'],
 ARRAY['Scarlett Johansson', 'Jonathan Bailey', 'Mahershala Ali'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/7gKI9hpEMlNXkUFMuxDxMXDOepj.jpg',
 'https://image.tmdb.org/t/p/w1280/oHToFDDFouvdVoOYPmUcQJAHBEm.jpg',
 'https://www.youtube.com/embed/P7h4FuBsXOM'),

-- ── 15. Superman (UPCOMING 2025) ─────────────────────────────────────────────
('Superman',
 'Clark Kent balances his life as a reporter in Metropolis with his role as Superman, facing both human and alien threats in the dawn of the new DC Universe.',
 NULL, 'PG-13', '2025-07-11',
 NULL, NULL, NULL,
 ARRAY['James Gunn'],
 ARRAY['James Gunn'],
 ARRAY['David Corenswet', 'Rachel Brosnahan', 'Nicholas Hoult'],
 ARRAY['EN'],
 'https://image.tmdb.org/t/p/w500/miKlSO8jJFyHDSnBu3IMN4qe2J9.jpg',
 'https://image.tmdb.org/t/p/w1280/5U7qNAsYMGxFTkNIKRjCNiMNPDG.jpg',
 'https://www.youtube.com/embed/LFdUQBCKOhE');


-- =============================================================================
-- Genres SEED  (11 Cinemas)

 INSERT INTO genres (name, icon_url) VALUES
('Action', '💥'),
('Adventure', '🗺️'),
('Animation', '🎨'),
('Biography', '📖'),
('Crime', '🕵️'),
('Drama', '🎭'),
('Family', '🏠'),
('Fantasy', '🧙'),
('History', '📜'),
('Sci-Fi', '🚀'),
('Thriller', '🔪');

-- =============================================================================
-- Movie Genres SEED  (At least 1 genre per movie)

INSERT INTO movie_genres (movie_id, genre_id) VALUES
-- 1. The Shawshank Redemption: Drama
((SELECT id FROM movies WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genres WHERE name = 'Drama')),

-- 2. Pulp Fiction: Crime, Drama
((SELECT id FROM movies WHERE title = 'Pulp Fiction'), (SELECT id FROM genres WHERE name = 'Crime')),
((SELECT id FROM movies WHERE title = 'Pulp Fiction'), (SELECT id FROM genres WHERE name = 'Drama')),

-- 3. Forrest Gump: Drama, Family
((SELECT id FROM movies WHERE title = 'Forrest Gump'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM movies WHERE title = 'Forrest Gump'), (SELECT id FROM genres WHERE name = 'Family')),

-- 4. The Lion King: Animation, Adventure, Family
((SELECT id FROM movies WHERE title = 'The Lion King'), (SELECT id FROM genres WHERE name = 'Animation')),
((SELECT id FROM movies WHERE title = 'The Lion King'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'The Lion King'), (SELECT id FROM genres WHERE name = 'Family')),

-- 5. Schindler's List: Biography, Drama, History
((SELECT id FROM movies WHERE title = 'Schindler''s List'), (SELECT id FROM genres WHERE name = 'Biography')),
((SELECT id FROM movies WHERE title = 'Schindler''s List'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM movies WHERE title = 'Schindler''s List'), (SELECT id FROM genres WHERE name = 'History')),

-- 6. The Matrix: Action, Sci-Fi
((SELECT id FROM movies WHERE title = 'The Matrix'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'The Matrix'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),

-- 7. Gladiator: Action, Adventure, Drama
((SELECT id FROM movies WHERE title = 'Gladiator'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Gladiator'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Gladiator'), (SELECT id FROM genres WHERE name = 'Drama')),

-- 8. The Dark Knight: Action, Crime, Drama
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Crime')),
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Drama')),

-- 9. Inception: Action, Adventure, Sci-Fi
((SELECT id FROM movies WHERE title = 'Inception'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Inception'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Inception'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),

-- 10. Interstellar: Adventure, Drama, Sci-Fi
((SELECT id FROM movies WHERE title = 'Interstellar'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Interstellar'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM movies WHERE title = 'Interstellar'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),

-- 11. Mission: Impossible – The Final Reckoning: Action, Adventure, Thriller
((SELECT id FROM movies WHERE title = 'Mission: Impossible – The Final Reckoning'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Mission: Impossible – The Final Reckoning'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Mission: Impossible – The Final Reckoning'), (SELECT id FROM genres WHERE name = 'Thriller')),

-- 12. Avatar: Fire and Ash: Action, Adventure, Sci-Fi
((SELECT id FROM movies WHERE title = 'Avatar: Fire and Ash'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Avatar: Fire and Ash'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Avatar: Fire and Ash'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),

-- 13. The Fantastic Four: First Steps: Action, Adventure, Fantasy
((SELECT id FROM movies WHERE title = 'The Fantastic Four: First Steps'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'The Fantastic Four: First Steps'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'The Fantastic Four: First Steps'), (SELECT id FROM genres WHERE name = 'Fantasy')),

-- 14. Jurassic World Rebirth: Action, Adventure, Sci-Fi
((SELECT id FROM movies WHERE title = 'Jurassic World Rebirth'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Jurassic World Rebirth'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Jurassic World Rebirth'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),

-- 15. Superman: Action, Adventure, Sci-Fi
((SELECT id FROM movies WHERE title = 'Superman'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'Superman'), (SELECT id FROM genres WHERE name = 'Adventure')),
((SELECT id FROM movies WHERE title = 'Superman'), (SELECT id FROM genres WHERE name = 'Sci-Fi'));

-- =============================================================================
-- Halls SEED  (At least 1 hall per cinema)

INSERT INTO halls (cinema_id, hall_name, hall_type, total_capacity) VALUES
-- Nueplex Cinemas Rashid Minhas (5 Halls)
((SELECT id FROM cinemas WHERE name = 'Nueplex Cinemas Rashid Minhas'), 'Hall 1', 'Dolby Atmos', 60),
((SELECT id FROM cinemas WHERE name = 'Nueplex Cinemas Rashid Minhas'), 'Hall 2', 'ScreenX', 60),
((SELECT id FROM cinemas WHERE name = 'Nueplex Cinemas Rashid Minhas'), 'Hall 3', 'Standard', 60),
((SELECT id FROM cinemas WHERE name = 'Nueplex Cinemas Rashid Minhas'), 'Hall 4', 'Gold', 60),
((SELECT id FROM cinemas WHERE name = 'Nueplex Cinemas Rashid Minhas'), 'Hall 5', '4DX', 60),

-- Universal Cinemas Emporium Mall (4 Halls)
((SELECT id FROM cinemas WHERE name = 'Universal Cinemas Emporium Mall'), 'Ultra 1', 'IMAX', 60),
((SELECT id FROM cinemas WHERE name = 'Universal Cinemas Emporium Mall'), 'Ultra 2', 'Dolby Atmos', 60),
((SELECT id FROM cinemas WHERE name = 'Universal Cinemas Emporium Mall'), 'Ultra 3', 'Standard', 60),
((SELECT id FROM cinemas WHERE name = 'Universal Cinemas Emporium Mall'), 'Ultra 4', 'Premium', 60),

-- Cinepax Ocean Mall (3 Halls)
((SELECT id FROM cinemas WHERE name = 'Cinepax Ocean Mall'), 'Platinum', 'Gold', 60),
((SELECT id FROM cinemas WHERE name = 'Cinepax Ocean Mall'), 'CMAXX', 'Dolby Atmos', 60),
((SELECT id FROM cinemas WHERE name = 'Cinepax Ocean Mall'), 'Silver', 'Standard', 60),

-- CineStar IMAX Township (2 Halls)
((SELECT id FROM cinemas WHERE name = 'CineStar IMAX Township'), 'IMAX Theatre', 'IMAX', 60),
((SELECT id FROM cinemas WHERE name = 'CineStar IMAX Township'), 'Star Hall', 'Standard', 60),

-- The Centaurus Cineplex (4 Halls)
((SELECT id FROM cinemas WHERE name = 'The Centaurus Cineplex'), 'Hall A', 'Dolby Atmos', 60),
((SELECT id FROM cinemas WHERE name = 'The Centaurus Cineplex'), 'Hall B', 'Standard', 60),
((SELECT id FROM cinemas WHERE name = 'The Centaurus Cineplex'), 'Hall C', 'VIP', 60),
((SELECT id FROM cinemas WHERE name = 'The Centaurus Cineplex'), 'Hall D', 'ScreenX', 60),

-- Atrium Cinemas (3 Halls)
((SELECT id FROM cinemas WHERE name = 'Atrium Cinemas'), 'Cinema 1', 'Standard', 60),
((SELECT id FROM cinemas WHERE name = 'Atrium Cinemas'), 'Cinema 2', '3D Standard', 60),
((SELECT id FROM cinemas WHERE name = 'Atrium Cinemas'), 'Cinema 3', 'Dolby Atmos', 60),

-- Sozo World Cinema (1 Hall)
((SELECT id FROM cinemas WHERE name = 'Sozo World Cinema'), 'Main Hall', 'Standard', 60),

-- CineGold Plex (3 Halls)
((SELECT id FROM cinemas WHERE name = 'CineGold Plex'), 'Gold Class', 'Gold', 60),
((SELECT id FROM cinemas WHERE name = 'CineGold Plex'), 'Red Class', 'Standard', 60),
((SELECT id FROM cinemas WHERE name = 'CineGold Plex'), 'Lounge', 'Premium', 60),

-- Raiha CineGold Plex (2 Halls)
((SELECT id FROM cinemas WHERE name = 'Raiha CineGold Plex'), 'Grand Hall', 'Dolby Atmos', 60),
((SELECT id FROM cinemas WHERE name = 'Raiha CineGold Plex'), 'Suite', 'Gold', 60),

-- Mega Plex Cinemas (2 Halls)
((SELECT id FROM cinemas WHERE name = 'Mega Plex Cinemas'), 'Hall 1', 'Standard', 60),
((SELECT id FROM cinemas WHERE name = 'Mega Plex Cinemas'), 'Hall 2', 'Premium', 60);

-- =============================================================================
-- Seats SEED  (All halls have 60 seats)

WITH row_definitions AS (
  -- Define the layout: Row name, and how many seats are in that row
  SELECT 'A' AS r_name, 6 AS s_count UNION ALL
  SELECT 'B', 8 UNION ALL
  SELECT 'C', 8 UNION ALL
  SELECT 'D', 8 UNION ALL
  SELECT 'E', 8 UNION ALL
  SELECT 'F', 8 UNION ALL
  SELECT 'G', 8 UNION ALL
  SELECT 'H', 6
),
generated_seats AS (
  -- This acts as our nested loop: for each row, generate N seats
  SELECT 
    rd.r_name AS row_label,
    s.seat_num
  FROM row_definitions rd
  CROSS JOIN LATERAL generate_series(1, rd.s_count) AS s(seat_num)
)
INSERT INTO seats (row_label, seat_number)
SELECT 
  row_label, 
  seat_num
FROM generated_seats;


-- =============================================================================
-- Seats Shows  (2 Shows per hall per day for 30 days, rotating movies)

INSERT INTO shows (hall_id, movie_id, start_time, base_price_usd)
WITH daily_slots AS (
    -- 1. Create a series of 30 days
    SELECT generate_series(
        current_date, 
        current_date + interval '29 days', 
        interval '1 day'
    )::date AS show_date
),
all_halls AS (
    -- 2. Get all 29 halls and assign a row number for math offsets
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as hall_num FROM halls
),
all_movies AS (
    -- 3. Get your 15 movies and assign a row number
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as movie_num FROM movies
),
schedule_logic AS (
    -- 4. Join halls, days, and movies using math to rotate titles
    SELECT 
        h.id AS h_id,
        -- Afternoon Movie
        (SELECT id FROM all_movies WHERE movie_num = ((h.hall_num + EXTRACT(day FROM d.show_date)::int) % 15) + 1) AS movie_aft,
        -- Evening Movie
        (SELECT id FROM all_movies WHERE movie_num = ((h.hall_num + EXTRACT(day FROM d.show_date)::int + 1) % 15) + 1) AS movie_eve,
        d.show_date
    FROM all_halls h
    CROSS JOIN daily_slots d
)
-- 5. Final Insert: Targets 4 columns specifically
-- We removed the "end_time" value since your table doesn't have that column
SELECT h_id, movie_aft, (show_date + time '14:00:00'), 16.00 FROM schedule_logic
UNION ALL
SELECT h_id, movie_eve, (show_date + time '20:00:00'), 16.00 FROM schedule_logic;