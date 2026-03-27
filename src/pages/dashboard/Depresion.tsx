import IndicadorCard from '@/components/ui/IndicadorCard'
import { Database, Activity, Tag, MoreHorizontal } from 'lucide-react'

function Depresion() {
  const entidades = [
    { id: 1, text: 'Estudiante' },
    { id: 2, text: 'Síntoma' },
    { id: 3, text: 'Evaluación' },
    { id: 4, text: 'Seguimiento' }
  ]

  const verbos = [
    { id: 1, text: 'Detectar' },
    { id: 2, text: 'Monitorear' },
    { id: 3, text: 'Clasificar' },
    { id: 4, text: 'Prevenir' }
  ]

  const adjetivos = [
    { id: 1, text: 'Leve' },
    { id: 2, text: 'Moderada' },
    { id: 3, text: 'Severa' },
    { id: 4, text: 'Persistente' }
  ]

  const otros = [
    { id: 1, text: 'Test PHQ-9' },
    { id: 2, text: 'Historial' },
    { id: 3, text: 'Recomendaciones' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Depresión</h1>
        <p className="text-gray-600 mt-1">Indicadores de evaluación de depresión</p>
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

export default Depresion