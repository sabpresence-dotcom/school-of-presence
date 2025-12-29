'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultTab = 'login' }: AuthModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            onSuccess();
            onClose();
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            setSuccessMessage('Account created! Please check your email to verify your account.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-slate-950 border-slate-700/50 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading text-center text-primary">
                        Welcome Back
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        Sign in to continue your purchase
                    </DialogDescription>
                </DialogHeader>

                {successMessage ? (
                    <div className="text-center py-8 space-y-4">
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Check your email</h3>
                        <p className="text-slate-400">{successMessage}</p>
                        <Button variant="outline" onClick={onClose} className="w-full border-white/10 hover:bg-white/5 text-white">
                            Close
                        </Button>
                    </div>
                ) : (
                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-white/5">
                            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4 mt-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="pl-16 bg-white/5 border-white/10 text-white"
                                            style={{ paddingLeft: '4rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="pl-16 pr-10 bg-white/5 border-white/10 text-white"
                                            style={{ paddingLeft: '4rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-500 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2" role="alert" aria-live="polite">
                                        <span className="flex-shrink-0">⚠️</span>
                                        <div>
                                            <p className="font-medium mb-1">{error}</p>
                                            {error.includes('Invalid login') && (
                                                <p className="text-xs text-red-300/80">Please check your email and password, or try resetting your password.</p>
                                            )}
                                            {error.includes('Email') && (
                                                <p className="text-xs text-red-300/80">Make sure you&apos;re using the email address you signed up with.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4 mt-4">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            placeholder="Your Name"
                                            required
                                            className="pl-16 bg-white/5 border-white/10 text-white"
                                            style={{ paddingLeft: '4rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="signup-email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="pl-16 bg-white/5 border-white/10 text-white"
                                            style={{ paddingLeft: '4rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="signup-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="pl-16 pr-10 bg-white/5 border-white/10 text-white"
                                            style={{ paddingLeft: '4rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-500 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2" role="alert" aria-live="polite">
                                        <span className="flex-shrink-0">⚠️</span>
                                        <div>
                                            <p className="font-medium mb-1">{error}</p>
                                            {error.includes('Invalid login') && (
                                                <p className="text-xs text-red-300/80">Please check your email and password, or try resetting your password.</p>
                                            )}
                                            {error.includes('Email') && (
                                                <p className="text-xs text-red-300/80">Make sure you&apos;re using the email address you signed up with.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    );
}
