'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRef, useMemo } from 'react';
import Image from 'next/image';

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yImage = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 50]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = useMemo(() => ({
        stiffness: prefersReducedMotion ? 500 : 40,
        damping: prefersReducedMotion ? 50 : 25,
        mass: 0.5
    }), [prefersReducedMotion]);

    const mouseX = useSpring(x, springConfig);
    const mouseY = useSpring(y, springConfig);

    function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
        if (prefersReducedMotion) return;
        const { currentTarget, clientX, clientY } = event;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set(clientX - centerX);
        y.set(clientY - centerY);
    }

    const rotateX = useTransform(mouseY, [-500, 500], prefersReducedMotion ? [0, 0] : [-5, 5]);
    const rotateY = useTransform(mouseX, [-500, 500], prefersReducedMotion ? [0, 0] : [5, -5]);

    const glareX = useTransform(mouseX, [-500, 500], ['0%', '100%']);
    const glareY = useTransform(mouseY, [-500, 500], ['0%', '100%']);
    const glareOpacity = useTransform(mouseX, [-500, 500], prefersReducedMotion ? [0, 0] : [0, 0.2]);

    const roles = [
        { title: "Communication Coach", icon: "✦" },
        { title: "Entrepreneur", icon: "◆" },
        { title: "Consultant", icon: "●" }
    ];

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="relative min-h-screen w-full bg-background overflow-hidden"
        >
            {/* Background Gradient - Darker for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />

            {/* Texture Overlay - behind content */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%20opacity%3D%220.02%22%20mix-blend-overlay%20pointer-events-none%20z-0%22%2F%3E%3C%2Fsvg%3E')] opacity-[0.02] mix-blend-overlay pointer-events-none z-0" />

            {/* Animated Floating Particles */}
            {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[
                        { left: 5, top: 10, duration: 5, delay: 0 },
                        { left: 15, top: 25, duration: 6, delay: 1 },
                        { left: 25, top: 60, duration: 4, delay: 2 },
                        { left: 35, top: 80, duration: 7, delay: 0.5 },
                        { left: 45, top: 15, duration: 5, delay: 3 },
                        { left: 55, top: 45, duration: 6, delay: 1.5 },
                        { left: 65, top: 70, duration: 4, delay: 4 },
                        { left: 75, top: 30, duration: 5, delay: 2.5 },
                        { left: 85, top: 55, duration: 6, delay: 0.8 },
                        { left: 95, top: 85, duration: 7, delay: 3.5 },
                        { left: 10, top: 40, duration: 5, delay: 1.2 },
                        { left: 30, top: 20, duration: 4, delay: 2.8 },
                        { left: 50, top: 75, duration: 6, delay: 0.3 },
                        { left: 70, top: 50, duration: 5, delay: 4.2 },
                        { left: 90, top: 35, duration: 7, delay: 1.8 },
                    ].map((particle, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-300/20 rounded-full"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.1, 0.4, 0.1],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: particle.delay,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Spotlight on Right Side - Subtle blue tint */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

            {/* Main Split Layout Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-32 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center w-full">

                    {/* LEFT SIDE: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1"
                    >
                        {/* Headline */}
                        <div className="space-y-4">
                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1]"
                                style={{
                                    color: '#ffffff',
                                    textShadow: '0 2px 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <span className="block">
                                    Master the Art of
                                </span>
                                <span className="block">
                                    Communication
                                </span>
                            </h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-base sm:text-lg md:text-xl max-w-lg"
                                style={{ color: '#e2e8f0' }}
                            >
                                Transform your presence. Captivate any audience. Build unshakeable confidence.
                            </motion.p>
                        </div>

                        {/* CTA Buttons - Hidden on mobile, shown on desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="hidden lg:flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Button
                                asChild
                                variant="default"
                                size="lg"
                                className="rounded-full px-8 py-6 text-base font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <a href="/booking">BOOK A SERVICE</a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-full px-8 py-6 text-base font-bold tracking-wide bg-transparent text-white border-slate-600/60 hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
                            >
                                <a href="/courses">EXPLORE COURSES</a>
                            </Button>
                        </motion.div>

                        {/* Stats Row - Hidden on mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="hidden lg:flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 pt-6"
                        >
                            {[
                                { value: "3+", label: "Years Experience" },
                                { value: "500+", label: "Clients Helped" },
                                { value: "Global", label: "Reach" }
                            ].map((stat, index) => (
                                <div key={stat.label} className="text-center lg:text-left group">
                                    <div
                                        className="text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                        style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-sm sm:text-base uppercase tracking-widest text-slate-200 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT SIDE: Image with Role Pills and Mobile Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 40 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex flex-col items-center order-1 lg:order-2"
                    >
                        {/* Mobile Role Pills - Above Image */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex lg:hidden flex-wrap justify-center gap-2 mb-4"
                        >
                            {roles.map((role) => (
                                <div
                                    key={role.title}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 backdrop-blur-md rounded-full border border-slate-700/60"
                                >
                                    <span className="text-white text-[10px]">{role.icon}</span>
                                    <span className="text-[10px] font-medium tracking-wider text-white uppercase">
                                        {role.title}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Image Container - Shifted Left */}
                        <motion.div
                            style={{
                                y: yImage,
                                rotateX: rotateX,
                                rotateY: rotateY,
                            }}
                            className="relative lg:ml-16 perspective-1000"
                        >
                            {/* Subtle glow behind image - blue tinted */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                            <div className="relative">
                                <Image
                                    src="/hero-cutout.png"
                                    alt="Sarpong Andrews Boakye"
                                    width={500}
                                    height={750}
                                    priority
                                    className="h-[50vh] sm:h-[55vh] lg:h-[70vh] w-auto object-contain object-center drop-shadow-[0_35px_60px_rgba(0,0,0,0.5)] [filter:contrast(1.02)_brightness(1)]"
                                />

                                {/* Dynamic Glare Overlay */}
                                <motion.div
                                    style={{
                                        opacity: glareOpacity,
                                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 70%)`
                                    }}
                                    className="absolute inset-0 w-full h-full mix-blend-overlay pointer-events-none"
                                />
                            </div>
                        </motion.div>

                        {/* Mobile CTA Buttons - Under Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex lg:hidden flex-row gap-3 mt-1"
                        >
                            <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="rounded-full px-5 py-5 text-xs font-bold tracking-wide shadow-lg"
                            >
                                <a href="/booking">BOOK A SERVICE</a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-full px-5 py-5 text-xs font-bold tracking-wide bg-transparent text-white border-slate-600/60 hover:bg-white hover:text-black"
                            >
                                <a href="/courses">EXPLORE COURSES</a>
                            </Button>
                        </motion.div>

                        {/* Desktop Role Pills - Under the Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="hidden lg:flex flex-wrap justify-center gap-3 sm:gap-4 mt-8"
                        >
                            {roles.map((role) => (
                                <div
                                    key={role.title}
                                    className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-900/80 backdrop-blur-xl rounded-full border border-primary/40 shadow-lg shadow-primary/10 hover:border-primary/60 hover:shadow-primary/20 transition-all duration-300"
                                >
                                    <span className="text-primary text-sm">{role.icon}</span>
                                    <span className="text-sm font-semibold tracking-wider text-white uppercase">
                                        {role.title}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Fade - Seamless blend with body */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
        </section>
    );
}
