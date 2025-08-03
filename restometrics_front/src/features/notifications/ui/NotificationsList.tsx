import React, { useState } from 'react'
import { Bell, X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { ConfirmDialog } from '@/shared/ui/confirmDialog'
import { useNotifications } from '@/shared/lib/hooks/useNotifications'
import { Notification } from '@/shared/types/notifications'

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove
}) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const getRelativeTime = (date: Date) => {
    try {
      const now = new Date()
      const diff = now.getTime() - new Date(date).getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return 'только что'
      if (minutes < 60) return `${minutes} мин. назад`
      if (hours < 24) return `${hours} ч. назад`
      if (days < 7) return `${days} дн. назад`
      return new Date(date).toLocaleDateString('ru-RU')
    } catch {
      return 'недавно'
    }
  }

  const handleRemove = () => {
    setShowConfirm(false)
    onRemove(notification.id)
  }

  return (
    <>
      <Card className="p-3 sm:p-4 border border-border/50 hover:border-border transition-colors">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <Bell className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm leading-tight mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-snug">
                  {notification.message}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              {getRelativeTime(notification.createdAt)}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowConfirm(true)}
              title="Удалить уведомление"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Удалить уведомление?"
        message={`Вы уверены, что хотите удалить уведомление "${notification.title}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
        onConfirm={handleRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}

export const NotificationsList: React.FC = () => {
  const {
    notifications,
    removeNotification,
    clearAll
  } = useNotifications()

  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearAll = () => {
    setShowClearConfirm(false)
    clearAll()
  }

  if (notifications.length === 0) {
    return (
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="p-6 sm:p-8 text-center">
          <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium mb-2">Нет уведомлений</h3>
          <p className="text-sm text-muted-foreground">
            Все уведомления будут появляться здесь
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h3 className="font-semibold text-sm sm:text-base">
            Уведомления ({notifications.length})
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs sm:text-sm text-muted-foreground hover:text-destructive px-2 sm:px-3"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Очистить все</span>
            <span className="sm:hidden">Очистить</span>
          </Button>
        </div>
        
        <div className="max-h-80 sm:max-h-96 overflow-y-auto">
          <div className="p-2 sm:p-3 space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRemove={removeNotification}
              />
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Очистить все уведомления?"
        message="Вы уверены, что хотите удалить все уведомления? Это действие нельзя отменить."
        confirmText="Очистить все"
        cancelText="Отмена"
        variant="destructive"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />
    </>
  )
}
