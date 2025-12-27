'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { handlePurchaseSuccess } from '@/app/actions/payment';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/AuthModal';
import type { PaystackResponse } from '@/lib/paystack-types';

interface BuyButtonProps {
    courseId: string;
    price: number;
    title: string;
    user: { id: string; email: string } | null;
    className?: string;
}

export default function BuyButton({ courseId, price, title, user, className }: BuyButtonProps) {
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Only run on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSuccess = async (reference: PaystackResponse) => {
        setIsProcessing(true);
        try {
            const result = await handlePurchaseSuccess(courseId, reference.reference || reference.data?.reference || '');
            if (result.success) {
                router.refresh(); // Invalidate client-side cache
                router.push(`/dashboard/courses/${courseId}`);
            } else {
                alert(`Payment successful but failed to record purchase: ${result.error}`);
            }
        } catch (error) {
            alert('An error occurred while processing your purchase. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    const onClose = () => {
        // Payment modal closed
    };

    const handleClick = async () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
            alert('Payment system configuration error');
            return;
        }

        // Dynamically import and initialize Paystack only on client side
        try {
            const { usePaystackPayment } = await import('react-paystack');

            const config = {
                reference: (new Date()).getTime().toString(),
                email: user?.email || '',
                amount: price * 100,
                publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
                currency: 'GHS',
                metadata: {
                    courseId,
                    title,
                    custom_fields: [
                        {
                            display_name: "Course Title",
                            variable_name: "course_title",
                            value: title
                        }
                    ]
                }
            };

            // Use the PaystackButton approach instead of the hook
            const handler = window.PaystackPop?.setup({
                key: config.publicKey,
                email: config.email,
                amount: config.amount,
                currency: config.currency,
                ref: config.reference,
                metadata: config.metadata,
                callback: (response: PaystackResponse) => {
                    onSuccess(response);
                },
                onClose: () => {
                    onClose();
                },
            });

            if (handler) {
                handler.openIframe();
            } else {
                // Fallback: load Paystack script and try again
                const script = document.createElement('script');
                script.src = 'https://js.paystack.co/v1/inline.js';
                script.async = true;
                script.onload = () => {
                    if (window.PaystackPop) {
                        const newHandler = window.PaystackPop.setup({
                            key: config.publicKey,
                            email: config.email,
                            amount: config.amount,
                            currency: config.currency,
                            ref: config.reference,
                            metadata: config.metadata,
                            callback: (response: PaystackResponse) => {
                                onSuccess(response);
                            },
                            onClose: () => {
                                onClose();
                            },
                        });
                        newHandler.openIframe();
                    }
                };
                document.body.appendChild(script);
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    // Show loading state until mounted
    if (!isMounted) {
        return (
            <Button
                variant="default"
                className={cn("w-full", className)}
                disabled
            >
                Loading...
            </Button>
        );
    }

    return (
        <>
            <Button
                variant="default"
                className={cn("w-full", className)}
                onClick={handleClick}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Buy Now - GHS ${price.toFixed(2)}`
                )}
            </Button>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    setShowAuthModal(false);
                }}
            />
        </>
    );
}
