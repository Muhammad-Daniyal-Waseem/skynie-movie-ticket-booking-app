import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/color';
import { supabase } from '@/src/supabase/client';
import { GetMovieShowsResponse } from '@/supabase/api';
import Loader from '@/components/Loader';
import { EmptyState } from '@/components/empty-state';
import { formatTimeHHMM, getDuration } from '@/utils';
import * as WebBrowser from 'expo-web-browser';
import { Image } from 'expo-image';

const showtimes = [
  { id: '1', time: '10:15', hall: 'Hall 1', available: 53, total: 80, type: 'ScreenX', audio: 'Dolby Atmos' },
  { id: '2', time: '12:30', hall: 'Hall 7', available: 15, total: 56, type: 'ScreenX', audio: 'Dolby Digital' },
  { id: '3', time: '14:45', hall: 'Hall 2', available: 0, total: 68, type: 'ScreenX', audio: 'Dolby Atmos', disabled: true },
  { id: '4', time: '18:00', hall: 'Hall 7', available: 0, total: 56, type: 'ScreenX', audio: 'Dolby Digital', disabled: true },
  { id: '5', time: '20:15', hall: 'Hall 1', available: 6, total: 40, type: 'ScreenX', audio: 'Dolby Atmos' },
  { id: '6', time: '22:30', hall: 'Hall 4', available: 62, total: 80, type: 'ScreenX', audio: 'Dolby Digital' },
];

const getWeekdayLabel = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const getDateLabel = (date: Date) => {
  return date.getDate().toString();
};

export default function BookTicket() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [shows, setShows] = useState<GetMovieShowsResponse['shows']>([]);
  const [movie, setMovie] = useState<GetMovieShowsResponse['movie'] | null>(null);

  const [loading, setLoading] = useState(false);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(showtimes[0].id);

  const dates = useMemo(() => {
    return Array.from({ length: 30 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return { id: `${index}`, weekday: getWeekdayLabel(date), date: getDateLabel(date) };
    });
  }, []);

  const getShowsData = async () => {
    try {
      if (!supabase || !id) return;
      const { data, error } = await supabase.functions.invoke<GetMovieShowsResponse>(`get-movie-shows?id=${id}`, {
        method: 'GET',
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      if (data) {
        setMovie(data.movie)
        setShows(data.shows)
      }
    } catch (err) {
      console.error('Failed to data:', err);
    }
  };

  useEffect(() => {
    setLoading(true)
    getShowsData().then(() => setLoading(false));
  }, [id])

  const getDateKey = (date: string | Date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };

  const isPastShow = (startTime: string) => {
    return new Date(startTime).getTime() < Date.now();
  };

  const selectedDateShows = useMemo(() => {
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + selectedDateIndex);
    return shows.filter(item => {
      return getDateKey(new Date(item.start_time)) === getDateKey(selectedDate)
    })
  }, [selectedDateIndex, shows])

  const handleOpenTrailer = async () => {
    const url = movie?.trailer_url;
    if (url) {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  if (loading)
    return <Loader />

  if (!movie)
    return <EmptyState message='Movie not found' />

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tickets</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
          {dates.map((item, index) => {
            const active = selectedDateIndex === index;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.datePill, active && styles.activeDatePill]}
                onPress={() => setSelectedDateIndex(index)}
              >
                <Text style={[styles.dateWeekday, active && styles.activeDateText]}>{item.weekday}</Text>
                <Text style={[styles.dateNumber, active && styles.activeDateText]}>{item.date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.movieCard}>
          <Image source={{ uri: movie.poster_url || "" }} style={styles.posterPlaceholder} />
          <View style={styles.movieDetails}>
            <Text style={styles.movieGenre}>{movie.genres?.map(g => g.name).join(" • ")} • {getDuration(movie.duration_minutes)}</Text>
            <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={styles.badgeRow}>
                {movie.languages?.map(lang => (
                  <View key={lang} style={styles.outlineBadge}><Text style={styles.badgeText}>{lang}</Text></View>
                ))}
              </View>
              <TouchableOpacity style={styles.trailerBtn} onPress={handleOpenTrailer}>
                <Ionicons name="play" size={16} color="black" />
                <Text style={styles.trailerText}>Trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Showtime</Text>
        {selectedDateShows.length == 0 && <EmptyState message='No show found' />}
        <View style={styles.cardsGrid}>
          {selectedDateShows.map((show) => {
            const active = selectedShowtimeId === show.id;
            const disabled = (show.booked_seats_count == show.halls.total_capacity) || (isPastShow(show.start_time));
            const availableColor = disabled
              ? '#555'
              : show.booked_seats_count < 10
                ? '#EE5959'
                : '#D9D900';

            return (
              <Link disabled={disabled} asChild
                style={[styles.showtimeCard, active && styles.activeShowtimeCard, disabled && styles.disabledShowtimeCard]}
                key={show.id}
                href={{
                  pathname: '/(stack)/ChooseSeat',
                  params: {
                    id: show.id,
                    title: movie.title,
                    poster: movie.poster_url,
                    langs: movie.languages,
                    hallName: show.halls.hall_name,
                    hallType: show.halls.hall_type,
                    dateTime: show.start_time,
                    cinema: show.halls.cinemas.name,
                    ticketPrice: show.base_price_usd
                  }
                }}
              >
                <TouchableOpacity
                  onPress={() => !disabled && router.push('./ChooseSeat')}
                  disabled={disabled}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>{show.halls.cinemas.name}</Text>
                    <Text style={styles.cardAudio}>{show.halls.hall_type}</Text>
                  </View>
                  <Text style={[styles.showtimeText, disabled && styles.disabledText, disabled && styles.lineThrough]}>{formatTimeHHMM(show.start_time)}</Text>
                  <View>
                    <Text style={[styles.hallText, disabled && styles.disabledText]}>{show.halls.hall_name}</Text>
                    <Text style={[styles.availabilityText, { color: availableColor }]}>
                      {show.booked_seats_count > 0 ? `${show.booked_seats_count} Available / ${show.halls.total_capacity}` : `${show.booked_seats_count} / ${show.halls.total_capacity}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  dateList: {
    marginTop: 16,
  },
  datePill: {
    width: 62,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeDatePill: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  activeDateText: {
    color: 'white',
  },
  dateWeekday: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  dateNumber: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  filterList: {
    marginTop: 18,
    marginBottom: 24,
  },
  filterChip: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 12,
  },
  activeFilterChip: {
    backgroundColor: '#FF0000',
  },
  filterText: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 24,
    padding: 16,
    marginVertical: 24,
    alignItems: "stretch"
  },
  posterPlaceholder: {
    aspectRatio: "9/16",
    height: 150,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  movieDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  movieGenre: {
    color: '#888',
    fontSize: 12,
    lineHeight: 18,
  },
  movieTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  outlineBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  trailerBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  trailerText: {
    marginLeft: 8,
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  showtimeCard: {
    width: '48%',
    backgroundColor: '#242424',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  activeShowtimeCard: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  disabledShowtimeCard: {
    opacity: 0.45,
  },
  cardHeader: {
    gap: 2,
    marginBottom: 20,
  },
  cardType: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '700',
  },
  cardAudio: {
    color: '#aaa',
    fontSize: 11,
  },
  showtimeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 18,
  },
  hallText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 6,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '700',
  },
  disabledText: {
    color: '#666',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
});
