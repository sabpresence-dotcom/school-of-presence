'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Course } from '@/lib/types';
import Image from 'next/image';
import { AuthModal } from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
    course: Course;
    user: { id: string; email: string } | null;
    isOwned: boolean;
}

export function CourseCard({ course, user, isOwned }: CourseCardProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const router = useRouter();

    const handleAction = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            setShowAuthModal(true);
        }
        // If user is logged in, the Link or Button default action will proceed.
    };

    const getButtonConfig = () => {
        if (!user) {
            return {
                text: "Buy Course",
                href: "#",
                onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    setShowAuthModal(true);
                },
                variant: "default" as const
            };
        }
        if (isOwned) {
            return {
                text: "View Course",
                href: `/dashboard/courses/${course.id}`,
                onClick: undefined,
                variant: "default" as const
            };
        }
        return {
            text: "Buy Course",
            href: `/courses/${course.id}`,
            onClick: undefined,
            variant: "default" as const
        };
    };

    const config = getButtonConfig();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="h-full will-change-transform"
        >
            <Card className="h-full glass-card border-white/5 hover:border-white/50 transition-all duration-500 group flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-white/5 backdrop-blur-md">
                {/* Thumbnail Container */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />

                    {(() => {
                        const getThumbnail = (url: string | null) => {
                            if (!url) return null;
                            if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com')) {
                                let videoId = '';
                                if (url.includes('/embed/')) {
                                    videoId = url.split('/embed/')[1];
                                } else if (url.includes('v=')) {
                                    videoId = url.split('v=')[1];
                                } else {
                                    videoId = url.split('/').pop() || '';
                                }
                                const cleanId = videoId?.split('?')[0];
                                return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
                            }
                            return url;
                        };

                        const thumb = getThumbnail(course.thumbnail_url);

                        return thumb ? (
                            <Image
                                src={thumb}
                                alt={course.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-slate-900 group-hover:bg-slate-800 transition-colors duration-500">
                                <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:border-white/50 transition-all duration-500 shadow-lg shadow-white/5">
                                    <Play className="h-8 w-8 text-white ml-1" />
                                </div>
                            </div>
                        );
                    })()}

                    {/* Price Tag */}
                    {!isOwned && (
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/30 px-4 py-1.5 rounded-full shadow-lg shadow-black/20 group-hover:border-white/60 transition-colors duration-300">
                                <span className="text-white font-bold font-heading tracking-wide text-sm">GHS {(course.price || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                    {isOwned && (
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/30 px-4 py-1.5 rounded-full shadow-lg shadow-black/20">
                                <span className="text-green-400 font-bold font-heading tracking-wide text-sm flex items-center gap-2">Owned</span>
                            </div>
                        </div>
                    )}
                </div>

                <CardHeader className="relative z-20 -mt-8 pt-0 px-8">
                    <CardTitle className="text-2xl sm:text-3xl font-heading font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300 leading-tight">
                        {course.title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow px-8 pt-2">
                    <p className="text-slate-300 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors duration-300 font-light text-base">
                        {course.description}
                    </p>
                </CardContent>

                <CardFooter className="px-8 pb-8 pt-4">
                    <Button
                        variant={config.variant}
                        className="w-full bg-white/5 hover:bg-white hover:text-black text-white border border-white/10 hover:border-white transition-all duration-300 font-heading tracking-wider uppercase text-sm py-6"
                        asChild={!config.onClick}
                        onClick={config.onClick}
                    >
                        {config.onClick ? (
                            <span>{config.text}</span>
                        ) : (
                            <a href={config.href}>
                                {config.text}
                            </a>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    setShowAuthModal(false);
                    router.refresh();
                }}
            />
        </motion.div>
    );
}
