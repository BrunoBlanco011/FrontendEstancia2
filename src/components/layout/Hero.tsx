import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { World } from '@/components/ui/Globe'
import { Spotlight } from '@/components/ui/Spotlight'
import { cn } from '@/utils/cn'

function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    autoRotate: true,
    autoRotateSpeed: 0.5,
  }

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"]
  
  const sampleArcs = [
    {
      order: 1,
      startLat: 19.4326,
      startLng: -99.1332,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[0],
    },
    {
      order: 2,
      startLat: 16.7569,
      startLng: -93.1292,
      endLat: 19.4326,
      endLng: -99.1332,
      arcAlt: 0.2,
      color: colors[1],
    },
    {
      order: 3,
      startLat: 16.7569,
      startLng: -93.1292,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.4,
      color: colors[2],
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(titleRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(descriptionRef.current, {
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .from(buttonRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.3")
      .from(globeRef.current, {
        scale: 0.7,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "-=1")
    })

    return () => ctx.revert()
  }, [])

  const handleButtonHover = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center overflow-hidden pt-20">
      {/* Grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-40"
        fill="white"
      />

      <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
        <div className="grid grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <h1
              ref={titleRef}
              className="text-7xl font-bold text-white leading-tight"
            >
              Sistema de Encuestas
            </h1>
            
            <p
              ref={descriptionRef}
              className="text-2xl text-gray-300 leading-relaxed"
            >
              Crea, administra y analiza encuestas de manera profesional. 
              Obtén resultados en tiempo real y toma decisiones basadas en datos.
            </p>

            <Link
              ref={buttonRef}
              to="/dashboard"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              className="inline-block bg-blue-600 text-white px-10 py-5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xl"
            >
              Ir al Dashboard
            </Link>
          </div>

          <div
            ref={globeRef}
            className="h-[700px] relative"
          >
            <World data={sampleArcs} globeConfig={globeConfig} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero