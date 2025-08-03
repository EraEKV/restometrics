'use client'
import { useThemeStore } from '@/shared/model/themeStore'
import { Button } from '@/shared/ui/button'
import { Moon, Sun, Menu, Bell, User, Plus, TrendingUp } from 'lucide-react'

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container m-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent transition-all duration-300">
                RestoMetrics
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Analytics Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Add New Button */}
          <Button 
            variant="default" 
            size="sm" 
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Add New</span>
          </Button>

          {/* Add Button - Mobile */}
          <Button variant="default" size="icon" className="sm:hidden bg-gradient-to-r from-primary to-primary/90 shadow-lg">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add New</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-accent/50 transition-all duration-200">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-destructive to-destructive/80 text-[10px] font-medium text-destructive-foreground flex items-center justify-center animate-pulse">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="transition-all duration-300 hover:rotate-12 hover:bg-accent/50"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 text-yellow-500 dark:-rotate-90 dark:scale-0" />
            ) : (
              <Moon className="h-4 w-4 rotate-90 scale-0 transition-all duration-300 text-blue-600 dark:rotate-0 dark:scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="icon" className="hover:bg-accent/50 transition-all duration-200">
            <User className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent/50 transition-all duration-200">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
