import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/color';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  function getIconName(name: IconSymbolName, focused: boolean) {
    return focused ? (name + ".focus") as IconSymbolName : name
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY.red,
        tabBarInactiveTintColor: Colors.NEUTRAL.darkGrey2,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.PRIMARY.black,
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
          paddingTop: 15,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={getIconName("home", focused)} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={getIconName("search", focused)} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={getIconName("ticket", focused)} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={getIconName("profile", focused)} color={color} />,
        }}
      />
    </Tabs>
  );
}
