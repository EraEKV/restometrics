'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Clock, Users } from "lucide-react"

interface HourlyData {
  hour: string
  orders: number
  customers: number
  avgWaitTime: number
}

interface PeakHoursProps {
  data: HourlyData[]
}

export const PeakHoursChart = ({ data }: PeakHoursProps) => {
  const maxOrders = Math.max(...data.map(item => item.orders))
  const maxCustomers = Math.max(...data.map(item => item.customers))

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-6">
        <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-lg">
            <Clock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          Анализ пиковых часов
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
          Почасовая разбивка заказов, клиентов и времени ожидания
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.hour} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-[60px]">
                  {item.hour}
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{item.orders} заказов</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span className="text-slate-600 dark:text-slate-400">{item.customers}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {item.avgWaitTime}мин ожидания
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                  />
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-indigo-400 h-1 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(item.customers / maxCustomers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
