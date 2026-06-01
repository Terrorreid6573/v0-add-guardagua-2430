"use client"

import { useEffect, useState } from "react"

const stats = [
  { value: 500, suffix: "+", label: "Sistemas Activos" },
  { value: 99.9, suffix: "%", label: "Tiempo de Actividad" },
  { value: 1, suffix: "M+", label: "Litros Monitoreados" },
  { value: 24, suffix: "/7", label: "Soporte Técnico" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [target])
  
  return (
    <span>
      {Number.isInteger(target) ? Math.round(count) : count.toFixed(1)}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/70 text-sm md:text-base font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
