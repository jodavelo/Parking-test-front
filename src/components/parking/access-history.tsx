"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogIn, LogOut, AlertTriangle } from "lucide-react"

interface AccessEvent {
  id: string
  licensePlate: string
  userId: string
  accessType: "entry" | "exit"
  success: boolean
  message: string
  timestamp: string
}

interface AccessHistoryProps {
  refreshTrigger?: number
}

export function AccessHistory({ refreshTrigger }: AccessHistoryProps) {
  const [events, setEvents] = useState<AccessEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/access/history`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch {
      console.error("Error fetching history")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory, refreshTrigger])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getAccessIcon = (event: AccessEvent) => {
    if (!event.success) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
    return event.accessType === "entry" ? (
      <LogIn className="w-5 h-5 text-green-500" />
    ) : (
      <LogOut className="w-5 h-5 text-blue-500" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Accesos</CardTitle>
        <CardDescription>Registro de auditoría de todos los intentos de acceso</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay registros de acceso
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    event.success 
                      ? "bg-card" 
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getAccessIcon(event)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{event.licensePlate}</span>
                        <Badge variant={event.accessType === "entry" ? "default" : "secondary"}>
                          {event.accessType === "entry" ? "Entrada" : "Salida"}
                        </Badge>
                        <Badge variant={event.success ? "outline" : "destructive"}>
                          {event.success ? "Exitoso" : "Denegado"}
                        </Badge>
                      </div>
                      {!event.success && event.message && (
                        <p className="text-sm text-red-500 mt-1">{event.message}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Usuario: {event.userId} • {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
