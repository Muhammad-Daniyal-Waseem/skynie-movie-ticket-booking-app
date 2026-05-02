import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyTickets() {
  const router = useRouter();

  const tickets = [
    { id: '1', title: 'Oppenheimer', location: 'Stars (90° Mall)', date: '13.04.2025, 22:15', count: '3 Tickets' },
    { id: '2', title: 'Oppenheimer', location: 'VOX (City Center)', date: '08.02.2025, 00:45', count: '2 Tickets' },
    { id: '3', title: 'Oppenheimer', location: 'Delox (90° Mall)', date: '26.01.2025, 14:00', count: '5 Tickets' },
  ];

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
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {tickets.map((item) => (
          <View key={item.id} style={styles.ticketCard}>
            {/* The "Punch" cutouts */}
            <View style={[styles.cutout, styles.cutoutTop]} />
            <View style={[styles.cutout, styles.cutoutBottom]} />

            <View style={styles.posterPlaceholder} />

            <View style={styles.ticketInfo}>
              <Text style={styles.movieTitle}>{item.title}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="location-sharp" size={14} color="white" />
                <Text style={styles.infoText}>{item.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time" size={14} color="white" />
                <Text style={styles.infoText}>{item.date}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="ticket-confirmation" size={14} color="white" />
                <Text style={styles.infoText}>{item.count}</Text>
              </View>
            </View>

            {/* Right side barcode placeholder */}
            <View style={styles.barcodePlaceholder} />
          </View>
        ))}
      </ScrollView>
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