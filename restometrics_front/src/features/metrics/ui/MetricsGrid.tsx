"use client"

import { motion } from "framer-motion"
import { ScrollAnimatedSection, CountUpNumber } from "@/shared/ui/animations"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  LucideIcon
} from "lucide-react"

interface Metric {
  title: string
  value: number | string
  numericValue?: number
  suffix?: string
  prefix?: string
  decimals?: number
  change?: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  gradient: string
  iconColor: string
  borderColor: string
}

interface MetricsGridProps {
  analytics: any
}

export function MetricsGrid({ analytics }: MetricsGridProps) {
  const {
    totalRevenue = 7200000,
    totalOrders = 1000,
    averageRating = 4.6,
    peakHours = "18:00-20:00",
  } = analytics || {}

  const metrics: Metric[] = [
    {
      title: "Общая выручка",
      value: totalRevenue,
      numericValue: totalRevenue,
      suffix: " ₸",
      change: "+12.5% к прошлому месяцу",
      changeType: 'positive',
      icon: DollarSign,
      gradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200/50 dark:border-emerald-700/50"
    },
    {
      title: "Всего заказов",
      value: totalOrders,
      numericValue: totalOrders,
      change: "+8.2% к прошлому месяцу",
      changeType: 'positive',
      icon: Users,
      gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200/50 dark:border-blue-700/50"
    },
    {
      title: "Средний рейтинг",
      value: averageRating,
      numericValue: averageRating,
      decimals: 1,
      change: "-0.1 к прошлому месяцу",
      changeType: 'negative',
      icon: Star,
      gradient: "from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200/50 dark:border-amber-700/50"
    },
    {
      title: "Час пик",
      value: peakHours,
      change: "156 заказов в час пик",
      changeType: 'neutral',
      icon: Clock,
      gradient: "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200/50 dark:border-purple-700/50"
    }
  ]

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-emerald-600 dark:text-emerald-400'
      case 'negative': return 'text-red-600 dark:text-red-400'
      default: return 'text-slate-600 dark:text-slate-400'
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive': return TrendingUp
      case 'negative': return TrendingDown
      default: return null
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const ChangeIcon = getChangeIcon(metric.changeType)
        
        return (
          <ScrollAnimatedSection 
            key={metric.title} 
            direction="up" 
            delay={index * 0.1}
          >
            <motion.div
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
                    {metric.numericValue !== undefined ? (
                      <CountUpNumber 
                        value={metric.numericValue} 
                        suffix={metric.suffix || ""}
                        prefix={metric.prefix || ""}
                        decimals={metric.decimals || 0}
                        delay={index * 0.1 + 0.5}
                        duration={1.5}
                      />
                    ) : (
                      metric.value
                    )}
                  </div>
                  <p className={`text-sm ${getChangeColor(metric.changeType)} flex items-center gap-1`}>
                    {ChangeIcon && <ChangeIcon className="h-4 w-4" />}
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollAnimatedSection>
        )
      })}
    </div>
  )
}
