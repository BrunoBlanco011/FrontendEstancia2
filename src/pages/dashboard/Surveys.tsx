import { useState, useEffect } from 'react'
import QuestionCard from "@/components/ui/QuestionCard"
import { FileCheck, Loader2, AlertCircle, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { slugify } from "@/utils/slugify"
import { surveyService } from "@/services/survey.service"
import type { SurveyData } from "@/services/survey.service"

function Surveys() {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<SurveyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSurveys()
  }, [])

  const loadSurveys = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await surveyService.getAllSurveys()
      setSurveys(data)
    } catch (err) {
      console.error('Error loading surveys:', err)
      setError('Error al cargar las encuestas. Verifica que el servidor esté activo en el puerto 8001.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSurvey = () => {
    const slug = slugify("Nueva Encuesta")
    navigate(`/dashboard/surveys/new/${slug}/questions`)
  }

  const handleDeleteSurvey = async (surveyId: number | string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta encuesta?')) return

    try {
      await surveyService.deleteSurvey(surveyId)
      setSurveys(prev => prev.filter(s => s.id !== surveyId))
    } catch (err) {
      console.error('Error deleting survey:', err)
      alert('Error al eliminar la encuesta. Intenta de nuevo.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Cargando encuestas...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Encuestas</h1>
        <button
          onClick={handleAddSurvey}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
        >
          <FileCheck className="w-5 h-5" />
          Agregar Encuesta
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadSurveys}
            className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {surveys.length === 0 && !error ? (
        <div className="text-center py-16">
          <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No hay encuestas aún</p>
          <p className="text-gray-400 text-sm">Crea tu primera encuesta para comenzar</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {surveys.map((survey, index) => (
            <div key={survey.id} className="relative group">
              <QuestionCard
                id={survey.id as number}
                number={index + 1}
                title={survey.nameSurvey}
                description={survey.description || 'Sin descripción'}
              />
              <button
                onClick={(e) => handleDeleteSurvey(survey.id!, e)}
                className="absolute top-2 right-12 p-1.5 bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 cursor-pointer z-10"
                title="Eliminar encuesta"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Surveys