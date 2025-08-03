'use client'

import { RestaurantSelect } from '@/features/form/restaurantSelect/RestaurantSelect'
import { RestaurantSuccess } from '@/features/form/restaurantSuccess'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { RestaurantDetails } from '@/features/form/restaurantDetails/RestaurantDetails'
import { motion, AnimatePresence } from 'framer-motion'
import { useFormStore } from '@/shared/model/formStore'

export const RestaurantFormWrapper = () => {
  const { step, getProgress } = useFormStore()

  const renderStepIndicator = (stepNumber: number, title: string) => {
    const isActive = step === stepNumber
    const isCompleted = step > stepNumber
    
    return (
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: stepNumber * 0.1 }}
      >
        <div 
          className={`
            w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg
            ${isCompleted 
              ? 'bg-green-500 text-white scale-105' 
              : isActive 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 ring-4 ring-blue-200 dark:ring-blue-800' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {isCompleted ? '✓' : stepNumber + 1}
        </div>
        <span className={`mt-2 text-xs sm:text-sm transition-colors duration-300 text-center ${
          isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 
          isCompleted ? 'text-green-600 dark:text-green-400 font-medium' : 
          'text-gray-500 dark:text-gray-400'
        }`}>
          {title}
        </span>
      </motion.div>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <RestaurantSelect />
      case 1:
        return <RestaurantDetails />
      case 2:
        return <RestaurantSuccess />
      default:
        return <RestaurantSelect />
    }
  }
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center p-2 sm:p-4"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="backdrop-blur-xl border-border/50 shadow-2xl">
            <CardHeader className="border-b border-border/50 px-4 py-4 sm:px-6 sm:py-6">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center mb-6 text-foreground">
                  Регистрация ресторана
                </CardTitle>

                <div className="flex justify-center items-center">
                  <div className="flex items-center space-x-4">
                    {renderStepIndicator(0, 'Выбор ресторана')}
                    
                    <div className={`w-12 sm:w-16 h-0.5 transition-colors duration-300 ${
                      step > 0 ? 'bg-green-500' : step === 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    
                    {renderStepIndicator(1, 'Детали')}
                    
                    <div className={`w-12 sm:w-16 h-0.5 transition-colors duration-300 ${
                      step > 1 ? 'bg-green-500' : step === 1 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    
                    {renderStepIndicator(2, 'Завершение')}
                  </div>
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-x-hidden min-h-[400px] sm:min-h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
