import { Image } from 'expo-image'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

export default function NewShowingList() {
  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
      data={[0, 1, 2, 3, 5, 6, 7]}
      style={{ padding: 10 }}
      renderItem={() => <ListItem uri="https://mondoshop.com/cdn/shop/products/Ruth_Dune_Lg.jpg?v=1652158241&width=570" onPress={() => { }} />}
    />
  )
}

function ListItem({ uri, onPress }: { uri: string, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri }}
        style={{ aspectRatio: "2/3", height: 400, borderRadius: 10 }}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})