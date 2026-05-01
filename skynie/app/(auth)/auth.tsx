import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthDivider from '@/components/auth/AuthDivider';
import SocialAuthButton from '@/components/auth/SocialAuthButton';
import CustomButton from '@/components/common/CustomButton';
import { Colors } from '@/constants/color';

export default function AuthEntryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <Image
            source={require('@/assets/images/logo.svg')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.brandName}>Skynie</Text>
        </View>

        <View style={styles.actionBlock}>
          <CustomButton title="Log In" onPress={() => router.push('/login')} style={styles.primaryButton} />
          <CustomButton
            title="Sign Up"
            onPress={() => router.push('/signup')}
            variant="outline"
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />

          <AuthDivider />

          <View style={styles.socialRow}>
            <SocialAuthButton brand="google" title="Google" />
            <SocialAuthButton brand="facebook" title="Facebook" />
          </View>
        </View>
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
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 84,
  },
  brandBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12,
  },
  logo: {
    width: 108,
    height: 108,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 10,
  },
  actionBlock: {
    marginBottom: 4,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 14,
    borderColor: Colors.PRIMARY.red,
  },
  secondaryButtonText: {
    color: Colors.PRIMARY.red,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
