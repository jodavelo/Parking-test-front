"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Car, User, Clock } from "lucide-react"

interface Vehicle {
  id: string
  licensePlate: string
  userId: string
  userName: string
  entryTime: string
  isInside: boolean
}

interface VehicleStatusProps {
  refreshTrigger?: number
}

export function VehicleStatus({ refreshTrigger }: VehicleStatusProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/status`)
      if (response.ok) {
        const data = await response.json()
        setVehicles(data)
      }
    } catch {
      console.error("Error fetching vehicles")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles, refreshTrigger])

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const vehiclesInside = vehicles.filter((v) => v.isInside).length

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Estado de Vehículos</CardTitle>
            <CardDescription>{vehiclesInside} vehículo(s) actualmente dentro</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar placa o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron vehículos
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Car className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{vehicle.licensePlate}</span>
                      <Badge variant={vehicle.isInside ? "default" : "secondary"}>
                        {vehicle.isInside ? "Dentro" : "Fuera"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {vehicle.userName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(vehicle.entryTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
