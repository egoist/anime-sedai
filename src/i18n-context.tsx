import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { translations, type Language } from './i18n'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.zh, interpolations?: Record<string, string | number>) => string
  isZh: boolean
  isEn: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('language')
      return saved ? JSON.parse(saved) : 'zh'
    } catch {
      return 'zh'
    }
  })

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    try {
      localStorage.setItem('language', JSON.stringify(newLanguage))
    } catch (error) {
      console.error('Failed to save language to localStorage:', error)
    }
  }

  const t = (key: keyof typeof translations.zh, interpolations?: Record<string, string | number>) => {
    const currentTranslations = translations[language]
    let text = currentTranslations[key] || translations.zh[key] || key
    
    if (interpolations) {
      Object.entries(interpolations).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(value))
      })
    }
    
    return text
  }

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isZh: language === 'zh',
    isEn: language === 'en'
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
} 