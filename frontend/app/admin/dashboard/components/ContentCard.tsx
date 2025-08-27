interface ContentCardProps {
  id: number
}

export default function ContentCard({ id }: ContentCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-2">Card {id}</h3>
      <p className="text-gray-600 text-sm">
        Sample content card with some placeholder text.
      </p>
    </div>
  )
}