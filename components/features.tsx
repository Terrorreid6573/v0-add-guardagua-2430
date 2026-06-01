"use client"

import { Droplet, BarChart3, Bell, Smartphone, Cloud, Lock } from "lucide-react"

const features = [
  {
    icon: Droplet,
    title: "Sensores Hídricos",
    description: "Monitoreo preciso del nivel, calidad y flujo del agua en tiempo real con sensores de última generación.",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Análisis Avanzado",
    description: "Dashboard intuitivo con métricas detalladas, históricos y predicciones basadas en IA.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificaciones instantáneas ante cualquier anomalía o situación de riesgo detectada.",
    color: "from-teal-400 to-teal-600",
  },
  {
    icon: Smartphone,
    title: "Control Remoto",
    description: "Gestiona y supervisa tus sistemas desde cualquier lugar con nuestra app móvil.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Cloud,
    title: "Datos en la Nube",
    description: "Almacenamiento seguro y acceso ilimitado a tu historial de datos desde cualquier dispositivo.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Lock,
    title: "Seguridad Total",
    description: "Encriptación de extremo a extremo y protocolos de seguridad de nivel empresarial.",
    color: "from-teal-500 to-cyan-500",
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0a1628] to-[#0d1d30] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
            Características
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tecnología de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Vanguardia</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Soluciones integrales para el monitoreo y gestión inteligente de recursos hídricos
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="relative text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400/50 group-hover:bg-cyan-400 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
