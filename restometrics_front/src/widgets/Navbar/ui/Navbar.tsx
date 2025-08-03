'use client'
import { useThemeStore } from '@/shared/model/themeStore'
import { Button } from '@/shared/ui/button'
import { Moon, Sun, Plus } from 'lucide-react'
import { NotificationPopover } from '@/features/notifications'
import Link from 'next/link'

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container m-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              R
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent transition-all duration-300">
                RestoMetrics
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Панель аналитики</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link className='flex items-center space-x-2' href={'/restaurant-form'}>
            
              <Plus className="h-4 w-4" />
              <span className="font-medium">Новый ресторан</span>
            </Link>
          </Button>

          <Button variant="default" size="icon" className="sm:hidden bg-gradient-to-r from-primary to-primary/90 shadow-lg">
            <Link className='flex items-center space-x-2' href={'/restaurant-form'}>
              <Plus className="h-4 w-4" />
            </Link>
          </Button>


          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="bg-muted/30 backdrop-blur-sm rounded-sm border border-border/20 shadow-sm hover:bg-background/80 hover:text-foreground transition-all duration-200 hover:shadow-md"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-yellow-500 hover:text-yellow-400 transition-colors" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 hover:text-slate-700 transition-colors" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <NotificationPopover />

          {/* <Button variant="ghost" size="icon" className="bg-muted/30 backdrop-blur-sm rounded-sm border border-border/20 shadow-sm hover:bg-background/80 hover:text-foreground transition-all duration-200 hover:shadow-md">
            <User className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </Button> */}

        </div>
      </div>
    </header>
  )
}
