import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { NotificationsForm } from './notifications-form';
import { SecurityForm } from './security-form';

export default async function SettingsPage() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch profile data for settings
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    // Default settings if profile missing
    const settings = profile || { email_notifications: true, marketing_updates: false };

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <DashboardSidebar />

                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold font-heading text-white mb-2">Settings</h1>
                            <p className="text-slate-400">Manage your account preferences</p>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            {/* Notifications */}
                            <NotificationsForm profile={settings} />

                            {/* Security */}
                            <SecurityForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
