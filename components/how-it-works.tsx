"use client"

const steps = [
  {
    number: "01",
    title: "Instalación",
    description: "Nuestros técnicos instalan los sensores IoT en tu sistema hídrico de forma rápida y sin complicaciones.",
  },
  {
    number: "02",
    title: "Configuración",
    description: "Configuramos tu dashboard personalizado con las métricas y alertas que necesitas monitorear.",
  },
  {
    number: "03",
    title: "Monitoreo",
    description: "Comienza a recibir datos en tiempo real y alertas inteligentes sobre el estado de tus recursos hídricos.",
  },
  {
    number: "04",
    title: "Optimización",
    description: "Usa los insights y análisis para optimizar el uso del agua y prevenir problemas antes de que ocurran.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0d1d30] to-[#0a1628] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
            Proceso
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Funciona</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            En solo 4 pasos comienza a proteger y optimizar tus recursos hídricos
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Number */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 mb-6 group-hover:scale-110 group-hover:border-cyan-400/60 transition-all duration-500">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
                    {step.number}
                  </span>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: "2s" }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
