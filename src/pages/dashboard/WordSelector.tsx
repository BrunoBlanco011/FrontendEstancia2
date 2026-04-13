import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { BookType, Save, User, Table2, CheckCircle2, Loader2, RefreshCw, FileText } from 'lucide-react'
import {
  extractKeywordsFromBackend,
  analysisVariables,
  emotions,
  sentiments,
  weightOptions,
} from '@/data/wordSelectorData'
import { responseService } from '@/services/response.service'
import type { WordItem, WordAssignment, WordSelectorRecord } from '@/types/wordSelector.types'

function WordSelector() {
  const [activeTab, setActiveTab] = useState(analysisVariables[0].id)
  const [userName, setUserName] = useState('')
  const [extractedWords, setExtractedWords] = useState<WordItem[]>([])
  const [loadingWords, setLoadingWords] = useState(true)
  const [customText, setCustomText] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [extractingCustom, setExtractingCustom] = useState(false)

  const [assignmentsByVariable, setAssignmentsByVariable] = useState<
    Record<string, Record<string, WordAssignment>>
  >({})

  const [records, setRecords] = useState<WordSelectorRecord[]>([])
  const [saveSuccess, setSaveSuccess] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Inicializar assignments cuando cambian las palabras extraídas
  const initializeAssignments = (words: WordItem[]) => {
    const initial: Record<string, Record<string, WordAssignment>> = {}
    analysisVariables.forEach((v) => {
      initial[v.id] = {}
      words.forEach((w) => {
        initial[v.id][w.id] = {
          wordId: w.id,
          wordText: w.text,
          applicable: false,
          weight: 0,
          emotion: '',
          sentiment: '',
        }
      })
    })
    setAssignmentsByVariable(initial)
  }

  // Cargar palabras desde las respuestas de encuestas
  const loadWordsFromSurveyResponses = async () => {
    try {
      setLoadingWords(true)

      // Obtener todas las respuestas y sus textos
      const allAnswers = await responseService.getAllAnswers()

      // Extraer textos de respuestas abiertas
      const textAnswers = allAnswers
        .filter((a: any) => a.answer_text && a.answer_text.trim().length > 0)
        .map((a: any) => a.answer_text)

      if (textAnswers.length > 0) {
        // Combinar todos los textos
        const combinedText = textAnswers.join('. ')

        // Enviar al NLP para extraer keywords
        const keywords = await extractKeywordsFromBackend(combinedText, 'spanish', 20)

        if (keywords.length > 0) {
          const words: WordItem[] = keywords.map((kw, index) => ({
            id: `w${index + 1}`,
            text: kw
          }))
          setExtractedWords(words)
          initializeAssignments(words)
          return
        }
      }

      // Si no hay textos de respuestas, indicar que no hay datos
      setExtractedWords([])
      initializeAssignments([])

    } catch (error) {
      console.error('Error cargando palabras:', error)
      setExtractedWords([])
      initializeAssignments([])
    } finally {
      setLoadingWords(false)
    }
  }

  // Extraer palabras de texto personalizado
  const handleExtractCustom = async () => {
    if (!customText.trim()) {
      alert('Ingresa un texto para extraer palabras clave.')
      return
    }

    try {
      setExtractingCustom(true)
      const keywords = await extractKeywordsFromBackend(customText.trim(), 'spanish', 20)

      if (keywords.length > 0) {
        const words: WordItem[] = keywords.map((kw, index) => ({
          id: `w${index + 1}`,
          text: kw
        }))
        setExtractedWords(words)
        initializeAssignments(words)
        setShowCustomInput(false)
        setCustomText('')
      } else {
        alert('No se pudieron extraer palabras clave del texto proporcionado.')
      }
    } catch (error) {
      console.error('Error extrayendo palabras:', error)
      alert('Error al conectar con el servicio NLP. Verifica que el backend esté activo.')
    } finally {
      setExtractingCustom(false)
    }
  }

  useEffect(() => {
    loadWordsFromSurveyResponses()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
      gsap.from(tabsRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.4,
        delay: 0.2,
        ease: 'power2.out',
      })
      if (tableRef.current) {
        gsap.from(tableRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.3,
          ease: 'power2.out',
        })
      }
    })
    return () => ctx.revert()
  }, [])

  const updateAssignment = (
    variableId: string,
    wordId: string,
    field: keyof WordAssignment,
    value: string | number | boolean
  ) => {
    setAssignmentsByVariable((prev) => {
      const updated = { ...prev }
      updated[variableId] = { ...updated[variableId] }
      updated[variableId][wordId] = {
        ...updated[variableId][wordId],
        [field]: value,
      }

      if (field === 'applicable' && value === false) {
        updated[variableId][wordId].weight = 0
        updated[variableId][wordId].emotion = ''
        updated[variableId][wordId].sentiment = ''
      }

      return updated
    })
  }

  const handleSave = () => {
    if (!userName.trim()) {
      alert('Por favor ingresa tu nombre de usuario antes de guardar.')
      return
    }

    if (extractedWords.length === 0) {
      alert('No hay palabras para evaluar.')
      return
    }

    const newRecords: WordSelectorRecord[] = analysisVariables.map((v) => ({
      id: `${Date.now()}-${v.id}`,
      userName: userName.trim(),
      variableId: v.id,
      variableName: v.name,
      timestamp: new Date().toLocaleString('es-MX'),
      assignments: Object.values(assignmentsByVariable[v.id] || {}),
    }))

    setRecords((prev) => [...newRecords, ...prev])
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // Log para debugging — payload que se enviaría al backend
    console.log('[WordSelector] Evaluaciones guardadas (localmente):', newRecords)
  }

  const activeVariable = analysisVariables.find((v) => v.id === activeTab)!
  const currentAssignments = assignmentsByVariable[activeTab] || {}
  const applicableCount = Object.values(currentAssignments).filter(
    (a) => a.applicable
  ).length

  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  // Estado de carga
  if (loadingWords) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Extrayendo palabras clave de las encuestas...</p>
        </div>
      </div>
    )
  }

  // Estado vacío — sin palabras
  if (extractedWords.length === 0 && !showCustomInput) {
    return (
      <div>
        <div ref={headerRef} className="mb-6">
          <div className="flex items-center gap-3">
            <BookType className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Selector de Palabras
            </h1>
          </div>
          <p className="text-gray-600 mt-1 ml-11">
            Evaluación de palabras clave extraídas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontraron palabras clave
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            No hay respuestas de texto en las encuestas para procesar. Puedes ingresar texto manualmente para extraer palabras clave.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowCustomInput(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
            >
              Ingresar texto manualmente
            </button>
            <button
              onClick={loadWordsFromSurveyResponses}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar desde encuestas
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Input de texto personalizado
  if (showCustomInput) {
    return (
      <div>
        <div ref={headerRef} className="mb-6">
          <div className="flex items-center gap-3">
            <BookType className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Selector de Palabras
            </h1>
          </div>
          <p className="text-gray-600 mt-1 ml-11">
            Ingresa texto para extraer palabras clave
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto para análisis NLP
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Pega aquí el texto del cual quieres extraer palabras clave (respuestas de encuestas, textos abiertos, etc.)..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleExtractCustom}
              disabled={extractingCustom}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 cursor-pointer"
            >
              {extractingCustom && <Loader2 className="w-4 h-4 animate-spin" />}
              {extractingCustom ? 'Extrayendo...' : 'Extraer Palabras Clave'}
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false)
                setCustomText('')
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div ref={headerRef} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BookType className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Selector de Palabras
              </h1>
            </div>
            <p className="text-gray-600 mt-1 ml-11">
              Evaluación de palabras clave extraídas vía NLP
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              title="Extraer de texto personalizado"
            >
              <FileText className="w-4 h-4" />
              Nuevo texto
            </button>
            <button
              onClick={loadWordsFromSurveyResponses}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              title="Recargar desde encuestas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
              <User className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nombre del experto"
                className="border-none outline-none text-sm font-medium text-gray-700 bg-transparent w-44 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={tabsRef} className="mb-4">
        <div className="flex gap-1 bg-white p-1 rounded-xl shadow overflow-x-auto">
          {analysisVariables.map((variable) => {
            const isActive = activeTab === variable.id
            const varAssignments = assignmentsByVariable[variable.id] || {}
            const varApplicable = Object.values(varAssignments).filter(
              (a) => a.applicable
            ).length

            return (
              <button
                key={variable.id}
                onClick={() => setActiveTab(variable.id)}
                className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {variable.name}
                {varApplicable > 0 && (
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-600'
                      }`}
                  >
                    {varApplicable}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div ref={tableRef} className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {activeVariable.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {extractedWords.length} palabras •{' '}
              <span className="text-indigo-600 font-medium">
                {applicableCount} aplicables
              </span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                  #
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Palabra
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-28">
                  ¿Aplicable?
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                  Peso (0-1)
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">
                  Emoción
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                  Sentimiento
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {extractedWords.map((word, idx) => {
                const assignment = currentAssignments[word.id]
                if (!assignment) return null
                const isApplicable = assignment.applicable

                return (
                  <tr
                    key={word.id}
                    className={`transition-colors ${isApplicable
                      ? 'bg-indigo-50/40 hover:bg-indigo-50'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    <td className="px-6 py-3 text-sm text-gray-400 font-mono">
                      {idx + 1}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`text-sm font-medium ${isApplicable ? 'text-indigo-700' : 'text-gray-700'
                          }`}
                      >
                        {word.text}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isApplicable}
                        onChange={(e) =>
                          updateAssignment(
                            activeTab,
                            word.id,
                            'applicable',
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    <td className="px-6 py-3">
                      <select
                        value={assignment.weight}
                        onChange={(e) =>
                          updateAssignment(
                            activeTab,
                            word.id,
                            'weight',
                            parseFloat(e.target.value)
                          )
                        }
                        disabled={!isApplicable}
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg transition-colors ${isApplicable
                          ? 'border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white'
                          : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                          }`}
                      >
                        {weightOptions.map((w) => (
                          <option key={w} value={w}>
                            {w.toFixed(1)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-3">
                      <select
                        value={assignment.emotion}
                        onChange={(e) =>
                          updateAssignment(
                            activeTab,
                            word.id,
                            'emotion',
                            e.target.value
                          )
                        }
                        disabled={!isApplicable}
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg transition-colors ${isApplicable
                          ? 'border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white'
                          : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Seleccionar...</option>
                        {emotions.map((em) => (
                          <option key={em.id} value={em.label}>
                            {em.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Sentiment */}
                    <td className="px-6 py-3">
                      <select
                        value={assignment.sentiment}
                        onChange={(e) =>
                          updateAssignment(
                            activeTab,
                            word.id,
                            'sentiment',
                            e.target.value
                          )
                        }
                        disabled={!isApplicable}
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg transition-colors ${isApplicable
                          ? 'border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white'
                          : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Seleccionar...</option>
                        {sentiments.map((s) => (
                          <option key={s.id} value={s.label}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-gray-500">
          Completa la evaluación en todas las pestañas antes de guardar.
        </p>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg cursor-pointer"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              ¡Guardado!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Evaluación
            </>
          )}
        </button>
      </div>

      {records.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <Table2 className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Registros Guardados
            </h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              {records.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Variable
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Aplicables
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => {
                  const applicableAssignments = record.assignments.filter(
                    (a) => a.applicable
                  )
                  const isExpanded = expandedRecord === record.id

                  return (
                    <>
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {record.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {record.userName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm text-gray-600 bg-indigo-50 px-2 py-1 rounded-md">
                            {record.variableName}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {record.timestamp}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-sm font-semibold text-indigo-600">
                            {applicableAssignments.length}
                          </span>
                          <span className="text-sm text-gray-400">
                            /{record.assignments.length}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() =>
                              setExpandedRecord(isExpanded ? null : record.id)
                            }
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                          >
                            {isExpanded ? 'Ocultar' : 'Ver'}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && applicableAssignments.length > 0 && (
                        <tr key={`${record.id}-details`}>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-left">
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                      Palabra
                                    </th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                      Peso
                                    </th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                      Emoción
                                    </th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                      Sentimiento
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {applicableAssignments.map((a) => (
                                    <tr key={a.wordId}>
                                      <td className="px-3 py-2 font-medium text-gray-700">
                                        {a.wordText}
                                      </td>
                                      <td className="px-3 py-2 text-gray-600">
                                        {a.weight.toFixed(1)}
                                      </td>
                                      <td className="px-3 py-2 text-gray-600">
                                        {a.emotion || '—'}
                                      </td>
                                      <td className="px-3 py-2 text-gray-600">
                                        {a.sentiment || '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default WordSelector
