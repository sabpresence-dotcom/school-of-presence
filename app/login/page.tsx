'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoginBranding } from '@/components/LoginBranding';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamic import with SSR disabled to prevent server-side crashes
const LoginForm = dynamic(() => import('@/components/LoginForm').then(mod => mod.LoginForm), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
    )
});

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),rgba(0,0,0,0)_50%)] pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

            {/* Navigation */}
            <div className="absolute top-6 left-6 z-50">
                <Button
                    variant="ghost"
                    asChild
                    className="text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group rounded-full px-6 border border-transparent hover:border-white/10"
                >
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-heading tracking-wider text-sm">Back to Home</span>
                    </Link>
                </Button>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Branding (Hidden on mobile) */}
                <LoginBranding />

                {/* Right Side: Form */}
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
