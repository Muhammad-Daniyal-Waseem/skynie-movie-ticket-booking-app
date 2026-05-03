import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from '@/constants/color'
import { getCurrentSession, getCurrentUserProfile, signOutUser } from '@/src/auth/service'
import { showValidationToast } from '@/src/utils/validation'

function ActionRow({
  label,
  value,
  icon,
  iconColor = Colors.PRIMARY.white,
  onPress,
}: {
  label: string
  value?: string
  icon: React.ComponentProps<typeof Ionicons>['name']
  iconColor?: string
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      android_ripple={{ color: '#2B2B2B' }}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowTextWrap}>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {value ? <Text style={styles.rowValueRight}>{value}</Text> : null}
    </Pressable>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [language, setLanguage] = useState('English (US)')
  const [pushEnabled, setPushEnabled] = useState(true)
  const [promoEnabled, setPromoEnabled] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getCurrentSession()
        const user = session?.user

        if (user) {
          setEmail(user.email ?? null)
        }

        const profile = await getCurrentUserProfile()
        setName(profile?.full_name ?? null)
        setLanguage(languageLabel(profile?.language_preference))
      } catch {
        setEmail(null)
        setName(null)
        setLanguage('English (US)')
      }
    }

    loadSession()
  }, [])

  function languageLabel(code?: string | null) {
    switch (code) {
      case 'ja':
        return 'Japanese'
      case 'it':
        return 'Italian'
      case 'de':
        return 'German'
      case 'es':
        return 'Español'
      case 'th':
        return 'ไทย'
      default:
        return 'English'
    }
  }

  const handleLogout = React.useCallback(
    async () => {
      try {
        setIsSigningOut(true)
        await signOutUser()
        showValidationToast('Logged out successfully')
        router.replace('/login')
      } catch (error) {
        showValidationToast(error instanceof Error ? error.message : 'Unable to sign out')
      } finally {
        setIsSigningOut(false)
      }
    },
    [router]
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>Account</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatar} />
            <Text style={styles.profileName}>{name ?? 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{email ?? 'No email available'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Account</Text>
            <ActionRow label="Full name" icon="person-circle-outline" value={name ?? '—'} />
            <ActionRow
              label="Language"
              icon="globe-outline"
              value={language}
            />
            <ActionRow label="Privacy Policy" icon="shield-checkmark-outline" />
            <ActionRow label="Setting" icon="settings-outline" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Ionicons name="notifications-outline" size={20} color={Colors.PRIMARY.white} />
              </View>
              <Text style={styles.rowLabel}>Push Notifications</Text>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                thumbColor={pushEnabled ? Colors.PRIMARY.red : '#BFBFBF'}
                trackColor={{ false: '#2D2D2D', true: '#4B1A1A' }}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Ionicons name="notifications-off-outline" size={20} color={Colors.PRIMARY.white} />
              </View>
              <Text style={styles.rowLabel}>Promotional Notifications</Text>
              <Switch
                value={promoEnabled}
                onValueChange={setPromoEnabled}
                thumbColor={promoEnabled ? Colors.PRIMARY.red : '#BFBFBF'}
                trackColor={{ false: '#2D2D2D', true: '#4B1A1A' }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More</Text>
            <ActionRow label="Help Center" icon="help-circle-outline" />
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.logoutRow, pressed && styles.rowPressed]}
              android_ripple={{ color: '#2B2B2B' }}>
              <View style={styles.iconWrapper}>
                <Ionicons name="log-out-outline" size={20} color={Colors.SEMANTIC.red} />
              </View>
              <Text style={styles.logoutText}>{isSigningOut ? 'Signing out...' : 'Log Out'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  pageTitle: {
    color: Colors.PRIMARY.white,
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 18,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3A3A3A',
    marginBottom: 14,
  },
  profileName: {
    color: Colors.PRIMARY.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  profileEmail: {
    color: Colors.NEUTRAL.lightGrey,
    fontSize: 14,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: Colors.PRIMARY.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  rowPressed: {
    opacity: 0.7,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowLabel: {
    color: Colors.PRIMARY.white,
    fontSize: 15,
    fontWeight: '500',
  },
  rowValueRight: {
    color: Colors.NEUTRAL.darkGrey2,
    fontSize: 14,
    marginLeft: 10,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  logoutText: {
    color: Colors.SEMANTIC.red,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },
})