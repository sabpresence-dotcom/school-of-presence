"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function WelcomeModal() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('welcome') === 'true') {
            setOpen(true);

            // Dynamically import confetti to avoid SSR issues
            import('canvas-confetti').then((confettiModule) => {
                const confetti = confettiModule.default;

                // Fire confetti
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }

                    const particleCount = 50 * (timeLeft / duration);

                    // since particles fall down, start a bit higher than random
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }, 250);
            });

            // Clean up URL
            router.replace('/dashboard');
        }
    }, [searchParams, router]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-slate-950 border border-slate-700/50 shadow-2xl shadow-blue-500/10">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-700/70 flex items-center justify-center mb-4 text-white">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-2xl font-heading text-center text-white">Welcome Aboard!</DialogTitle>
                    <DialogDescription className="text-center text-slate-400 pt-2 text-lg">
                        We&apos;re thrilled to have you join the School of Presence. Your journey to confident communication starts now.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center mt-4">
                    <Button
                        variant="default"
                        size="lg"
                        className="w-full text-lg shadow-lg shadow-blue-500/20"
                        onClick={() => setOpen(false)}
                    >
                        Let&apos;s Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
