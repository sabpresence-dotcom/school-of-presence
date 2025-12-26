'use client';

import { motion } from 'framer-motion';
import { BookOpen, LineChart, Sparkles } from 'lucide-react';

export function LoginBranding() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="hidden lg:block space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="space-y-2">
                <motion.h1
                    className="text-5xl font-bold font-heading text-white leading-tight"
                    variants={item}
                >
                    Master the Art of <br />
                    <span className="text-white text-gradient">Presence.</span>
                </motion.h1>
                <motion.p
                    className="text-xl text-slate-400 font-light max-w-md"
                    variants={item}
                >
                    Join the community of leaders, entrepreneurs, and speakers elevating their communication game.
                </motion.p>
            </div>

            <div className="space-y-4">
                <motion.div className="flex items-center gap-4 text-slate-300 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50" variants={item}>
                    <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center border border-slate-700/60 text-white">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Access exclusive courses and resources</p>
                </motion.div>

                <motion.div className="flex items-center gap-4 text-slate-300 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50" variants={item}>
                    <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center border border-slate-700/60 text-white">
                        <LineChart className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Track your progress and growth</p>
                </motion.div>

                <motion.div className="flex items-center gap-4 text-slate-300 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50" variants={item}>
                    <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center border border-slate-700/60 text-white">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Unlock your full potential as a world-class communicator</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
