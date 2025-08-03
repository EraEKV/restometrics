'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Star, TrendingUp, TrendingDown } from "lucide-react"

interface SatisfactionData {
  rating: number
  count: number
  percentage: number
  trend: number
  comments: string[]
}

interface CustomerSatisfactionProps {
  data: SatisfactionData[]
  averageRating: number
  totalReviews: number
}

const ratingConfig = {
  5: { color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Отлично' },
  4: { color: 'from-lime-500 to-emerald-500', bgColor: 'bg-lime-50 dark:bg-lime-900/20', label: 'Хорошо' },
  3: { color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Средне' },
  2: { color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', label: 'Ниже среднего' },
  1: { color: 'from-red-500 to-rose-500', bgColor: 'bg-red-50 dark:bg-red-900/20', label: 'Плохо' }
}

export const CustomerSatisfactionChart = ({ data, averageRating, totalReviews }: CustomerSatisfactionProps) => {
  const maxCount = Math.max(...data.map(item => item.count))

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-6">
        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg">
            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          Удовлетворенность клиентов
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
          Распределение оценок и тренды из {totalReviews} отзывов
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {averageRating}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              из 5
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {data.map((item) => {
            const config = ratingConfig[item.rating as keyof typeof ratingConfig]
            
            return (
              <div key={item.rating} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {item.rating}
                      </span>
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {config.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.count} ({item.percentage}%)
                    </span>
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      item.trend > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      item.trend < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {item.trend > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : item.trend < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {item.trend !== 0 && `${Math.abs(item.trend)}%`}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${config.color} h-2 rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
