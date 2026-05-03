import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/supabase/client';
import { ChooseSeatScreenParams, GetBookedSeatsResponse } from '@/supabase/api';
import { formatTimeHHMM } from '@/utils';
import { Image, ImageBackground } from 'expo-image';
import { Colors } from '@/constants/color';
import Loader from '@/components/Loader';

const rows = [
  { label: 'A', seats: 6 },
  { label: 'B', seats: 8 },
  { label: 'C', seats: 8 },
  { label: 'D', seats: 8 },
  { label: 'E', seats: 8 },
  { label: 'F', seats: 8 },
  { label: 'G', seats: 8 },
  { label: 'H', seats: 6 },
];

export default function ChooseSeat() {
  const { id, cinema, dateTime, hallName, hallType, langs, poster, title, ticketPrice } = useLocalSearchParams<ChooseSeatScreenParams>();
  const router = useRouter();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<GetBookedSeatsResponse['seats']>([])

  const [loading, setLoading] = useState(false);

  const bookedSeatSet = useMemo(() => {
    return new Set(
      bookedSeats.map(
        (s) => `${s.row_label}${s.seat_number}`
      )
    );
  }, [bookedSeats]);

  const seatRows = useMemo(() => {
    return rows.map((row) => {
      const leftCount = Math.ceil(row.seats / 2);
      const rightCount = row.seats - leftCount;
      const leftSeats = Array.from({ length: leftCount }, (_, index) => {
        const id = `${row.label}${index + 1}`;
        return {
          id,
          row: row.label,
          seatNumber: index + 1,
          status: bookedSeatSet.has(id) ? 'booked' : 'available' as const,
        };
      });
      const rightSeats = Array.from({ length: rightCount }, (_, index) => {
        const id = `${row.label}${leftCount + index + 1}`;
        return {
          id,
          row: row.label,
          seatNumber: index + 1,
          status: bookedSeatSet.has(id) ? 'booked' : 'available' as const,
        };
      });
      return { ...row, leftSeats, rightSeats };
    });
  }, [bookedSeats]);

  const getShowsData = async () => {
    try {
      if (!supabase || !id) return;
      const { data, error } = await supabase.functions.invoke<GetBookedSeatsResponse>(`get-booked-seats?show_id=${id}`, {
        method: 'GET',
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      if (data) {
        setBookedSeats(data.seats);
      }
    } catch (err) {
      console.error('Failed to data:', err);
    }
  };

  const toggleSeat = (seatId: string, status: string) => {
    if (status === 'booked') return;
    setSelectedSeats((current) => {
      if (current.includes(seatId)) {
        return current.filter((id) => id !== seatId);
      }
      // if (current.length >= 4) return current;
      return [...current, seatId];
    });
  };

  useEffect(() => {
    setLoading(true)
    getShowsData().then(() => setLoading(false));
  }, [id])

  if (loading)
    return <Loader />

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Image source={{ uri: poster }} style={{ width: '100%', height: '100%', position: "absolute", inset: 0 }} />
          <View style={{ width: '100%', height: '100%', position: "absolute", inset: 0, backgroundColor: "black", opacity: 0.5 }} />
          <View style={{
            paddingTop: 14,
            paddingBottom: 24,
            paddingHorizontal: 18,
            marginBottom: 12,
          }}>
            <View style={styles.topIconsRow}>
              <TouchableOpacity style={styles.topIconCircle} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={20} color="#141414" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.topIconCircle}>
                <Ionicons name="heart-outline" size={20} color="#141414" />
              </TouchableOpacity>
            </View>

            <Text style={styles.movieTitle}>{title}</Text>

            <View style={styles.badgeRow}>
              {langs.split(",")?.map(lang => (
                <View key={lang} style={styles.outlineBadge}><Text style={styles.badgeText}>{lang}</Text></View>
              ))}
              <View style={styles.outlineBadge}>
                <Text style={styles.badgeText}>{hallType}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <InfoBlock icon="location-outline" label="Theater" value={cinema} />
              <InfoBlock icon="cube-outline" label="Hall" value={hallName} />
              <InfoBlock icon="calendar-outline" label="Date" value={new Date(dateTime).toDateString()} />
              <InfoBlock icon="time-outline" label="Time" value={formatTimeHHMM(dateTime)} />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          <View style={styles.screenWrapper}>
            <View style={styles.screenRow} />
            <Text style={styles.screenLabel}>SCREEN</Text>
          </View>

          <View style={styles.seatMap}>
            {seatRows.map((row, index) => (
              <View key={row.label} style={styles.rowBlock}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={[styles.sideRow, { justifyContent: "flex-end" }]}>
                  {row.leftSeats.map((seat) => {
                    const selected = selectedSeats.includes(seat.id);
                    return (
                      <TouchableOpacity
                        key={seat.id}
                        style={[
                          styles.seat,
                          seat.status === 'booked' && styles.bookedSeat,
                          selected && styles.selectedSeat,
                        ]}
                        onPress={() => toggleSeat(seat.id, seat.status)}
                        disabled={seat.status === 'booked'}
                      />
                    );
                  })}
                </View>
                <View style={{ width: 26 }} />
                <View style={[styles.sideRow, { justifyContent: "flex-start" }]}>
                  {row.rightSeats.map((seat) => {
                    const selected = selectedSeats.includes(seat.id);
                    return (
                      <TouchableOpacity
                        key={seat.id}
                        style={[
                          styles.seat,
                          seat.status === 'booked' && styles.bookedSeat,
                          selected && styles.selectedSeat,
                        ]}
                        onPress={() => toggleSeat(seat.id, seat.status)}
                        disabled={seat.status === 'booked'}
                      />
                    );
                  })}
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.legendRow}>
            <LegendDot color="#EE5959" label="Booked" />
            <LegendDot color="#00C851" label="Yours" />
            <LegendDot color="#333" label="Available" outline />
          </View>

          <Link disabled={selectedSeats.length == 0} href={{
            pathname: "/(stack)/OrderDetails",
            params: {
              title,
              poster,
              langs,
              hallName,
              hallType,
              id,
              cinema,
              dateTime,
              ticketPrice,
              selectedSeats
            }
          }} asChild>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionText}>Proceed to Cash Out</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoBlock = ({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) => (
  <View style={styles.infoBlock}>
    <View style={styles.infoLabelRow}>
      <Ionicons name={icon} size={14} color="#ccc" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const LegendDot = ({ color, label, outline }: { color: string; label: string; outline?: boolean }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, outline ? styles.legendOutline : { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: {
    paddingBottom: 30,
  },
  topSection: {
    position: "relative",
    backgroundColor: '#E2E2E2',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 20
  },
  topIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  topIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    color: '#141414',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  ratingBadge: {
    backgroundColor: '#00C851',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ratingText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 12,
  },
  outlineBadge: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 10
  },
  infoBlock: {
    width: '48%',
    marginBottom: 14,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoLabel: {
    color: '#ccc',
    fontSize: 11,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  screenWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  screenRow: {
    width: '60%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    marginBottom: 10,
  },
  screenLabel: {
    color: '#7D7D7D',
    fontSize: 12,
    letterSpacing: 2,
  },
  seatMap: {
    backgroundColor: '#181818',
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  rowBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  rowLabel: {
    width: 20,
    color: '#7D7D7D',
    fontWeight: '700',
  },
  sideRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    flexWrap: 'wrap',
    flex: 1,
  },
  seat: {
    width: 24,
    height: 24,
    backgroundColor: '#121212',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  bookedSeat: {
    backgroundColor: '#EE5959',
    borderColor: '#EE5959',
  },
  selectedSeat: {
    backgroundColor: '#00C851',
    borderColor: '#00C851',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendOutline: {
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: 'transparent',
  },
  legendText: {
    color: '#ccc',
    fontSize: 13,
  },
  actionBtn: {
    height: 62,
    borderRadius: 32,
    backgroundColor: Colors.PRIMARY.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
