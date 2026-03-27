import QuestionCard from "@/components/ui/QuestionCard"
import { FileCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { slugify } from "@/utils/slugify"

function Surveys() {
  const navigate = useNavigate()

  const surveys = [
    {
      id: 1,
      title: "Encuesta de Emociones",
      description: "Evalúa el estado emocional actual de los participantes y obtén insights valiosos."
    },
    {
      id: 2,
      title: "Encuesta de Sentimientos",
      description: "Comprende los sentimientos profundos de tu audiencia con preguntas específicas."
    },
    {
      id: 3,
      title: "Encuesta de Satisfacción",
      description: "Mide el nivel de satisfacción de tus usuarios con nuestros servicios."
    }
  ]

  const handleAddSurvey = () => {
    const newSurveyId = Date.now() 
    const slug = slugify("Nueva Encuesta")
    navigate(`/dashboard/surveys/${newSurveyId}/${slug}/questions`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Encuestas</h1>
        <button 
          onClick={handleAddSurvey}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <FileCheck className="w-5 h-5" />
          Agregar Encuesta
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {surveys.map((survey) => (
          <QuestionCard
            key={survey.id}
            id={survey.id}
            number={survey.id}
            title={survey.title}
            description={survey.description}
          />
        ))}
      </div>
    </div>
  )
}

export default Surveys