import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { MovieWithGenres } from '@/supabase/api'
import { Colors } from '@/constants/color'
import { Link } from 'expo-router'
import { getDuration } from '@/utils'

export default function OurPick({ data }: { data: MovieWithGenres | null }) {

  if (!data) {
    return null
  }

  return (
    <Link asChild href={{ pathname: "/(stack)/FilmDetails", params: { id: data.id } }}>
      <TouchableOpacity style={{ marginHorizontal: 10, marginBottom: 10, borderRadius: 10, overflow: "hidden", position: "relative" }} onPress={() => { }}>
        <Image
          source={{ uri: data.banner_url || '' }}
          style={{ aspectRatio: "16/9", height: 200, backgroundColor: Colors.NEUTRAL.darkGrey3 }}
        />
        <View style={{ backgroundColor: "rgba(87, 87, 87, 0.7)", width: "100%", position: "absolute", bottom: 0, padding: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 4, marginBottom: 16 }}>
            <Text style={{ color: "white" }}>{data.genres?.map(g => g.name).join(" • ")} • {getDuration(data.duration_minutes)}</Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>{data.rating_imdb || 'N/A'}/10 IMDb</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text numberOfLines={1} style={{ color: "white", fontSize: 24, fontWeight: "bold", flexShrink: 1, }}>{data.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 2, padding: 4, borderRadius: 5, backgroundColor: "red" }}>
                <Ionicons color={"white"} name={"star-outline"} />
                <Text style={{
                  fontSize: 12, fontWeight: "medium", color: "white",
                }}>Our Pick</Text>
              </View>
            </View>

            {data.languages?.map(item => (<Text key={item} style={{
              fontSize: 12, fontWeight: "bold", color: "white", padding: 4, borderColor: "white", borderWidth: 1, borderRadius: 5,
            }}>{item}</Text>))}
          </View>
        </View>
      </TouchableOpacity >
    </Link>
  )
}

const styles = StyleSheet.create({})