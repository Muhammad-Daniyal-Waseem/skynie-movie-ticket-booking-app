import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

export default function ComingSoonList() {
  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
      data={[0, 1, 2, 3, 5, 6, 7]}
      style={{ padding: 10}}
      renderItem={() => <ListItem uri="https://mondoshop.com/cdn/shop/products/Ruth_Dune_Lg.jpg?v=1652158241&width=570" onPress={() => { }} />}
    />
  )
}

function ListItem({ uri, onPress }: { uri: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={{ position: 'relative' }} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri }}
        style={{ aspectRatio: "2/3", height: 200, borderRadius: 10 }}
      />
      <Text style={{
        position: "absolute", bottom: 5, right: 5, fontSize: 12, fontWeight: "medium", padding: 4, borderRadius: 5, color
          : "white", backgroundColor: "red"
      }}>New</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({})