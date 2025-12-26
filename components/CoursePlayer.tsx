'use client';

import { useState, useEffect, ComponentType } from 'react';
import { Lesson } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, FileText, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as ComponentType<Record<string, unknown>>;

interface CoursePlayerProps {
    courseId: string;
    courseTitle: string;
    lessons: Lesson[];
    isPurchased: boolean;
    commitmentPeriod: 14 | 28;
    progressData: {
        completedCount: number;
        totalCount: number;
        minutesWatched: number;
        isCompleted: boolean;
    };
}

export function CoursePlayer({ courseId, courseTitle, lessons, isPurchased, commitmentPeriod, progressData }: CoursePlayerProps) {
    const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0]);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update selected lesson when lessons change (e.g., commitment period switch)
    useEffect(() => {
        if (lessons.length > 0) {
            setSelectedLesson(lessons[0]);
        }
    }, [lessons]);

    const handlePeriodChange = (period: 14 | 28) => {
        router.push(`/courses/${courseId}?period=${period}`);
    };

    if (!isMounted) {
        return null;
    }

    if (!lessons.length) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-300">No lessons available for this course yet.</p>
            </div>
        );
    }

    const progressPercentage = progressData.totalCount > 0
        ? Math.round((progressData.completedCount / progressData.totalCount) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">
                    {courseTitle}
                </h1>

                {/* Commitment Period Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300 mr-2">Commitment:</span>
                    <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => handlePeriodChange(14)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                commitmentPeriod === 14
                                    ? "bg-white text-black"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            14 Days
                        </button>
                        <button
                            onClick={() => handlePeriodChange(28)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                commitmentPeriod === 28
                                    ? "bg-white text-black"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            28 Days
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {isPurchased && progressData.totalCount > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">
                            {progressData.completedCount} of {progressData.totalCount} lessons completed
                        </span>
                        <span className="text-sm font-medium text-white">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)] min-h-[600px]">
                {/* Main Content Area (Left/Top) */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
                        {isPurchased ? (
                            <ReactPlayer
                                url={selectedLesson.video_url}
                                width="100%"
                                height="100%"
                                controls
                                playing={false}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10">
                                <Lock className="w-12 h-12 text-slate-400 mb-4" />
                                <p className="text-white font-medium text-lg">Purchase to unlock this lesson</p>
                            </div>
                        )}
                    </div>

                    {/* Activity Card */}
                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl font-heading text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-white" />
                                Day {selectedLesson.day_number} of {lessons.length}: Daily Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <h3 className="text-lg font-bold text-white">{selectedLesson.title}</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {selectedLesson.description}
                            </p>
                            {selectedLesson.resource_url && (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-black gap-2"
                                        asChild
                                    >
                                        <a href={selectedLesson.resource_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4" />
                                            Open Activity Worksheet
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-1 h-full">
                    <Card className="h-full bg-slate-950 border-slate-700/50 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-heading text-white">Course Schedule</CardTitle>
                        </CardHeader>
                        <Separator className="bg-white/10" />
                        <CardContent className="flex-1 p-0 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-2">
                                    {lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-lg flex items-start gap-4 transition-all duration-300 border",
                                                selectedLesson.id === lesson.id
                                                    ? "bg-white/10 border-white/50"
                                                    : "bg-white/5 border-transparent hover:bg-white/10"
                                            )}
                                        >
                                            <div className="mt-1">
                                                {lesson.day_number <= progressData.completedCount ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : selectedLesson.id === lesson.id ? (
                                                    <PlayCircle className="w-5 h-5 text-white" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center">
                                                        <span className="text-[10px] text-slate-500">{lesson.day_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className={cn(
                                                    "font-medium text-sm mb-1",
                                                    selectedLesson.id === lesson.id ? "text-white" : "text-slate-400"
                                                )}>
                                                    Day {lesson.day_number}
                                                </p>
                                                <p className="text-sm text-slate-300 line-clamp-1">
                                                    {lesson.title}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
