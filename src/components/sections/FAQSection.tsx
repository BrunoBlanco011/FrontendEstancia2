import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
      >
        <span className="text-lg font-semibold text-white pr-8">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        )}
      >
        <p className="text-gray-300 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    {
      question: "¿Cómo puedo crear una encuesta?",
      answer: "Es muy sencillo. Desde el dashboard, haz clic en 'Crear Encuesta', agrega tus preguntas y configura las opciones. En minutos tendrás tu encuesta lista para compartir."
    },
    {
      question: "¿Puedo ver los resultados en tiempo real?",
      answer: "Sí, todos los resultados se actualizan automáticamente. Puedes ver gráficos, estadísticas y respuestas individuales al instante desde tu dashboard."
    },
    {
      question: "¿Cuántas encuestas puedo crear?",
      answer: "No hay límite. Puedes crear todas las encuestas que necesites y mantenerlas activas el tiempo que desees."
    },
    {
      question: "¿Puedo exportar los datos?",
      answer: "Por supuesto. Puedes exportar los resultados en formato Excel, CSV o PDF con un solo clic desde el panel de administración."
    },
    {
      question: "¿Es seguro el sistema?",
      answer: "Sí, utilizamos encriptación de datos y seguimos los mejores estándares de seguridad para proteger tu información y la de tus encuestados."
    },
    {
      question: "¿Necesito conocimientos técnicos?",
      answer: "No. El sistema está diseñado para ser intuitivo y fácil de usar. Cualquier persona puede crear y administrar encuestas sin necesidad de conocimientos técnicos."
    }
  ]

  return (
    <div id="faq" className="bg-black py-20 px-8 relative">
      {/* Grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-400">
            Todo lo que necesitas saber sobre nuestro sistema de encuestas
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-800">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQSection