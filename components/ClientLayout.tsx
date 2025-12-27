'use client';

import { Preloader } from '@/components/Preloader';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <Preloader>
            {children}
        </Preloader>
    );
}
