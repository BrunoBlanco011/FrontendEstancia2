import IndicadorCard from '@/components/ui/IndicadorCard'
import { Database, Activity, Tag, MoreHorizontal } from 'lucide-react'

function Ansiedad() {
  const entidades = [
    { id: 1, text: 'Estudiante' },
    { id: 2, text: 'Encuesta' },
    { id: 3, text: 'Respuesta' },
    { id: 4, text: 'Pregunta' }
  ]

  const verbos = [
    { id: 1, text: 'Evaluar' },
    { id: 2, text: 'Registrar' },
    { id: 3, text: 'Analizar' },
    { id: 4, text: 'Reportar' }
  ]

  const adjetivos = [
    { id: 1, text: 'Alta' },
    { id: 2, text: 'Media' },
    { id: 3, text: 'Baja' },
    { id: 4, text: 'Crítica' }
  ]

  const otros = [
    { id: 1, text: 'Escala 1-5' },
    { id: 2, text: 'Fecha de evaluación' },
    { id: 3, text: 'Observaciones' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ansiedad</h1>
        <p className="text-gray-600 mt-1">Indicadores de evaluación de ansiedad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndicadorCard
          title="Entidades"
          icon={<Database className="w-5 h-5 text-blue-600" />}
          items={entidades}
          color="bg-blue-100"
        />
        
        <IndicadorCard
          title="Verbos"
          icon={<Activity className="w-5 h-5 text-green-600" />}
          items={verbos}
          color="bg-green-100"
        />
        
        <IndicadorCard
          title="Adjetivos"
          icon={<Tag className="w-5 h-5 text-purple-600" />}
          items={adjetivos}
          color="bg-purple-100"
        />
        
        <IndicadorCard
          title="Otros"
          icon={<MoreHorizontal className="w-5 h-5 text-orange-600" />}
          items={otros}
          color="bg-orange-100"
        />
      </div>
    </div>
  )
}

export default Ansiedad