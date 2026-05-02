import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, presentation: 'card'
      }}
    >
      <Stack.Screen
        name="film-details"
      />

    </Stack>
  );
}