import { useI18n } from './i18n-context'

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useI18n()
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('language')}:</span>
      <button
        className={`px-3 py-1 text-sm rounded transition-colors ${
          language === 'zh' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setLanguage('zh')}
      >
        {t('chinese')}
      </button>
      <button
        className={`px-3 py-1 text-sm rounded transition-colors ${
          language === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setLanguage('en')}
      >
        {t('english')}
      </button>
    </div>
  )
} 