import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'card' }} >
      <Stack.Screen name="FilmDetails" />
      <Stack.Screen name="OrderDetails" />
    </Stack>
  );
}