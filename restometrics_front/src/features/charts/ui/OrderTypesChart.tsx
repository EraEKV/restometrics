'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Truck, Store, Car } from "lucide-react"

interface OrderTypeData {
  type: 'dine-in' | 'delivery' | 'takeout'
  count: number
  percentage: number
  avgOrderValue: number
  peakTime: string
}

interface OrderTypesProps {
  data: OrderTypeData[]
  totalOrders: number
}

const typeConfig = {
  'dine-in': {
    icon: Store,
    label: 'В зале',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30',
    textColor: 'text-teal-600 dark:text-teal-400'
  },
  'delivery': {
    icon: Truck,
    label: 'Доставка',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  'takeout': {
    icon: Car,
    label: 'На вынос',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30',
    textColor: 'text-purple-600 dark:text-purple-400'
  }
}

export const OrderTypesChart = ({ data, totalOrders }: OrderTypesProps) => {
  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-6">
        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg">
            <Store className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          Распределение заказов
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
          Статистика по типам заказов с ключевыми метриками
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-6">
          {data.map((item, index) => {
            const config = typeConfig[item.type]
            const IconComponent = config.icon
            
            return (
              <div key={item.type} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-br ${config.bgColor} rounded-lg`}>
                      <IconComponent className={`h-4 w-4 ${config.textColor}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {config.label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Peak: {item.peakTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.count} заказов
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.avgOrderValue}₸ средний чек
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{item.percentage}% от общего числа</span>
                    <span>{item.count}/{totalOrders}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${config.color} h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
