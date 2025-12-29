'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if user has a valid recovery session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsValidSession(!!session);
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            setSuccess(true);
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidSession === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isValidSession) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Invalid or Expired Link</h1>
                    <p className="text-slate-400">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Button onClick={() => router.push('/login')} className="w-full">
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Password Updated!</h1>
                            <p className="text-slate-400">
                                Your password has been successfully changed. Redirecting to dashboard...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="h-7 w-7 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                                <p className="text-slate-400">Enter your new password below</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        minLength={6}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        minLength={6}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
