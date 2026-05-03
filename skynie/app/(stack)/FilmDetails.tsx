import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilmDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>

        {/* Header Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000' }}
          style={styles.heroImage}
        >
          <View
            // colors={['transparent', 'rgba(18, 18, 18, 0.8)', '#121212']}
            style={styles.gradient}
          />

          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circularBtn}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circularBtn}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.metaText}>Biography • PG-13 • 1h 56m</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Oppenheimer</Text>
              <TouchableOpacity style={styles.playBtn}>
                <Ionicons name="play" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.badgeText}>+13</Text>
              </View>
              <View style={styles.outlineBadge}><Text style={styles.badgeText}>EN</Text></View>
              <View style={styles.outlineBadge}><Text style={styles.badgeText}>Sub EN/SP</Text></View>
            </View>

            {/* Ratings Row */}
            <View style={styles.ratingContainer}>
              <RatingItem label="IMDB" value="8.9/10" />
              <View style={styles.separator} />
              <RatingItem label="Rotten Tomatoes" value="96%" />
              <View style={styles.separator} />
              <RatingItem label="CornPass" value="9.5/10" />
            </View>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <View style={styles.contentBody}>
          <Text style={styles.description} numberOfLines={3}>
            During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project... <Text style={styles.seeMore}>See More..</Text>
          </Text>

          {/* Media Placeholders */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={40} color="white" opacity={0.8} />
            </View>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={40} color="white" opacity={0.8} />
            </View>
          </ScrollView>

          {/* Cast & Crew Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Director</Text>
              <Text style={styles.value}>Christopher Nolan</Text>

              <Text style={[styles.label, { marginTop: 15 }]}>Stars</Text>
              <Text style={styles.value}>Cillian Murphy{"\n"}Emily Blunt{"\n"}Robert Downey Jr.</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Writers</Text>
              <Text style={styles.value}>Christopher Nolan{"\n"}Kai Bird</Text>

              <Text style={[styles.label, { marginTop: 15 }]}>Classification</Text>
              <Text style={styles.value}>PG-13</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>You may also like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.recommendCard} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>Buy ticket</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const RatingItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.ratingItem}>
    <Text style={styles.ratingValue}>{value}</Text>
    <Text style={styles.ratingLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { height: 450, width: '100%' },
  gradient: { ...StyleSheet.absoluteFillObject },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  circularBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  metaText: { color: '#ccc', fontSize: 14, marginBottom: 5 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  playBtn: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: { flexDirection: 'row', marginTop: 15, gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  outlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666'
  },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingItem: { alignItems: 'center', flex: 1 },
  ratingValue: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  ratingLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  separator: { width: 1, height: 30, backgroundColor: '#333' },
  contentBody: { padding: 10 },
  description: { color: '#bbb', lineHeight: 20 },
  seeMore: { color: 'white', fontWeight: 'bold' },
  mediaRow: { marginTop: 20, flexDirection: 'row' },
  videoPlaceholder: {
    width: 160,
    height: 100,
    backgroundColor: '#333',
    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePlaceholder: { width: 160, height: 100, backgroundColor: '#333', borderRadius: 12 },
  infoGrid: { flexDirection: 'row', marginTop: 25 },
  infoCol: { flex: 1 },
  label: { color: '#666', fontSize: 12, marginBottom: 4 },
  value: { color: 'white', fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 30 },
  recommendRow: { marginTop: 15 },
  recommendCard: {
    width: 100,
    height: 140,
    backgroundColor: '#333',
    borderRadius: 12,
    marginRight: 12
  },
  footer: {
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#222'
  },
  buyBtn: {
    backgroundColor: '#FF0000',
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});