import { useState, useCallback } from 'react'
import { createPlacesSearchService, type SearchPlace } from './placesSearchService'

interface UsePlacesSearchOptions {
  apiKey: string
  onSearchComplete?: (places: SearchPlace[]) => void
  onSearchError?: (error: string) => void
}

export const usePlacesSearch = ({
  apiKey,
  onSearchComplete,
  onSearchError
}: UsePlacesSearchOptions) => {
  const [searchResults, setSearchResults] = useState<SearchPlace[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const placesService = createPlacesSearchService(apiKey)

  const searchNearbyPlaces = useCallback(async (
    lng: number, 
    lat: number,
    options?: { query?: string; radius?: number; pageSize?: number }
  ) => {
    setIsSearching(true)
    setSearchError(null)
    
    try {
      const places = await placesService.searchNearbyPlaces(lng, lat, options)
      
      setSearchResults(places)
      
      if (onSearchComplete) {
        onSearchComplete(places)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
      console.error('Ошибка поиска:', error)
      
      setSearchError(errorMessage)
      setSearchResults([])
      
      if (onSearchError) {
        onSearchError(errorMessage)
      }
    } finally {
      setIsSearching(false)
    }
  }, [placesService, onSearchComplete, onSearchError])

  const clearSearch = useCallback(() => {
    setSearchResults([])
    setSearchError(null)
    setIsSearching(false)
  }, [])

  return {
    searchResults,
    isSearching,
    searchError,
    searchNearbyPlaces,
    clearSearch
  }
}
