"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Utensils, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { PredictionResponse } from "@/shared/types/prediction"

interface FoodRecommendationsProps {
  prediction?: PredictionResponse
}

export function FoodRecommendations({ prediction }: FoodRecommendationsProps) {
  if (!prediction || !prediction.foodPopularity.length) {
    return (
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Utensils className="h-5 w-5" />
            Рекомендации блюд
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            Данные о популярности блюд недоступны
          </p>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend.toUpperCase()) {
      case 'RISING': return TrendingUp
      case 'FALLING': return TrendingDown
      default: return Minus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend.toUpperCase()) {
      case 'RISING': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
      case 'FALLING': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30'
    }
  }

  const getTrendText = (trend: string) => {
    switch (trend.toUpperCase()) {
      case 'RISING': return 'Растет'
      case 'FALLING': return 'Снижается'
      default: return 'Стабильно'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg">
              <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            Рекомендации популярных блюд
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prediction.foodPopularity.map((category, categoryIndex) => {
            const TrendIcon = getTrendIcon(category.trend)
            
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {category.category === 'HOT_DISHES' ? 'Горячие блюда' : category.category}
                  </h4>
                  <Badge className={`${getTrendColor(category.trend)} border-0`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {getTrendText(category.trend)}
                  </Badge>
                </div>
                
                <div className="grid gap-2">
                  {category.dishes.map((dish, dishIndex) => (
                    <motion.div
                      key={dish}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: categoryIndex * 0.1 + dishIndex * 0.05, 
                        duration: 0.3 
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {dish}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {category.confidence}% точность
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 Рекомендация: Увеличьте запасы популярных блюд и рассмотрите специальные предложения
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
