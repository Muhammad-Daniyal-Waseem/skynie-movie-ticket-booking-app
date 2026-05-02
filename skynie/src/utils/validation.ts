import { Alert, Platform, ToastAndroid } from 'react-native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

export function hasMinPasswordLength(password: string, minLength = 6) {
  return password.trim().length >= minLength;
}

export function showValidationToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert('Validation', message);
}
