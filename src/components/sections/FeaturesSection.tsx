import { WobbleCard } from "@/components/ui/wobble-card"
import { cn } from "@/utils/cn"

function FeaturesSection() {
  return (
    <div id="features" className="bg-white py-20 px-8 relative">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)]"
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full relative z-10">
        
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Crea encuestas personalizadas en minutos
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Con más de 1,000 encuestas activas, nuestro sistema es la plataforma más confiable para recopilar datos.
            </p>
          </div>
          <img
            src="/assets/encuestas.png"
            width={300}
            height={300}
            alt="encuestas demo"
            className="absolute -right-4 lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Resultados en tiempo real
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Visualiza y analiza las respuestas al instante con dashboards interactivos.
          </p>
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Administra todas tus encuestas desde un solo lugar
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Sistema centralizado con gestión de archivos, reportes automáticos y exportación de datos.
            </p>
          </div>
          <img
            src="/assets/encuestas.png"
            width={300}
            height={300}
            alt="dashboard demo"
            className="absolute -right-10 md:-right-[10%] lg:-right-[5%] -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>

      </div>
    </div>
  )
}

export default FeaturesSection