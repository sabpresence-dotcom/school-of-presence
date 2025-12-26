import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const TiktokIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/courses', label: 'Courses' },
];

const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/andrews-boakye-sarpong-a76206218', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/andrewsboakyesarpong?igsh=MXFqenlqYXZydjBwMA==', label: 'Instagram' },
    { icon: Twitter, href: 'https://x.com/ANDREWSBOAKYES1?t=TuVU6hrFWbz3Hu6nbL-1tg&s=09', label: 'X (Twitter)' },
    { icon: Youtube, href: 'https://youtube.com/@sarpong_andrews?si=oZ5DJq3i-XqDDLn-', label: 'YouTube' },
    { icon: TiktokIcon, href: 'https://www.tiktok.com/@andrewsboakyesarp?_r=1&_t=ZM-920XslR8Fh2', label: 'TikTok' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-700/50 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold font-heading bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent tracking-widest">
                            SARPONG ANDREWS BOAKYE
                        </h3>
                        <p className="text-slate-300 max-w-md leading-relaxed">
                            Communication Coach & Entrepreneur dedicated to helping leaders speak with confidence and clarity.
                        </p>
                        <div className="flex justify-center space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-400/50 hover:bg-slate-700/50 transition-all duration-300"
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-heading font-bold text-white uppercase tracking-widest">Contact</h4>
                        <div className="space-y-2 text-slate-300 text-sm">
                            <p>Kumasi, Ghana</p>
                            <a href="mailto:boakyesarpong18@gmail.com" className="block hover:text-white transition-colors">boakyesarpong18@gmail.com</a>
                            <a href="tel:+233548623125" className="block hover:text-white transition-colors">+233 54 862 3125</a>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 bg-slate-700/50" />

                <div className="flex flex-col items-center gap-4 text-slate-500 text-xs uppercase tracking-wider text-center">
                    <p>&copy; {currentYear} Sarpong Andrews Boakye. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
