import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'

import fr from '../locales/fr.json'
import ar from '../locales/ar.json'

const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
}

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user-language')
      if (savedLanguage) {
        callback(savedLanguage)
        return
      }
    } catch (error) {
      console.error('Error reading language from storage:', error)
    }
    
    const deviceLanguage = Localization.locale.split('-')[0]
    callback(deviceLanguage === 'ar' ? 'ar' : 'fr')
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language)
    } catch (error) {
      console.error('Error saving language to storage:', error)
    }
  },
}

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n