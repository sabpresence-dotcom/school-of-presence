import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { sendBookingNotification, sendPaymentConfirmation } from '@/app/actions/send-notification';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            fullName,
            email,
            phone,
            country,
            serviceType,
            serviceLabel,
            serviceDetails,
            priceUSD,
            priceGHS,
            paymentStatus,
            paymentReference,
        } = body;

        // Validate required fields
        if (!fullName || !email || !phone || !country || !serviceType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Build additional_info string from service details
        const additionalInfoParts: string[] = [];
        if (serviceDetails) {
            if (serviceDetails.theme_expectation) {
                additionalInfoParts.push(`Theme/Expectation: ${serviceDetails.theme_expectation}`);
            }
            if (serviceDetails.communication_aspect) {
                additionalInfoParts.push(`Communication Aspect: ${serviceDetails.communication_aspect}`);
            }
            if (serviceDetails.mentoring_aspect) {
                additionalInfoParts.push(`Mentoring Aspect: ${serviceDetails.mentoring_aspect}`);
            }
            if (serviceDetails.podcast_subject) {
                additionalInfoParts.push(`Podcast Subject: ${serviceDetails.podcast_subject}`);
            }
            if (serviceDetails.coaching_options && serviceDetails.coaching_options.length > 0) {
                additionalInfoParts.push(`Coaching Focus: ${serviceDetails.coaching_options.join(', ')}`);
            }
            if (serviceDetails.other_notes) {
                additionalInfoParts.push(`Additional Notes: ${serviceDetails.other_notes}`);
            }
        }
        const additionalInfo = additionalInfoParts.join('\n');

        // Insert booking into database
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                first_name: fullName.split(' ')[0] || fullName,
                last_name: fullName.split(' ').slice(1).join(' ') || '',
                email,
                phone,
                country,
                booking_type: serviceType,
                additional_info: additionalInfo || null,
                price: priceUSD || null,
                payment_status: paymentStatus || 'pending',
                payment_reference: paymentReference || null,
                status: 'pending',
            })
            .select('id')
            .single();

        if (error) {
            logger.error('Failed to create booking in database', error, { email, serviceType });
            return NextResponse.json(
                { error: 'Failed to create booking' },
                { status: 500 }
            );
        }

        // Send email notification to admin
        const emailResult = await sendBookingNotification({
            fullName,
            email,
            phone,
            country,
            serviceType,
            serviceLabel: serviceLabel || serviceType,
            serviceDetails: serviceDetails || {},
            paymentStatus: paymentStatus || 'pending',
            priceUSD,
            priceGHS,
        });

        if (!emailResult.success) {
            logger.warn('Booking notification email failed', { bookingId: data.id, error: emailResult.error });
            // Don't fail the booking if email fails, just log it
        }

        // Send payment confirmation to customer if paid
        if (paymentStatus === 'paid' && paymentReference) {
            const paymentConfirmation = await sendPaymentConfirmation({
                customerName: fullName,
                customerEmail: email,
                serviceLabel: serviceLabel || serviceType,
                amountPaid: priceGHS || 0,
                currency: 'GHS',
                paymentReference,
                transactionDate: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
            });

            if (!paymentConfirmation.success) {
                logger.warn('Payment confirmation email failed', { bookingId: data.id, error: paymentConfirmation.error });
            }
        }

        // Generate Cal.com prefill URL for scheduling (consultation only)
        let calComUrl = null;
        if (serviceType === 'consultation') {
            const calComBaseUrl = 'https://cal.com/andrews-4babzd/consultation-30-mins';
            const calComParams = new URLSearchParams({
                name: fullName,
                email: email,
                notes: `Service: ${serviceType}\nPhone: ${phone}\nCountry: ${country}\n\n${additionalInfo || 'N/A'}`,
            });
            calComUrl = `${calComBaseUrl}?${calComParams.toString()}`;
        }

        return NextResponse.json({
            success: true,
            bookingId: data.id,
            calComUrl,
            requiresPayment: !!priceUSD,
            emailSent: emailResult.success,
        });
    } catch (error) {
        logger.error('Booking API error', error, { endpoint: 'POST /api/bookings' });
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve booking details (protected - requires auth)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
        return NextResponse.json(
            { error: 'Booking ID required' },
            { status: 400 }
        );
    }

    const supabase = createServerClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Check if user is admin (optional - you can adjust based on your roles)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    // Fetch booking
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

    if (error || !data) {
        return NextResponse.json(
            { error: 'Booking not found' },
            { status: 404 }
        );
    }

    // Non-admin users can only see bookings with their email
    if (!isAdmin && data.email !== user.email) {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }

    return NextResponse.json(data);
}
