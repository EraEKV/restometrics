// Типы для работы с 2GIS MapGL
export interface MapInstance {
  setCenter: (coordinates: [number, number]) => void
  setZoom: (zoom: number) => void
  destroy: () => void
  on: (event: string, handler: (e: any) => void) => void
}

export interface MapMarker {
  destroy: () => void
  on: (event: string, handler: (e: any) => void) => void
}

export interface MapClickEvent {
  lngLat?: { lng: number; lat: number } | [number, number]
  coordinates?: [number, number]
  detail?: { coordinates: [number, number] }
  point?: [number, number]
}

export interface MarkerData {
  id: string
  coordinates: [number, number]
  title?: string
  isActive?: boolean
  color?: string
}
