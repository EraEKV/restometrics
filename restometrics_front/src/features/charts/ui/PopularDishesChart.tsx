'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Activity, TrendingUp } from "lucide-react"

interface DishData {
  name: string
  orders: number
  revenue: number
  trend: number
  category: 'appetizer' | 'main' | 'dessert' | 'beverage'
}

interface PopularDishesProps {
  data: DishData[]
}

const categoryColors = {
  appetizer: 'from-orange-500 to-red-500',
  main: 'from-blue-500 to-indigo-500', 
  dessert: 'from-pink-500 to-purple-500',
  beverage: 'from-teal-500 to-cyan-500'
}

const categoryLabels = {
  appetizer: 'Закуски',
  main: 'Основные блюда',
  dessert: 'Десерты', 
  beverage: 'Напитки'
}

export const PopularDishesChart = ({ data }: PopularDishesProps) => {
  const maxOrders = Math.max(...data.map(item => item.orders))

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-6">
        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-lg">
            <Activity className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          Popular Dishes
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
          Top selling dishes with trends and categories
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-5">
          {data.map((item, index) => (
            <div key={item.name} className="space-y-3 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/20">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[item.category]}
                  </Badge>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.orders} orders
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ${item.revenue.toLocaleString()}
                  </div>
                  {item.trend > 0 && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      +{item.trend}%
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${categoryColors[item.category]} h-2 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
