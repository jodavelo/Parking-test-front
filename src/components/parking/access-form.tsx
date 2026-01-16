"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, LogOut, AlertCircle, CheckCircle2 } from "lucide-react"

interface AccessFormProps {
  onAccessRegistered?: () => void
}

interface ApiResponse {
  success: boolean
  message: string
}

export function AccessForm({ onAccessRegistered }: AccessFormProps) {
  const [licensePlate, setLicensePlate] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleAccess = async (accessType: "entry" | "exit") => {
    if (!licensePlate.trim() || !userId.trim()) {
      setMessage({ type: "error", text: "Debe ingresar la placa del vehículo y el ID de usuario" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licensePlate: licensePlate.trim().toUpperCase(),
          userId: userId.trim(),
          accessType: accessType === "entry" ? 0 : 1,
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok && data.success) {
        setMessage({ type: "success", text: data.message || `${accessType === "entry" ? "Entrada" : "Salida"} registrada correctamente` })
        setLicensePlate("")
        setUserId("")
        onAccessRegistered?.()
      } else {
        setMessage({ type: "error", text: data.message || "Error al procesar la solicitud" })
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión con el servidor" })
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
          <Label htmlFor="licensePlate">Placa del Vehículo</Label>
          <Input
            id="licensePlate"
            placeholder="ABC-123"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userId">ID de Usuario</Label>
          <Input
            id="userId"
            placeholder="USR001"
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
            onClick={() => handleAccess("entry")}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Entrada
          </Button>
          <Button
            onClick={() => handleAccess("exit")}
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
