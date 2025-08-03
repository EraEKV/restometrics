import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'default'
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog Container */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        {/* Dialog */}
        <Card className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 bg-background border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              variant === 'destructive' 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-primary/10 text-primary'
            }`}>
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">{title}</h3>
              <p className="text-muted-foreground text-sm mb-4 sm:mb-6 leading-relaxed">{message}</p>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="w-full sm:w-auto"
                >
                  {cancelText}
                </Button>
                <Button
                  variant={variant === 'destructive' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={onConfirm}
                  className="w-full sm:w-auto"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8 -mt-1 -mr-1 flex-shrink-0"
              onClick={onCancel}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
