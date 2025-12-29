import { getCourse, getUserPurchases } from '@/lib/actions';
import { createServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import BuyButton from '@/components/BuyButton';
import { Clock, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface CoursePageProps {
    params: {
        courseId: string;
    };
}

export default async function CoursePage({ params }: CoursePageProps) {
    const course = await getCourse(params.courseId);
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!course) {
        notFound();
    }

    // Check if purchased
    let isPurchased = false;
    if (user) {
        const purchases = await getUserPurchases(user.id);
        isPurchased = purchases.some(p => p.id === course.id);
    }

    // If purchased, redirect to the dashboard course player
    if (isPurchased) {
        redirect(`/dashboard/courses/${course.id}`);
    }

    // Extract YouTube thumbnail or use direct thumbnail URL
    const getThumbnail = (url: string | null) => {
        if (!url) return null;
        if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com')) {
            let videoId = '';
            if (url.includes('/embed/')) {
                videoId = url.split('/embed/')[1];
            } else if (url.includes('v=')) {
                videoId = url.split('v=')[1];
            } else {
                videoId = url.split('/').pop() || '';
            }
            const cleanId = videoId?.split('?')[0];
            return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
        }
        return url;
    };

    const thumbnail = getThumbnail(course.thumbnail_url);

    // For unpurchased courses, show a purchase page
    return (
        <div className="min-h-screen bg-background bg-noise pt-24">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Course Info */}
                    <div className="space-y-8">
                        {/* Course Thumbnail */}
                        {thumbnail && (
                            <div className="aspect-video relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <Image
                                    src={thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}

                        {/* Course Title & Description */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
                                {course.title}
                            </h1>
                            <p className="text-lg text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {course.long_description || course.description}
                            </p>
                        </div>

                        {/* Course Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <Clock className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-white font-medium">{course.duration || 0} mins</p>
                                    <p className="text-sm text-slate-400">Total Duration</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-white font-medium">Full Access</p>
                                    <p className="text-sm text-slate-400">Lifetime Access</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Purchase Card */}
                    <div className="lg:sticky lg:top-28">
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <div className="text-center mb-6">
                                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Course Price</p>
                                <p className="text-4xl font-bold text-white font-heading">
                                    GHS {(course.price || 0).toFixed(2)}
                                </p>
                            </div>

                            <BuyButton
                                courseId={course.id}
                                price={course.price || 0}
                                title={course.title}
                                user={user ? { id: user.id, email: user.email || '' } : null}
                                className="w-full py-6 text-lg"
                            />

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Instant access after purchase
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Secure payment via Paystack
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Access from any device
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
