import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, ArrowLeft } from 'lucide-react'

type QuestionType = 'text' | 'multiple' | 'checkbox' | 'radio' | 'scale'

interface Option {
  id: string
  text: string
}

interface Question {
  id: string
  type: QuestionType
  text: string
  required: boolean
  options: Option[]
}

function Questions() {
  const { id, slug } = useParams<{ id: string; slug: string }>()
  const navigate = useNavigate()
  
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyDescription, setSurveyDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'text',
      text: '',
      required: false,
      options: []
    }
  ])

  const questionTypes = [
    { value: 'text', label: 'Respuesta Abierta' },
    { value: 'multiple', label: 'Opción Múltiple' },
    { value: 'checkbox', label: 'Casillas de Verificación' },
    { value: 'radio', label: 'Selección Única' },
    { value: 'scale', label: 'Escala (1-5)' }
  ]

  useEffect(() => {
    const titleFromSlug = slug?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    setSurveyTitle(titleFromSlug || 'Nueva Encuesta')
  }, [slug])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      text: '',
      required: false,
      options: []
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [...q.options, { id: Date.now().toString(), text: '' }]
        }
      }
      return q
    }))
  }

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt => 
            opt.id === optionId ? { ...opt, text } : opt
          )
        }
      }
      return q
    }))
  }

  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId)
        }
      }
      return q
    }))
  }

  const needsOptions = (type: QuestionType) => {
    return ['multiple', 'checkbox', 'radio'].includes(type)
  }

  const handleSave = () => {
    if (!surveyTitle.trim()) {
      alert('Por favor ingresa un título para la encuesta')
      return
    }

    const hasEmptyQuestions = questions.some(q => !q.text.trim())
    if (hasEmptyQuestions) {
      alert('Por favor completa todas las preguntas')
      return
    }

    const surveyData = {
      id: id,
      title: surveyTitle,
      description: surveyDescription,
      questions: questions.map((q, index) => ({
        question_text: q.text,
        question_type: q.type,
        is_required: q.required,
        order_position: index + 1,
        options: q.options.map((opt, optIndex) => ({
          option_text: opt.text,
          order_position: optIndex + 1
        }))
      }))
    }

    console.log('Encuesta guardada:', surveyData)
    alert('Encuesta guardada exitosamente! (simulado)')
    navigate('/dashboard/surveys')
  }

  const handleBack = () => {
    navigate('/dashboard/surveys')
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            placeholder="Título de la encuesta"
            className="text-3xl font-bold text-gray-800 border-none outline-none w-full focus:ring-0 bg-transparent"
          />
          <input
            type="text"
            value={surveyDescription}
            onChange={(e) => setSurveyDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="text-gray-600 mt-1 border-none outline-none w-full focus:ring-0 bg-transparent"
          />
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Guardar Encuesta
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="pt-3 cursor-move">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregunta {index + 1}
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                      placeholder="Escribe tu pregunta aquí..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, 'type', e.target.value as QuestionType)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {needsOptions(question.type) && (
                  <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Opciones
                    </label>
                    {question.options.map((option, optIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm w-6">{optIndex + 1}.</span>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                          placeholder={`Opción ${optIndex + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <button
                          onClick={() => deleteOption(question.id, option.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(question.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar opción
                    </button>
                  </div>
                )}

                {question.type === 'scale' && (
                  <div className="pl-4 border-l-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vista previa
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors font-medium"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${question.id}`}
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
                    Pregunta obligatoria
                  </label>
                </div>
              </div>

              <button
                onClick={() => deleteQuestion(question.id)}
                disabled={questions.length === 1}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="w-full mt-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Agregar pregunta
      </button>
    </div>
  )
}

export default Questions