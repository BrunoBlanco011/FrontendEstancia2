import { useState, useEffect } from 'react'
import IndicadorCard from '@/components/ui/IndicadorCard'
import { Database, Activity, Tag, MoreHorizontal, Loader2 } from 'lucide-react'
import { surveyService } from '@/services/survey.service'
import { responseService } from '@/services/response.service'
import { questionService } from '@/services/question.service'

interface IndicadorItem {
  id: number
  text: string
}

function Depresion() {
  const [loading, setLoading] = useState(true)
  const [entidades, setEntidades] = useState<IndicadorItem[]>([])
  const [verbos, setVerbos] = useState<IndicadorItem[]>([])
  const [adjetivos, setAdjetivos] = useState<IndicadorItem[]>([])
  const [otros, setOtros] = useState<IndicadorItem[]>([])

  useEffect(() => {
    loadIndicatorData()
  }, [])

  const loadIndicatorData = async () => {
    try {
      setLoading(true)

      const [surveys, responses, answers] = await Promise.allSettled([
        surveyService.getAllSurveys(),
        responseService.getAllResponses(),
        responseService.getAllAnswers()
      ])

      const surveysList = surveys.status === 'fulfilled' ? surveys.value : []
      const responsesList = responses.status === 'fulfilled' ? responses.value : []
      const answersList = answers.status === 'fulfilled' ? answers.value : []

      // Construir indicadores desde datos reales
      const entidadesData: IndicadorItem[] = surveysList.slice(0, 6).map((s, i) => ({
        id: i + 1,
        text: s.nameSurvey || `Encuesta ${s.id}`
      }))
      if (entidadesData.length === 0) {
        entidadesData.push({ id: 1, text: 'Sin encuestas registradas' })
      }

      const verbosData: IndicadorItem[] = []
      if (surveysList.length > 0) verbosData.push({ id: 1, text: `${surveysList.length} encuestas creadas` })
      if (responsesList.length > 0) verbosData.push({ id: 2, text: `${responsesList.length} respuestas registradas` })
      if (answersList.length > 0) verbosData.push({ id: 3, text: `${answersList.length} respuestas de preguntas` })
      if (verbosData.length === 0) {
        verbosData.push({ id: 1, text: 'Sin actividad registrada' })
      }

      const textAnswers = answersList.filter((a: any) => a.answer_text && a.answer_text.trim().length > 0)
      const numericAnswers = answersList.filter((a: any) => a.answer_value !== undefined && a.answer_value !== null)
      const adjetivosData: IndicadorItem[] = [
        { id: 1, text: `${textAnswers.length} respuestas abiertas` },
        { id: 2, text: `${numericAnswers.length} respuestas numéricas` },
      ]

      let questionCount = 0
      for (const survey of surveysList.slice(0, 3)) {
        try {
          const qs = await questionService.getQuestionsBySurvey(survey.id!)
          questionCount += qs.length
        } catch { /* ignore */ }
      }
      const otrosData: IndicadorItem[] = [
        { id: 1, text: `${questionCount} preguntas totales` },
        { id: 2, text: `Última actualización: ${new Date().toLocaleDateString('es-MX')}` },
      ]

      setEntidades(entidadesData)
      setVerbos(verbosData)
      setAdjetivos(adjetivosData)
      setOtros(otrosData)

    } catch (error) {
      console.error('Error loading indicator data:', error)
      setEntidades([{ id: 1, text: 'Error al cargar datos' }])
      setVerbos([{ id: 1, text: 'Error al cargar datos' }])
      setAdjetivos([{ id: 1, text: 'Error al cargar datos' }])
      setOtros([{ id: 1, text: 'Verifica que el backend esté activo' }])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Cargando indicadores de depresión...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Depresión</h1>
        <p className="text-gray-600 mt-1">Indicadores basados en datos reales del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndicadorCard
          title="Encuestas"
          icon={<Database className="w-5 h-5 text-blue-600" />}
          items={entidades}
          color="bg-blue-100"
        />

        <IndicadorCard
          title="Actividad"
          icon={<Activity className="w-5 h-5 text-green-600" />}
          items={verbos}
          color="bg-green-100"
        />

        <IndicadorCard
          title="Métricas"
          icon={<Tag className="w-5 h-5 text-purple-600" />}
          items={adjetivos}
          color="bg-purple-100"
        />

        <IndicadorCard
          title="Información"
          icon={<MoreHorizontal className="w-5 h-5 text-orange-600" />}
          items={otros}
          color="bg-orange-100"
        />
      </div>
    </div>
  )
}

export default Depresion