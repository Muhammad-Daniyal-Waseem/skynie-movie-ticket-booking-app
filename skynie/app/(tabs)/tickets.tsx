import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/supabase/client';
import { GetUserBookingsResponse, UserBooking } from '@/supabase/api';
import { Image } from 'expo-image';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to load tickets';
}

export default function MyTickets() {
  const router = useRouter();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking =>
        booking.movieTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.cinemaName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [searchText, bookings]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase is not configured. Check your Expo public environment variables.');
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('You need to be logged in to view tickets');
        setBookings([]);
        return;
      }

      const { data, error } = await supabase.functions.invoke<GetUserBookingsResponse>(
        'get-user-bookings',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        throw error;
      }

      setBookings(data?.bookings || []);
      setFilteredBookings(data?.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(getErrorMessage(err));
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year}, ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const handleTicketPress = (booking: UserBooking) => {
    router.push({
      pathname: '/TicketDetails',
      params: {
        bookingId: booking.id,
        movieTitle: booking.movieTitle,
        moviePoster: booking.moviePoster,
        movieClassification: booking.movieClassification,
        cinemaName: booking.cinemaName,
        hallName: booking.hallName,
        hallType: booking.hallType,
        startTime: booking.startTime,
        basePrice: booking.basePrice.toString(),
        totalAmount: booking.totalAmount.toString(),
        seats: JSON.stringify(booking.seats),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circularBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <TouchableOpacity style={styles.circularBtn}>
          <Ionicons name="filter-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B3B" />
          <Text style={styles.loadingText}>Loading your tickets...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B3B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserBookings}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>
            {searchText ? 'No tickets found' : 'No tickets booked yet'}
          </Text>
          {searchText && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.ticketCard}
              onPress={() => handleTicketPress(booking)}
            >
              {/* The "Punch" cutouts */}
              <View style={[styles.cutout, styles.cutoutTop]} />
              <View style={[styles.cutout, styles.cutoutBottom]} />

              <Image source={{ uri: booking.moviePoster || "" }} style={styles.posterPlaceholder} />

              <View style={styles.ticketInfo}>
                <Text style={styles.movieTitle}>{booking.movieTitle}</Text>

                <View style={styles.infoRow}>
                  <Ionicons name="location-sharp" size={14} color="white" />
                  <Text style={styles.infoText}>{booking.cinemaName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="time" size={14} color="white" />
                  <Text style={styles.infoText}>{formatDate(booking.startTime)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="ticket-confirmation" size={14} color="white" />
                  <Text style={styles.infoText}>{booking.seats.length} Ticket{booking.seats.length !== 1 ? 's' : ''}</Text>
                </View>
              </View>

              {/* Right side barcode placeholder */}
              <View style={styles.barcodePlaceholder} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  circularBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#222',
    margin: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: 'white', fontSize: 16 },
  listContent: { paddingHorizontal: 10, paddingBottom: 40 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF6B3B',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B3B',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  clearSearchText: {
    color: '#FF6B3B',
    fontSize: 14,
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  ticketCard: {
    backgroundColor: '#222',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 20,
    overflow: 'hidden', // Clips the cutouts
    position: 'relative',
  },
  // Ticket cutouts effect
  cutout: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'black', // Matches screen background
    left: 105, // Positioned exactly at the poster edge
  },
  cutoutTop: { top: -12 },
  cutoutBottom: { bottom: -12 },

  posterPlaceholder: {
    width: 100,
    height: 120,
    backgroundColor: '#D9D9D9',
    borderRadius: 12
  },
  ticketInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-around' },
  movieTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { color: '#ccc', fontSize: 12, marginLeft: 6 },
  barcodePlaceholder: {
    width: 30,
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
    opacity: 0.5,
  },
});
