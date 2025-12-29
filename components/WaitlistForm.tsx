'use client';

import { useState } from 'react';
import { joinWaitlist } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const result = await joinWaitlist(email);

        if (result.success) {
            setMessage('Thank you! You\'ve been added to the waitlist.');
            setEmail('');
        } else {
            setMessage(result.error || 'An error occurred. Please try again.');
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <div>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-400 h-12 text-lg transition-colors"
                />
            </div>
            <Button
                type="submit"
                variant="default"
                className="w-full h-12 text-lg font-heading tracking-wider shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
                size="lg"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </Button>
            {message && (
                <p className={`text-center text-sm ${message.includes('Thank you') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
