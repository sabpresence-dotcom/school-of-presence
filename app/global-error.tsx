'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
        console.error('Global Error:', error);
    }

    return (
        <html>
            <body className="bg-background text-foreground p-10 font-sans">
                <div className="max-w-2xl mx-auto border border-red-500 rounded-lg p-8 bg-red-950/30">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Critical System Error</h2>
                    <p className="text-xl mb-4 text-zinc-300">The application encountered a fatal error.</p>

                    <div className="bg-black/50 p-4 rounded overflow-auto mb-6 border border-white/10">
                        <p className="font-mono text-red-300 whitespace-pre-wrap">
                            {error.message || 'Unknown Error'}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-zinc-500 mt-2">Digest: {error.digest}</p>
                        )}
                        {error.stack && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-zinc-500 text-sm">Stack Trace</summary>
                                <pre className="text-xs text-zinc-600 mt-2 overflow-auto">
                                    {error.stack}
                                </pre>
                            </details>
                        )}
                    </div>

                    <button
                        onClick={() => reset()}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="Try again to reload the application"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
