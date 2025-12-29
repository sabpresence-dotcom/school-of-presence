"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { changePassword } from "./actions";

export function SecurityForm() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setMessage(null);

        const result = await changePassword(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setIsExpanded(false); // Close form on success
            // Optional: reset form
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Security</h3>
                    <p className="text-sm text-slate-400">Protect your account</p>
                </div>
            </div>

            <div className="space-y-4">
                {!isExpanded ? (
                    <Button
                        variant="outline"
                        onClick={() => setIsExpanded(true)}
                        className="w-full justify-start border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                    </Button>
                ) : (
                    <form action={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <Input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                required
                                minLength={6}
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                            <Button type="submit" variant="default" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setIsExpanded(false);
                                    setMessage(null);
                                }}
                                className="text-slate-400 hover:text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                {/* Success message shown even when collapsed if just finished */}
                {!isExpanded && message?.type === 'success' && (
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-400 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Password updated successfully
                    </div>
                )}
            </div>
        </div>
    );
}
