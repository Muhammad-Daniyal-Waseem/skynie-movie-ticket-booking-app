import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { completeAuthFromUrl } from '@/src/auth/service';
import { Colors } from '@/constants/color';
import { showValidationToast } from '@/src/utils/validation';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const currentUrl = Linking.useURL();
  const hasProcessed = useRef(false);
  const [message, setMessage] = useState('Completing sign up...');

  useEffect(() => {
    async function handleCallback() {
      const incomingUrl = currentUrl ?? (await Linking.getInitialURL());

      if (!incomingUrl || hasProcessed.current) {
        return;
      }

      hasProcessed.current = true;

      try {
        const result = await completeAuthFromUrl(incomingUrl);
        if (result.type === 'recovery') {
          setMessage('Password recovery ready');
          showValidationToast('Please set a new password');
          router.replace('/reset-password');
        } else {
          setMessage('Email verified successfully');
          showValidationToast(
            result.type === 'signup'
              ? 'Email confirmed successfully'
              : 'Authentication completed successfully'
          );
          router.replace('/(tabs)');
        }
      } catch (error) {
        const messageText =
          error instanceof Error ? error.message : 'Unable to complete authentication';
        setMessage(messageText);
        showValidationToast(messageText);
        router.replace('/login');
      }
    }

    handleCallback();
  }, [currentUrl, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Colors.PRIMARY.red} />
        <Text style={styles.title}>Please wait</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
  },
});
