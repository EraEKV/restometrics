import { 
  RevenueData, 
  DishData, 
  HourlyData, 
  OrderTypeData, 
  SatisfactionData, 
  StaffData 
} from './types'

export const mockRevenueData: RevenueData[] = [
  { month: "Янв", revenue: 45000, orders: 450 },
  { month: "Фев", revenue: 52000, orders: 520 },
  { month: "Мар", revenue: 48000, orders: 480 },
  { month: "Апр", revenue: 61000, orders: 610 },
  { month: "Май", revenue: 67000, orders: 670 },
  { month: "Июн", revenue: 72000, orders: 720 },
]

export const mockDishesData: DishData[] = [
  { name: "Плов узбекский", orders: 245, revenue: 6125, trend: 15, category: 'main' },
  { name: "Салат Цезарь", orders: 189, revenue: 2835, trend: 8, category: 'appetizer' },
  { name: "Форель на гриле", orders: 156, revenue: 4680, trend: -3, category: 'main' },
  { name: "Шоколадный фондан", orders: 134, revenue: 1340, trend: 22, category: 'dessert' },
  { name: "Крафтовое пиво", orders: 123, revenue: 861, trend: 12, category: 'beverage' },
]

export const mockHourlyData: HourlyData[] = [
  { hour: "11:00", orders: 25, customers: 18, avgWaitTime: 8 },
  { hour: "12:00", orders: 67, customers: 45, avgWaitTime: 12 },
  { hour: "13:00", orders: 89, customers: 62, avgWaitTime: 15 },
  { hour: "14:00", orders: 45, customers: 32, avgWaitTime: 7 },
  { hour: "18:00", orders: 134, customers: 98, avgWaitTime: 18 },
  { hour: "19:00", orders: 156, customers: 112, avgWaitTime: 22 },
  { hour: "20:00", orders: 142, customers: 103, avgWaitTime: 20 },
  { hour: "21:00", orders: 98, customers: 71, avgWaitTime: 14 },
]

export const mockOrderTypesData: OrderTypeData[] = [
  { 
    type: 'dine-in', 
    count: 450, 
    percentage: 45, 
    avgOrderValue: 65, 
    peakTime: '19:00-20:00' 
  },
  { 
    type: 'delivery', 
    count: 350, 
    percentage: 35, 
    avgOrderValue: 42, 
    peakTime: '18:00-19:00' 
  },
  { 
    type: 'takeout', 
    count: 200, 
    percentage: 20, 
    avgOrderValue: 38, 
    peakTime: '12:00-13:00' 
  },
]

export const mockSatisfactionData: SatisfactionData[] = [
  { rating: 5, count: 234, percentage: 52, trend: 8, comments: ["Отличный сервис!", "Потрясающее качество блюд"] },
  { rating: 4, count: 156, percentage: 35, trend: 3, comments: ["Очень хорошо", "Доволен обслуживанием"] },
  { rating: 3, count: 45, percentage: 10, trend: -2, comments: ["Средне", "Можно лучше"] },
  { rating: 2, count: 12, percentage: 3, trend: -5, comments: ["Ниже ожиданий"] },
  { rating: 1, count: 3, percentage: 1, trend: -1, comments: ["Плохой сервис"] },
]

export const mockStaffData: StaffData[] = [
  {
    name: "Алина Жанарбекова",
    role: 'waiter',
    ordersHandled: 156,
    avgServiceTime: 8,
    customerRating: 4.8,
    hoursWorked: 8.5,
    efficiency: 92
  },
  {
    name: "Марат Родригез",
    role: 'chef',
    ordersHandled: 230,
    avgServiceTime: 12,
    customerRating: 4.6,
    hoursWorked: 9,
    efficiency: 89
  },
  {
    name: "Сара Уильямс",
    role: 'manager',
    ordersHandled: 45,
    avgServiceTime: 15,
    customerRating: 4.7,
    hoursWorked: 10,
    efficiency: 95
  },
  {
    name: "Данияр Чен",
    role: 'cashier',
    ordersHandled: 189,
    avgServiceTime: 3,
    customerRating: 4.5,
    hoursWorked: 8,
    efficiency: 87
  },
]
