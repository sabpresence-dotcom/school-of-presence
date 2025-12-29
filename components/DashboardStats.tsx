import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock } from 'lucide-react';

interface DashboardStatsProps {
    coursesCount: number;
}

export function DashboardStats({ coursesCount }: DashboardStatsProps) {
    const stats = [
        {
            label: 'Courses Enrolled',
            value: coursesCount,
            icon: BookOpen,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20'
        },

        {
            label: 'Hours Learned',
            value: '0', // Placeholder for now
            icon: Clock,
            color: 'text-white',
            bg: 'bg-white/10',
            border: 'border-slate-700/60'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.label} className={`bg-slate-800/50 ${stat.border} border`}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-white font-heading">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
