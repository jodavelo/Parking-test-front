"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Car, User, Clock, RefreshCw } from "lucide-react"
import { getVehicleStatus, VehicleStatus as VehicleStatusType, ApiError } from "@/lib/api/parking"

interface VehicleStatusProps {
  refreshTrigger?: number
}

interface SearchResult {
  vehicle: VehicleStatusType | null
  error: string | null
}

export function VehicleStatus({ refreshTrigger }: VehicleStatusProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult>({ vehicle: null, error: null })
  const [recentSearches, setRecentSearches] = useState<VehicleStatusType[]>([])

  const searchVehicle = useCallback(async (plate: string) => {
    if (!plate.trim()) return

    setIsLoading(true)
    setSearchResult({ vehicle: null, error: null })

    try {
      const vehicle = await getVehicleStatus(plate.trim().toUpperCase())
      setSearchResult({ vehicle, error: null })
      
      setRecentSearches((prev) => {
        const filtered = prev.filter((v) => v.plate !== vehicle.plate)
        return [vehicle, ...filtered].slice(0, 5)
      })
    } catch (error) {
      const apiError = error as ApiError
      setSearchResult({ 
        vehicle: null, 
        error: apiError.error || "Error al buscar el vehículo" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchResult.vehicle && refreshTrigger) {
      searchVehicle(searchResult.vehicle.plate)
    }
  }, [refreshTrigger, searchResult.vehicle, searchVehicle])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchVehicle(searchTerm)
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const vehiclesInside = recentSearches.filter((v) => v.isInside).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Estado de Vehículos</CardTitle>
            <CardDescription>
              {recentSearches.length > 0 
                ? `${vehiclesInside} de ${recentSearches.length} vehículo(s) consultados están dentro`
                : "Busque un vehículo por su placa"}
            </CardDescription>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="pl-9 w-48"
              />
            </div>
            <Button type="submit" size="icon" disabled={isLoading || !searchTerm.trim()}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {searchResult.error && (
          <div className="text-center py-4 text-red-500 bg-red-500/10 rounded-lg mb-4">
            {searchResult.error}
          </div>
        )}
        
        {searchResult.vehicle && (
          <div className="mb-4 p-4 rounded-lg border-2 border-primary bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{searchResult.vehicle.plate}</span>
                  <Badge variant={searchResult.vehicle.isInside ? "default" : "secondary"}>
                    {searchResult.vehicle.isInside ? "Dentro" : "Fuera"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {searchResult.vehicle.currentUserId && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {searchResult.vehicle.currentUserId}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Entrada: {formatDateTime(searchResult.vehicle.lastEntry)}
                  </span>
                  {searchResult.vehicle.lastExit && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Salida: {formatDateTime(searchResult.vehicle.lastExit)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {recentSearches.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Búsquedas recientes</h4>
            <div className="space-y-3">
              {recentSearches.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSearchTerm(vehicle.plate)
                    searchVehicle(vehicle.plate)
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <Car className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{vehicle.plate}</span>
                        <Badge variant={vehicle.isInside ? "default" : "secondary"}>
                          {vehicle.isInside ? "Dentro" : "Fuera"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(vehicle.lastEntry)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!searchResult.vehicle && recentSearches.length === 0 && !searchResult.error && (
          <div className="text-center py-8 text-muted-foreground">
            Ingrese una placa para consultar el estado del vehículo
          </div>
        )}
      </CardContent>
    </Card>
  )
}
