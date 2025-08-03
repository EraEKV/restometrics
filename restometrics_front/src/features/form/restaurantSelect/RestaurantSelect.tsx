'use client'
import React, { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Navigation } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { useFormStore, Restaurant } from '@/shared/model/formStore'
import { useRestaurantStore } from '@/shared/model/restaurantStore'
import { restaurantService } from '@/shared/api/services/restaurantService'
import { toast } from 'sonner'
import { useMapWithSearch, type SearchPlace } from '@/widgets/map'
import { searchPlaceToRestaurant, searchPlacesToRestaurants } from './lib/converters'
import { RestaurantCard } from './ui/RestaurantCard'


export const RestaurantSelect = React.memo(() => {
  const { nextStep, updateData, setLoading, isLoading } = useFormStore()
  const { addRegisteredRestaurant } = useRestaurantStore()
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_2GIS_MAPS_API_KEY || ''

  const mapContainerRef = useCallback((node: HTMLDivElement | null) => {
    setMapContainer(node)
  }, [])
  
  const handlePlaceSelect = useCallback((place: SearchPlace) => {
    const restaurant = searchPlaceToRestaurant(place)
    setSelectedRestaurant(restaurant)
  }, [])

  const {
    searchResults,
    isSearching,
    searchError,
    isLocationLoading,
    selectedPlace,
    searchNearUser,
    selectPlace,
    clearSelection
  } = useMapWithSearch({
    apiKey,
    container: mapContainer,
    center: [76.9228, 43.2567] as [number, number], // Алматы
    zoom: 13,
    onPlaceSelect: handlePlaceSelect
  })

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    
    const place = searchResults.find(p => p.id === restaurant.id)
    if (place) {
      selectPlace(place)
    }
  }, [searchResults, selectPlace])

  const restaurants = useMemo(() => {
    return searchPlacesToRestaurants(searchResults)
  }, [searchResults])

  const handleRestaurantSelect = async () => {
    if (!selectedRestaurant) return

    if (!selectedRestaurant.hasMenu) {
      toast.error('❌ У выбранного ресторана нет меню. Выберите другой ресторан или загрузите меню позже.')
      return
    }

    setLoading(true)
    
    try {
      const registeredRestaurant = {
        ...selectedRestaurant,
        registrationId: `quick_${Date.now()}`,
        customName: undefined,
        owner: {
          name: '',
          phone: '',
          email: '',
        },
        status: 'approved' as const,
        registeredAt: new Date().toISOString(),
      }
      
      const registrationData = {
        selectedRestaurant,
        ownerName: 'Быстрая регистрация',
        phone: '+7 (000) 000-00-00',
        email: '',
      }
      
      const result = await restaurantService.registerRestaurant(registrationData)
      
      if (result.success) {
        registeredRestaurant.registrationId = result.restaurantId
        
        addRegisteredRestaurant(registeredRestaurant)
        
        updateData({ selectedRestaurant })
        
        toast.success('Ресторан выбран и зарегистрирован!')
        nextStep()
      } else {
        toast.error('Ошибка при регистрации ресторана')
      }
    } catch (error) {
      console.error('Ошибка при выборе ресторана:', error)
      toast.error('Произошла ошибка при выборе ресторана')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" overflow-hidden flex flex-col bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col p-8 space-y-6"
      >
        <div className="text-center flex-shrink-0">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            Выберите ресторан
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            Найдите свое заведение рядом с вами или кликните по карте для поиска ресторанов
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-shrink-0"
        >
          <Button 
            onClick={searchNearUser}
            disabled={isLoading || isSearching || isLocationLoading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            size="lg"
          >
            <Navigation className="mr-2 h-4 w-4" />
            {isLoading ? 'Определяем местоположение...' : 
             isSearching ? 'Ищем заведения...' : 
             isLocationLoading ? 'Получаем геолокацию...' :
             'Найти заведения рядом со мной'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg overflow-hidden border border-border shadow-lg flex-shrink-0"
        >
          <div 
            ref={mapContainerRef}
            className="w-full h-80 bg-muted relative"
          >
            {isSearching && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg z-10">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent"></div>
                  <span className="text-sm text-violet-700">Поиск заведений...</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col space-y-4">
          <AnimatePresence>
            {searchError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg flex-shrink-0"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{searchError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {restaurants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                <h3 className="font-semibold text-foreground mb-3 flex-shrink-0">
                  Найденные заведения ({restaurants.length}):
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {restaurants.map((restaurant, index) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      index={index}
                      isSelected={selectedRestaurant?.id === restaurant.id}
                      onClick={handleRestaurantClick}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedRestaurant && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4 flex-shrink-0"
              >
                <Card className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-violet-600" />
                    <h4 className="font-semibold text-violet-900 dark:text-violet-100">
                      Выбран: {selectedRestaurant.name}
                    </h4>
                  </div>
                  <p className="text-sm text-violet-700 dark:text-violet-300">{selectedRestaurant.address}</p>
                </Card>

                <Button 
                  onClick={handleRestaurantSelect}
                  disabled={!selectedRestaurant.hasMenu || isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                >
                  {isLoading 
                    ? 'Регистрируем ресторан...' 
                    : selectedRestaurant.hasMenu 
                      ? 'Продолжить с этим рестораном' 
                      : 'Ресторан без меню - выберите другой'
                  }
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
})
