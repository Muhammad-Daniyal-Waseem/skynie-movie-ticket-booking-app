import { Colors } from '@/constants/color'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={Colors.PRIMARY.red} size={'large'} />
    </View>
  )
}
