import React, { ComponentProps, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderDetailsScreenParams } from '@/supabase/api';
import { formatTimeHHMM } from '@/utils';
import { Image } from 'expo-image';
import { getCurrentSession } from '@/src/auth/service';
import { supabase } from '@/src/supabase/client';
import { Colors } from '@/constants/color';
import { showValidationToast } from '@/src/utils/validation';

export default function OrderDetails() {
  const { id, cinema, dateTime, hallName, hallType, langs, poster, title, ticketPrice, selectedSeats } = useLocalSearchParams<OrderDetailsScreenParams>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const bookSeats = async () => {
    try {
      setLoading(true);
      const session = await getCurrentSession()
      const user = session?.user

      if (!supabase || !user) return;
      const body = {
        show_id: id,
        user_id: user.id,
        total_amount: Number(ticketPrice) * selectedSeats.split(",").length,
        seats: selectedSeats.split(",").map((seatId) => {
          const row_label = seatId[0]; // "A1" -> "A"
          const seat_number = parseInt(seatId.slice(1)); // "A1" -> 1

          return { row_label, seat_number };
        }),
      }

      const { data, error } = await supabase.functions.invoke('book-seats', {
        method: 'POST',
        body,
      });

      if (error) {
        console.error('Booking error:', error);
        return;
      }

      showValidationToast("Ticket(s) booked successfully")
      router.replace('/(tabs)');
      console.log('Booking success:', data);

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* Movie Summary Card */}
        <View style={styles.movieCard}>
          <Image source={{ uri: poster }} style={styles.posterPlaceholder} />
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{title}</Text>
            <View style={styles.badgeRow}>
              {langs.split(",")?.map(lang => (
                <View key={lang} style={styles.badgeOutline}><Text style={styles.badgeText}>{lang}</Text></View>
              ))}
              <View style={styles.badgeOutline}><Text style={styles.badgeText}>{hallType}</Text></View>
            </View>
          </View>
        </View>

        {/* Showtime Grid */}
        <View style={styles.gridRow}>
          <GridItem icon="location-outline" label="Theater" value={cinema} />
          <GridItem icon="film-outline" label="film-outline" value={hallName} />
          <GridItem icon="calendar-outline" label="Date" value={new Date(dateTime).toDateString()} />
          <GridItem icon="time-outline" label="Time" value={formatTimeHHMM(dateTime)} />
        </View>

        <View style={styles.divider} />

        {/* Tickets Section */}
        <SectionHeader title="Tickets" />
        {
          selectedSeats.split(",").map((seat, index) => (
            <LineItem key={index} label={`Row ${seat[0]}, Seat ${seat[1]}`} price={`${ticketPrice} USD`} />
          ))
        }
        {/* Snacks Section (Smaks)
        <SectionHeader title="Smaks" />
        <LineItem label="X2 Medium Solt Popcorn" price="16 USD" isSnack />
        <LineItem label="X1 Larg Caramel Popcorn" price="16 USD" isSnack /> */}

        <View style={styles.divider} />

        {/* Total Section */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{selectedSeats.split(",").length * Number(ticketPrice)} USD</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.payBtn} onPress={bookSeats} disabled={loading}>
          {loading && <ActivityIndicator color={"white"} />}
          <Text style={styles.payBtnText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Sub-components for cleaner code
const GridItem = ({ icon, label, value }: { icon: ComponentProps<typeof Ionicons>['name'], label: string, value: string }) => (
  <View style={styles.gridItem}>
    <View style={styles.labelRow}>
      <Ionicons name={icon} size={12} color="#666" />
      <Text style={styles.gridLabel}> {label}</Text>
    </View>
    <Text style={styles.gridValue}>{value}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const LineItem = ({ label, price, isSnack }: any) => (
  <View style={styles.lineItem}>
    <Text style={[styles.lineLabel, isSnack && { color: '#666' }]}>{label}</Text>
    <Text style={styles.linePrice}>{price}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
  },
  headerBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  scrollBody: { paddingHorizontal: 10 },
  movieCard: { flexDirection: 'row', marginTop: 30, marginBottom: 30 },
  posterPlaceholder: { width: 85, height: 110, backgroundColor: '#D9D9D9', borderRadius: 10 },
  movieInfo: { marginLeft: 20, justifyContent: 'center', flex: 1 },
  movieTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10, flexShrink: 1, flexWrap: 'wrap', },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeOutline: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#555' },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  screenInfo: { flexDirection: 'row', gap: 15, marginLeft: 10 },
  smallLabel: { color: 'white', fontSize: 10, lineHeight: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  gridItem: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  gridLabel: { color: '#666', fontSize: 11 },
  gridValue: { color: 'white', fontSize: 13, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 20 },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  lineLabel: { color: '#666', fontSize: 14 },
  linePrice: { color: 'white', fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  totalLabel: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  totalValue: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  footer: {
    width: '100%',
  },
  payBtn: {
    flexDirection: "row",
    gap: 5,
    marginHorizontal: 10,
    backgroundColor: '#FF0000',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});