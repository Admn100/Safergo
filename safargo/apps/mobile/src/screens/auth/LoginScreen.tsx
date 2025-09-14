import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { authService } from '../../services/api'
import { AlgeriaFlag } from '../../components/AlgeriaFlag'

export function LoginScreen() {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async () => {
    const value = method === 'email' ? email : phone
    if (!value) {
      Alert.alert(t('error'), t('auth.enterEmailOrPhone'))
      return
    }

    setLoading(true)
    try {
      const data = {
        ...(method === 'email' ? { email } : { phone }),
        locale: i18n.language,
      }
      
      await authService.requestOtp(data)
      
      navigation.navigate('Otp' as any, data)
    } catch (error: any) {
      Alert.alert(
        t('error'),
        error.response?.data?.message || t('auth.errorOtp')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <AlgeriaFlag size={60} />
          <Text style={styles.title}>SafarGo</Text>
          <Text style={styles.subtitle}>{t('auth.welcome')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, method === 'email' && styles.activeTab]}
              onPress={() => setMethod('email')}
            >
              <Text
                style={[
                  styles.tabText,
                  method === 'email' && styles.activeTabText,
                ]}
              >
                {t('auth.email')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, method === 'phone' && styles.activeTab]}
              onPress={() => setMethod('phone')}
            >
              <Text
                style={[
                  styles.tabText,
                  method === 'phone' && styles.activeTabText,
                ]}
              >
                {t('auth.phone')}
              </Text>
            </TouchableOpacity>
          </View>

          {method === 'email' ? (
            <TextInput
              style={styles.input}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder={t('auth.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRequestOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('auth.requestOtp')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.terms')}</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006233',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  form: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#006233',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#006233',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
})