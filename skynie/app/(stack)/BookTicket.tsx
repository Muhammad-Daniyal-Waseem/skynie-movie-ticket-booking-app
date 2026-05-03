import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/color';

const filmTypes = ['IMAX', 'GOLD', 'ScreenX', '4D MAX', '3D', '2D'];

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
  const router = useRouter();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(2);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(showtimes[0].id);

  const dates = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return { id: `${index}`, weekday: getWeekdayLabel(date), date: getDateLabel(date) };
    });
  }, []);

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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
          {filmTypes.map((type, index) => {
            const active = selectedTypeIndex === index;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.filterChip, active && styles.activeFilterChip]}
                onPress={() => setSelectedTypeIndex(index)}
              >
                <Text style={[styles.filterText, active && styles.activeFilterText]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.movieCard}>
          <View style={styles.posterPlaceholder} />
          <View style={styles.movieDetails}>
            <Text style={styles.movieGenre}>Biography • PG-13 • 1h 56m</Text>
            <Text style={styles.movieTitle}>Oppenheimer</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.badgeText}>+13</Text>
              </View>
              <View style={styles.outlineBadge}><Text style={styles.badgeText}>EN</Text></View>
              <View style={styles.outlineBadge}><Text style={styles.badgeText}>Sub EN/SP</Text></View>
            </View>
            <TouchableOpacity style={styles.trailerBtn}>
              <Ionicons name="play" size={16} color="black" />
              <Text style={styles.trailerText}>Trailer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Showtime</Text>
        <View style={styles.cardsGrid}>
          {showtimes.map((show) => {
            const active = selectedShowtimeId === show.id;
            const disabled = !!show.disabled;
            const availableColor = disabled
              ? '#555'
              : show.available < 10
              ? '#EE5959'
              : '#D9D900';

            return (
              <TouchableOpacity
                key={show.id}
                style={[styles.showtimeCard, active && styles.activeShowtimeCard, disabled && styles.disabledShowtimeCard]}
                onPress={() => !disabled && router.push('./ChooseSeat')}
                disabled={disabled}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardType}>{show.type}</Text>
                  <Text style={styles.cardAudio}>{show.audio}</Text>
                </View>
                <Text style={[styles.showtimeText, disabled && styles.disabledText, disabled && styles.lineThrough]}>{show.time}</Text>
                <View>
                  <Text style={[styles.hallText, disabled && styles.disabledText]}>{show.hall}</Text>
                  <Text style={[styles.availabilityText, { color: availableColor }]}>
                    {show.available > 0 ? `${show.available} Available / ${show.total}` : `${show.total} / ${show.total}`}
                  </Text>
                </View>
              </TouchableOpacity>
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
    borderRadius: 18,
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
    marginBottom: 24,
  },
  posterPlaceholder: {
    width: 100,
    height: 140,
    borderRadius: 18,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardType: {
    color: '#aaa',
    fontSize: 11,
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
