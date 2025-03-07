export default function Loading() {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="hidden md:block h-6 w-32 bg-gray-200 rounded"></div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="h-10 w-64 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="hidden md:block h-4 w-24 bg-gray-200 rounded"></div>
              <div className="hidden md:block h-4 w-8 bg-gray-200 rounded"></div>
              <div className="hidden lg:block h-4 w-32 bg-gray-200 rounded"></div>
              <div className="hidden lg:block h-4 w-40 bg-gray-200 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center mt-8">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
