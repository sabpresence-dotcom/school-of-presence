import { Skeleton } from "@/components/ui/skeleton"

export function BookingFormSkeleton() {
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-4">
                <Skeleton className="h-10 w-2/3 mx-auto bg-slate-800" />
                <Skeleton className="h-6 w-1/2 mx-auto bg-slate-800/50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Service Selection */}
                <div className="space-y-8">
                    <div className="bg-slate-800/20 p-6 rounded-xl border border-white/5 space-y-4">
                        <Skeleton className="h-7 w-40 bg-slate-800" />
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
                            <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-7 w-40 bg-slate-800" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-24 w-full bg-slate-800 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Client Details Form */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24 bg-slate-800" />
                        <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24 bg-slate-800" />
                        <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-20 bg-slate-800" />
                            <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-20 bg-slate-800" />
                            <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Skeleton className="h-14 w-full bg-slate-800 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
