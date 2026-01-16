const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5206"

export interface AccessRequest {
  vehiclePlate: string
  userId: string
  accessType: 0 | 1
  timestamp: string
}

export interface AccessResponse {
  success: boolean
  message: string
  logId: string
}

export interface VehicleStatus {
  id: string
  plate: string
  isInside: boolean
  lastEntry: string | null
  lastExit: string | null
  currentUserId: string | null
}

export interface AuditLog {
  id: string
  vehiclePlate: string
  userId: string
  accessType: number
  timestamp: string
  success: boolean
  failureReason: string | null
  createdAt: string
}

export interface ApiError {
  error: string
  code: string
  statusCode: number
}

export async function registerAccess(data: AccessRequest): Promise<AccessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/access`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw error
  }

  return response.json()
}

export async function getVehicleStatus(plate: string): Promise<VehicleStatus> {
  const response = await fetch(`${API_BASE_URL}/api/access/vehicle/${encodeURIComponent(plate)}/status`)

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw error
  }

  return response.json()
}

export async function getAuditLogs(skip = 0, take = 50): Promise<AuditLog[]> {
  const response = await fetch(`${API_BASE_URL}/api/access/audit?skip=${skip}&take=${take}`)

  if (!response.ok) {
    throw new Error("Error al obtener logs de auditoría")
  }

  return response.json()
}
