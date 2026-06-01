"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Droplets, 
  Thermometer, 
  Gauge, 
  Activity,
  CheckCircle2,
  AlertTriangle,
  X
} from "lucide-react"

interface MonitoringDemoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SensorData {
  waterLevel: number
  temperature: number
  pressure: number
  flowRate: number
  ph: number
  turbidity: number
}

export function MonitoringDemo({ open, onOpenChange }: MonitoringDemoProps) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [sensorData, setSensorData] = useState<SensorData>({
    waterLevel: 0,
    temperature: 0,
    pressure: 0,
    flowRate: 0,
    ph: 0,
    turbidity: 0,
  })

  useEffect(() => {
    if (!open) {
      setIsMonitoring(false)
      setSensorData({
        waterLevel: 0,
        temperature: 0,
        pressure: 0,
        flowRate: 0,
        ph: 0,
        turbidity: 0,
      })
    }
  }, [open])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      setSensorData({
        waterLevel: Math.round(65 + Math.random() * 25),
        temperature: Math.round((22 + Math.random() * 6) * 10) / 10,
        pressure: Math.round((1.2 + Math.random() * 0.8) * 100) / 100,
        flowRate: Math.round((45 + Math.random() * 30) * 10) / 10,
        ph: Math.round((6.8 + Math.random() * 1.2) * 10) / 10,
        turbidity: Math.round(Math.random() * 15 * 10) / 10,
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const startMonitoring = () => {
    setIsMonitoring(true)
  }

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return "text-emerald-400"
    return "text-amber-400"
  }

  const getStatusIcon = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    }
    return <AlertTriangle className="h-4 w-4 text-amber-400" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[#0a1628] border-cyan-400/20 text-white" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="h-6 w-6 text-cyan-400" />
                Panel de Monitoreo
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-1">
                Demo interactiva del sistema de monitoreo IoT
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {!isMonitoring ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Droplets className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sistema listo para monitorear
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Inicia el monitoreo para ver datos en tiempo real de los sensores IoT conectados al sistema.
              </p>
              <Button
                onClick={startMonitoring}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg rounded-xl"
              >
                <Activity className="mr-2 h-5 w-5" />
                Iniciar Monitoreo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status bar */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-medium">Monitoreo Activo</span>
                </div>
                <span className="text-gray-400 text-sm">Actualizando cada 1.5s</span>
              </div>

              {/* Sensor grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Water Level */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Droplets className="h-5 w-5 text-cyan-400" />
                    {getStatusIcon(sensorData.waterLevel, 50, 90)}
                  </div>
                  <p className="text-gray-400 text-sm">Nivel de Agua</p>
                  <p className={`text-2xl font-bold ${getStatusColor(sensorData.waterLevel, 50, 90)}`}>
                    {sensorData.waterLevel}%
                  </p>
                  <Progress value={sensorData.waterLevel} className="mt-2 h-1.5 bg-white/10" />
                </div>

                {/* Temperature */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Thermometer className="h-5 w-5 text-orange-400" />
                    {getStatusIcon(sensorData.temperature, 20, 28)}
                  </div>
                  <p className="text-gray-400 text-sm">Temperatura</p>
                  <p className={`text-2xl font-bold ${getStatusColor(sensorData.temperature, 20, 28)}`}>
                    {sensorData.temperature}°C
                  </p>
                  <Progress value={(sensorData.temperature / 40) * 100} className="mt-2 h-1.5 bg-white/10" />
                </div>

                {/* Pressure */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Gauge className="h-5 w-5 text-purple-400" />
                    {getStatusIcon(sensorData.pressure, 1.0, 2.0)}
                  </div>
                  <p className="text-gray-400 text-sm">Presion</p>
                  <p className={`text-2xl font-bold ${getStatusColor(sensorData.pressure, 1.0, 2.0)}`}>
                    {sensorData.pressure} bar
                  </p>
                  <Progress value={(sensorData.pressure / 3) * 100} className="mt-2 h-1.5 bg-white/10" />
                </div>

                {/* Flow Rate */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    {getStatusIcon(sensorData.flowRate, 40, 80)}
                  </div>
                  <p className="text-gray-400 text-sm">Flujo</p>
                  <p className={`text-2xl font-bold ${getStatusColor(sensorData.flowRate, 40, 80)}`}>
                    {sensorData.flowRate} L/min
                  </p>
                  <Progress value={(sensorData.flowRate / 100) * 100} className="mt-2 h-1.5 bg-white/10" />
                </div>

                {/* pH */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 w-5 rounded-full bg-green-400/20 flex items-center justify-center text-xs font-bold text-green-400">pH</div>
                    {getStatusIcon(sensorData.ph, 6.5, 8.0)}
                  </div>
                  <p className="text-gray-400 text-sm">pH del Agua</p>
                  <p className={`text-2xl font-bold ${getStatusColor(sensorData.ph, 6.5, 8.0)}`}>
                    {sensorData.ph}
                  </p>
                  <Progress value={(sensorData.ph / 14) * 100} className="mt-2 h-1.5 bg-white/10" />
                </div>

                {/* Turbidity */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 w-5 rounded-full bg-amber-400/20 flex items-center justify-center text-xs font-bold text-amber-400">T</div>
                    {getStatusIcon(sensorData.turbidity, 0, 10)}
                  </div>
                  <p className="text-gray-400 text-sm">Turbidez</p>
                  <p className={`text-2xl font-bold ${getStatusColor(sensorData.turbidity, 0, 10)}`}>
                    {sensorData.turbidity} NTU
                  </p>
                  <Progress value={(sensorData.turbidity / 20) * 100} className="mt-2 h-1.5 bg-white/10" />
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-gray-400">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-gray-400">Atencion</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
