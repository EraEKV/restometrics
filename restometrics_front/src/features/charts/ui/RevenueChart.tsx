'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { AnimatedChartWrapper, AnimatedProgressBar, CountUpNumber } from "@/shared/ui/animations"
import { BarChart3 } from "lucide-react"

interface RevenueData {
  month: string
  revenue: number
  orders: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const maxRevenue = Math.max(...data.map(item => item.revenue))

  return (
    <AnimatedChartWrapper>
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="pb-6">
          <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Месячная выручка
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
            Тренды выручки и заказов за последние 6 месяцев
          </CardDescription>
        </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={item.month} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.month}</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    <CountUpNumber 
                      value={item.revenue} 
                      prefix="$" 
                      delay={index * 0.1}
                      duration={1}
                    />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <CountUpNumber 
                      value={item.orders} 
                      suffix=" заказов"
                      delay={index * 0.1 + 0.2}
                      duration={1}
                    />
                  </div>
                </div>
              </div>
              <AnimatedProgressBar 
                value={item.revenue} 
                maxValue={maxRevenue}
                delay={index * 0.1 + 0.5}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    </AnimatedChartWrapper>
  )
}
