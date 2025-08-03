import type { SearchPlace } from '@/widgets/map'
import type { Restaurant } from '@/shared/model/formStore'

export const searchPlaceToRestaurant = (place: SearchPlace): Restaurant => {
  return {
    id: place.id,
    name: place.name,
    address: place.address,
    coordinates: place.coordinates,
    hasMenu: place.hasMenu,
    rating: place.rating,
    distance: place.distance
  }
}

export const searchPlacesToRestaurants = (places: SearchPlace[]): Restaurant[] => {
  return places.map(searchPlaceToRestaurant)
}
