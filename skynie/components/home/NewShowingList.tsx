import { Colors } from '@/constants/color'
import { Movie } from '@/supabase/api'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

export default function NewShowingList({ data }: { data: Movie[] }) {
  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
      data={data}
      style={{ padding: 10 }}
      renderItem={({ item }) => <ListItem id={item.id} uri={item.poster_url || ""} onPress={() => { }} />}
    />
  )
}

function ListItem({ uri, id, onPress }: { id: string; uri: string, onPress: () => void }) {
  return (
    <Link href={{
      pathname: "/(stack)/FilmDetails",
      params: { id }
    }} asChild>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri }}
          style={{ aspectRatio: "2/3", height: 400, borderRadius: 10, backgroundColor: Colors.NEUTRAL.darkGrey }}
        />
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({})