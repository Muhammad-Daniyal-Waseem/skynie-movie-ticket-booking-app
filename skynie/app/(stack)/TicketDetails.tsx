import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TicketDetails() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerCircle} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ticket Details</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.cardWrapper}>
          <View style={styles.cardInner}>
            <View style={styles.topBadgeRow}>
              <View style={styles.sqaureBadge} />
              <Text style={styles.locationText}>Stars (90° Mall)</Text>
            </View>

            <View style={styles.movieRow}>
              <View style={styles.posterPlaceholder} />
              <View style={styles.movieMeta}>
                <Text style={styles.movieName}>Oppenheimer</Text>
                <View style={styles.movieFlagsRow}>
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>+13</Text>
                  </View>
                  <View style={styles.languageBadge}>
                    <Text style={styles.languageText}>EN</Text>
                  </View>
                  <Text style={styles.screenText}>ScreenX Dolby Atmos</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRowTop}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Amount</Text>
                <Text style={styles.infoValue}>3 Persind</Text>
              </View>
              <View style={styles.infoBlockCenter}>
                <Text style={styles.infoLabel}>Cost</Text>
                <Text style={styles.infoValue}>59.98 USD</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Hall</Text>
                <Text style={styles.infoValue}>4th</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRowBottom}>
              <View style={styles.bottomInfoBlock}>
                <Text style={styles.infoLabel}>Seats</Text>
                <Text style={styles.infoValue}>Row E (5,6,7)</Text>
              </View>
              <View style={styles.bottomInfoBlock}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>13.04.2025</Text>
              </View>
              <View style={styles.bottomInfoBlock}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>22:15</Text>
              </View>
            </View>

            <View style={styles.barcodeArea}>
              <View style={styles.barcodeRectangle} />
              <Text style={styles.barcodeNote}>Show this code to the gatekeeper at the cinema</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Text style={styles.actionText}>Send Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 18, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 50,
    height: 50,
  },
  cardWrapper: {
    backgroundColor: '#1E1E1E',
    borderRadius: 36,
    overflow: 'hidden',
  },
  cardInner: {
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 22,
    backgroundColor: '#222',
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  sqaureBadge: {
    width: 16,
    height: 16,
    borderRadius: 6,
    backgroundColor: '#60BFFF',
    marginRight: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  movieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  posterPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#AAA',
    marginRight: 16,
  },
  movieMeta: {
    flex: 1,
  },
  movieName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  movieFlagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  ageBadge: {
    backgroundColor: '#00C851',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ageText: {
    color: '#141414',
    fontWeight: '700',
    fontSize: 12,
  },
  languageBadge: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  languageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  screenText: {
    color: '#AAA',
    fontSize: 12,
    marginLeft: 10,
  },
  infoRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  infoBlock: {
    flex: 1,
  },
  infoBlockCenter: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#7D7D7D',
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 18,
  },
  infoRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  bottomInfoBlock: {
    flex: 1,
  },
  barcodeArea: {
    alignItems: 'center',
  },
  barcodeRectangle: {
    width: '100%',
    height: 90,
    borderRadius: 18,
    backgroundColor: '#BDBDBD',
    marginBottom: 14,
  },
  barcodeNote: {
    color: '#8F8F8F',
    fontSize: 12,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 20,
    height: 60,
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