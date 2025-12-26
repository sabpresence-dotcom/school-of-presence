import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseCardSkeleton() {
    return (
        <Card className="h-full glass-card border-white/5 flex flex-col overflow-hidden">
            {/* Thumbnail Skeleton */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                <Skeleton className="h-full w-full" />
            </div>

            <CardHeader className="relative z-20 -mt-8 pt-0 px-8">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>

            <CardContent className="flex-grow px-8 pt-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>

            <CardFooter className="px-8 pb-8 pt-4">
                <Skeleton className="h-12 w-full rounded-full" />
            </CardFooter>
        </Card>
    );
}

