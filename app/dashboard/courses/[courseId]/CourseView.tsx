"use client";

import { Play } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Course } from '@/lib/types';

interface CourseViewProps {
    course: Course;
}

export default function CourseView({ course }: CourseViewProps) {

    const [currentVideoId, setCurrentVideoId] = useState(course.video_url);

    // If we had multiple lessons, we would switch state here. 
    // Since we only have one "course" record representing the lesson for now, 
    // re-clicking can just restart or ensure it's selected.

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div key={currentVideoId}> {/* Key forces re-render if ID changes */}
                            <VideoPlayer videoId={currentVideoId} />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold font-heading text-white">
                                {course.title}
                            </h1>
                            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {course.long_description || course.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Playlist */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 flex flex-col h-[calc(100vh-8rem)] rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-black/20">
                                <h3 className="font-bold text-white">Course Content</h3>
                                <p className="text-sm text-slate-400">1 Lesson • {course.duration || 0}m total</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                <button
                                    onClick={() => setCurrentVideoId(course.video_url)}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                                        "bg-primary/10 border border-primary/20"
                                    )}
                                >
                                    <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <Play className="h-3 w-3 text-primary-foreground fill-current" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-sm line-clamp-2">
                                            {course.title}
                                        </div>
                                        <div className="text-xs text-primary mt-1">
                                            Click to Play
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
