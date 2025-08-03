'use client'
import { useEffect } from 'react'
import { useThemeStore } from '@/shared/model/themeStore'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    setTheme(stored)
  }, [])

  return <>{children}</>
}
