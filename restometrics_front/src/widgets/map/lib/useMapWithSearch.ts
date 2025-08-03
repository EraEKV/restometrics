import { useState, useCallback, useEffect } from 'react'
import { useMap } from './useMap'
import { useGeolocation } from './useGeolocation'
import { usePlacesSearch } from './usePlacesSearch'
import { SearchPlace } from './placesSearchService'

interface UseMapWithSearchOptions {
  apiKey: string
  container: HTMLDivElement | null
  center?: [number, number]
  zoom?: number
  onPlaceSelect?: (place: SearchPlace) => void
}

export const useMapWithSearch = ({
  apiKey,
  container,
  center = [76.9228, 43.2567],
  zoom = 13,
  onPlaceSelect
}: UseMapWithSearchOptions) => {
  const [selectedPlace, setSelectedPlace] = useState<SearchPlace | null>(null)

  const {
    searchResults,
    isSearching,
    searchError,
    searchNearbyPlaces,
    clearSearch
  } = usePlacesSearch({
    apiKey
  })

  const {
    userLocation,
    isLoading: isLocationLoading,
    error: locationError,
    getCurrentLocation
  } = useGeolocation({
    defaultLocation: center
  })

  const {
    mapInstance,
    isMapReady,
    addMarkers,
    setCenter,
    setZoom
  } = useMap({
    container,
    apiKey,
    center,
    zoom,
    onMapClick: useCallback((coordinates: [number, number]) => {
      searchNearbyPlaces(coordinates[0], coordinates[1])
    }, [searchNearbyPlaces])
  })

  useEffect(() => {
    if (!isMapReady || !searchResults.length || !addMarkers) return

    const markersData = searchResults.map((place, index) => ({
      id: `place-${index}`,
      coordinates: place.coordinates,
      title: place.name,
      isActive: false
    }))
    
    addMarkers(markersData, (markerId: string, coordinates: [number, number]) => {
      const index = parseInt(markerId.replace('place-', ''))
      const place = searchResults[index]
      if (place) {
        setSelectedPlace(place)
        setCenter(place.coordinates, 16)
        
        if (onPlaceSelect) {
          onPlaceSelect(place)
        }
      }
    })
  }, [searchResults, isMapReady, addMarkers, setCenter, onPlaceSelect])

  const searchNearUser = useCallback(() => {
    getCurrentLocation((coordinates) => {
      setCenter(coordinates, 14)
      searchNearbyPlaces(coordinates[0], coordinates[1])
    })
  }, [getCurrentLocation, setCenter, searchNearbyPlaces])

  const selectPlace = useCallback((place: SearchPlace) => {
    setSelectedPlace(place)
    setCenter(place.coordinates, 16)
    
    if (onPlaceSelect) {
      onPlaceSelect(place)
    }
  }, [setCenter, onPlaceSelect])

  const clearSelection = useCallback(() => {
    setSelectedPlace(null)
    clearSearch()
  }, [clearSearch])

  return {
    mapInstance,
    isMapReady,
    searchResults,
    isSearching,
    searchError,
    userLocation,
    isLocationLoading,
    locationError,
    selectedPlace,
    searchNearbyPlaces,
    searchNearUser,
    selectPlace,
    clearSelection,
    setCenter,
    setZoom
  }
}
