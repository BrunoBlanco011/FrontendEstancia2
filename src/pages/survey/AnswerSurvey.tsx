import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyService } from '@/services/survey.service';
import type { SurveyData } from '@/services/survey.service';
import { questionService } from '@/services/question.service';
import type { QuestionData, QuestionOptionData } from '@/services/question.service';
import { responseService } from '@/services/response.service';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

interface QuestionWithOptions extends QuestionData {
  options: QuestionOptionData[];
}

function AnswerSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSurveyData();
    }
  }, [id]);

  const loadSurveyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const surveyData = await surveyService.getSurveyById(id!);
      setSurvey(surveyData);

      const qsData = await questionService.getQuestionsBySurvey(id!);
      
      // Load options for questions that need them
      const questionsWithOptions = await Promise.all(
        qsData.map(async (q) => {
          if (['multiple', 'checkbox', 'dropdown'].includes(q.questionType)) {
            const options = await questionService.getOptionsByQuestion(q.id!);
            return { ...q, options: options.sort((a, b) => a.orderPosition - b.orderPosition) };
          }
          return { ...q, options: [] };
        })
      );
      
      setQuestions(questionsWithOptions.sort((a, b) => a.orderPosition - b.orderPosition));
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar la encuesta. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId: number, optionId: number, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (checked) {
        return { ...prev, [questionId]: [...current, optionId] };
      } else {
        return { ...prev, [questionId]: current.filter((id: number) => id !== optionId) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required questions
    for (const q of questions) {
      if (q.isRequired) {
        const val = answers[q.id!];
        if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
          setError(`Por favor responde la pregunta: "${q.questionText}"`);
          const element = document.getElementById(`q-${q.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'rounded-xl', 'transition-all');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'rounded-xl', 'transition-all');
            }, 3000);
          }
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // 1. Create response record
      const response = await responseService.createResponse({
        surveyId: Number(id),
        respondentUserId: user?.id,
        respondentEmail: user?.email,
      });
      
      const responseId = response.id!;

      // 2. Submit all answers
      const answerPromises = [];
      
      for (const q of questions) {
        const val = answers[q.id!];
        if (val !== undefined && val !== '') {
          
          if (q.questionType === 'text') {
            answerPromises.push(responseService.createAnswer({
              responseId,
              questionId: q.id!,
              answerText: String(val)
            }));
          } else if (q.questionType === 'number' || q.questionType === 'scale') {
            answerPromises.push(responseService.createAnswer({
              responseId,
              questionId: q.id!,
              answerValue: Number(val)
            }));
          } else if (q.questionType === 'multiple' || q.questionType === 'dropdown') {
            answerPromises.push(responseService.createAnswer({
              responseId,
              questionId: q.id!,
              selectedOptionId: Number(val)
            }));
          } else if (q.questionType === 'checkbox') {
            // Checkbox values are arrays
            if (Array.isArray(val)) {
              for (const optionId of val) {
                answerPromises.push(responseService.createAnswer({
                  responseId,
                  questionId: q.id!,
                  selectedOptionId: Number(optionId)
                }));
              }
            }
          }
        }
      }

      await Promise.all(answerPromises);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al enviar la encuesta. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Gracias por participar!</h2>
          <p className="text-gray-600 mb-8">Tus respuestas han sido registradas exitosamente.</p>
          <button
            onClick={() => navigate('/surveys')}
            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate('/surveys')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">{survey?.nameSurvey}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{survey?.nameSurvey}</h2>
          {survey?.description && (
            <p className="text-gray-600 text-lg whitespace-pre-wrap">{survey.description}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, index) => (
            <div 
              key={q.id} 
              id={`q-${q.id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="font-semibold mr-2">{index + 1}.</span>
                  {q.questionText}
                  {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                </h3>
              </div>

              <div className="pl-6">
                {q.questionType === 'text' && (
                  <input
                    type="text"
                    value={answers[q.id!] || ''}
                    onChange={(e) => handleAnswerChange(q.id!, e.target.value)}
                    className="w-full border-b-2 border-gray-200 pb-2 focus:border-blue-600 outline-none transition-colors bg-transparent"
                    placeholder="Tu respuesta"
                  />
                )}

                {q.questionType === 'number' && (
                  <input
                    type="number"
                    value={answers[q.id!] || ''}
                    onChange={(e) => handleAnswerChange(q.id!, e.target.value)}
                    className="w-full md:w-1/2 border-b-2 border-gray-200 pb-2 focus:border-blue-600 outline-none transition-colors bg-transparent"
                    placeholder="Ingresa un número"
                  />
                )}

                {q.questionType === 'scale' && (
                  <div className="flex flex-col gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={answers[q.id!] || 5}
                      onChange={(e) => handleAnswerChange(q.id!, Number(e.target.value))}
                      className="w-full cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>1 (Mín)</span>
                      <span className="text-blue-600 text-lg font-bold">{answers[q.id!] || 5}</span>
                      <span>10 (Máx)</span>
                    </div>
                  </div>
                )}

                {q.questionType === 'multiple' && (
                  <div className="space-y-3">
                    {q.options.map(opt => (
                      <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt.id}
                          checked={answers[q.id!] === opt.id}
                          onChange={() => handleAnswerChange(q.id!, opt.id)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-gray-700 font-medium">{opt.optionText}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.questionType === 'checkbox' && (
                  <div className="space-y-3">
                    {q.options.map(opt => {
                      const isChecked = Array.isArray(answers[q.id!]) && answers[q.id!].includes(opt.id);
                      return (
                        <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(q.id!, opt.id!, e.target.checked)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-700 font-medium">{opt.optionText}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {q.questionType === 'dropdown' && (
                  <select
                    value={answers[q.id!] || ''}
                    onChange={(e) => handleAnswerChange(q.id!, Number(e.target.value))}
                    className="w-full md:w-1/2 p-3 border border-gray-300 rounded-xl focus:border-blue-600 outline-none transition-colors bg-white font-medium text-gray-700"
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    {q.options.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.optionText}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-3 disabled:opacity-70 group"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enviar Respuestas
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AnswerSurvey;
