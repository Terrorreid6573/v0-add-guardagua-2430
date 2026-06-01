"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0a1628] to-[#0d1d30] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-[60px]" />

          <div className="relative flex flex-col lg:flex-row items-center gap-12">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-pulse" />
              <Image
                src="/logo.jpg"
                alt="GuardAgua Logo"
                width={150}
                height={150}
                className="relative rounded-2xl border-2 border-white/20 shadow-2xl shadow-cyan-500/20"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                ¿Listo para proteger tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">recursos hídricos</span>?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                Únete a cientos de organizaciones que ya confían en GuardAgua para el monitoreo inteligente de sus sistemas de agua.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105 group"
                >
                  Solicitar Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
                >
                  Contactar Ventas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
