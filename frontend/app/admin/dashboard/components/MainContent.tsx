import ContentCard from './ContentCard'

export default function MainContent() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Main Content Area</h2>
          <p className="text-gray-600">
            This is your main content area. Replace this with your actual page content.
          </p>

          {/* Sample Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((i) => (
              <ContentCard key={i} id={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}