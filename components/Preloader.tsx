'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
    children: React.ReactNode;
}

export function Preloader({ children }: PreloaderProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Minimum display time for the preloader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="preloader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative z-10 text-center space-y-6">
                            {/* Name Animation */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-[0.2em] text-white"
                            >
                                SARPONG ANDREWS BOAKYE
                            </motion.h1>

                            {/* Title Animation */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-sm sm:text-base tracking-[0.3em] uppercase text-slate-400"
                            >
                                Communication Coach & Entrepreneur
                            </motion.p>

                            {/* Loading bar */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8 w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden mx-auto"
                            >
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content - always render but hidden during preloader */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                {children}
            </motion.div>
        </>
    );
}
