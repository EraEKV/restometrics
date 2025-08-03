interface PlaceFromAPI {
  id?: string
  name?: string
  full_name?: string
  address_name?: string
  point?: {
    lon: number
    lat: number
  }
  rubrics?: Array<{
    name: string
  }>
}

export interface SearchPlace {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  distance: number
  hasMenu: boolean
  rating?: number
}

interface SearchPlacesOptions {
  query?: string
  radius?: number
  pageSize?: number
}

export class PlacesSearchService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private calculateDistance(
    point1: [number, number], 
    point2: [number, number]
  ): number {
    const [lng1, lat1] = point1
    const [lng2, lat2] = point2
    
    return Math.round(
      Math.sqrt(
        Math.pow((lng2 - lng1) * 111000, 2) + 
        Math.pow((lat2 - lat1) * 111000, 2)
      )
    )
  }

  private validateCoordinates(lng: number, lat: number): void {
    if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
      throw new Error(`Невалидные координаты: lng=${lng}, lat=${lat}`)
    }
    
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new Error(`Координаты вне допустимого диапазона: lng=${lng}, lat=${lat}`)
    }
  }

  async searchNearbyPlaces(
    lng: number, 
    lat: number, 
    options: SearchPlacesOptions = {}
  ): Promise<SearchPlace[]> {
    const {
      query = 'кафе ресторан',
      radius = 1000,
      pageSize = 10
    } = options

    this.validateCoordinates(lng, lat)

    if (!this.apiKey) {
      throw new Error('API ключ 2GIS не найден')
    }

    const searchQuery = encodeURIComponent(query)
    const url = `https://catalog.api.2gis.com/3.0/items?q=${searchQuery}&location=${lng},${lat}&key=${this.apiKey}&page_size=${pageSize}&radius=${radius}`
    
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Ошибка API:', errorData)
      throw new Error(`API error: ${errorData.meta?.error?.message || response.status}`)
    }
    
    const data = await response.json()
    const places = data.result?.items || []
    
    if (places.length === 0) {
      throw new Error('В этой области не найдено заведений питания. Попробуйте другую область или используйте геолокацию.')
    }

    const searchResults: SearchPlace[] = places.map((place: PlaceFromAPI, index: number) => ({
      id: place.id || `place-${index}`,
      name: place.name || place.full_name || 'Название не указано',
      address: place.address_name || 'Адрес не указан',
      coordinates: place.point ? [place.point.lon, place.point.lat] : [lng, lat],
      hasMenu: true, // Пока всегда true для упрощения
      distance: place.point ? this.calculateDistance([lng, lat], [place.point.lon, place.point.lat]) : 0,
    }))

    return searchResults
  }
}

export const createPlacesSearchService = (apiKey: string) => {
  return new PlacesSearchService(apiKey)
}
