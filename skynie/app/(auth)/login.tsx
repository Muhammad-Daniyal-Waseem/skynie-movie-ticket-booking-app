import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthBackButton from '@/components/auth/AuthBackButton';
import AuthDivider from '@/components/auth/AuthDivider';
import SocialAuthButton from '@/components/auth/SocialAuthButton';
import CustomButton from '@/components/common/CustomButton';
import CustomInput from '@/components/common/CustomInput';
import { signInWithEmailPassword } from '@/src/auth/service';
import { Colors } from '@/constants/color';
import { hasMinPasswordLength, isValidEmail, showValidationToast } from '@/src/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      showValidationToast('Please add a valid email');
      return;
    }

    if (!hasMinPasswordLength(password)) {
      showValidationToast('Please add a valid password');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmailPassword(trimmedEmail, password);
      showValidationToast('Logged in successfully');
      router.replace('/(tabs)');
    } catch (error) {
      showValidationToast(error instanceof Error ? error.message : 'Unable to log in');
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
            <Text style={styles.title}>Log In</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.form}>
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

            <CustomInput
              label="Password"
              placeholder="Text your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              containerStyle={styles.inputGroupTight}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />

            <View style={styles.optionsRow}>
              <Pressable onPress={() => setRememberMe((value) => !value)} style={styles.rememberWrap}>
                <MaterialIcons
                  name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                  size={22}
                  color={rememberMe ? '#16D10F' : '#8B8B8B'}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Pressable onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <CustomButton
              title={isSubmitting ? 'Logging In...' : 'Log In'}
              onPress={handleLogin}
              style={styles.submitButton}
            />

            <AuthDivider />

            <View style={styles.socialRow}>
              <SocialAuthButton brand="google" title="Google" onPress={() => showValidationToast('Google login is not connected yet')} />
              <SocialAuthButton brand="facebook" title="Facebook" onPress={() => showValidationToast('Facebook login is not connected yet')} />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don&apos;t have an account? </Text>
              <Link href="/signup" style={styles.footerLink}>
                Register
              </Link>
            </View>
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
    marginBottom: 58,
  },
  headerSpacer: {
    width: 42,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputGroupTight: {
    marginBottom: 10,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#EDEDED',
    fontSize: 12,
    marginLeft: 8,
  },
  forgotText: {
    color: '#EDEDED',
    fontSize: 12,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    color: '#F1F1F1',
    fontSize: 14,
  },
  footerLink: {
    color: '#007DFC',
    fontSize: 14,
    fontWeight: '500',
  },
});
