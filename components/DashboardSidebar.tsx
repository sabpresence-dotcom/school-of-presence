'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Settings, LogOut, User, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';

const links = [
    { href: '/dashboard', label: 'My Learning', icon: BookOpen },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
        <>
            <div className="space-y-2">
                <h2 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Menu
                </h2>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onLinkClick}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-slate-800/60 text-white border border-slate-700/60"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-8 border-t border-white/10">
                <button
                    onClick={() => {
                        onLinkClick?.();
                        handleSignOut();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-black shadow-lg hover:bg-slate-200 transition-colors"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="text-white">Dashboard</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <NavContent onLinkClick={() => setIsOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="w-64 shrink-0 hidden lg:block">
                <div className="sticky top-24 space-y-8">
                    <NavContent />
                </div>
            </div>
        </>
    );
}
