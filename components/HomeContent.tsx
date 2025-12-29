'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Globe, Users, Mic, Target, Briefcase, MessageSquareQuote, Presentation, Sparkles, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Service } from '@/lib/types';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0
        }
    }
};


const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

interface HomeContentProps {
    services: Service[];
}

export function HomeContent({ services }: HomeContentProps) {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-screen bg-background bg-noise selection:bg-primary/30 selection:text-white overflow-x-hidden"
        >
            <Hero />

            {/* About Section */}
            <section id="about" className="py-16 md:py-24 lg:py-32 relative overflow-hidden -mt-16">
                {/* Top Gradient Fade for seamless transition */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Image Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="relative flex justify-center lg:justify-end order-2 lg:order-1 h-full"
                        >
                            <div className="relative w-full max-w-[500px] h-full">
                                {/* Decorative glow behind image */}
                                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-30" />

                                {/* Main image container */}
                                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-600/50 shadow-2xl shadow-blue-950/50 aspect-[3/4]">
                                    <Image
                                        src="/andrews-portrait.jpg"
                                        alt="Sarpong Andrews Boakye"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover object-top"
                                        priority
                                    />
                                    {/* Subtle overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                                </div>

                                {/* Decorative corner accent */}
                                <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-slate-500/50 rounded-br-2xl" />
                                <div className="absolute -top-3 -left-3 w-24 h-24 border-l-2 border-t-2 border-slate-500/50 rounded-tl-2xl" />
                            </div>
                        </motion.div>

                        {/* Text Column */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="space-y-8 order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start"
                        >
                            <div className="inline-flex items-center justify-center space-x-2 border border-slate-600/50 rounded-full px-4 py-1.5 bg-slate-800/50">
                                <span className="text-white text-sm font-medium tracking-wide uppercase">About & Approach</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading leading-tight text-white">
                                Helping leaders <span className="text-white underline decoration-slate-400/50 underline-offset-4">speak with confidence</span> and build powerful personal brands.
                            </h2>

                            <div className="space-y-6 text-lg text-slate-300 leading-relaxed font-light">
                                <p>
                                    Through <span className="text-white font-medium">School of Presence</span>, I coach executives, entrepreneurs, and professionals in mastering impactful communication—from public speaking to personal branding.
                                </p>
                                <p>
                                    I&apos;m also co-founder and CEO of <span className="text-white font-medium">Trekenvyl Footwear</span>, a premium brand for executives who value quality and craftsmanship.
                                </p>
                            </div>

                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-xl">
                                    <h4 className="text-sm font-heading text-white mb-2 flex items-center">
                                        <Globe className="w-4 h-4 text-white mr-2" /> Delivery
                                    </h4>
                                    <p className="text-slate-300 text-sm">In-person • Online • Hybrid</p>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-xl">
                                    <h4 className="text-sm font-heading text-white mb-2 flex items-center">
                                        <Users className="w-4 h-4 text-white mr-2" /> Clients
                                    </h4>
                                    <p className="text-slate-300 text-sm">Leaders • Entrepreneurs • Professionals</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold font-heading text-white mb-6">
                            Services
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        {services.length > 0 ? (
                            services.map((service, index) => (
                                <motion.div key={service.id || index} variants={staggerItem} className="hover:-translate-y-1.5 transition-transform duration-200">
                                    <Card className="h-full bg-slate-900/50 border-slate-700/50 hover:border-primary/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm">
                                        <CardHeader className="text-center flex flex-col items-center">
                                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-700/50 text-white group-hover:text-black group-hover:bg-white transition-all duration-500">
                                                {/* Dynamic Icon mapping */}
                                                {service.icon_name === 'MessageSquareQuote' || service.icon_name === 'Mic' ? <MessageSquareQuote className="h-6 w-6" /> :
                                                    service.icon_name === 'Presentation' || service.icon_name === 'Users' ? <Presentation className="h-6 w-6" /> :
                                                        service.icon_name === 'Sparkles' || service.icon_name === 'Star' ? <Sparkles className="h-6 w-6" /> :
                                                            <GraduationCap className="h-6 w-6" />}
                                            </div>
                                            <CardTitle className="text-2xl font-heading text-white group-hover:text-white transition-colors">
                                                {service.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <p className="text-slate-300 leading-relaxed group-hover:text-slate-300 transition-colors">
                                                {service.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            // Fallback if no services loaded
                            [
                                { title: "Communication Consultation", description: "We help you refine your message, delivery, and overall communication strategy, ensuring your words align with your personal or corporate brand.", icon: MessageSquareQuote },
                                { title: "Team Training & Workshops", description: "Interactive sessions for companies, institutions, and groups focused on improving team communication, collaboration, and leadership presence.", icon: Presentation },
                                { title: "One-on-One Coaching", description: "Personalised coaching to build your communication confidence and unique speaking style.", icon: Sparkles },
                                { title: "Focused Courses", description: "Deep-dive learning in key areas: public speaking, voice, articulation and storytelling, and presence.", icon: GraduationCap }
                            ].map((service, index) => (
                                <motion.div key={index} variants={staggerItem} className="hover:-translate-y-1.5 transition-transform duration-200">
                                    <Card className="h-full bg-slate-900/50 border-slate-700/50 hover:border-primary/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm">
                                        <CardHeader className="text-center flex flex-col items-center">
                                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-700/50 text-white group-hover:text-black group-hover:bg-white transition-all duration-500">
                                                <service.icon className="h-6 w-6" />
                                            </div>
                                            <CardTitle className="text-2xl font-heading text-white group-hover:text-white transition-colors">
                                                {service.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <p className="text-slate-300 leading-relaxed group-hover:text-slate-300 transition-colors">
                                                {service.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>
            </section>

            {/* What You'll Achieve */}
            <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-slate-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
                            What You&apos;ll Achieve
                        </h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Develop the communication skills to influence, inspire, and lead with confidence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {[
                            { title: "Speak with Confidence", icon: Target, desc: "Express your thoughts effortlessly with clarity and composure." },
                            { title: "Authentic Voice", icon: Mic, desc: "Develop a speaking style that feels genuine and engaging." },
                            { title: "Personal Brand", icon: Star, desc: "Show up powerfully both online and offline." },
                            { title: "Stage Presence", icon: Presentation, desc: "Present with impact on stage and camera." },
                            { title: "Persuasion Skills", icon: MessageSquareQuote, desc: "Master the art of influence and negotiation." },
                            { title: "Professional Network", icon: Users, desc: "Communicate effectively in any business setting." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/50 hover:border-primary/50 transition-all duration-200 cursor-default hover:scale-[1.02]"
                            >
                                <div className="mb-4 w-12 h-12 rounded-full bg-slate-900/80 border border-slate-600/50 flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-heading font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-300 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Other Ventures */}
            <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-black" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-center text-white mb-20"
                    >
                        Other Ventures
                    </motion.h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Trekenvyl */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-10 backdrop-blur-md hover:border-primary/50 transition-all duration-500"
                        >
                            <h3 className="text-3xl font-bold font-heading text-white mb-6">
                                Trekenvyl Footwear Company Ltd
                            </h3>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                Premium leather footwear designed for executives who value craftsmanship, comfort, and elegance. As co-founder and CEO, I lead a team creating timeless pieces for those who want to look and feel their best.
                            </p>
                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                                <a href="http://trekenvyl.com/" target="_blank" rel="noopener noreferrer">
                                    Visit Trekenvyl <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </motion.div>

                        {/* Consulting */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-10 backdrop-blur-md hover:border-primary/50 transition-all duration-500"
                        >
                            <h3 className="text-3xl font-bold font-heading text-white mb-6">
                                Consulting
                            </h3>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                I help businesses refine their marketing, communications, and strategy with a practical, people-centred approach that translates ideas into meaningful action.
                            </p>
                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                                <a href="mailto:boakyesarpong18@gmail.com">
                                    Work With Me <Briefcase className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 lg:py-32 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-8">
                            Ready to <span className="text-white">Transform Your Communication?</span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                            Let’s help you communicate with confidence, connect deeply, and lead with presence.
                        </p>
                        <Button variant="default" size="lg" className="text-base px-8 py-5 h-auto rounded-full shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500" asChild>
                            <Link href="/booking">
                                Book a Consultation
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </motion.main>
    );
}
