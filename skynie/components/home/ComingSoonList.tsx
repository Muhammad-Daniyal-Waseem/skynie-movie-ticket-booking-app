import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Movie } from '@/supabase/api'
import { EmptyState } from '../empty-state'
import { Colors } from '@/constants/color'
import { Link } from 'expo-router'

export default function ComingSoonList({ data }: { data: Movie[] }) {

  if (data.length === 0) {
    return <EmptyState message='No up comings' />
  }

  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
      data={data}
      style={{ padding: 10 }}
      renderItem={({ item }) => <ListItem id={item.id} uri={item.poster_url || ''} onPress={() => { }} />}
    />
  )
}

function ListItem({ id, uri, onPress }: { id: string; uri: string, onPress: () => void }) {
  return (
    <Link href={{
      pathname: "/(stack)/FilmDetails",
      params: { id }
    }} asChild>
      <TouchableOpacity style={{ position: 'relative' }} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri }}
          style={{ aspectRatio: "2/3", height: 200, borderRadius: 10, backgroundColor: Colors.NEUTRAL.darkGrey }}
        />
        <Text style={{
          position: "absolute", bottom: 5, right: 5, fontSize: 12, fontWeight: "medium", padding: 4, borderRadius: 5, color
            : "white", backgroundColor: "red"
        }}>New</Text>
      </TouchableOpacity>
    </Link>
  )
}


const styles = StyleSheet.create({})