'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && error) {
            console.error('Dashboard error:', error);
        }
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
                Dashboard Error
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">
                Something went wrong while loading your dashboard. Your data is safe, and you can try again.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </Button>
                <Button variant="outline" asChild className="border-white/10 text-white hover:bg-white/5 gap-2">
                    <Link href="/">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
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
