'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/dashboard/settings`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[400px] bg-slate-950 border-slate-700/50 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading text-center text-primary">
                        Reset Password
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        {success ? 'Check your email' : 'Enter your email to receive a reset link'}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="text-center py-8 space-y-4">
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Reset Link Sent!</h3>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        <p className="text-slate-400">
                            We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                            Click the link in the email to create a new password.
                        </p>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="w-full border-white/10 hover:bg-white/5 text-white"
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                                <Input
                                    id="reset-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="pl-14 bg-white/5 border-white/10 text-white"
                                    style={{ paddingLeft: '3.5rem' }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
