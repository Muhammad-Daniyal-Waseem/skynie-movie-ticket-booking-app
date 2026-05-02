import ComingSoonList from '@/components/home/ComingSoonList'
import GenreList from '@/components/home/GenreList'
import HeroCarousel from '@/components/home/HeroCarousel'
import NewShowingList from '@/components/home/NewShowingList'
import OurPick from '@/components/home/OurPick'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/color'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  return (
    <SafeAreaView edges={['top']} >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={{ margin: 100 }} /> */}
        <HeroCarousel />
        <SectionHeading title='Now Showing' onMorePress={() => { }} />
        <NewShowingList />


        <SectionHeading title='Coming Soon' onMorePress={() => { }} />
        <ComingSoonList />

        <SectionHeading title='Genres' onMorePress={() => { }} />
        <GenreList />

        <OurPick />
      </ScrollView>
    </SafeAreaView>
  )
}


function SectionHeading({ title, onMorePress }: { title: string, onMorePress: () => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center" }}>
      <Text style={{ color: Colors.PRIMARY.white, fontSize: 18, fontWeight: 600 }}>{title}</Text>
      <TouchableOpacity onPress={onMorePress}
        style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Text style={{ color: Colors.PRIMARY.red }}>More</Text>
        <IconSymbol name="arrow-right" color={Colors.PRIMARY.red} size={16} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})
