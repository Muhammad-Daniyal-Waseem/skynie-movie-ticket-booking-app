import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = "No data found",
  description = "Check back later for updates!"
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* You can swap this for any Image or Icon */}
      <Ionicons name='videocam-off-outline' size={48} color="#666" />
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 200, // Ensures it shows up properly in a ScrollView
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});