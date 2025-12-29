'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/courses', label: 'Courses' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    if (pathname === '/login') return null;

    return (
        <nav
            className={cn(
                "fixed z-50 px-4 md:px-6 box-border transition-all duration-300",
                scrolled
                    ? "glass border border-slate-700/50 shadow-2xl shadow-blue-950/50 py-3 w-[calc(100%-24px)] max-w-[1200px] left-1/2 -translate-x-1/2 top-4 md:top-6 rounded-full"
                    : "bg-transparent py-4 md:py-6 border-b border-transparent w-full left-0 top-0"
            )}
            aria-label="Main navigation"
        >
            <div className={cn("w-full transition-all duration-500", scrolled ? "" : "container mx-auto")}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group relative z-50" aria-label="Sarpong Andrews Boakye - Home">
                        <span className="bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-heading tracking-[0.08em] sm:tracking-[0.1em] text-transparent group-hover:to-blue-200 transition-all duration-700 whitespace-nowrap">
                            SARPONG ANDREWS BOAKYE
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-heading tracking-widest uppercase transition-all duration-300 relative group py-2",
                                    pathname === link.href ? "text-white" : "text-slate-400 hover:text-white"
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <motion.span
                                        layoutId="underline"
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                                    />
                                )}
                                <span className={cn(
                                    "absolute bottom-0 left-0 w-0 h-0.5 bg-slate-400/50 transition-all duration-300 group-hover:w-full",
                                    pathname !== link.href && "block"
                                )} />
                            </Link>
                        ))}

                        <div className="flex items-center gap-4 ml-4">
                            <Button variant="default" size="sm" asChild className="relative overflow-hidden group h-[30px]">
                                <Link href="/booking">
                                    <span className="relative z-10 text-sm font-heading tracking-widest uppercase">Book Consultation</span>
                                    <motion.div
                                        className="absolute inset-0 bg-blue-400/20"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700/50 hover:text-white transition-colors group">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform transition-transform duration-300 group-hover:scale-110">
                                    <path d="M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="origin-center transition-all duration-300 group-hover:w-full" />
                                    <path d="M8 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="origin-right transition-all duration-300 group-hover:w-full group-hover:translate-x-0" />
                                </svg>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:w-[400px] border-l border-slate-700/50 bg-slate-950/95 backdrop-blur-2xl p-0">
                            <div className="flex flex-col h-full relative overflow-hidden">
                                {/* Background Noise */}
                                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

                                {/* Close Button */}
                                <div className="absolute top-6 right-6 z-50">
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                            <X className="h-6 w-6" />
                                        </Button>
                                    </SheetClose>
                                </div>

                                <div className="flex flex-col justify-center items-center h-full space-y-8 p-8 relative z-10">
                                    {navLinks.map((link, index) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-3xl font-heading font-bold uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 hover:to-blue-200 transition-all duration-500"
                                            style={{ transitionDelay: `${index * 50}ms` }}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    <div className="pt-8 w-full max-w-xs space-y-4">
                                        <Button variant="default" size="lg" className="w-full text-lg font-heading tracking-wider py-6" asChild>
                                            <Link href="/booking" onClick={() => setIsOpen(false)}>
                                                Book Consultation
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}

