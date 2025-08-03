import React, { useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { NotificationsList } from './NotificationsList'
import { useNotifications } from '@/shared/lib/hooks/useNotifications'

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications } = useNotifications()
  const popoverRef = useRef<HTMLDivElement>(null)

  const togglePopover = () => {
    setIsOpen(!isOpen)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={popoverRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={togglePopover}
        className="relative bg-muted/30 backdrop-blur-sm rounded-sm border border-border/20 shadow-sm hover:bg-background/80 hover:text-foreground transition-all duration-200 hover:shadow-md"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-destructive to-destructive/80 text-[10px] font-medium text-destructive-foreground flex items-center justify-center animate-pulse">
            {notifications.length > 99 ? '99+' : notifications.length}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full w-[350px] right-0 mt-2 z-[60] bg-background border border-border rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
          <NotificationsList />
        </div>
      )}
    </div>
  )
}
