'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error for debugging in development
        if (process.env.NODE_ENV === 'development' && error) {
            console.error('Login page error:', error);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                We encountered an error while loading the login screen. This might be a temporary glitch.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">
                    Try again
                </Button>
                <Button variant="outline" asChild className="border-white/10 text-white hover:bg-white/5">
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-slate-900 rounded border border-red-500/20 text-red-400 text-xs font-mono text-left max-w-2xl overflow-auto">
                    {error.message}
                </div>
            )}
        </div>
    );
}
