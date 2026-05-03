import * as Linking from 'expo-linking';
import type { AuthError, Session } from '@supabase/supabase-js';

import { supabase } from '@/src/supabase/client';

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your Expo public environment variables.');
  }

  return supabase;
}

function getErrorMessage(error: AuthError | Error | null | undefined, fallback: string) {
  if (!error) {
    return fallback;
  }

  return error.message || fallback;
}

function getUrlParams(url: string) {
  const [, hashFragment = ''] = url.split('#');
  const queryString = hashFragment || url.split('?')[1] || '';
  return new URLSearchParams(queryString);
}

export function getAuthCallbackUrl() {
  return Linking.createURL('/callback');
}

export async function signInWithEmailPassword(email: string, password: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to log in.'));
  }

  return data;
}

export async function signUpWithEmailPassword(email: string, password: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to sign up.'));
  }

  return data;
}

export async function createOrUpdateUserProfile(userId: string, fullName: string, languagePreference: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: fullName,
        language_preference: languagePreference,
      },
      { onConflict: 'id' }
    );

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to save profile.'));
  }

  return data;
}

export async function getCurrentUserProfile() {
  const client = getSupabaseClient();
  const session = await getCurrentSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const { data, error } = await client
    .from('profiles')
    .select('full_name, language_preference')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to load profile.'));
  }

  return data;
}

export async function completeAuthFromUrl(url: string) {
  const client = getSupabaseClient();
  const params = getUrlParams(url);
  const errorDescription = params.get('error_description');

  if (errorDescription) {
    throw new Error(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
  }

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const type = params.get('type');

  if (!accessToken || !refreshToken) {
    throw new Error('Missing auth session in confirmation link.');
  }

  const { data, error } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to complete authentication.'));
  }

  return {
    type,
    session: data.session,
    user: data.user,
  };
}

export async function sendRecoveryOtp(email: string) {
  const client = getSupabaseClient();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to send OTP.'));
  }
}

export async function verifyRecoveryOtp(email: string, token: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    throw new Error(getErrorMessage(error, 'Invalid OTP code.'));
  }

  return data;
}

export async function updateCurrentUserPassword(password: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to update password.'));
  }

  return data;
}

export async function getCurrentSession(): Promise<Session | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to read session.'));
  }

  return data.session;
}

export async function signOutUser() {
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to sign out.'));
  }
}
