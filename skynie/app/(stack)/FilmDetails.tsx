import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetMovieByIdResponse } from '@/supabase/api';
import { supabase } from '@/src/supabase/client';
import Loader from '@/components/Loader';
import { Colors } from '@/constants/color';
import { EmptyState } from '@/components/empty-state';
import { getDuration } from '@/utils';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';

export default function FilmDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [movieData, setMovieData] = useState<GetMovieByIdResponse['movie']>();
  const [relatedMovies, setRelatedMovies] = useState<GetMovieByIdResponse['relatedMovies']>([]);

  const getMovieData = async () => {
    try {
      if (!supabase || !id) return;
      const { data, error } = await supabase.functions.invoke<GetMovieByIdResponse>(`get-movie-by-id?id=${id}`, {
        method: 'GET',
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      if (data) {
        setMovieData(data.movie)
        setRelatedMovies(data.relatedMovies)
      }
    } catch (err) {
      console.error('Failed to data:', err);
    }
  };

  useEffect((() => {
    setLoading(true);
    getMovieData().then(() => setLoading(false));
  }), [id])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMovieData();
    setRefreshing(false);
  }, []);

  const handleOpenTrailer = async () => {
    const url = movieData?.trailer_url;
    if (url) {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  if (loading)
    return <Loader />

  if (!movieData)
    return <EmptyState message='Movie not found' />

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.PRIMARY.red} // iOS spinner color
            colors={[Colors.PRIMARY.red]}   // Android spinner colors
          />
        }
      >

        {/* Header Hero Section */}
        <ImageBackground
          source={{ uri: movieData.poster_url || "" }}
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
            <Text style={styles.metaText}>{movieData.genres?.map(g => g.name).join(" • ")} • {getDuration(movieData.duration_minutes)}</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{movieData.title}</Text>
              <TouchableOpacity style={styles.playBtn} onPress={handleOpenTrailer}>
                <Ionicons name="play" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              {movieData.languages?.map(lang => (
                <View key={lang} style={styles.outlineBadge}><Text style={styles.badgeText}>{lang}</Text></View>
              ))}
            </View>

            {/* Ratings Row */}
            <View style={styles.ratingContainer}>
              <RatingItem label="IMDB" value={`${movieData.rating_imdb || 'N/A'}/10`} />
              <View style={styles.separator} />
              <RatingItem label="Rotten Tomatoes" value={movieData.rating_rotten_tomatoes + "%" || 'N/A'} />
              <View style={styles.separator} />
              <RatingItem label="CornPass" value={`${movieData.rating_compass || 'N/A'}/10`} />
            </View>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <View style={styles.contentBody}>
          <Text style={styles.description}>
            {movieData.description}
          </Text>

          {/* Media Placeholders */}
          <TouchableOpacity onPress={handleOpenTrailer} style={styles.videoPlaceholder}>
            <Image style={{ position: "absolute", width: "100%", height: "100%" }} source={{ uri: movieData.banner_url || "" }} />
            <Ionicons name="play-circle" size={40} color="white" />
          </TouchableOpacity>

          {/* Cast & Crew Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Director</Text>
              <Text style={styles.value}>{movieData.directors?.join("\n")}</Text>

              <Text style={[styles.label, { marginTop: 15 }]}>Stars</Text>
              <Text style={styles.value}>{movieData.stars?.join("\n")}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Writers</Text>
              <Text style={styles.value}>{movieData.writers?.join("\n")}</Text>

              <Text style={[styles.label, { marginTop: 15 }]}>Classification</Text>
              <Text style={styles.value}>{movieData.classification}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>You may also like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendRow}>
            {relatedMovies.map((item, i) => (
              <Link
                key={i}
                href={{
                  pathname: "/(stack)/FilmDetails",
                  params: { id: item.id }
                }}
                asChild
              >
                <TouchableOpacity>
                  <Image
                    style={styles.recommendCard}
                    source={{ uri: item.poster_url || "" }}
                  />
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
          {relatedMovies.length == 0 && <EmptyState message='No related movies found' />}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <Link
          href={{
            pathname: "/(stack)/BookTicket",
            params: { id: movieData.id }
          }}
          asChild>
          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>Buy ticket</Text>
          </TouchableOpacity>
        </Link>
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
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: "left", flexShrink: 1 },
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
    marginRight: 4,
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
  description: { color: '#bbb', lineHeight: 20, justifyContent: 'center', },
  seeMore: { color: 'white', fontWeight: 'bold', },
  videoPlaceholder: {
    marginTop: 20,
    overflow: "hidden",
    position: "relative",
    width: "100%",
    aspectRatio: '16/9',
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