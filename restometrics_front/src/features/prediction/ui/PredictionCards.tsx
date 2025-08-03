"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { CountUpNumber } from "@/shared/ui/animations"
import { Star, TrendingUp, DollarSign, Clock } from "lucide-react"
import type { PredictionResponse } from "@/shared/types/prediction"

interface PredictionCardsProps {
  prediction?: PredictionResponse
}

export function PredictionCards({ prediction }: PredictionCardsProps) {
  if (!prediction) {
    return (
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.2 }}
        className="grid gap-8 md:grid-cols-3"
      >
        <Card className="h-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Прогноз недоступен</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Нет данных для отображения</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const topDish = prediction.foodPopularity[0]?.dishes[0] || "Популярное блюдо"
  const confidence = prediction.confidenceScore
  const growthPercentage = prediction.salesGrowth.percentage

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: 0.2 }}
      className="grid gap-8 md:grid-cols-3"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          delay: 0,
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <Card className="h-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-white/15 rounded-xl backdrop-blur-sm"
              >
                <Star className="h-6 w-6 text-amber-300" />
              </motion.div>
              Прогноз выручки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                <CountUpNumber 
                  value={prediction.predictedValue} 
                  suffix={` ${prediction.unit}`}
                  delay={0.2}
                  duration={1.5}
                />
              </h3>
              <p className="text-violet-100">
                {prediction.description}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-300 shadow-lg">
                <Star className="h-4 w-4 mr-1" />
                Доверие {confidence}%
              </Badge>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          delay: 0.2,
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <Card className="h-full bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-white/15 rounded-xl backdrop-blur-sm"
              >
                <TrendingUp className="h-6 w-6" />
              </motion.div>
              Рост продаж
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                <CountUpNumber 
                  value={growthPercentage} 
                  suffix="%"
                  delay={0.4}
                  duration={1.5}
                />
              </h3>
              <p className="text-teal-100">{prediction.salesGrowth.description}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Badge className="bg-white/20 text-white hover:bg-white/30 shadow-lg">
                <TrendingUp className="h-4 w-4 mr-1" />
                Прогноз роста
              </Badge>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          delay: 0.4,
          duration: 0.6,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <Card className="h-full bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-white border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-white/15 rounded-xl backdrop-blur-sm"
              >
                <Clock className="h-6 w-6" />
              </motion.div>
              Популярные блюда
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{topDish}</h3>
              <p className="text-rose-100">
                Тренд: {prediction.foodPopularity[0]?.trend === 'RISING' ? 'Растет' : 'Стабильно'}
              </p>
              <div className="text-sm text-rose-100/80">
                Популярные блюда:
                <div className="flex flex-wrap gap-1 mt-1">
                  {prediction.foodPopularity[0]?.dishes.slice(0, 3).map((dish, index) => (
                    <span key={index} className="bg-white/10 px-2 py-1 rounded text-xs">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Badge className="bg-white/20 text-white hover:bg-white/30 shadow-lg">
                <DollarSign className="h-4 w-4 mr-1" />
                {prediction.foodPopularity[0]?.confidence || 0}% точность
              </Badge>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
