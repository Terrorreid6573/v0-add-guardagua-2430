import Hero from "@/components/hero"
import Features from "@/components/features"
import Stats from "@/components/stats"
import HowItWorks from "@/components/how-it-works"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
