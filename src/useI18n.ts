import { usePersistState } from './hooks'
import { translations, type Language } from './i18n'

export const useI18n = () => {
  const [language, setLanguage] = usePersistState<Language>('language', 'zh')
  
  const t = (key: keyof typeof translations.zh, interpolations?: Record<string, string | number>) => {
    const currentTranslations = translations[language] as typeof translations.zh
    let text = currentTranslations[key] || translations.zh[key] || key
    
    if (interpolations) {
      Object.entries(interpolations).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(value))
      })
    }
    
    return text
  }
  
  return {
    language,
    setLanguage,
    t,
    isZh: language === 'zh',
    isEn: language === 'en'
  }
} 