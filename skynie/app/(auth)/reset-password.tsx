import { useRouter } from 'expo-router';
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
import {
  signOutUser,
  updateCurrentUserPassword,
} from '@/src/auth/service';
import { Colors } from '@/constants/color';
import { hasMinPasswordLength, showValidationToast } from '@/src/utils/validation';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleResetPassword() {
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
      await updateCurrentUserPassword(password);
      await signOutUser();
      showValidationToast('Password updated successfully');
      router.replace('/login');
    } catch (error) {
      showValidationToast(error instanceof Error ? error.message : 'Unable to reset password');
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
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.body}>
            <Text style={styles.description}>
              Create a new password for your account. Make sure it is secure and easy for you to remember.
            </Text>

            <CustomInput
              label="New password"
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
              title={isSubmitting ? 'Updating...' : 'Confirm'}
              onPress={handleResetPassword}
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
});
