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

const { width, height } = Dimensions.get('window')

const DATA = [
  {
    id: '1',
    title: 'New Arrival',
    subtitle: 'NEW • Mystery • PG-13 • 1h 56m',
    image: 'https://image.tmdb.org/t/p/w1280/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg'
  },
  {
    id: '2',
    title: 'The Batman',
    subtitle: 'Action • Crime • 2h 56m',
    image: 'https://image.tmdb.org/t/p/w1280/74xTEgt7R36Fpooo50r9T25onhq.jpg'
  },
  {
    id: '3',
    title: 'Interstellar',
    subtitle: 'Sci-Fi • Drama • 2h 49m',
    image: 'https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg'
  }
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  return (
    <View style={{ height: height * 0.7 }}>

      {/* 🔥 IMAGE CAROUSEL ONLY */}
      <FlatList
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width)
          setIndex(i)
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageBackground source={{ uri: item.image }} style={styles.image}>
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
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>

          <Text style={styles.title}>{DATA[index].title}</Text>
          <Text style={styles.subtitle}>{DATA[index].subtitle}</Text>

          {/* Dots */}
          <View style={styles.dots}>
            {DATA.map((_, i) => (
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

            <TouchableOpacity style={styles.trailerBtn}>
              <Ionicons name="play" size={18} color="black" />
              <Text style={styles.trailerText}>Trailer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="information" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width,
    height: '100%'
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
    fontWeight: 'bold'
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