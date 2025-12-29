'use server';

import { createServerClient } from './supabase/server';
import { Course, CourseProgress, Lesson, Purchase, Service } from './types';
import { unstable_cache } from 'next/cache';

/**
 * Fetch all services ordered by display_order
 */
export const getServices = unstable_cache(
    async (): Promise<Service[]> => {
        const supabase = createServerClient();

        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                return [];
            }

            return data || [];
        } catch (e) {
            return [];
        }
    },
    ['services'],
    {
        revalidate: 3600, // 1 hour
        tags: ['services'],
    }
);

/**
 * Fetch all published courses ordered by display_order
 * Cached for 1 minute to ensure fresh content
 */
export const getCourses = unstable_cache(
    async (): Promise<Course[]> => {
        const supabase = createServerClient();

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_published', true)
                .order('display_order', { ascending: true });

            if (error) {
                return [];
            }

            return data || [];
        } catch (e) {
            return [];
        }
    },
    ['courses'],
    {
        revalidate: 60,
        tags: ['courses'],
    }
);

/**
 * Fetch a single course by ID
 * Cached for 1 minute
 */
export const getCourse = unstable_cache(
    async (courseId: string): Promise<Course | null> => {
        const supabase = createServerClient();

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (error) {
                return null;
            }

            return data;
        } catch (e) {
            return null;
        }
    },
    ['course-details'],
    {
        revalidate: 60,
        tags: ['courses'],
    }
);

/**
 * Fetch courses purchased by a specific user
 * Not cached (user-specific data)
 */
export async function getUserPurchases(userId: string): Promise<Course[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('purchases')
        .select(`
      course_id,
      courses (*)
    `)
        .eq('user_id', userId);

    if (error) {
        return [];
    }

    // Extract courses from the join
    return data?.map((purchase: any) => purchase.courses).filter(Boolean) || [];
}

/**
 * Add email to waitlist
 */
export async function joinWaitlist(email: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Fetch lessons for a course
 * @param courseId - The course ID
 * @param commitmentPeriod - Optional: Filter by 14-day or 28-day commitment (defaults to 28)
 */
export async function getLessons(
    courseId: string,
    commitmentPeriod: 14 | 28 = 28
): Promise<Lesson[]> {
    const supabase = createServerClient();

    try {
        let query = supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .eq('is_published', true)
            .order('day_number', { ascending: true });

        // Filter by commitment period using simple numeric logic
        if (commitmentPeriod === 14) {
            query = query.lte('day_number', 14);
        }
        // For 28-day, fetch all lessons (no additional filter needed)

        const { data, error } = await query;

        if (error) {
            return [];
        }

        return data || [];
    } catch (e) {
        return [];
    }
}

/**
 * Get course progress for a user
 */
export async function getCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
    const supabase = createServerClient();

    try {
        const { data, error } = await supabase
            .from('course_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (error) {
            return null;
        }

        return data;
    } catch (e) {
        return null;
    }
}

/**
 * Update course progress (minutes watched)
 */
export async function updateCourseProgress(
    userId: string,
    courseId: string,
    minutesWatched: number
): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient();

    try {
        // Upsert progress
        const { error } = await supabase
            .from('course_progress')
            .upsert(
                {
                    user_id: userId,
                    course_id: courseId,
                    minutes_watched: minutesWatched,
                    last_watched_at: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id,course_id',
                }
            );

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to update progress' };
    }
}

/**
 * Mark course as completed
 */
export async function markCourseComplete(
    userId: string,
    courseId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient();

    try {
        const { error } = await supabase
            .from('course_progress')
            .upsert(
                {
                    user_id: userId,
                    course_id: courseId,
                    is_completed: true,
                    last_watched_at: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id,course_id',
                }
            );

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to mark complete' };
    }
}
