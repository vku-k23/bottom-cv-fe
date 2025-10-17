'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { useTranslation } from '@/hooks/useTranslation'
import { useState } from 'react'

export function LanguageSwitcher() {
  const { changeLanguage, getCurrentLanguage } = useTranslation()
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage())

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

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng)
    setCurrentLang(lng)
  }

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0]

  return (
    <Select
      value={currentLang}
      onValueChange={(value) => handleLanguageChange(value)}
    >
      <SelectTrigger className="w-[140px] min-w-0 border-none shadow-none">
        <SelectValue>
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
