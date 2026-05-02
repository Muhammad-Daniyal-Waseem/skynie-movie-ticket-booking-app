import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/color'

export default function GenreList() {
  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
      data={GENRE}
      style={{ padding: 10 }}
      renderItem={({ item }) => <ListItem text={item} onPress={() => { }} />}
    />
  )
}

function ListItem({ text, onPress }: { text: string, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: Colors.NEUTRAL.darkGrey, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 }}>
      <Text style={{ color: "white", fontWeight: "semibold" }}>{text}</Text>
    </TouchableOpacity>
  )
}


const GENRE = [
  "🗺️ Adventure",
  "💕 Romance",
  "😂 Comedy",
  "🔥 Action",
  "👻 Horror",
  "🚀 Sci-fi",
  "🔪 Thriller"
];

const styles = StyleSheet.create({})