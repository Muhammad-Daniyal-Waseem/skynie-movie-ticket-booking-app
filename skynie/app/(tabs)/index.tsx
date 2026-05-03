import ComingSoonList from '@/components/home/ComingSoonList'
import GenreList from '@/components/home/GenreList'
import HeroCarousel from '@/components/home/HeroCarousel'
import NewShowingList from '@/components/home/NewShowingList'
import OurPick from '@/components/home/OurPick'
import Loader from '@/components/Loader'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/color'
import { supabase } from '@/src/supabase/client'
import { Genre, HomeDataResponse, Movie, MovieWithGenres } from '@/supabase/api'
import React, { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  const [carousel, setCarousel] = useState<Movie[]>([])
  const [nowShowing, setNowSowing] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [ourPick, setOurPick] = useState<MovieWithGenres | null>(null)

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getHomeScreenData = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase.functions.invoke<HomeDataResponse>('get-home-data', {
        method: 'GET',
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      if (data) {
        setCarousel(data.carousel);
        setNowSowing(data.activeMovies);
        setUpcomingMovies(data.upcomingMovies);
        setGenres(data.allGenres);
        setOurPick(data.ourPick);
      }
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHomeScreenData();
    setRefreshing(false);
  }, []);

  useEffect(() => {

    getHomeScreenData().then(() => setLoading(false));
  }, [])

  if (loading)
    return <Loader />

  return (
    <SafeAreaView edges={['top']} >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.PRIMARY.red} // iOS spinner color
            colors={[Colors.PRIMARY.red]}   // Android spinner colors
          />
        }
      >
        {/* <View style={{ margin: 100 }} /> */}
        <HeroCarousel data={carousel} />
        <SectionHeading title='Now Showing' onMorePress={() => { }} />
        <NewShowingList data={nowShowing} />


        <SectionHeading title='Coming Soon' onMorePress={() => { }} />
        <ComingSoonList data={upcomingMovies} />

        <SectionHeading title='Genres' onMorePress={() => { }} />
        <GenreList data={genres} />

        <OurPick data={ourPick} />
      </ScrollView>
    </SafeAreaView>
  )
}


function SectionHeading({ title, onMorePress }: { title: string, onMorePress: () => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, alignItems: "center" }}>
      <Text style={{ color: Colors.PRIMARY.white, fontSize: 18, fontWeight: 600 }}>{title}</Text>
      <TouchableOpacity onPress={onMorePress}
        style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Text style={{ color: Colors.PRIMARY.red }}>More</Text>
        <IconSymbol name="arrow-right" color={Colors.PRIMARY.red} size={16} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})
