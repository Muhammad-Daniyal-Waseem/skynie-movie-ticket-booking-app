import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const bookedSeats = new Set([ 'A2', 'A5', 'B3', 'C6', 'D2', 'E4', 'F7', 'G5', 'H1', 'H6' ]);

export default function ChooseSeat() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const seatRows = useMemo(() => {
    return rows.map((row) => {
      const leftCount = Math.ceil(row.seats / 2);
      const rightCount = row.seats - leftCount;
      const leftSeats = Array.from({ length: leftCount }, (_, index) => {
        const id = `${row.label}${index + 1}`;
        return {
          id,
          row: row.label,
          status: bookedSeats.has(id) ? 'booked' : 'available' as const,
        };
      });
      const rightSeats = Array.from({ length: rightCount }, (_, index) => {
        const id = `${row.label}${leftCount + index + 1}`;
        return {
          id,
          row: row.label,
          status: bookedSeats.has(id) ? 'booked' : 'available' as const,
        };
      });
      return { ...row, leftSeats, rightSeats };
    });
  }, []);

  const toggleSeat = (seatId: string, status: string) => {
    if (status === 'booked') return;
    setSelectedSeats((current) => {
      if (current.includes(seatId)) {
        return current.filter((id) => id !== seatId);
      }
      if (current.length >= 4) return current;
      return [...current, seatId];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.topIconsRow}>
            <TouchableOpacity style={styles.topIconCircle} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="#141414" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topIconCircle}>
              <Ionicons name="heart-outline" size={20} color="#141414" />
            </TouchableOpacity>
          </View>

          <Text style={styles.movieTitle}>Oppenheimer</Text>

          <View style={styles.badgeRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>+13</Text>
            </View>
            <View style={styles.outlineBadge}>
              <Text style={styles.badgeText}>EN</Text>
            </View>
            <View style={styles.outlineBadge}>
              <Text style={styles.badgeText}>ScreenX</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <InfoBlock icon="location-outline" label="Theater" value="Stars (90°Mall)" />
            <InfoBlock icon="cube-outline" label="Hall" value="1st" />
            <InfoBlock icon="calendar-outline" label="Date" value="13.04.2025" />
            <InfoBlock icon="time-outline" label="Time" value="22:15" />
          </View>
        </View>

        <View style={styles.screenWrapper}>
          <View style={styles.screenRow} />
          <Text style={styles.screenLabel}>SCREEN</Text>
        </View>

        <View style={styles.seatMap}>
          {seatRows.map((row) => (
            <View key={row.label} style={styles.rowBlock}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <View style={styles.sideRow}>
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
              <View style={styles.sideRow}>
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

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('./OrderDetails')}>
          <Text style={styles.actionText}>Proceed to Cash Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoBlock = ({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) => (
  <View style={styles.infoBlock}>
    <View style={styles.infoLabelRow}>
      <Ionicons name={icon} size={14} color="#556473" />
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
    backgroundColor: '#E2E2E2',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 14,
    paddingBottom: 24,
    paddingHorizontal: 18,
    marginBottom: 12,
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
    color: '#7D7D7D',
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
    gap: 10,
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
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
