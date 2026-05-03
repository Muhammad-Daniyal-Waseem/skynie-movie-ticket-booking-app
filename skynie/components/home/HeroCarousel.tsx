import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Movie } from '@/supabase/api'
import { Colors } from '@/constants/color'
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get('window')

export default function HeroCarousel({ data }: { data: Movie[] }) {
  const [index, setIndex] = useState(0)

  const handleOpenTrailer = async () => {
    const url = data[index]?.trailer_url;
    if (url) {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  if (data.length == 0) {
    return null;
  }

  return (
    <View style={{ height: height * 0.7 }}>

      {/* 🔥 IMAGE CAROUSEL ONLY */}
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width)
          setIndex(i)
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageBackground source={{ uri: item.poster_url || '' }} style={styles.image}>
            <View style={styles.overlay} />
          </ImageBackground>
        )}
      />

      {/* 🔥 FIXED UI OVERLAY */}
      <View style={styles.overlayContainer}>

        {/* Top Icons */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>

          <Link href="/(tabs)/search" asChild>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Bottom Content */}
        <View style={styles.centerContent}>
          <Text style={styles.title}>{data[index].title}</Text>

          {/* Dots */}
          <View style={styles.dots}>
            {data.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  index === i && styles.activeDot
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="add" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.trailerBtn} onPress={handleOpenTrailer}>
              <Ionicons name="play" size={18} color="black" />
              <Text style={styles.trailerText}>Trailer</Text>
            </TouchableOpacity>

            <Link
              href={{
                pathname: "/(stack)/FilmDetails",
                params: { id: data[index]?.id }
              }}
              asChild>
              <TouchableOpacity style={styles.circleBtn}>
                <Ionicons name="information" size={22} color="white" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width,
    height: '100%',
    backgroundColor: Colors.NEUTRAL.darkGrey
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },

  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between'
  },

  topBar: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  iconBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  centerContent: {
    alignItems: 'center',
    marginBottom: 40
  },

  newBadge: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6
  },

  newText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },

  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: "center"
  },

  subtitle: {
    color: '#ddd',
    marginTop: 5
  },

  dots: {
    flexDirection: 'row',
    marginTop: 10
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#aaa',
    marginHorizontal: 3
  },

  activeDot: {
    width: 20,
    backgroundColor: 'white'
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 20
  },

  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  trailerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8
  },

  trailerText: {
    fontWeight: 'bold'
  }
})