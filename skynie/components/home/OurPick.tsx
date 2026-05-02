import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'

export default function OurPick() {
  return (
    <TouchableOpacity style={{ marginHorizontal: 10, marginBottom: 10, borderRadius: 10, overflow: "hidden", position: "relative" }} onPress={() => { }}>
      <Image
        source={{ uri: "https://res.cloudinary.com/dj3vgnj0u/image/upload/v1777712993/the-boys-cast-4k-wallpaper-uhdpaper.com-54_0_k_awhbxx.jpg" }}
        style={{ aspectRatio: "16/9", height: 200 }}
      />
      <View style={{ backgroundColor: "rgba(87, 87, 87, 0.7)", width: "100%", position: "absolute", bottom: 0, padding: 5 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 4, marginBottom: 16 }}>
          <Text style={{ color: "white" }}>New • Animation • 1h 49m</Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>8.9/10 IMDb</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text numberOfLines={1} style={{ color: "white", fontSize: 24, fontWeight: "bold", flexShrink: 1, }}>The Boyssssssssssssssssssssssssss</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2, padding: 4, borderRadius: 5, backgroundColor: "red" }}>
              <Ionicons color={"white"} name={"star-outline"} />
              <Text style={{
                fontSize: 12, fontWeight: "medium", color: "white",
              }}>Our Pick</Text>
            </View>
          </View>
          <Text style={{
            fontSize: 12, fontWeight: "bold", color: "white", padding: 4, borderColor: "white", borderWidth: 1, borderRadius: 5,
          }}>EN</Text>
        </View>
      </View>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({})