'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Home, RotateCcw, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useFormStore } from '@/shared/model/formStore'
import { useRestaurantStore } from '@/shared/model/restaurantStore'
import { useAuthStore } from '@/shared/model/authStore'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

export const RestaurantSuccess = () => {
  const { data, resetForm } = useFormStore()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    const submitRegistration = async () => {
      if (!data.selectedRestaurant || !data.ownerName || !data.phone || !data.email || isSubmitting || hasSubmitted) {
        return
      }

      setIsSubmitting(true)
      setHasSubmitted(true)
      
      try {
        const restaurantName = data.customRestaurantName || data.selectedRestaurant.name
        const address = data.selectedRestaurant.address
        const coordinates = data.selectedRestaurant.coordinates
        
        const generatedId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const restaurantData = {
          id: generatedId,
          name: restaurantName,
          address: address,
          coordinates: coordinates,
          hasMenu: data.selectedRestaurant.hasMenu || false,
          registrationId: generatedId,
          customName: data.customRestaurantName,
          owner: {
            name: data.ownerName,
            phone: data.phone,
            email: data.email,
          },
          status: 'pending',
          mapId: data.selectedRestaurant.id,
          createDate: new Date().toISOString(),
          updateDate: new Date().toISOString()
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('restaurantData', JSON.stringify(restaurantData))
        }

        toast.success('Ресторан успешно зарегистрирован!')
      } catch (error) {
        console.error('Registration error:', error)
        toast.error('Ошибка при регистрации ресторана')
        setHasSubmitted(false)
      } finally {
        setIsSubmitting(false)
      }
    }

    submitRegistration()
  }, [data])// Убрали isSubmitting из зависимостей

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleCreateAnother = () => {
    resetForm()
    setHasSubmitted(false) // Сбрасываем флаг для возможности новой отправки
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const floatingAnimation = {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }

  return (
    <div className="p-8 bg-background flex items-center justify-center relative overflow-hidden min-h-[600px]">
      {/* Background Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-3 h-3 text-primary" />
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        {/* Success Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={floatingAnimation}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-2xl opacity-20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="relative p-8 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 rounded-full border-4 border-primary/30 shadow-2xl backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="h-20 w-20 text-primary" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1 
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            🎉 Поздравляем!
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Регистрация ресторана успешно завершена
          </motion.p>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Теперь вы можете перейти к панели управления
          </motion.p>
        </motion.div>

        {/* Restaurant Info Card */}
        {data.selectedRestaurant && (
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="bg-card/50 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Информация о ресторане
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-3 text-left"
                >
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Название:</span> {
                      data.customRestaurantName || 
                      data.selectedRestaurant?.name
                    }
                  </p>
                  {data.selectedRestaurant?.address && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Адрес:</span> {data.selectedRestaurant?.address}
                    </p>
                  )}
                  {data.ownerName && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Владелец:</span> {data.ownerName}
                    </p>
                  )}
                  {data.phone && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Телефон:</span> {data.phone}
                    </p>
                  )}
                  {data.email && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Email:</span> {data.email}
                    </p>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={isSubmitting}
          >
            <Home className="mr-2 h-5 w-5" />
            {isSubmitting ? 'Регистрируем...' : 'Перейти к панели управления'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            onClick={handleCreateAnother}
            variant="outline"
            size="lg"
            disabled={isSubmitting}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Добавить ещё ресторан
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
