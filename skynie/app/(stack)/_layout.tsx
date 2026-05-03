import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'card' }} >
      <Stack.Screen name="FilmDetails" />
      <Stack.Screen name="BookTicket" />
      <Stack.Screen name="ChooseSeat" />
      <Stack.Screen name="OrderDetails" />
      <Stack.Screen name="TicketDetails" />
    </Stack>
  );
}