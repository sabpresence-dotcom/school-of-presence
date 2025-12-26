'use server';

import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'boakyesarpong18@gmail.com';

// Lazy initialization to avoid build-time errors
function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error('RESEND_API_KEY is not configured');
    }
    return new Resend(apiKey);
}

interface BookingNotificationData {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    serviceType: string;
    serviceLabel: string;
    serviceDetails: Record<string, unknown>;
    paymentStatus: string;
    priceUSD?: number;
    priceGHS?: number;
}

export async function sendBookingNotification(booking: BookingNotificationData) {
    try {
        // Format service details for email display
        const formattedDetails = Object.entries(booking.serviceDetails)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                if (Array.isArray(value)) {
                    return `<strong>${formattedKey}:</strong> ${value.join(', ')}`;
                }
                return `<strong>${formattedKey}:</strong> ${value}`;
            })
            .join('<br>');

        const priceInfo = booking.priceUSD
            ? `<p><strong>Amount:</strong> $${booking.priceUSD} (GHS ${booking.priceGHS?.toFixed(2) || 'N/A'})</p>`
            : '';

        const paymentBadge = booking.paymentStatus === 'paid'
            ? '<span style="background-color: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">PAID</span>'
            : booking.paymentStatus === 'n/a'
                ? '<span style="background-color: #6b7280; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">INQUIRY</span>'
                : '<span style="background-color: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">PENDING</span>';

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #3b82f6; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: 600; color: #555; }
        .details-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #3b82f6; }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #1a1a2e; margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>School of Presence</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">New Booking Request</p>
        </div>
        <div class="content">
            <h2>${booking.serviceLabel} ${paymentBadge}</h2>
            
            <div class="field"><span class="label">Name:</span> ${booking.fullName}</div>
            <div class="field"><span class="label">Email:</span> <a href="mailto:${booking.email}">${booking.email}</a></div>
            <div class="field"><span class="label">Phone:</span> ${booking.phone}</div>
            <div class="field"><span class="label">Country:</span> ${booking.country}</div>
            ${priceInfo}
            
            ${formattedDetails ? `
            <div class="details-box">
                <h3 style="margin-top: 0; color: #1a1a2e;">Service Details</h3>
                ${formattedDetails}
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>
        `;

        const resend = getResendClient();
        const { data, error: sendError } = await resend.emails.send({
            from: 'School of Presence <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: `New Booking: ${booking.serviceLabel} - ${booking.fullName}`,
            html: htmlContent,
        });

        if (sendError) {
            console.error('Resend error:', sendError);
            return { success: false, error: sendError.message };
        }

        return { success: true, emailId: data?.id };
    } catch (error) {
        console.error('Email notification error:', error);
        return { success: false, error: 'Failed to send notification email' };
    }
}
