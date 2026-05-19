import { cn } from '../../lib/utils'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <Skeleton className="h-4 w-1/4 mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
}
