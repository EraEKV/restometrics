'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

interface AnimatedFormProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export const AnimatedForm = ({ children, className, title, subtitle }: AnimatedFormProps) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("max-w-2xl mx-auto p-6", className)}
    >
      {(title || subtitle) && (
        <motion.div variants={headerVariants} className="text-center mb-8">
          {title && (
            <motion.h2 
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      )}
      {children}
    </motion.div>
  )
}

interface AnimatedFormFieldProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const AnimatedFormField = ({ children, className, delay = 0 }: AnimatedFormFieldProps) => {
  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: delay * 0.1
      }
    }
  }

  return (
    <motion.div
      variants={fieldVariants}
      className={cn("mb-6", className)}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onTransitionEnd'> {
  label?: string
  error?: string
  icon?: ReactNode
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <motion.label
            className="block text-sm font-medium text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          {icon && (
            <motion.div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {icon}
            </motion.div>
          )}
          <motion.input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200",
              icon && "pl-10",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            transition={{ duration: 0.2 }}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 text-sm mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedInput.displayName = "AnimatedInput"

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onTransitionEnd'> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export const AnimatedButton = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className, 
  disabled,
  ...props 
}: AnimatedButtonProps) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
  }
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
      } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Загрузка...
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export const AnimatedCard = ({ children, className, hover = false }: AnimatedCardProps) => {
  return (
    <motion.div
      className={cn(
        "bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? {
        y: -4,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      } : {}}
    >
      {children}
    </motion.div>
  )
}
