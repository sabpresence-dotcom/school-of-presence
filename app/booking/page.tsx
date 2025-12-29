"use client";

import BookingForm from '@/components/BookingForm';
import { Suspense } from 'react';
import { BookingFormSkeleton } from '@/components/BookingFormSkeleton';

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 flex flex-col items-center justify-center">
            <div className="w-full h-full max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-6">
                        Book a Service
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                        Select the service that fits your needs and let&apos;s start the journey.
                    </p>
                </div>

                <Suspense fallback={<BookingFormSkeleton />}>
                    <div className="glass-card luxury-border rounded-2xl p-6 sm:p-10 bg-black/40">
                        <BookingForm />
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
