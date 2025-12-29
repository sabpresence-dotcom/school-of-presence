import { getCourses, getUserPurchases, joinWaitlist } from '@/lib/actions';
import { createServerClient } from '@/lib/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { CourseCardSkeleton } from '@/components/CourseCardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import WaitlistForm from '@/components/WaitlistForm';
import { Suspense } from 'react';
import type { Course } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
    const courses = await getCourses();
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let purchasedCourses: Course[] = [];
    if (user) {
        purchasedCourses = await getUserPurchases(user.id);
    }
    // ... (rest of function)

    return (
        <div className="pt-16 min-h-screen bg-background bg-noise relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6">
                        Focused Courses
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light mb-8">
                        Deep-dive learning in key areas: public speaking, voice, articulation, and presence.
                    </p>

                    {/* Login / Dashboard CTA */}
                    {user ? (
                        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-left">
                                <p className="text-primary font-medium text-sm uppercase tracking-wider mb-1">Welcome Back</p>
                                <p className="text-white font-heading text-lg">You have {purchasedCourses.length} active courses</p>
                            </div>
                            <Button variant="default" asChild className="sm:ml-4">
                                <a href="/dashboard">Go to Dashboard</a>
                            </Button>
                        </div>
                    ) : (
                        <div className="inline-block">
                            <p className="text-slate-400 mb-4 text-sm">Already a member?</p>
                            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                                <a href="/login?next=/courses">Log In to Access Your Content</a>
                            </Button>
                        </div>
                    )}
                </div>

                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </div>
                }>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {courses.map((course) => {
                            // Fix: getUserPurchases returns Course[], so we must check p.id, not p.course_id
                            const isOwned = purchasedCourses.some(p => p.id === course.id);
                            return (
                                <CourseCard key={course.id} course={course} user={user ? { id: user.id, email: user.email || '' } : null} isOwned={isOwned} />
                            );
                        })}
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
