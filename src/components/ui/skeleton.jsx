export function Skeleton({ className = '', dark = false }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${dark ? 'bg-[#2d1f4e]' : 'bg-gray-100'} ${className}`}
    />
  );
}

export function JobCardSkeleton({ dark = false }) {
  return (
    <div className={`rounded-2xl border p-5 md:p-6 ${dark ? 'bg-[#1a0f2e] border-[#2d1f4e]' : 'bg-white border-gray-100'}`}>
      <Skeleton dark={dark} className="h-4 w-1/4 mb-3" />
      <Skeleton dark={dark} className="h-5 w-3/4 mb-2" />
      <Skeleton dark={dark} className="h-4 w-full mb-2" />
      <Skeleton dark={dark} className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2">
        <Skeleton dark={dark} className="h-8 flex-1" />
        <Skeleton dark={dark} className="h-8 flex-1" />
      </div>
    </div>
  );
}
