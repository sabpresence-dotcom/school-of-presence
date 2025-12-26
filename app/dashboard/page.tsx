import { redirect } from 'next/navigation';
import { getCourses, getUserPurchases } from '@/lib/actions';
import { createServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { WelcomeModal } from '@/components/WelcomeModal';
import { DashboardStats } from '@/components/DashboardStats';
import { DashboardStatsSkeleton } from '@/components/DashboardStatsSkeleton';
import { CourseCard } from '@/components/CourseCard';
import { CourseCardSkeleton } from '@/components/CourseCardSkeleton';
import { GraduationCap } from 'lucide-react';
import { Suspense } from 'react';

export default async function DashboardPage() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/dashboard');
    }

    const purchasedCourses = await getUserPurchases(user.id);
    const allCourses = await getCourses();

    // Filter out purchased courses to show recommendations
    const recommendedCourses = allCourses.filter(
        course => !purchasedCourses.some(p => p.id === course.id)
    );

    return (
        <div className="min-h-screen bg-background bg-noise pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <WelcomeModal />
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <DashboardSidebar />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold font-heading text-white mb-2">
                                Welcome back, {user.user_metadata.full_name?.split(' ')[0] || 'Member'}
                            </h1>
                            <p className="text-slate-400">
                                Continue your journey to mastering communication.
                            </p>
                        </div>

                        <Suspense fallback={<DashboardStatsSkeleton />}>
                            <DashboardStats coursesCount={purchasedCourses.length} />
                        </Suspense>

                        {/* My Learning */}
                        <section className="mb-12">
                            <h2 className="text-xl font-bold text-white mb-6 font-heading border-b border-white/10 pb-2">
                                My Learning
                            </h2>

                            {purchasedCourses.length === 0 ? (
                                <Card className="bg-white/5 border-white/10 border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-center px-6">
                                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                                            <GraduationCap className="h-10 w-10 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-heading text-white mb-3">Start Your Learning Journey</h3>
                                        <p className="text-slate-300 max-w-md mb-8 text-base leading-relaxed">
                                            You haven&apos;t enrolled in any courses yet. Explore our catalog of communication courses designed to help you master the art of presence and influence.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Button variant="default" size="lg" className="min-h-[44px] px-8" asChild>
                                                <a href="/courses">Browse All Courses</a>
                                            </Button>
                                            <Button variant="outline" size="lg" className="min-h-[44px] px-8 border-white/20 text-white hover:bg-white/10" asChild>
                                                <a href="/#services">View Services</a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Suspense fallback={
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <CourseCardSkeleton key={i} />
                                        ))}
                                    </div>
                                }>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {purchasedCourses.map((course) => (
                                            <CourseCard key={course.id} course={course} user={{ id: user.id, email: user.email || '' }} isOwned={true} />
                                        ))}
                                    </div>
                                </Suspense>
                            )}
                        </section>

                        {/* Recommended */}
                        {recommendedCourses.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-6 font-heading border-b border-white/10 pb-2">
                                    Recommended for You
                                </h2>
                                <Suspense fallback={
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <CourseCardSkeleton key={i} />
                                        ))}
                                    </div>
                                }>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {recommendedCourses.slice(0, 3).map((course) => (
                                            <CourseCard key={course.id} course={course} user={{ id: user.id, email: user.email || '' }} isOwned={false} />
                                        ))}
                                    </div>
                                </Suspense>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
