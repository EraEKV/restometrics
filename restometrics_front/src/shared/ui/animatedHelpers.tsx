'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Info, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface AnimatedTooltipProps {
  children: ReactNode
  type?: 'info' | 'success' | 'warning' | 'help'
  className?: string
}

export const AnimatedTooltip = ({ 
  children, 
  type = 'info', 
  className 
}: AnimatedTooltipProps) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    help: HelpCircle
  }

  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-200',
    help: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-200'
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm',
        colors[type],
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      </motion.div>
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  )
}

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: Array<{ title: string; description: string }>
}

export const StepIndicator = ({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <motion.div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                index < currentStep 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={index === currentStep ? {
                boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 10px rgba(59, 130, 246, 0)"],
              } : {}}
              transition={index === currentStep ? {
                duration: 1.5,
                repeat: Infinity,
              } : {}}
            >
              {index < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              ) : (
                index + 1
              )}
            </motion.div>
            <div className="text-center mt-2">
              <p className={cn(
                'text-xs font-medium',
                index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              )}>
                {step.title}
              </p>
              <p className={cn(
                'text-xs',
                index <= currentStep ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              )}>
                {step.description}
              </p>
            </div>
          </div>
          {index < totalSteps - 1 && (
            <motion.div
              className={cn(
                'flex-1 h-0.5 mx-4 transition-all duration-500',
                index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: index < currentStep ? 1 : 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface FloatingActionButtonProps {
  onClick: () => void
  icon: ReactNode
  label: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  color?: 'blue' | 'green' | 'purple' | 'red'
}

export const FloatingActionButton = ({ 
  onClick, 
  icon, 
  label, 
  position = 'bottom-right',
  color = 'blue' 
}: FloatingActionButtonProps) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30',
    green: 'bg-green-500 hover:bg-green-600 shadow-green-500/30',
    purple: 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/30',
    red: 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed z-50 w-14 h-14 rounded-full text-white shadow-lg backdrop-blur-sm',
        'flex items-center justify-center transition-all duration-300',
        positions[position],
        colors[color]
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.5 
      }}
      title={label}
    >
      {icon}
    </motion.button>
  )
}
