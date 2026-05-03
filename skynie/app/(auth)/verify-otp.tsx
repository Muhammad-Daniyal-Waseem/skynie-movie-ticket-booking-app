import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthBackButton from '@/components/auth/AuthBackButton';
import CustomButton from '@/components/common/CustomButton';
import { verifyRecoveryOtp } from '@/src/auth/service';
import { Colors } from '@/constants/color';
import { showValidationToast } from '@/src/utils/validation';

const OTP_LENGTH = 8;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const otpDigits = useMemo(
    () =>
      Array.from({ length: OTP_LENGTH }, (_, index) => {
        return otp[index] ?? '';
      }),
    [otp]
  );

  async function handleVerifyOtp() {
    if (!email) {
      showValidationToast('Missing email address for OTP verification');
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      showValidationToast('Please enter the 8-digit OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyRecoveryOtp(email, otp);
      showValidationToast('OTP verified successfully');
      router.replace('/reset-password');
    } catch (error) {
      showValidationToast(error instanceof Error ? error.message : 'Unable to verify OTP');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          <View style={styles.headerRow}>
            <AuthBackButton />
            <Text style={styles.title}>Verify OTP</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.body}>
            <Text style={styles.description}>
              Enter the 8-digit password reset code sent to your email to continue.
            </Text>

            <Pressable style={styles.otpArea} onPress={() => inputRef.current?.focus()}>
              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={(value) => setOtp(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                style={styles.hiddenInput}
                autoFocus
              />

              <View style={styles.otpRow}>
                {otpDigits.map((digit, index) => (
                  <View key={index} style={styles.otpCell}>
                    <Text style={styles.otpDigit}>{digit}</Text>
                    <View style={styles.otpLine} />
                  </View>
                ))}
              </View>
            </Pressable>

            <Text style={styles.helperText}>A code has been sent to your email</Text>

            <CustomButton
              title={isSubmitting ? 'Verifying...' : 'Confirm'}
              onPress={handleVerifyOtp}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY.black,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  headerSpacer: {
    width: 42,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  description: {
    color: '#ECECEC',
    fontSize: 14,
    lineHeight: 28,
    maxWidth: 320,
    marginBottom: 58,
  },
  otpArea: {
    marginBottom: 30,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpCell: {
    flex: 1,
    alignItems: 'center',
  },
  otpDigit: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '500',
    height: 40,
    textAlign: 'center',
  },
  otpLine: {
    marginTop: 10,
    width: '100%',
    height: 1.2,
    backgroundColor: '#E6E6E6',
  },
  helperText: {
    color: '#EDEDED',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 72,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
  },
});
