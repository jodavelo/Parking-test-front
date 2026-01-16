"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogIn, LogOut, AlertTriangle } from "lucide-react"
import { getAuditLogs, AuditLog } from "@/lib/api/parking"

interface AccessHistoryProps {
  refreshTrigger?: number
}

export function AccessHistory({ refreshTrigger }: AccessHistoryProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAuditLogs(0, 50)
      setLogs(data)
    } catch {
      setLogs([])
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

  const getAccessIcon = (log: AuditLog) => {
    if (!log.success) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
    return log.accessType === 0 ? (
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
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay registros de acceso
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-lg border ${
                    log.success 
                      ? "bg-card" 
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getAccessIcon(log)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{log.vehiclePlate}</span>
                        <Badge variant={log.accessType === 0 ? "default" : "secondary"}>
                          {log.accessType === 0 ? "Entrada" : "Salida"}
                        </Badge>
                        <Badge variant={log.success ? "outline" : "destructive"}>
                          {log.success ? "Exitoso" : "Denegado"}
                        </Badge>
                      </div>
                      {!log.success && log.failureReason && (
                        <p className="text-sm text-red-500 mt-1">{log.failureReason}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Usuario: {log.userId} • {formatDateTime(log.timestamp)}
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
