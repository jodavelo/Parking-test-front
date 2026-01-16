"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, LogOut, AlertCircle, CheckCircle2 } from "lucide-react"
import { registerAccess, ApiError } from "@/lib/api/parking"

interface AccessFormProps {
  onAccessRegistered?: () => void
}

export function AccessForm({ onAccessRegistered }: AccessFormProps) {
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleAccess = async (accessType: 0 | 1) => {
    if (!vehiclePlate.trim() || !userId.trim()) {
      setMessage({ type: "error", text: "Debe ingresar la placa del vehículo y el ID de usuario" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await registerAccess({
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
        userId: userId.trim(),
        accessType,
        timestamp: new Date().toISOString(),
      })

      setMessage({ 
        type: "success", 
        text: result.message || `${accessType === 0 ? "Entrada" : "Salida"} registrada correctamente` 
      })
      setVehiclePlate("")
      setUserId("")
      onAccessRegistered?.()
    } catch (error) {
      const apiError = error as ApiError
      setMessage({ 
        type: "error", 
        text: apiError.error || "Error de conexión con el servidor" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Acceso</CardTitle>
        <CardDescription>Ingrese los datos del vehículo para registrar entrada o salida</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">Placa del Vehículo</Label>
          <Input
            id="vehiclePlate"
            placeholder="ABC123"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userId">ID de Usuario</Label>
          <Input
            id="userId"
            placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-green-500 bg-green-500/10" : ""}>
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-500" : ""}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => handleAccess(0)}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Entrada
          </Button>
          <Button
            onClick={() => handleAccess(1)}
            disabled={isLoading}
            variant="outline"
            className="flex-1 text-red-500 border-red-500 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Salida
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
