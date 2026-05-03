import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthBackButton from '@/components/auth/AuthBackButton';
import AuthDivider from '@/components/auth/AuthDivider';
import SocialAuthButton from '@/components/auth/SocialAuthButton';
import CustomButton from '@/components/common/CustomButton';
import CustomInput from '@/components/common/CustomInput';
import { createOrUpdateUserProfile, signInWithEmailPassword, signUpWithEmailPassword } from '@/src/auth/service';
import { Colors } from '@/constants/color';
import { hasMinPasswordLength, isValidEmail, showValidationToast } from '@/src/utils/validation';

export default function SignUpScreen() {
  const router = useRouter();
  type LanguageCode = 'en' | 'ja' | 'it' | 'de';

  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [languagePreference, setLanguagePreference] = React.useState<LanguageCode>('en');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const languageOptions: { value: LanguageCode; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'it', label: 'Italian' },
    { value: 'de', label: 'German' },
  ];

  async function handleSignUp() {
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    if (!trimmedFullName) {
      showValidationToast('Please enter your full name');
      return;
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      showValidationToast('Please add a valid email');
      return;
    }

    if (!hasMinPasswordLength(password)) {
      showValidationToast('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showValidationToast('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signUpWithEmailPassword(trimmedEmail, password);

      if (result.user?.id) {
        await createOrUpdateUserProfile(result.user.id, trimmedFullName, languagePreference);
      }

      if (result.session) {
        showValidationToast('Account created successfully');
        router.replace('/(tabs)');
        return;
      }

      // If signUp does not return a session, try sign in immediately.
      try {
        await signInWithEmailPassword(trimmedEmail, password);
        showValidationToast('Account created successfully');
        router.replace('/(tabs)');
        return;
      } catch {
        showValidationToast('Account created successfully. Please log in.');
        router.replace('/login');
      }
    } catch (error) {
      showValidationToast(error instanceof Error ? error.message : 'Unable to sign up');
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
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Full name"
              placeholder="Text your full name"
              value={fullName}
              onChangeText={setFullName}
              containerStyle={styles.inputGroup}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />

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

            <Text style={styles.sectionLabel}>Language preference</Text>
            <View style={styles.languageRow}>
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setLanguagePreference(option.value)}
                  style={[
                    styles.languageOption,
                    languagePreference === option.value && styles.languageOptionActive,
                  ]}>
                  <Text
                    style={[
                      styles.languageOptionText,
                      languagePreference === option.value && styles.languageOptionTextActive,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomInput
              label="Password"
              placeholder="Text your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              containerStyle={styles.inputGroup}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />

            <CustomInput
              label="Confirm password"
              placeholder="Text your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              containerStyle={styles.inputGroupLast}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />

            <CustomButton
              title={isSubmitting ? 'Signing Up...' : 'Sign Up'}
              onPress={handleSignUp}
              style={styles.submitButton}
            />

            <AuthDivider />

            <View style={styles.socialRow}>
              <SocialAuthButton brand="google" title="Google" onPress={() => showValidationToast('Google signup is not connected yet')} />
              <SocialAuthButton brand="facebook" title="Facebook" onPress={() => showValidationToast('Facebook signup is not connected yet')} />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/login" style={styles.footerLink}>
                Log In
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
    marginBottom: 16,
  },
  inputGroupLast: {
    marginBottom: 30,
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
  sectionLabel: {
    color: '#E5E5E5',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  languageOptionActive: {
    backgroundColor: Colors.PRIMARY.red,
    borderColor: Colors.PRIMARY.red,
  },
  languageOptionText: {
    color: '#D8D8D8',
    fontSize: 14,
    fontWeight: '500',
  },
  languageOptionTextActive: {
    color: '#FFFFFF',
  },
});
