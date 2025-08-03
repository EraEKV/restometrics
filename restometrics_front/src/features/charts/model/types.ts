export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface DishData {
  name: string
  orders: number
  revenue: number
  trend: number
  category: 'appetizer' | 'main' | 'dessert' | 'beverage'
}

export interface HourlyData {
  hour: string
  orders: number
  customers: number
  avgWaitTime: number
}

export interface OrderTypeData {
  type: 'dine-in' | 'delivery' | 'takeout'
  count: number
  percentage: number
  avgOrderValue: number
  peakTime: string
}

export interface SatisfactionData {
  rating: number
  count: number
  percentage: number
  trend: number
  comments: string[]
}

export interface StaffData {
  name: string
  role: 'waiter' | 'chef' | 'manager' | 'cashier'
  ordersHandled: number
  avgServiceTime: number
  customerRating: number
  hoursWorked: number
  efficiency: number
}
