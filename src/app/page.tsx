"use client"

import { useState } from "react"
import { Header, AccessForm, VehicleStatus, AccessHistory } from "@/components/parking"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAccessRegistered = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AccessForm onAccessRegistered={handleAccessRegistered} />
          </div>
          <div className="lg:col-span-2">
            <VehicleStatus refreshTrigger={refreshTrigger} />
          </div>
        </div>
        <div className="mt-6">
          <AccessHistory refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  )
}

