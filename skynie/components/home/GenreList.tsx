import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/color'
import { Genre } from '@/supabase/api'
import { EmptyState } from '../empty-state'

export default function GenreList({ data }: { data: Genre[] }) {

  if (data.length === 0) {
    return <EmptyState message='No genre found' />
  }

  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <View style={{ marginLeft: 10 }} />}
      data={data}
      style={{ padding: 10 }}
      renderItem={({ item }) => <ListItem text={item.name} icon={item.icon_url || ''} onPress={() => { }} />}
    />
  )
}

function ListItem({ text, icon, onPress }: { text: string, icon: string, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: Colors.NEUTRAL.darkGrey, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 }}>
      <Text style={{ color: "white", fontWeight: "semibold" }}>{icon} {text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})