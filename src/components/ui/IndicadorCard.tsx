interface IndicadorItem {
  id: number
  text: string
}

interface IndicadorCardProps {
  title: string
  icon: React.ReactNode
  items: IndicadorItem[]
  color: string
}

function IndicadorCard({ title, icon, items, color }: IndicadorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndicadorCard