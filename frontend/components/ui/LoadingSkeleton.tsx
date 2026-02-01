interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`bg-slate-200 rounded-lg animate-pulse-soft ${className}`}
        />
    );
}

// Card Skeleton
export function CardSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <Skeleton className="h-8 w-full" />
        </div>
    );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <div className="p-4 border-b border-slate-200">
                <Skeleton className="h-8 w-48" />
            </div>
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
    return (
        <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    );
}
