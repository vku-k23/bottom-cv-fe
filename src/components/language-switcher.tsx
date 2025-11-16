'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect } from 'react'

export function LanguageSwitcher() {
  const { changeLanguage, language, isReady } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState('en') // Default to 'en' for SSR

  const languages = [
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
    },
    {
      code: 'vi',
      name: 'Tiếng Việt',
      flag: '🇻🇳',
    },
  ]

  // Sync with i18n language after mount
  useEffect(() => {
    setMounted(true)
    if (isReady && language) {
      setCurrentLang(language)
    }
  }, [isReady, language])

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng)
    setCurrentLang(lng)
  }

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0]

  // Show default during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Select value="en" disabled>
        <SelectTrigger className="w-[140px] min-w-0 border-none shadow-none">
          <SelectValue suppressHydrationWarning>🇺🇸 English</SelectValue>
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select
      value={currentLang}
      onValueChange={(value) => handleLanguageChange(value)}
    >
      <SelectTrigger className="w-[140px] min-w-0 border-none shadow-none">
        <SelectValue suppressHydrationWarning>
          {currentLanguage.flag} {currentLanguage.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="relative z-[9999]">
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.flag} {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
