import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Star, Clock } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Restaurant } from '@/shared/model/formStore'

interface RestaurantCardProps {
  restaurant: Restaurant
  index: number
  isSelected: boolean
  onClick: (restaurant: Restaurant) => void
}

export const RestaurantCard = memo(({ restaurant, index, isSelected, onClick }: RestaurantCardProps) => {  
  return (
    <motion.div
      key={restaurant.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card 
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected 
            ? 'ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950/20' 
            : 'hover:bg-accent/50'
        }`}
        onClick={() => onClick(restaurant)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-foreground">{restaurant.name}</h4>
              {restaurant.hasMenu ? (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Меню есть
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Нет меню
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{restaurant.address}</p>
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              {restaurant.rating && (
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})
