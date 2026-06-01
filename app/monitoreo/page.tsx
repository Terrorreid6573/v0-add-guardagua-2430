"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"

// Leaflet se carga dinamicamente para evitar errores de SSR
const MapComponent = dynamic(() => import("@/components/monitoring/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0F1E29]">
      <div className="text-cyan-400 animate-pulse">Cargando mapa...</div>
    </div>
  ),
})

// Tipos
interface Colony {
  id: number
  name: string
  lat: number
  lng: number
  zone: string
  muni: string
  hasWater: boolean
  lastChange: Date
  estReturn: Date | null
  estGone: Date | null
  riskLevel: number
}

interface EventItem {
  type: "on" | "off" | "risk"
  name: string
  zone: string
  muni: string
  msg: string
  time: Date
}

// Datos de colonias
const COLONIES_RAW = [
  // Ciudad de Aguascalientes
  { id: 1, name: "San Marcos", lat: 21.8794, lng: -102.2972, zone: "Centro", muni: "Aguascalientes" },
  { id: 2, name: "Jardines de la Asuncion", lat: 21.8679, lng: -102.2941, zone: "Sur", muni: "Aguascalientes" },
  { id: 3, name: "Bosques del Prado", lat: 21.8995, lng: -102.2868, zone: "Norte", muni: "Aguascalientes" },
  { id: 4, name: "Ojocaliente", lat: 21.8523, lng: -102.2467, zone: "Oriente", muni: "Aguascalientes" },
  { id: 5, name: "Pilar Blanco", lat: 21.8448, lng: -102.3045, zone: "Sur", muni: "Aguascalientes" },
  { id: 6, name: "Morelos", lat: 21.8762, lng: -102.328, zone: "Poniente", muni: "Aguascalientes" },
  { id: 7, name: "Insurgentes", lat: 21.8892, lng: -102.2698, zone: "Oriente", muni: "Aguascalientes" },
  { id: 8, name: "Las Americas", lat: 21.8717, lng: -102.286, zone: "Centro", muni: "Aguascalientes" },
  { id: 9, name: "Altavista", lat: 21.8878, lng: -102.3102, zone: "Centro", muni: "Aguascalientes" },
  { id: 10, name: "Del Valle", lat: 21.892, lng: -102.303, zone: "Centro", muni: "Aguascalientes" },
  { id: 11, name: "Gremial", lat: 21.8955, lng: -102.2985, zone: "Centro", muni: "Aguascalientes" },
  { id: 12, name: "La Estrella", lat: 21.884, lng: -102.317, zone: "Poniente", muni: "Aguascalientes" },
  { id: 13, name: "Espana", lat: 21.857, lng: -102.3, zone: "Sur", muni: "Aguascalientes" },
  { id: 14, name: "Fundicion", lat: 21.878, lng: -102.321, zone: "Poniente", muni: "Aguascalientes" },
  { id: 15, name: "Circunvalacion Norte", lat: 21.91, lng: -102.296, zone: "Norte", muni: "Aguascalientes" },
  { id: 16, name: "Los Bosques", lat: 21.921, lng: -102.292, zone: "Norte", muni: "Aguascalientes" },
  { id: 17, name: "Las Hadas", lat: 21.912, lng: -102.281, zone: "Norte", muni: "Aguascalientes" },
  { id: 18, name: "Trojes de Alonso", lat: 21.936, lng: -102.301, zone: "Norte", muni: "Aguascalientes" },
  { id: 19, name: "Villa Teresa", lat: 21.905, lng: -102.275, zone: "Norte", muni: "Aguascalientes" },
  { id: 20, name: "Villas de Nuestra Senora", lat: 21.9275, lng: -102.2508, zone: "Oriente", muni: "Aguascalientes" },
  // San Francisco de los Romo
  { id: 41, name: "Centro", lat: 22.0724, lng: -102.2727, zone: "San Pancho", muni: "San Francisco de los Romo" },
  { id: 42, name: "El Sauz", lat: 22.068, lng: -102.268, zone: "San Pancho", muni: "San Francisco de los Romo" },
  { id: 43, name: "La Palma", lat: 22.076, lng: -102.278, zone: "San Pancho", muni: "San Francisco de los Romo" },
  { id: 44, name: "Lomas de San Francisco", lat: 22.08, lng: -102.274, zone: "San Pancho", muni: "San Francisco de los Romo" },
  { id: 45, name: "Villas de San Francisco", lat: 22.07, lng: -102.265, zone: "San Pancho", muni: "San Francisco de los Romo" },
  // Jesus Maria
  { id: 51, name: "Centro", lat: 21.9648, lng: -102.3432, zone: "Jesus Maria", muni: "Jesus Maria" },
  { id: 52, name: "Las Margaritas", lat: 21.958, lng: -102.337, zone: "Jesus Maria", muni: "Jesus Maria" },
  { id: 53, name: "El Encino", lat: 21.97, lng: -102.35, zone: "Jesus Maria", muni: "Jesus Maria" },
  { id: 54, name: "Paseos del Vergel", lat: 21.972, lng: -102.329, zone: "Jesus Maria", muni: "Jesus Maria" },
  { id: 55, name: "Lomas de Jesus Maria", lat: 21.964, lng: -102.355, zone: "Jesus Maria", muni: "Jesus Maria" },
  // El Llano
  { id: 61, name: "Cabecera", lat: 21.921, lng: -102.019, zone: "El Llano", muni: "El Llano" },
  { id: 62, name: "La Loma del Trigo", lat: 21.915, lng: -102.014, zone: "El Llano", muni: "El Llano" },
  { id: 63, name: "Los Arquitos", lat: 21.928, lng: -102.023, zone: "El Llano", muni: "El Llano" },
  { id: 64, name: "El Potrero", lat: 21.91, lng: -102.027, zone: "El Llano", muni: "El Llano" },
  { id: 65, name: "Las Pilas", lat: 21.933, lng: -102.016, zone: "El Llano", muni: "El Llano" },
]

// Utilidades
const fmt = (d: Date) =>
  d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true })
const fmtRemain = (future: Date) => {
  const d = future.getTime() - Date.now()
  if (d <= 0) return "muy pronto"
  const h = Math.floor(d / 3600000)
  const m = Math.floor((d % 3600000) / 60000)
  return h > 0 ? `~${h}h ${m}m` : `~${m} min`
}

export default function MonitoreoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [userColony, setUserColony] = useState<number | null>(null)
  const [colonies, setColonies] = useState<Record<number, Colony>>({})
  const [events, setEvents] = useState<EventItem[]>([])
  const [notifications, setNotifications] = useState<
    Array<{ id: string; type: string; title: string; body: string; time: Date }>
  >([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"colonies" | "events" | "nearby">("colonies")
  const notifIdRef = useRef(0)

  // Inicializar colonias
  useEffect(() => {
    const initialColonies: Record<number, Colony> = {}
    COLONIES_RAW.forEach((c) => {
      initialColonies[c.id] = {
        ...c,
        hasWater: Math.random() > 0.22,
        lastChange: new Date(Date.now() - Math.random() * 3600000),
        estReturn: null,
        estGone: null,
        riskLevel: 0,
      }
    })
    // Algunas colonias sin agua
    const noWater = Object.keys(initialColonies)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
    noWater.forEach((id) => {
      const colony = initialColonies[parseInt(id)]
      colony.hasWater = false
      colony.estReturn = new Date(Date.now() + (1 + Math.random() * 3.5) * 3600000)
    })
    setColonies(initialColonies)
  }, [])

  // Loading steps
  useEffect(() => {
    const steps = [
      "Conectando con sensores IoT...",
      "Cargando red hidrica de 4 municipios...",
      "Procesando reportes en tiempo real...",
      "Todo listo!",
    ]
    let step = 0
    const interval = setInterval(() => {
      step++
      setLoadingStep(step)
      if (step >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsLoading(false)
          // Mostrar modal de notificaciones si no se ha preguntado antes
          const asked = localStorage.getItem("guardagua_notif_asked")
          if (!asked) {
            setTimeout(() => setShowNotifModal(true), 500)
          } else {
            setShowLocationModal(true)
          }
        }, 800)
      }
    }, 650)
    return () => clearInterval(interval)
  }, [])

  // Reloj
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulacion de cambios de agua
  useEffect(() => {
    if (isLoading || Object.keys(colonies).length === 0) return

    const simulate = () => {
      const ids = Object.keys(colonies).map(Number)
      const id = ids[Math.floor(Math.random() * ids.length)]
      const colony = colonies[id]

      if (!colony.hasWater) {
        if (Math.random() < 0.65) {
          triggerWater(id, true)
        }
      } else {
        if (Math.random() < 0.28) {
          triggerWater(id, false)
        }
      }
    }

    const interval = setInterval(simulate, 25000 + Math.random() * 55000)
    return () => clearInterval(interval)
  }, [isLoading, colonies])

  const addNotification = useCallback(
    (type: string, title: string, body: string) => {
      const id = `notif-${notifIdRef.current++}`
      setNotifications((prev) => [...prev, { id, type, title, body, time: new Date() }])
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 6500)
    },
    []
  )

  const triggerWater = useCallback(
    (id: number, hasWater: boolean) => {
      setColonies((prev) => {
        const colony = prev[id]
        if (!colony) return prev

        const now = new Date()
        const updated = {
          ...colony,
          hasWater,
          lastChange: now,
          riskLevel: 0,
          estGone: null,
          estReturn: hasWater ? null : new Date(now.getTime() + (1.2 + Math.random() * 3.8) * 3600000),
        }

        // Agregar evento
        const eventMsg = hasWater
          ? `<strong>${colony.name}</strong> (${colony.muni}) - el agua regreso a las ${fmt(now)}`
          : `<strong>${colony.name}</strong> (${colony.muni}) - se fue el agua a las ${fmt(now)}`

        setEvents((prevEvents) => [
          { type: hasWater ? "on" : "off", name: colony.name, zone: colony.zone, muni: colony.muni, msg: eventMsg, time: now },
          ...prevEvents.slice(0, 119),
        ])

        // Notificacion si es la colonia del usuario
        if (id === userColony) {
          if (hasWater) {
            addNotification("water-on", `Ya hay agua en ${colony.name}!`, `El agua regreso a tu colonia a las ${fmt(now)}.`)
          } else {
            addNotification(
              "water-off",
              `Se fue el agua en ${colony.name}`,
              `El agua se corto a las ${fmt(now)}. Regreso estimado: ${fmt(updated.estReturn!)}.`
            )
          }
        }

        return { ...prev, [id]: updated }
      })
    },
    [userColony, addNotification]
  )

  const handleColonySelect = useCallback(
    (id: number) => {
      setUserColony(id)
      setShowLocationModal(false)
      const colony = colonies[id]
      if (colony) {
        if (colony.hasWater && colony.riskLevel === 0) {
          addNotification("water-on", `Hay agua en ${colony.name}`, `La colonia ${colony.name} (${colony.muni}) tiene suministro desde las ${fmt(colony.lastChange)}.`)
        } else if (!colony.hasWater) {
          addNotification(
            "water-off",
            `No hay agua en ${colony.name}`,
            `${colony.name} no tiene suministro${colony.estReturn ? `. Regreso estimado: ${fmt(colony.estReturn)}` : ""}. Te avisaremos cuando regrese.`
          )
        }
      }
    },
    [colonies, addNotification]
  )

  const handleNotifOptIn = useCallback((accept: boolean) => {
    localStorage.setItem("guardagua_notif_asked", "1")
    if (accept && "Notification" in window) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          localStorage.setItem("guardagua_notif", "on")
        }
      })
    }
    setShowNotifModal(false)
    setTimeout(() => setShowLocationModal(true), 350)
  }, [])

  const reportWater = useCallback(
    (hasWater: boolean) => {
      if (!userColony) {
        setShowLocationModal(true)
        return
      }
      triggerWater(userColony, hasWater)
      addNotification(
        hasWater ? "water-on" : "water-off",
        hasWater ? `Reportaste agua en ${colonies[userColony]?.name}` : `Reportaste falta de agua en ${colonies[userColony]?.name}`,
        hasWater ? `Gracias. Registramos que SI hay agua.` : `Gracias. Registramos que NO hay agua.`
      )
    },
    [userColony, colonies, triggerWater, addNotification]
  )

  const stats = {
    on: Object.values(colonies).filter((c) => c.hasWater && c.riskLevel === 0).length,
    off: Object.values(colonies).filter((c) => !c.hasWater).length,
    risk: Object.values(colonies).filter((c) => c.hasWater && c.riskLevel > 0).length,
  }

  const userColonyData = userColony ? colonies[userColony] : null

  const loadingSteps = [
    "Conectando con sensores IoT...",
    "Cargando red hidrica de 4 municipios...",
    "Procesando reportes en tiempo real...",
    "Todo listo!",
  ]

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0F1E29] via-[#1E4256] to-[#143041] flex flex-col items-center justify-center overflow-hidden">
        {/* Particulas de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute text-lg animate-float-up"
              style={{
                left: `${(i * 23) % 100}%`,
                fontSize: `${8 + (i % 3) * 6}px`,
                animationDuration: `${6 + (i % 5) * 2}s`,
                animationDelay: `${(i * 0.5) % 8}s`,
                opacity: 0.4,
              }}
            >
              {["💧", "🌊", "💦", "⚡", "🔵"][i % 5]}
            </div>
          ))}
        </div>

        {/* Logo animado */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-7 animate-float">
          {/* Anillos */}
          {[96, 132, 168].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border animate-ping-slow"
              style={{
                width: size,
                height: size,
                borderColor: i === 1 ? "rgba(93,162,113,0.25)" : "rgba(79,179,191,0.3)",
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
          {/* Logo interno */}
          <div className="w-[82px] h-[82px] rounded-[22px] bg-gradient-to-br from-cyan-500/20 to-green-500/15 border border-cyan-400/40 flex items-center justify-center text-4xl shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            💧
            <div className="absolute top-[-50%] left-[-60%] w-[60%] h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Titulo */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center">
          Guard<span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(79,179,191,0.5)]">Agua</span>
        </h1>
        <p className="text-xs tracking-[5px] uppercase text-cyan-400 mt-3 mb-11 opacity-80">
          Sistema de Monitoreo IoT
        </p>

        {/* Barra de carga */}
        <div className="w-60 h-[3px] bg-white/10 rounded overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-[length:200%] rounded animate-gradient-x transition-all duration-700"
            style={{ width: `${(loadingStep / 4) * 100}%` }}
          />
        </div>

        {/* Paso actual */}
        <p className="mt-4 text-xs font-mono text-white/40">{loadingSteps[Math.min(loadingStep, 3)]}</p>

        <style jsx>{`
          @keyframes float-up {
            0% {
              transform: translateY(110vh) scale(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.4;
            }
            100% {
              transform: translateY(-20vh) scale(1.2) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-float-up {
            animation: float-up linear infinite;
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-14px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes ping-slow {
            0% {
              opacity: 0.9;
              transform: scale(0.7);
            }
            100% {
              opacity: 0;
              transform: scale(1.15);
            }
          }
          .animate-ping-slow {
            animation: ping-slow 3s ease-out infinite;
          }
          @keyframes shimmer {
            0% {
              left: -60%;
            }
            100% {
              left: 130%;
            }
          }
          .animate-shimmer {
            animation: shimmer 2.5s ease-in-out infinite;
          }
          @keyframes gradient-x {
            0% {
              background-position: 0%;
            }
            100% {
              background-position: 200%;
            }
          }
          .animate-gradient-x {
            animation: gradient-x 1.5s linear infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0F1E29] text-[#EAF1F2] font-sans overflow-hidden">
      {/* NAV */}
      <nav className="h-[58px] flex items-center justify-between px-4 bg-[#0F1E29]/97 border-b border-cyan-400/20 backdrop-blur-xl flex-shrink-0 z-50 relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setShowLocationModal(true)}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/25 to-green-400/15 border border-cyan-400/30 flex items-center justify-center transition-all group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(79,179,191,0.3)]">
            💧
          </div>
          <span className="text-xl font-black tracking-tight">
            Guard<span className="text-cyan-400">Agua</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 bg-cyan-400/5 border border-cyan-400/20 rounded-full px-3 py-1 text-xs text-white/70 hover:bg-cyan-400/15 hover:border-cyan-400 transition-all max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span>{userColonyData?.name || "Seleccionar colonia"}</span>
          </button>
          <div className="font-mono text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-lg px-2.5 py-1 tracking-wide hidden sm:block">
            {currentTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* MAP */}
        <div className="flex-1 relative">
          <MapComponent
            colonies={colonies}
            userColony={userColony}
            onColonySelect={handleColonySelect}
            stats={stats}
          />

          {/* Stats flotantes */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] flex gap-2 bg-[#0F1E29]/95 border border-cyan-400/20 rounded-full px-4 py-2 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(93,162,113,0.7)]" />
              <span className="font-mono font-medium text-green-500">{stats.on}</span>
              <span className="text-white/40 text-[10px]">con agua</span>
            </div>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(197,107,92,0.7)]" />
              <span className="font-mono font-medium text-red-400">{stats.off}</span>
              <span className="text-white/40 text-[10px]">sin agua</span>
            </div>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(217,160,91,0.7)]" />
              <span className="font-mono font-medium text-orange-400">{stats.risk}</span>
              <span className="text-white/40 text-[10px]">en riesgo</span>
            </div>
          </div>

          {/* Controles del mapa */}
          <div className="absolute bottom-10 right-3 z-[400] flex flex-col gap-1.5">
            <button
              onClick={() => userColony && handleColonySelect(userColony)}
              className="bg-[#0F1E29]/95 border border-cyan-400/20 text-white px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-lg hover:bg-cyan-400/15 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center gap-1.5 shadow-lg"
            >
              📍 Mi colonia
            </button>
            <button
              onClick={() => setShowLocationModal(true)}
              className="bg-[#0F1E29]/95 border border-cyan-400/20 text-white px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-lg hover:bg-cyan-400/15 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center gap-1.5 shadow-lg"
            >
              🔄 Cambiar
            </button>
          </div>

          {/* Leyenda */}
          <div className="absolute bottom-10 left-3 z-[400] bg-[#0F1E29]/95 border border-cyan-400/20 rounded-xl px-4 py-3 backdrop-blur-lg shadow-lg">
            <div className="text-[10px] tracking-widest uppercase text-white/40 mb-2.5">Estado del Suministro</div>
            <div className="flex flex-col gap-1.5 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(93,162,113,0.6)]" />
                Con agua
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_6px_rgba(197,107,92,0.6)]" />
                Sin suministro
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(217,160,91,0.6)]" />
                En riesgo
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(79,179,191,0.9)] border-2 border-white" />
                Mi colonia
              </div>
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="w-[330px] bg-[rgba(20,40,56,0.97)] border-l border-cyan-400/20 flex-col overflow-hidden flex-shrink-0 hidden lg:flex">
          {/* Status Card */}
          <div
            className={`p-4 border-b border-cyan-400/20 relative overflow-hidden transition-colors duration-1000 ${
              userColonyData
                ? userColonyData.hasWater
                  ? userColonyData.riskLevel > 0
                    ? "bg-gradient-to-br from-orange-500/15 to-red-500/5"
                    : "bg-gradient-to-br from-green-500/15 to-cyan-500/5"
                  : "bg-gradient-to-br from-red-500/15 to-red-500/5"
                : ""
            }`}
          >
            {/* Ondas animadas */}
            <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden">
              <div className="absolute bottom-0 left-[-10%] w-[120%] h-full rounded-[50%_50%_0_0] bg-cyan-400/10 animate-wave1" />
              <div className="absolute bottom-0 left-[-10%] w-[120%] h-[80%] rounded-[50%_50%_0_0] bg-cyan-400/5 animate-wave2" />
            </div>

            <div className="flex items-start justify-between mb-3 relative z-10">
              <div>
                <div className="text-base font-extrabold tracking-tight">{userColonyData?.name || "—"}</div>
                <div className="text-[10px] text-white/40 font-mono mt-0.5">
                  {userColonyData ? `${userColonyData.muni} · act. ${fmt(userColonyData.lastChange)}` : "Sin colonia seleccionada"}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                  userColonyData
                    ? userColonyData.hasWater
                      ? userColonyData.riskLevel > 0
                        ? "bg-gradient-radial from-orange-500/30 to-transparent animate-pulse-orange"
                        : "bg-gradient-radial from-green-500/30 to-cyan-500/10 animate-pulse-green"
                      : "bg-gradient-radial from-red-500/25 to-transparent animate-pulse-red"
                    : ""
                }`}
              >
                {userColonyData ? (userColonyData.hasWater ? "💧" : "🚫") : "💧"}
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${
                userColonyData
                  ? userColonyData.hasWater
                    ? userColonyData.riskLevel > 0
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/35"
                      : "bg-green-500/20 text-green-500 border border-green-500/35"
                    : "bg-red-500/20 text-red-400 border border-red-500/35"
                  : "bg-green-500/20 text-green-500 border border-green-500/35"
              }`}
            >
              {userColonyData
                ? userColonyData.hasWater
                  ? userColonyData.riskLevel > 0
                    ? "⚠ EN RIESGO"
                    : "✓ HAY AGUA"
                  : "✗ NO HAY AGUA"
                : "✓ AGUA DISPONIBLE"}
            </div>

            <p className="text-sm text-white/70 leading-relaxed mt-2.5 relative z-10">
              {userColonyData
                ? userColonyData.hasWater
                  ? `Si hay agua en ${userColonyData.name}. El suministro es normal desde las ${fmt(userColonyData.lastChange)}.`
                  : `No hay agua en ${userColonyData.name}. Cortado a las ${fmt(userColonyData.lastChange)}. Recibiras una alerta cuando regrese.`
                : "Selecciona tu colonia para iniciar el monitoreo personalizado."}
            </p>

            {userColonyData && !userColonyData.hasWater && userColonyData.estReturn && (
              <div className="bg-black/20 border border-orange-500/25 rounded-xl p-2.5 mt-2.5 relative z-10">
                <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">⏳ Estimado de regreso</div>
                <div className="font-mono text-2xl font-medium text-green-500">{fmtRemain(userColonyData.estReturn)}</div>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 border-b border-cyan-400/20">
            <div className="p-3 text-center border-r border-cyan-400/20 hover:bg-cyan-400/5 transition-colors">
              <div className="font-mono text-2xl font-medium text-green-500">{stats.on}</div>
              <div className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Con Agua</div>
            </div>
            <div className="p-3 text-center border-r border-cyan-400/20 hover:bg-cyan-400/5 transition-colors">
              <div className="font-mono text-2xl font-medium text-red-400">{stats.off}</div>
              <div className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Sin Agua</div>
            </div>
            <div className="p-3 text-center hover:bg-cyan-400/5 transition-colors">
              <div className="font-mono text-2xl font-medium text-orange-400">{stats.risk}</div>
              <div className="text-[10px] tracking-widest uppercase text-white/40 mt-1">En Riesgo</div>
            </div>
          </div>

          {/* Report buttons */}
          <div className="flex gap-2.5 p-3.5 border-b border-cyan-400/20">
            <button
              onClick={() => reportWater(true)}
              className="flex-1 py-2.5 px-2 rounded-xl text-white text-sm font-bold bg-gradient-to-br from-green-500 to-green-600 hover:translate-y-[-3px] hover:shadow-[0_10px_28px_rgba(93,162,113,0.45)] transition-all relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
              💧 Tengo agua
            </button>
            <button
              onClick={() => reportWater(false)}
              className="flex-1 py-2.5 px-2 rounded-xl text-white text-sm font-bold bg-gradient-to-br from-red-400 to-red-500 hover:translate-y-[-3px] hover:shadow-[0_10px_28px_rgba(197,107,92,0.45)] transition-all relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
              🚫 No tengo agua
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-cyan-400/20 flex-shrink-0">
            {(["colonies", "events", "nearby"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-center text-xs font-semibold tracking-wide uppercase transition-all ${
                  activeTab === tab ? "text-cyan-400" : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "colonies" ? "Colonias" : tab === "events" ? "Eventos" : "Cercanas"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600">
            {activeTab === "colonies" && (
              <div>
                {["Aguascalientes", "San Francisco de los Romo", "Jesus Maria", "El Llano"].map((muni) => {
                  const muniColonies = COLONIES_RAW.filter((c) => c.muni === muni)
                  if (muniColonies.length === 0) return null
                  const muniColor =
                    muni === "San Francisco de los Romo"
                      ? "text-orange-400"
                      : muni === "Jesus Maria"
                        ? "text-green-500"
                        : muni === "El Llano"
                          ? "text-red-400"
                          : "text-cyan-400"
                  return (
                    <div key={muni}>
                      <div className={`px-4 py-2 text-[10px] tracking-widest uppercase ${muniColor} bg-black/15 border-b border-white/5 font-bold`}>
                        {muni}
                      </div>
                      {muniColonies.map((cd) => {
                        const c = colonies[cd.id]
                        if (!c) return null
                        const isUser = cd.id === userColony
                        const status = c.hasWater ? (c.riskLevel > 0 ? "risk" : "on") : "off"
                        return (
                          <div
                            key={cd.id}
                            onClick={() => handleColonySelect(cd.id)}
                            className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-cyan-400/5 hover:translate-x-0.5 transition-all ${isUser ? "border-l-[3px] border-l-green-500 pl-[13px]" : ""}`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full flex-shrink-0 transition-all ${
                                status === "on"
                                  ? "bg-green-500 shadow-[0_0_8px_rgba(93,162,113,0.7)]"
                                  : status === "off"
                                    ? "bg-red-400 shadow-[0_0_8px_rgba(197,107,92,0.7)]"
                                    : "bg-orange-400 shadow-[0_0_8px_rgba(217,160,91,0.7)]"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate">
                                {cd.name}
                                {isUser && <span className="text-cyan-400 text-[10px] ml-1">●</span>}
                              </div>
                              <div className="text-[11px] text-white/40 mt-0.5">
                                {c.hasWater ? (c.riskLevel > 0 ? "⚠️ En riesgo" : "Hay agua") : `No hay agua${c.estReturn ? ` · reg. ${fmt(c.estReturn)}` : ""}`}
                              </div>
                            </div>
                            <div className="text-[11px] text-white/40 font-mono flex-shrink-0">{c.zone}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === "events" && (
              <div>
                {events.length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-sm">📋 Sin eventos recientes</div>
                ) : (
                  events.slice(0, 40).map((ev, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 animate-slide-in">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 transition-transform hover:scale-110 ${
                          ev.type === "on"
                            ? "bg-green-500/20 shadow-[0_0_10px_rgba(93,162,113,0.2)]"
                            : ev.type === "off"
                              ? "bg-red-500/20 shadow-[0_0_10px_rgba(197,107,92,0.2)]"
                              : "bg-orange-500/20 shadow-[0_0_10px_rgba(217,160,91,0.2)]"
                        }`}
                      >
                        {ev.type === "on" ? "💧" : ev.type === "off" ? "🚫" : "⚠️"}
                      </div>
                      <div>
                        <div className="text-xs text-white/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: ev.msg }} />
                        <div className="text-[11px] text-white/40 mt-1 font-mono">
                          {fmt(ev.time)} · {ev.muni || ev.zone}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "nearby" && (
              <div>
                {!userColony ? (
                  <div className="p-8 text-center text-white/40 text-sm">📍 Selecciona tu colonia primero</div>
                ) : (
                  <>
                    <div className="px-4 py-2.5 text-[11px] text-white/40 bg-cyan-400/5 border-b border-cyan-400/20">
                      📡 Colonias en radio de 3.5 km · afectan tu suministro
                    </div>
                    {COLONIES_RAW.filter((c) => {
                      if (c.id === userColony) return false
                      const uc = colonies[userColony]
                      if (!uc) return false
                      const dist = Math.sqrt(Math.pow(c.lat - uc.lat, 2) + Math.pow(c.lng - uc.lng, 2)) * 111
                      return dist <= 3.5
                    }).map((cd) => {
                      const c = colonies[cd.id]
                      if (!c) return null
                      const status = c.hasWater ? (c.riskLevel > 0 ? "risk" : "on") : "off"
                      const uc = colonies[userColony!]
                      const dist = Math.sqrt(Math.pow(c.lat - uc.lat, 2) + Math.pow(c.lng - uc.lng, 2)) * 111
                      return (
                        <div
                          key={cd.id}
                          onClick={() => handleColonySelect(cd.id)}
                          className="flex items-center gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-cyan-400/5 hover:translate-x-0.5 transition-all"
                        >
                          <span
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              status === "on"
                                ? "bg-green-500 shadow-[0_0_8px_rgba(93,162,113,0.7)]"
                                : status === "off"
                                  ? "bg-red-400 shadow-[0_0_8px_rgba(197,107,92,0.7)]"
                                  : "bg-orange-400 shadow-[0_0_8px_rgba(217,160,91,0.7)]"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">
                              {cd.name} <span className="text-white/40 text-[10px]">{c.muni}</span>
                            </div>
                            <div className="mt-0.5">
                              {!c.hasWater ? (
                                <span className="text-red-400 text-[11px]">⚡ Influye en tu suministro</span>
                              ) : c.riskLevel > 0 ? (
                                <span className="text-orange-400 text-[11px]">⚠️ En riesgo</span>
                              ) : (
                                <span className="text-white/40 text-[11px]">Estado normal</span>
                              )}
                            </div>
                          </div>
                          <div className="text-[11px] text-white/40 font-mono flex-shrink-0">{dist.toFixed(1)}km</div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="fixed top-[70px] right-4 z-[2000] flex flex-col gap-2.5 max-w-[340px] pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-[rgba(12,26,38,0.98)] border rounded-2xl p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-3xl flex gap-3 items-start pointer-events-auto relative overflow-hidden animate-slide-in-right ${
              notif.type === "water-on"
                ? "border-l-4 border-l-green-500 border-cyan-400/20"
                : notif.type === "water-off"
                  ? "border-l-4 border-l-red-400 border-cyan-400/20"
                  : notif.type === "risk"
                    ? "border-l-4 border-l-orange-400 border-cyan-400/20"
                    : "border-l-4 border-l-cyan-400 border-cyan-400/20"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <span className="text-xl flex-shrink-0">
              {notif.type === "water-on" ? "💧" : notif.type === "water-off" ? "🚫" : notif.type === "risk" ? "⚠️" : "ℹ️"}
            </span>
            <div className="flex-1">
              <div className="text-sm font-bold mb-0.5">{notif.title}</div>
              <div className="text-xs text-white/70 leading-relaxed">{notif.body}</div>
              <div className="text-[10px] text-white/40 mt-1.5 font-mono">
                {fmt(notif.time)} · GuardAgua IoT
              </div>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
              className="text-white/40 hover:text-white hover:bg-white/10 p-1 rounded transition-all text-sm leading-none flex-shrink-0"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-white/10 rounded overflow-hidden">
              <div
                className={`h-full rounded animate-progress ${
                  notif.type === "water-on"
                    ? "bg-green-500"
                    : notif.type === "water-off"
                      ? "bg-red-400"
                      : notif.type === "risk"
                        ? "bg-orange-400"
                        : "bg-cyan-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NOTIFICACIONES */}
      {showNotifModal && (
        <div className="fixed inset-0 z-[850] bg-black/65 backdrop-blur-lg flex items-center justify-center animate-fade-in">
          <div className="bg-gradient-to-br from-[#1A3344] to-[#0F1E29] border border-cyan-400/20 rounded-3xl p-8 w-[92%] max-w-[460px] shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-scale-in">
            <div className="text-5xl text-center mb-2 animate-bell-ring origin-[50%_4px]">🔔</div>
            <h2 className="text-2xl font-extrabold text-center tracking-tight">Recibir alertas de agua?</h2>
            <p className="text-cyan-400 text-[10px] tracking-widest uppercase text-center mt-1.5 mb-4">
              Notificaciones del sistema
            </p>
            <p className="text-white/70 text-sm leading-relaxed text-center mb-6">
              Te avisamos al instante cuando el agua llega o se corta en tu colonia. Las notificaciones aparecen directo en tu pantalla, incluso si tienes otra pestana abierta.
            </p>
            <button
              onClick={() => handleNotifOptIn(true)}
              className="w-full p-3.5 rounded-xl bg-gradient-to-br from-cyan-400 to-[#2C6E8F] text-white font-semibold flex items-center gap-3.5 mb-2.5 hover:translate-y-[-3px] hover:shadow-[0_12px_32px_rgba(79,179,191,0.4)] transition-all relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <span className="text-xl">🔔</span>
              <div className="text-left">
                <div>Si, activar alertas</div>
                <div className="text-xs font-normal opacity-75">Recibe avisos al instante</div>
              </div>
            </button>
            <button
              onClick={() => handleNotifOptIn(false)}
              className="w-full p-3.5 rounded-xl bg-cyan-400/5 border border-cyan-400/20 text-white font-semibold flex items-center gap-3.5 hover:bg-cyan-400/15 hover:translate-y-[-2px] transition-all"
            >
              <span className="text-xl">🔕</span>
              <div className="text-left">
                <div>Ahora no</div>
                <div className="text-xs font-normal opacity-75">Continuar sin notificaciones</div>
              </div>
            </button>
            <p className="text-[11px] text-white/40 text-center mt-3.5">
              Puedes cambiar esto despues desde ⚙️ Configuracion
            </p>
          </div>
        </div>
      )}

      {/* MODAL UBICACION */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[800] bg-black/65 backdrop-blur-lg flex items-center justify-center animate-fade-in">
          <div className="bg-gradient-to-br from-[#1A3344] to-[#0F1E29] border border-cyan-400/20 rounded-3xl p-8 w-[92%] max-w-[460px] shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-scale-in">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-green-400/10 border border-cyan-400/30 flex items-center justify-center text-2xl">
                💧
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Bienvenido!</h2>
                <p className="text-cyan-400 text-[10px] tracking-widest uppercase mt-0.5">GuardAgua IoT</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Para enviarte alertas personalizadas sobre el suministro de agua en tu colonia, necesitamos saber tu ubicacion. Tambien puedes tocar cualquier colonia en el mapa.
            </p>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      let best = COLONIES_RAW[0]
                      let minD = Infinity
                      COLONIES_RAW.forEach((c) => {
                        const d = Math.sqrt(Math.pow(pos.coords.latitude - c.lat, 2) + Math.pow(pos.coords.longitude - c.lng, 2))
                        if (d < minD) {
                          minD = d
                          best = c
                        }
                      })
                      handleColonySelect(best.id)
                    },
                    () => {
                      const rand = COLONIES_RAW[Math.floor(Math.random() * COLONIES_RAW.length)]
                      handleColonySelect(rand.id)
                      addNotification("risk", "GPS no disponible", "Se asigno la colonia mas cercana disponible.")
                    }
                  )
                } else {
                  const rand = COLONIES_RAW[Math.floor(Math.random() * COLONIES_RAW.length)]
                  handleColonySelect(rand.id)
                }
              }}
              className="w-full p-3.5 rounded-xl bg-gradient-to-br from-cyan-400 to-[#2C6E8F] text-white font-semibold flex items-center gap-3.5 mb-2.5 hover:translate-y-[-3px] hover:shadow-[0_12px_32px_rgba(79,179,191,0.4)] transition-all relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <span className="text-xl">📍</span>
              <div className="text-left">
                <div>Usar mi ubicacion actual</div>
                <div className="text-xs font-normal opacity-75">Deteccion automatica via GPS</div>
              </div>
            </button>
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full p-3.5 rounded-xl bg-cyan-400/5 border border-cyan-400/20 text-white font-semibold flex items-center gap-3.5 mb-4 hover:bg-cyan-400/15 hover:translate-y-[-2px] transition-all"
            >
              <span className="text-xl">🗺️</span>
              <div className="text-left">
                <div>Seleccionar en el mapa</div>
                <div className="text-xs font-normal opacity-75">Toca tu colonia directamente</div>
              </div>
            </button>
            <div className="flex items-center gap-2.5 text-white/40 text-xs mb-3.5">
              <span className="flex-1 h-px bg-cyan-400/20" />o elige de la lista<span className="flex-1 h-px bg-cyan-400/20" />
            </div>
            <select
              onChange={(e) => e.target.value && handleColonySelect(parseInt(e.target.value))}
              className="w-full bg-black/35 border border-cyan-400/20 rounded-xl text-white p-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15 transition-all"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234FB3BF' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "38px",
              }}
            >
              <option value="">— Seleccionar colonia —</option>
              {["Aguascalientes", "San Francisco de los Romo", "Jesus Maria", "El Llano"].map((muni) => (
                <optgroup key={muni} label={muni}>
                  {COLONIES_RAW.filter((c) => c.muni === muni)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.zone}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <p className="text-[11px] text-white/40 text-center mt-3.5">
              🔒 Tu ubicacion solo se procesa localmente. No se comparte con terceros.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes wave1 {
          0%,
          100% {
            transform: translateX(0) scaleY(1);
          }
          50% {
            transform: translateX(4%) scaleY(1.2);
          }
        }
        @keyframes wave2 {
          0%,
          100% {
            transform: translateX(0) scaleY(1);
          }
          50% {
            transform: translateX(-5%) scaleY(1.3);
          }
        }
        .animate-wave1 {
          animation: wave1 6s ease-in-out infinite;
        }
        .animate-wave2 {
          animation: wave2 8s ease-in-out infinite reverse;
        }
        @keyframes pulse-green {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(93, 162, 113, 0.5), 0 0 20px rgba(93, 162, 113, 0.2);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(93, 162, 113, 0), 0 0 20px rgba(93, 162, 113, 0.3);
          }
        }
        @keyframes pulse-red {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(197, 107, 92, 0.5), 0 0 15px rgba(197, 107, 92, 0.2);
          }
          50% {
            box-shadow: 0 0 0 16px rgba(197, 107, 92, 0), 0 0 15px rgba(197, 107, 92, 0.3);
          }
        }
        @keyframes pulse-orange {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(217, 160, 91, 0.5), 0 0 15px rgba(217, 160, 91, 0.2);
          }
          50% {
            box-shadow: 0 0 0 16px rgba(217, 160, 91, 0), 0 0 15px rgba(217, 160, 91, 0.3);
          }
        }
        .animate-pulse-green {
          animation: pulse-green 2.5s infinite;
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite;
        }
        .animate-pulse-orange {
          animation: pulse-orange 2s infinite;
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease forwards;
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(380px) scale(0.95);
          }
          to {
            transform: translateX(0) scale(1);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress {
          animation: progress 6.5s linear forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
        @keyframes scale-in {
          from {
            transform: translateY(32px) scale(0.97);
          }
          to {
            transform: translateY(0) scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bell-ring {
          0%,
          55%,
          100% {
            transform: rotate(0);
          }
          10% {
            transform: rotate(-15deg);
          }
          20% {
            transform: rotate(15deg);
          }
          30% {
            transform: rotate(-12deg);
          }
          40% {
            transform: rotate(12deg);
          }
          50% {
            transform: rotate(-6deg);
          }
        }
        .animate-bell-ring {
          animation: bell-ring 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
