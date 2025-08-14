export default function TodoLoading() {
  return (
    <div className="min-h-screen bg-[#dedede] flex flex-col font-inter">
      {/* Header Skeleton */}
      <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="relative bg-white flex justify-center pt-16 pb-20 px-6">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <main className="flex justify-center -mt-12 px-6 pb-20">
        <section className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}