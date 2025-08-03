"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRestaurantStore } from "@/shared/model/restaurantStore"
import { useAuthStore } from "@/shared/model/authStore"
import { usePredictionStore } from "@/shared/model/predictionStore"
import { usePredictions } from "@/shared/api/hooks/usePredictions"
import { PredictionCards, PredictionMetrics, FoodRecommendations } from "@/features/prediction"
import { ScrollAnimatedSection, FloatingElements, ParallaxSection } from "@/shared/ui/animations"
import { Button } from "@/shared/ui/button"
import { useRestaurantAnalytics } from "@/shared/api/hooks/useRestaurantAnalytics"
import { useNotifications } from "@/shared/lib/hooks/useNotifications"
import {
  RevenueChart,
  OrderTypesChart,
  CustomerSatisfactionChart,
  mockRevenueData,
  mockOrderTypesData,
  mockSatisfactionData,
} from "@/features/charts"
import {
  RefreshCw,
} from "lucide-react"
import { PredictionMetricsSkeleton } from "@/shared/ui/skeletons/dashboardCards/PredictionMetricsSkeleton"

export function Dashboard() {
  const { getDashboardData, loadFromStorage } = useRestaurantStore()
  const { restaurant, loadFromStorage: loadAuthFromStorage } = useAuthStore()
  const { currentPrediction, setPrediction, setLoading, setError, isLoading } = usePredictionStore()
  const { generatePrediction, isGenerating } = usePredictions()
  const { updateAnalytics, fetchAnalytics } = useRestaurantAnalytics()
  const { createTestNotifications } = useNotifications()
  const [isUpdating, setIsUpdating] = useState(false)
  
  useEffect(() => {
    loadFromStorage()
    loadAuthFromStorage()
  }, [loadFromStorage, loadAuthFromStorage])

  useEffect(() => {
    const generateInitialPrediction = async () => {
      const currentRestaurant = restaurant || getDashboardData()?.restaurant
      
      if (currentRestaurant && !currentPrediction) {
        setLoading(true)
        try {
          const predictionData = {
            name: currentRestaurant.customName || currentRestaurant.name || "Мой ресторан",
            address: currentRestaurant.address || "Адрес не указан",
            coordinates: {
              lat: currentRestaurant.coordinates?.lat || 43.238949,
              lng: currentRestaurant.coordinates?.lng || 76.889709
            },
            dateTime: new Date().toISOString(),
            predictionType: "revenue" as const,
            period: "hourly" as const
          }
          
          const response = await generatePrediction(predictionData)
          setPrediction(response.data)
        } catch (error) {
          console.error('Ошибка генерации прогноза:', error)
          setError('Ошибка получения прогноза')
        } finally {
          setLoading(false)
        }
      }
    }

    generateInitialPrediction()
  }, [restaurant, currentPrediction, generatePrediction, setPrediction, setLoading, setError, getDashboardData])
  
  const handleUpdateAnalytics = async () => {
    setIsUpdating(true)
    try {
      const newAnalytics = await fetchAnalytics()
      if (newAnalytics) {
        updateAnalytics(newAnalytics)
      }
      createTestNotifications()

      const currentRestaurant = restaurant || getDashboardData()?.restaurant
      if (currentRestaurant) {
        const predictionData = {
          name: currentRestaurant.customName || currentRestaurant.name || "Мой ресторан",
          address: currentRestaurant.address || "Адрес не указан",
          coordinates: {
            lat: currentRestaurant.coordinates?.lat || 43.238949,
            lng: currentRestaurant.coordinates?.lng || 76.889709
          },
          dateTime: new Date().toISOString(),
          predictionType: "revenue" as const,
          period: "hourly" as const
        }
        
        const response = await generatePrediction(predictionData)
        setPrediction(response.data)
      }
    } catch (error) {
      console.error('Ошибка обновления аналитики:', error)
    } finally {
      setIsUpdating(false)
    }
  }
  
  const dashboardData = getDashboardData()
  
  if (!dashboardData && !restaurant) {
    return (
      <>
        <FloatingElements />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-teal-50/30 dark:from-slate-900 dark:via-violet-900/10 dark:to-teal-900/10"
        >
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-violet-700 to-teal-700 dark:from-slate-200 dark:via-violet-300 dark:to-teal-300 bg-clip-text text-transparent">
                Добро пожаловать!
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Сначала зарегистрируйте ресторан, чтобы увидеть аналитику
              </p>
            </motion.div>
          </div>
        </motion.div>
      </>
    )
  }

  const currentRestaurant = restaurant || dashboardData?.restaurant
  const restaurantName = currentRestaurant?.customName || currentRestaurant?.name || 'Мой ресторан'
  const restaurantAddress = currentRestaurant?.address || 'Адрес не указан'
  
  const analytics = dashboardData?.analytics || {}
  const {
    totalRevenue = 7200000,
    totalOrders = 1000,
    averageRating = 4.6,
    totalReviews = 450,
  } = analytics

  return (
    <>
      <FloatingElements />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <ParallaxSection speed={0.3} className="absolute -top-40 -right-40">
          <motion.div 
            className="w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </ParallaxSection>
        <ParallaxSection speed={0.5} className="absolute -bottom-40 -left-40">
          <motion.div 
            className="w-80 h-80 bg-gradient-to-br from-teal-400/10 to-cyan-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </ParallaxSection>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-teal-50/30 dark:from-slate-900 dark:via-violet-900/10 dark:to-teal-900/10 relative"
      >
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12 relative z-10">
          <div className="space-y-12">
            
            <ScrollAnimatedSection direction="down" delay={0.1}>
              <div className="md:flex items-center justify-between space-y-4">
                <div className="space-y-2">
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-violet-700 to-teal-700 dark:from-slate-200 dark:via-violet-300 dark:to-teal-300 bg-clip-text text-transparent"
                  >
                    {restaurantName}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg text-slate-600 dark:text-slate-400"
                  >
                    {restaurantAddress}
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleUpdateAnalytics}
                    disabled={isUpdating || isGenerating}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isUpdating || isGenerating ? 'animate-spin' : ''}`} />
                    {isUpdating || isGenerating ? 'Обновление...' : 'Обновить данные'}
                  </Button>
                </motion.div>
              </div>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection direction="up" delay={0.2}>
              {isLoading ? (
                <div className="flex justify-between items-center gap-3 py-8">
                  <PredictionMetricsSkeleton />
                  <PredictionMetricsSkeleton />
                  <PredictionMetricsSkeleton />
                </div>
              ) : currentPrediction ? (
                <PredictionCards prediction={currentPrediction} />
              ) : null}
            </ScrollAnimatedSection>

            <ScrollAnimatedSection direction="up" delay={0.3}>
              {!isLoading && currentPrediction && <PredictionMetrics prediction={currentPrediction} />}
            </ScrollAnimatedSection>

            <ScrollAnimatedSection direction="up" delay={0.4}>
              <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                <div className="lg:col-span-2 grid gap-8 grid-cols-1 lg:grid-cols-2">
                  <RevenueChart data={mockRevenueData} />
                  <OrderTypesChart data={mockOrderTypesData} totalOrders={totalOrders} />
                  <CustomerSatisfactionChart 
                    data={mockSatisfactionData} 
                    averageRating={averageRating} 
                    totalReviews={totalReviews}
                  />
                  {!isLoading && currentPrediction && <FoodRecommendations prediction={currentPrediction} />}
                </div>
                <div className="lg:col-span-1">
                </div>
              </div>
            </ScrollAnimatedSection>

          </div>
        </div>
      </motion.div>
    </>
  )
}
