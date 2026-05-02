import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/color'

const filters = ['IMAX', 'GOLD', 'ScreenX', '4D MAX']

const cinemas = [
  {
    id: '1',
    name: 'Stars (90°Mall)',
    address: '23 Sunny Boulevard, Sunshine City',
    distance: '1.2km'
  },
  {
    id: '2',
    name: 'FilmHouse (Galaxy Plaza)',
    address: '456 Starry Lane, Galaxy Town',
    distance: '1.8km'
  },
  {
    id: '3',
    name: 'ReelMagic (Dreamland Center)',
    address: '101 Paradise Parkway, Paradise City',
    distance: '2.7km'
  },
  {
    id: '4',
    name: 'StarVista (Cosmo City Mall)',
    address: '303 Ocean Drive, OceanView',
    distance: '4.0km'
  },
  {
    id: '5',
    name: 'FlickPalace (Emerald Plaza)',
    address: '505 Skyway Avenue, Skyline District',
    distance: '5.2km'
  }
]

export default function SearchScreen() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 50 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
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
          style={{ marginLeft: 10, color: 'white', flex: 1 }}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 15 }}>
        {filters.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              index === 0 && styles.activeChip
            ]}
          >
            <Text
              style={[
                styles.chipText,
                index === 0 && styles.activeChipText
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={cinemas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cinemaName}>{item.name}</Text>

              <View style={styles.addressRow}>
                <Ionicons name="location" size={14} color="#888" />
                <Text style={styles.address}>
                  {item.address}{' '}
                  <Text style={styles.distance}>{item.distance}</Text>
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        )}
      />

    </View>
  )
}

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

  chip: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10
  },

  activeChip: {
    backgroundColor: 'red'
  },

  chipText: {
    marginVertical: 8,
    color: '#ccc'
  },

  activeChipText: {
    color: 'white',
    fontWeight: '600'
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
})