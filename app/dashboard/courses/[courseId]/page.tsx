import { getCourse, getUserPurchases } from '@/lib/actions';
import { createServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import CourseView from './CourseView';

interface CoursePlayerPageProps {
    params: {
        courseId: string;
    };
}

export default async function CoursePlayerPage({ params }: CoursePlayerPageProps) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=/dashboard/courses/${params.courseId}`);
    }

    const course = await getCourse(params.courseId);
    if (!course) {
        notFound();
    }

    // Verify purchase
    const purchases = await getUserPurchases(user.id);
    const isPurchased = purchases.some(p => p.id === course.id);

    if (!isPurchased) {
        redirect(`/courses/${course.id}`);
    }

    return <CourseView course={course} />;
}
