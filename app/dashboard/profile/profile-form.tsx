"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Camera, Loader2, Save } from "lucide-react";
import { updateProfile } from "./actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileFormProps {
    user: any;
    profile: any;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result.error) {
            // Error handled by server action
        } else {
            // Success
            // router.refresh(); // Server action already revalidates, but explicit refresh ensures client sync
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                {/* Avatar Display */}
                <div className="relative">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white/10 bg-black relative">
                        <div className="h-full w-full flex items-center justify-center bg-white/20">
                            <User className="h-12 w-12 text-white" />
                        </div>
                    </div>
                </div>

                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white mb-1">{profile?.full_name || 'Student'}</h2>
                    <p className="text-slate-400">{user.email}</p>
                    <p className="text-xs text-slate-500 mt-2">Member since {new Date(user.created_at).getFullYear()}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            name="full_name"
                            defaultValue={profile?.full_name || ''}
                            className="pl-10 bg-black/20 border-white/10 text-white focus:border-white/50"
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-slate-300">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            defaultValue={user.email || ''}
                            className="pl-10 bg-black/40 border-white/5 text-slate-400 cursor-not-allowed"
                            readOnly
                            disabled
                        />
                    </div>
                    <p className="text-xs text-slate-600">Email cannot be changed.</p>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-white hover:bg-neutral-200 text-black font-bold min-w-[120px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
