import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
    try {
        const supabase = createServerClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            redirect('/login');
        }

        // Fetch profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        // Gracefully handle missing profile (if trigger didn't run)
        const effectiveProfile = profile || { full_name: 'Student', role: 'student' };

        return (
            <div className="min-h-screen bg-background pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <DashboardSidebar />

                        <div className="flex-1">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold font-heading text-white mb-2">My Profile</h1>
                                <p className="text-slate-400">Manage your personal information</p>
                            </div>

                            <ProfileForm user={user} profile={effectiveProfile} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Unhandled Profile Page Error:', error);
        }
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-white text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                    <p className="text-slate-400 mb-4">We couldn&apos;t load your profile. Please try refreshing the page.</p>
                    <div className="p-4 bg-slate-900 rounded text-left text-xs text-red-400 overflow-auto border border-red-500/20">
                        <p className="font-mono break-all">{error?.message || JSON.stringify(error)}</p>
                    </div>
                </div>
            </div>
        );
    }
}
