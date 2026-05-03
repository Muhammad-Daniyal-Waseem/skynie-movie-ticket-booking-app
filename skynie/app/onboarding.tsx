import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '@/components/common/CustomButton';
import { Colors } from '@/constants/color';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Image
        source={require('@/assets/images/bg-onboarding.svg')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.copyBlock}>
          <Text style={styles.heading}>Explore now{'\n'}to experience the benefits</Text>
          <Text style={styles.description}>
            Discover movies, check showtimes, and book your seats in just a few taps.
          </Text>
        </View>

        <CustomButton
          title="Get Started"
          onPress={() => router.replace('/auth')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  copyBlock: {
    alignItems: 'center',
    marginBottom: 34,
  },
  heading: {
    color: Colors.PRIMARY.white,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 17,
    lineHeight: 27,
    textAlign: 'center',
    maxWidth: 310,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 8,
  },
});
