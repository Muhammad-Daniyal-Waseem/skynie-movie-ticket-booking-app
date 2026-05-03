import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import * as Location from 'expo-location';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/color'
import { supabase } from '@/src/supabase/client'
import { CinemaWithHallTypes, SearchDataResponse } from '@/supabase/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location';
import Loader from '@/components/Loader'
import { useRouter } from 'expo-router'
import { EmptyState } from '@/components/empty-state'

export default function SearchScreen() {
  const [allCinemas, setAllCinemas] = useState<CinemaWithHallTypes[]>([]);
  const [allHallTypes, setAllHallTypes] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHallTypes, setSelectedHallTypes] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const router = useRouter();

  const getSearchScreenData = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase.functions.invoke<SearchDataResponse>('get-all-cinema', {
        method: 'GET',
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw error;
      }

      if (data) {
        setAllCinemas(data.cinemas);
        setAllHallTypes(data.allHallTypes)
      }
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    }
  };

  useEffect(() => {
    getSearchScreenData().then(() => setLoading(false));
    getUserLocation();
  }, [])

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setUserLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    } catch (err) {
      console.error('Location error:', err);
    }
  };

  const filteredCinemas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let result = allCinemas
      .map(cinema => {
        if (!userLocation || !cinema.location_lat || !cinema.location_long) {
          return { ...cinema, distance: null };
        }

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          cinema.location_lat,
          cinema.location_long
        );

        return {
          ...cinema,
          distance,
        };
      })
      .filter(cinema => {
        const matchesSearch =
          !q || cinema.name.toLowerCase().includes(q);

        const matchesHall =
          selectedHallTypes.length === 0 ||
          cinema.hall_types.some(type =>
            selectedHallTypes.includes(type)
          );

        return matchesSearch && matchesHall;
      });

    // 📍 Optional: sort by distance
    if (userLocation) {
      result.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
    }

    return result;
  }, [allCinemas, searchQuery, selectedHallTypes, userLocation]);

  const toggleHallType = (type: string) => {
    setSelectedHallTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type) // remove
        : [...prev, type]              // add
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getSearchScreenData();
    setRefreshing(false);
  }, []);

  const openMap = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    Linking.openURL(url);
  };

  if (loading)
    return <Loader />

  return (
    <SafeAreaView edges={["top"]} style={{ paddingHorizontal: 10, }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Search</Text>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginLeft: 10, color: 'white', flex: 1 }}
        />
      </View>

      {/* List */}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.PRIMARY.red} // iOS spinner color
            colors={[Colors.PRIMARY.red]}   // Android spinner colors
          />
        }
        ListHeaderComponent={
          <FlatList
            data={allHallTypes}
            horizontal
            style={{ marginVertical: 10 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Chip
                label={item}
                selected={selectedHallTypes.includes(item)}
                onPress={() => toggleHallType(item)}
              />
            )}
          />
        }
        data={filteredCinemas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openMap(item.location_lat!, item.location_long!)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cinemaName}>{item.name}</Text>

              <View style={styles.addressRow}>
                <Ionicons name="location" size={14} color="#888" />
                <Text style={styles.address}>
                  {item.address}{' '}
                  <Text style={styles.distance}>
                    {item.distance != null
                      ? `${item.distance.toFixed(1)} km`
                      : ''}
                  </Text>
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        )}
      />

      {filteredCinemas.length === 0 && (<EmptyState message='No Cinema Found' />)}

    </SafeAreaView>
  )
}


const Chip = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        selected && styles.chipActive
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextActive
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },

  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center'
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.NEUTRAL.darkGrey3,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginTop: 20
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.NEUTRAL.darkGrey3,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15
  },

  cinemaName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },

  address: {
    color: '#aaa',
    marginLeft: 5,
    fontSize: 13
  },

  distance: {
    color: '#00e676',
    fontWeight: '600'
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.NEUTRAL.darkGrey3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
    margin: 4,
  },

  chipActive: {
    backgroundColor: Colors.PRIMARY.red,
  },

  chipText: {
    color: '#ccc',
    fontSize: 14,
  },

  chipTextActive: {
    color: 'white',
    fontWeight: '600',
  },

})


const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};