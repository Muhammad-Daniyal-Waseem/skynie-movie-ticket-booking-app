import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthBackButton from '@/components/auth/AuthBackButton';
import CustomButton from '@/components/common/CustomButton';
import CustomInput from '@/components/common/CustomInput';
import { sendPasswordResetEmail } from '@/src/auth/service';
import { Colors } from '@/constants/color';
import { useRouter } from 'expo-router';
import { isValidEmail, showValidationToast } from '@/src/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleForgotPassword() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      showValidationToast('Please add a valid email');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(trimmedEmail);
      showValidationToast('Password reset code sent to your email');
      router.push({
        pathname: '/verify-otp',
        params: { email: trimmedEmail },
      });
    } catch (error) {
      showValidationToast(error instanceof Error ? error.message : 'Unable to send password reset code');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <AuthBackButton />
            <Text style={styles.title}>Forgot Password</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.body}>
            <Text style={styles.description}>
              Enter the email associated with your account and we&apos;ll send an 8-digit password reset code.
            </Text>

            <CustomInput
              label="Email"
              placeholder="Text your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              containerStyle={styles.inputGroup}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />

            <CustomButton
              title={isSubmitting ? 'Sending...' : 'Confirm'}
              onPress={handleForgotPassword}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 56,
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
    marginTop: 4,
  },
  description: {
    color: '#ECECEC',
    fontSize: 14,
    lineHeight: 28,
    marginBottom: 28,
    maxWidth: 316,
  },
  inputGroup: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: '#F2F2F2',
  },
  input: {
    backgroundColor: '#313131',
    borderRadius: 12,
    fontSize: 14,
    color: '#FFFFFF',
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
  },
});
