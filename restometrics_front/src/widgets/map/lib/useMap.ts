import { useState, useEffect, useCallback } from 'react'
import { load } from '@2gis/mapgl'
import type { MapInstance, MapMarker, MapClickEvent, MarkerData } from '../model/types'

interface UseMapOptions {
  container: HTMLDivElement | null
  apiKey: string
  center?: [number, number]
  zoom?: number
  onMapClick?: (coordinates: [number, number]) => void
}

export const useMap = ({
  container,
  apiKey,
  center = [76.9228, 43.2567], // Алматы по умолчанию
  zoom = 13,
  onMapClick
}: UseMapOptions) => {
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [markersData, setMarkersData] = useState<MarkerData[]>([])
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  const normalizeCoordinates = useCallback((coords: any): [number, number] | null => {
    if (!coords) return null
    
    let lng: number
    let lat: number

    if (Array.isArray(coords)) {
      if (coords.length !== 2) return null
      lng = coords[0]
      lat = coords[1]
    } else if (typeof coords === 'object' && coords.lng !== undefined && coords.lat !== undefined) {
      lng = coords.lng
      lat = coords.lat
    } else if (typeof coords === 'object' && coords.longitude !== undefined && coords.latitude !== undefined) {
      lng = coords.longitude
      lat = coords.latitude
    } else {
      return null
    }

    if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
      return null
    }

    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return null
    }

    return [lng, lat]
  }, [])

  const extractCoordinatesFromEvent = useCallback((e: MapClickEvent): [number, number] => {
    if (e.lngLat) {
      if (Array.isArray(e.lngLat)) {
        return [e.lngLat[0], e.lngLat[1]]
      } else {
        return [e.lngLat.lng, e.lngLat.lat]
      }
    } else if (e.coordinates) {
      return [e.coordinates[0], e.coordinates[1]]
    } else if (e.detail && e.detail.coordinates) {
      return [e.detail.coordinates[0], e.detail.coordinates[1]]
    } else if (e.point) {
      return [e.point[0], e.point[1]]
    } else {
      console.warn('Не удалось получить координаты клика, используем центр карты')
      return center
    }
  }, [center])

  useEffect(() => {
    if (!container || !apiKey || mapInstance) return

    let currentMapInstance: MapInstance | null = null
    let isDestroyed = false

    const initMap = async () => {
      try {
        if (isDestroyed) return

        const mapglAPI = await load()
        
        if (isDestroyed) return

        const map = new mapglAPI.Map(container, {
          key: apiKey,
          center,
          zoom,
        }) as MapInstance

        if (isDestroyed) {
          try {
            map.destroy()
          } catch (e) {
            console.warn('Ошибка уничтожения карты при размонтировании:', e)
          }
          return
        }

        (map as any)._mapglAPI = mapglAPI

        currentMapInstance = map
        setMapInstance(map)
        setIsMapReady(true)
        
      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
      }
    }

    initMap()

    return () => {
      isDestroyed = true
      if (currentMapInstance) {
        try {
          markers.forEach(marker => {
            try {
              marker.destroy()
            } catch (e) {
              console.warn('Ошибка удаления маркера:', e)
            }
          })
          
          currentMapInstance.destroy()
        } catch (e) {
          console.warn('Ошибка при уничтожении карты:', e)
        } finally {
          setMapInstance(null)
          setIsMapReady(false)
          setMarkers([])
        }
      }
    }
  }, [container, apiKey])

  useEffect(() => {
    if (!mapInstance || !isMapReady || !onMapClick) return

    const handleClick = (e: MapClickEvent) => {
      const coordinates = extractCoordinatesFromEvent(e)
      onMapClick(coordinates)
    }

    mapInstance.on('click', handleClick)

    return () => {
      try {
      } catch (e) {
        console.warn('Не удалось убрать обработчик клика:', e)
      }
    }
  }, [mapInstance, isMapReady, onMapClick, extractCoordinatesFromEvent])

  const setCenter = useCallback((coordinates: [number, number], zoomLevel?: number) => {
    if (!mapInstance) return
    
    mapInstance.setCenter(coordinates)
    if (zoomLevel) {
      mapInstance.setZoom(zoomLevel)
    }
  }, [mapInstance])

  const setZoom = useCallback((zoomLevel: number) => {
    if (!mapInstance) return
    mapInstance.setZoom(zoomLevel)
  }, [mapInstance])

  const addMarkers = useCallback((markersData: MarkerData[], onMarkerClick?: (markerId: string, coordinates: [number, number]) => void) => {
    if (!mapInstance || !isMapReady || !markersData?.length) return

    setMarkers(currentMarkers => {
      currentMarkers.forEach(marker => {
        try {
          marker.destroy()
        } catch (e) {
          console.warn('Ошибка удаления маркера при обновлении:', e)}
      })
      return []
    })

    const newMarkers: MapMarker[] = []
    const mapglAPI = (mapInstance as any)._mapglAPI

    if (!mapglAPI?.Marker) return

    markersData.forEach((markerData, index) => {
      if (Array.isArray(markerData)) {
        const coords = normalizeCoordinates(markerData)
        if (coords) {
          markerData = {
            id: `marker-${index}`,
            coordinates: coords
          }
        } else {
          return
        }
      }
      
      if (!markerData || !markerData.id) return

      const normalizedCoords = normalizeCoordinates(markerData.coordinates)
      if (!normalizedCoords) return

      const [lng, lat] = normalizedCoords

      try {
        const marker = new mapglAPI.Marker(mapInstance, {
          coordinates: [lng, lat]
        })

        if (onMarkerClick) {
          marker.on('click', (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            onMarkerClick(markerData.id, [lng, lat])
          })
        }

        newMarkers.push(marker)
      } catch (error) {
        console.error('Ошибка создания маркера:', error)
      }
    })

    setMarkers(newMarkers)
    setMarkersData(markersData)
  }, [mapInstance, isMapReady, activeMarkerId, normalizeCoordinates])

  const addMarkersLegacy = useCallback((coordinates: [number, number][], onMarkerClick?: (index: number, coordinates: [number, number]) => void) => {
    const legacyMarkersData: MarkerData[] = coordinates.map((coords, index) => ({
      id: `marker-${index}`,
      coordinates: coords
    }))
    
    const wrappedCallback = onMarkerClick 
      ? (markerId: string, coords: [number, number]) => {
          const index = parseInt(markerId.split('-')[1])
          onMarkerClick(index, coords)
        }
      : undefined
    
    addMarkers(legacyMarkersData, wrappedCallback)
  }, [addMarkers])

  const setActiveMarker = useCallback((markerId: string | null, shouldMoveToMarker = true) => {
    setActiveMarkerId(markerId)
    
    if (markerId && shouldMoveToMarker) {
      const markerData = markersData.find(m => m.id === markerId)
      if (markerData) {
        setCenter(markerData.coordinates, 16)
      }
    }
    
    if (markersData.length > 0) {
      setTimeout(() => {
        addMarkers(markersData)
      }, 100)
    }
  }, [markersData, addMarkers, setCenter])
  const addSingleMarker = useCallback((markerData: MarkerData, onMarkerClick?: (markerId: string, coordinates: [number, number]) => void) => {
    addMarkers([markerData], onMarkerClick)
  }, [addMarkers])

  const createMarkerData = useCallback((id: string, coordinates: any, options?: { title?: string, color?: string }): MarkerData | null => {
    const normalizedCoords = normalizeCoordinates(coordinates)
    if (!normalizedCoords) return null
    
    return {
      id,
      coordinates: normalizedCoords,
      title: options?.title,
      color: options?.color
    }
  }, [normalizeCoordinates])

  return {
    mapInstance,
    isMapReady,
    addMarkers,
    addMarkersLegacy,
    addSingleMarker,
    setActiveMarker,
    createMarkerData,
    setCenter,
    setZoom,
    markers,
    activeMarkerId,
    markersData
  }
}
