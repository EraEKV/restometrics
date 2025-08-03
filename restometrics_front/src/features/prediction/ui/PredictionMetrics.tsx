"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { CountUpNumber } from "@/shared/ui/animations"
import { Clock, TrendingUp, Activity, AlertCircle } from "lucide-react"
import type { PredictionResponse } from "@/shared/types/prediction"

interface PredictionMetricsProps {
  prediction?: PredictionResponse
}

export function PredictionMetrics({ prediction }: PredictionMetricsProps) {
  if (!prediction) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm">Нет данных</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Данные прогноза недоступны</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = [
    {
      title: "Базовое значение",
      value: prediction.baseValue,
      suffix: ` ${prediction.unit}`,
      change: `Историческое среднее: ${prediction.factors.historicalAverage.toLocaleString()}`,
      changeType: 'neutral',
      icon: Activity,
      gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200/50 dark:border-blue-700/50"
    },
    {
      title: "Сезонный множитель",
      value: prediction.factors.seasonalMultiplier,
      decimals: 1,
      suffix: "x",
      change: `Месяц: ${prediction.factors.timeFactors.month}`,
      changeType: 'positive',
      icon: TrendingUp,
      gradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200/50 dark:border-emerald-700/50"
    },
    {
      title: "Множитель дня недели",
      value: prediction.factors.weekdayMultiplier,
      decimals: 1,
      suffix: "x",
      change: `День недели: ${prediction.factors.timeFactors.dayOfWeek}`,
      changeType: 'positive',
      icon: Clock,
      gradient: "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200/50 dark:border-purple-700/50"
    },
    {
      title: "Уровень доверия",
      value: prediction.confidenceScore,
      suffix: "%",
      change: `Уровень: ${prediction.confidenceLevel}`,
      changeType: prediction.confidenceScore > 70 ? 'positive' : 'negative',
      icon: AlertCircle,
      gradient: prediction.confidenceScore > 70 
        ? "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
        : "from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
      iconColor: prediction.confidenceScore > 70 
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400",
      borderColor: prediction.confidenceScore > 70 
        ? "border-emerald-200/50 dark:border-emerald-700/50"
        : "border-amber-200/50 dark:border-amber-700/50"
    }
  ]

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-emerald-600 dark:text-emerald-400'
      case 'negative': return 'text-red-600 dark:text-red-400'
      default: return 'text-slate-600 dark:text-slate-400'
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2, type: "spring", stiffness: 300 }
            }}
          >
            <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border ${metric.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.title}
                </CardTitle>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`p-3 bg-gradient-to-br ${metric.gradient} rounded-xl`}
                >
                  <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  <CountUpNumber 
                    value={metric.value} 
                    suffix={metric.suffix || ""}
                    decimals={metric.decimals || 0}
                    delay={index * 0.1 + 0.5}
                    duration={1.5}
                  />
                </div>
                <p className={`text-sm ${getChangeColor(metric.changeType)} flex items-center gap-1`}>
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
