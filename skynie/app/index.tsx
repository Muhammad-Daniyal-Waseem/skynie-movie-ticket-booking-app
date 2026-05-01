import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/color';
import { getCurrentSession } from '@/src/auth/service';

const SPLASH_DELAY_MS = 1800;

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const timeoutId = setTimeout(async () => {
      try {
        const session = await getCurrentSession();

        if (!isMounted) {
          return;
        }

        router.replace(session ? '/(tabs)' : '/onboarding');
      } catch {
        if (isMounted) {
          router.replace('/onboarding');
        }
      }
    }, SPLASH_DELAY_MS);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.brandBlock}>
        <Image
          source={require('@/assets/images/logo.svg')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>Skynie</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    color: Colors.PRIMARY.white,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
