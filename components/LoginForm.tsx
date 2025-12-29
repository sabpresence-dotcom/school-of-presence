'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next');

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            role: 'student',
                        },
                    ]);

                // Profile creation is handled by database trigger
            }

            // If session exists immediately (email confirmation disabled), redirect
            if (data.session) {
                router.push('/dashboard?welcome=true');
                router.refresh();
                return;
            }

            // Show success message if email confirmation is required
            setSuccessMessage("Account created! Please check your email to confirm your signup.");
            setIsLogin(true); // Switch back to login tab
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push(next ? next : '/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Glass Card */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-blue-950/50" />

            <div className="relative p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold font-heading text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-400">
                        {isLogin ? 'Enter your details to access your account' : 'Start your journey with us today'}
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex p-1 bg-slate-900/60 rounded-lg mb-6 border border-slate-700/50">
                    <button
                        onClick={() => { setIsLogin(true); setError(null); setSuccessMessage(null); }}
                        className={cn(
                            "flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-300",
                            isLogin ? "bg-white text-black shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(null); setSuccessMessage(null); }}
                        className={cn(
                            "flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-300",
                            !isLogin ? "bg-white text-black shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form
                            key="signin"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSignIn}
                            className="space-y-5"
                        >
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    {successMessage}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        onBlur={(e) => {
                                            const emailValue = e.target.value;
                                            if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                                                setError('Please enter a valid email address');
                                            }
                                        }}
                                        required
                                        className={`pl-11 sm:pl-10 bg-slate-900/60 border-slate-700/50 focus:border-blue-400/50 text-white placeholder:text-slate-600 h-12 rounded-xl transition-all ${error && error.includes('email') ? 'border-red-500/50 focus:border-red-500' : ''
                                            }`}
                                        autoComplete="email"
                                        aria-invalid={!!(error && error.includes('email'))}
                                        aria-describedby={error && error.includes('email') ? 'email-error' : undefined}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        onBlur={(e) => {
                                            const passwordValue = e.target.value;
                                            if (passwordValue && passwordValue.length < 6) {
                                                setError('Password must be at least 6 characters');
                                            }
                                        }}
                                        required
                                        className={`pl-10 pr-10 bg-black/20 border-white/10 focus:border-white/50 text-white placeholder:text-slate-600 h-12 rounded-xl transition-all ${error && error.includes('password') ? 'border-red-500/50 focus:border-red-500' : ''
                                            }`}
                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                        aria-invalid={!!(error && error.includes('password'))}
                                        aria-describedby={error && error.includes('password') ? 'password-error' : undefined}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button type="submit" variant="default" className="w-full h-12 text-lg font-heading tracking-wide rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSignUp}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="fullname" className="text-slate-300">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                                    <Input
                                        id="fullname"
                                        placeholder="Your Name"
                                        value={fullName}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        onBlur={(e) => {
                                            const nameValue = e.target.value;
                                            if (nameValue && nameValue.trim().length < 2) {
                                                setError('Full name must be at least 2 characters');
                                            }
                                        }}
                                        required
                                        className={`pl-11 sm:pl-10 bg-slate-900/60 border-slate-700/50 focus:border-blue-400/50 text-white placeholder:text-slate-600 h-12 rounded-xl transition-all ${error && error.includes('name') ? 'border-red-500/50 focus:border-red-500' : ''
                                            }`}
                                        autoComplete="name"
                                        aria-invalid={!!(error && error.includes('name'))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email" className="text-slate-300">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        onBlur={(e) => {
                                            const emailValue = e.target.value;
                                            if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                                                setError('Please enter a valid email address');
                                            }
                                        }}
                                        required
                                        className={`pl-11 sm:pl-10 bg-slate-900/60 border-slate-700/50 focus:border-blue-400/50 text-white placeholder:text-slate-600 h-12 rounded-xl transition-all ${error && error.includes('email') ? 'border-red-500/50 focus:border-red-500' : ''
                                            }`}
                                        autoComplete="email"
                                        aria-invalid={!!(error && error.includes('email'))}
                                        aria-describedby={error && error.includes('email') ? 'signup-email-error' : undefined}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <Input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        onBlur={(e) => {
                                            const passwordValue = e.target.value;
                                            if (passwordValue && passwordValue.length < 6) {
                                                setError('Password must be at least 6 characters');
                                            }
                                        }}
                                        required
                                        className={`pl-10 pr-10 bg-black/20 border-white/10 focus:border-white/50 text-white placeholder:text-slate-600 h-12 rounded-xl transition-all ${error && error.includes('password') ? 'border-red-500/50 focus:border-red-500' : ''
                                            }`}
                                        autoComplete="new-password"
                                        aria-invalid={!!(error && error.includes('password'))}
                                        aria-describedby={error && error.includes('password') ? 'signup-password-error' : undefined}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <span className="flex-shrink-0">⚠️</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <Button type="submit" variant="default" className="w-full h-12 text-lg font-heading tracking-wide rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                                    <span className="flex items-center">
                                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
