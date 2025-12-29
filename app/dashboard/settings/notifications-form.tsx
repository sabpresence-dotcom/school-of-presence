"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Loader2 } from "lucide-react";
import { updateNotifications } from "./actions";
import { Button } from "@/components/ui/button";

interface NotificationsFormProps {
    profile: any;
}

export function NotificationsForm({ profile }: NotificationsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    // Optimistic state
    const [emailNotifs, setEmailNotifs] = useState(profile?.email_notifications ?? true);
    const [marketingNotifs, setMarketingNotifs] = useState(profile?.marketing_updates ?? false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        if (emailNotifs) formData.append("email_notifications", "on");
        if (marketingNotifs) formData.append("marketing_updates", "on");

        await updateNotifications(formData);
        setIsLoading(false);
    };

    // Auto-save wrapper or manual save? 
    // Let's do manual save for clarity and valid feedback, or auto-save on toggle?
    // User requested "functionality", manual save is often safer/clearer for settings.
    // Actually, typical settings pages auto-save toggles. Let's do auto-save on toggle change.

    const handleToggle = async (type: 'email' | 'marketing', value: boolean) => {
        // Update local state immediately (optimistic)
        if (type === 'email') setEmailNotifs(value);
        else setMarketingNotifs(value);

        // Trigger update
        const formData = new FormData();
        // Use the *new* value for the changed one, and *current* state for the other
        // Note: state updates are async, so use the values passed in or current refs.
        // Safer way:
        const newEmail = type === 'email' ? value : emailNotifs;
        const newMarketing = type === 'marketing' ? value : marketingNotifs;

        if (newEmail) formData.append("email_notifications", "on");
        if (newMarketing) formData.append("marketing_updates", "on");

        // Fire and forget (or handle error toast)
        // Ideally show a small "Saved" indicator
        await updateNotifications(formData);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                    <p className="text-sm text-slate-400">Manage how we contact you</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="email-notifs" className="text-slate-200 block">Email Notifications</Label>
                        <p className="text-xs text-slate-500">Receive updates about your course progress</p>
                    </div>
                    <Switch
                        id="email-notifs"
                        checked={emailNotifs}
                        onCheckedChange={(checked) => handleToggle('email', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails" className="text-slate-200 block">Marketing Updates</Label>
                        <p className="text-xs text-slate-500">Receive news about new courses and features</p>
                    </div>
                    <Switch
                        id="marketing-emails"
                        checked={marketingNotifs}
                        onCheckedChange={(checked) => handleToggle('marketing', checked)}
                    />
                </div>
            </div>
        </div>
    );
}
