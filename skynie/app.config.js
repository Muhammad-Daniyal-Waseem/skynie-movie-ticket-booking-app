import 'dotenv/config';
import appJson from './app.json';

const baseExpoConfig = appJson.expo ?? {};

export default {
  expo: {
    ...baseExpoConfig,

    extra: {
      ...(baseExpoConfig.extra ?? {}),
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};