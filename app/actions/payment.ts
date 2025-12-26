'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function handlePurchaseSuccess(courseId: string, reference: string) {
    try {
        const supabase = createServerClient();

        // 1. Verify User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'User not authenticated' };
        }

        // 2. Data Lookup

        // Fetch course (needed for price)
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('price')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return { success: false, error: 'Course not found' };
        }

        // --- PAYMENT VERIFICATION START ---
        if (!process.env.PAYSTACK_SECRET_KEY) {
            return { success: false, error: 'Server config error' };
        }

        try {
            const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store' // Ensure no caching
            });

            if (!verifyRes.ok) {
                return { success: false, error: `Payment verification failed (HTTP ${verifyRes.status})` };
            }

            const verifyJson = await verifyRes.json();
            if (verifyJson.data.status !== 'success') {
                return { success: false, error: 'Payment verification failed' };
            }

            const paid = verifyJson.data.amount / 100;
            if (Math.abs(paid - course.price) > 0.01) {
                return { success: false, error: 'Payment amount mismatch' };
            }

        } catch (netError: any) {
            return { success: false, error: 'Payment verification connection failed' };
        }
        // --- PAYMENT VERIFICATION END ---

        // 3. Record Purchase with idempotency key (payment reference)
        const { error: insertError } = await supabase.from('purchases').insert({
            user_id: user.id,
            course_id: courseId,
            amount_paid: course.price,
            payment_reference: reference
        });

        if (insertError) {
            if (insertError.code === '23505') { // Unique violation
                return { success: true };
            }
            return { success: false, error: 'Failed to record purchase' };
        }

        revalidatePath('/dashboard');
        revalidatePath('/courses');
        revalidatePath(`/courses/${courseId}`);
        return { success: true };

    } catch (e: any) {
        return { success: false, error: 'Internal processing exception' };
    }
}
