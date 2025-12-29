"use client";

import { Lock, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState, ComponentType } from "react";

// Lazy load ReactPlayer for YouTube with type assertion to fix dynamic import typing
const ReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-950" role="status" aria-label="Loading video player">
            <Loader2 className="w-8 h-8 text-white animate-spin" aria-hidden="true" />
        </div>
    )
}) as ComponentType<Record<string, unknown>>;

interface VideoPlayerProps {
    videoId: string | null;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
    const [hasWindow, setHasWindow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setHasWindow(true);
    }, []);

    if (!videoId) {
        return (
            <div className="w-full aspect-video bg-slate-900 rounded-lg flex flex-col items-center justify-center text-gray-500 border border-slate-700/50" role="status" aria-label="Video content is locked">
                <Lock className="w-12 h-12 mb-4 opacity-50" aria-hidden="true" />
                <p className="text-sm font-medium">Content Locked</p>
            </div>
        );
    }

    const cleanId = videoId?.trim();
    // Use standard YouTube URL format
    const videoUrl = cleanId.includes("http")
        ? cleanId
        : `https://www.youtube.com/watch?v=${cleanId}`;

    return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-950">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10" role="status" aria-label="Loading video">
                    <Loader2 className="w-8 h-8 text-white animate-spin" aria-hidden="true" />
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 text-red-500" role="alert" aria-live="polite">
                    <p className="text-sm">Error loading video</p>
                    <p className="text-xs text-gray-500 mt-2">{error}</p>
                </div>
            )}
            {hasWindow && (
                <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={false}
                    onReady={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setError("Could not load video");
                    }}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    config={{
                        youtube: {
                            playerVars: { showinfo: 1 }
                        }
                    }}
                />
            )}
        </div>
    );
}

