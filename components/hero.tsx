"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Droplets, Shield, Wifi } from "lucide-react"
import { MonitoringDemo } from "@/components/monitoring-demo"

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f2035] to-[#0a1628]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const size = 5 + ((i * 7) % 20)
          const left = (i * 23) % 100
          const top = (i * 17) % 100
          const delay = (i * 0.5) % 5
          const duration = 10 + (i % 10)
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-400/20 animate-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full text-[#0a1628]/50">
          <path
            fill="currentColor"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full text-cyan-500/5 animate-wave">
          <path
            fill="currentColor"
            d="M0,96L48,85.3C96,75,192,53,288,58.7C384,64,480,96,576,101.3C672,107,768,85,864,74.7C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          {/* Logo with spectacular effects */}
          <div className="relative mb-8 group">
            {/* Outer glow rings */}
            <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-2xl animate-pulse" />
            <div className="absolute inset-0 -m-4 rounded-full border border-cyan-400/20 animate-spin-slow" />
            <div className="absolute inset-0 -m-6 rounded-full border border-blue-500/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
            
            {/* Logo container */}
            <div className="relative p-2 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-500 group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="GuardAgua Logo"
                width={180}
                height={180}
                className="rounded-2xl"
                priority
              />
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white">
            Guard<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Agua</span>
          </h1>

          {/* Subtitle */}
          <p className="text-cyan-400/80 text-sm tracking-[0.3em] uppercase mb-6 font-medium">
            Sistema de Monitoreo IoT
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300/80 max-w-2xl mb-10 leading-relaxed">
            Protege y monitorea tus recursos hídricos con tecnología inteligente. 
            Sensores avanzados y análisis en tiempo real para una gestión eficiente del agua.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              size="lg" 
              onClick={() => setDemoOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105"
            >
              <Wifi className="mr-2 h-5 w-5" />
              Comenzar Monitoreo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setDemoOpen(true)}
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              Ver Demo
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Droplets, text: "Monitoreo 24/7" },
              { icon: Shield, text: "Datos Seguros" },
              { icon: Wifi, text: "Conexión IoT" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-gray-300 text-sm hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-300 cursor-default"
              >
                <item.icon className="h-4 w-4 text-cyan-400" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float linear infinite; }
        .animate-wave { animation: wave 8s linear infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>

      <MonitoringDemo open={demoOpen} onOpenChange={setDemoOpen} />
    </section>
  )
}
