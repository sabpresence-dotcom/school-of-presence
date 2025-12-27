'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookingType, BookingServiceConfig, ServiceDetails } from '@/lib/types';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, DollarSign, Loader2, Send } from 'lucide-react';

// Service configurations based on client requirements
const BOOKING_SERVICES: BookingServiceConfig[] = [
    {
        type: 'keynote',
        label: 'Keynote Speaking',
        requiresPayment: false,
        fieldType: 'textarea',
        fieldLabel: 'Theme and Expectation of Event',
        fieldPlaceholder: 'Describe the event theme and what you expect from the keynote...',
    },
    {
        type: 'masterclass',
        label: 'Masterclass',
        requiresPayment: false,
        fieldType: 'input',
        fieldLabel: 'Aspect of Communication',
        fieldPlaceholder: 'Which aspect of communication would you like to focus on?',
    },
    {
        type: 'mentoring',
        label: 'Mentoring',
        requiresPayment: false,
        fieldType: 'input',
        fieldLabel: 'Aspect (Personal Branding, Public Speaking, etc)',
        fieldPlaceholder: 'Describe the mentoring focus area...',
    },
    {
        type: 'podcast',
        label: 'Podcast Appearance',
        requiresPayment: false,
        fieldType: 'textarea',
        fieldLabel: 'Subject to be Discussed and Expectations',
        fieldPlaceholder: 'What topics would you like to discuss on your podcast?',
    },
    {
        type: 'one_on_one_coaching',
        label: 'One-on-One Coaching',
        priceUSD: 1000,
        requiresPayment: true,
        fieldType: 'checkboxes',
        checkboxOptions: [
            'Voice for Engagement',
            'Articulacy',
            'Commanding Presence',
            'Other'
        ],
    },
    {
        type: 'consultation',
        label: 'Consultation (30 mins)',
        priceUSD: 99,
        requiresPayment: true,
        requiresScheduling: true,
        fieldType: 'none',
    },
];

// Common countries list
const COUNTRIES = [
    'Ghana', 'Nigeria', 'United States', 'United Kingdom', 'Canada',
    'South Africa', 'Kenya', 'Germany', 'France', 'Australia',
    'India', 'UAE', 'Other'
];

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
    serviceType?: string;
    serviceDetails?: string;
}

export default function BookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [calComUrl, setCalComUrl] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Exchange rate hook
    const { convertToGHS, formatPrice, isLoading: rateLoading } = useExchangeRate();

    const searchParams = useSearchParams();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [serviceType, setServiceType] = useState<BookingType | ''>('');

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        if (serviceParam) {
            const validService = BOOKING_SERVICES.find(s => s.type === serviceParam);
            if (validService) {
                setServiceType(validService.type as BookingType);
            }
        }
    }, [searchParams]);

    // Service-specific fields
    const [textFieldValue, setTextFieldValue] = useState('');
    const [coachingOptions, setCoachingOptions] = useState<string[]>([]);
    const [otherNotes, setOtherNotes] = useState('');

    const selectedService = BOOKING_SERVICES.find(s => s.type === serviceType);

    // Load Paystack script on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // Real-time validation helpers
    const validateField = (field: keyof FormErrors, value: string): string | undefined => {
        switch (field) {
            case 'fullName':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return undefined;
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                return undefined;
            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                if (value.trim().length < 10) return 'Please enter a valid phone number';
                return undefined;
            case 'country':
                if (!value) return 'Country is required';
                return undefined;
            case 'serviceType':
                if (!value) return 'Please select a service';
                return undefined;
            default:
                return undefined;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        newErrors.fullName = validateField('fullName', fullName);
        newErrors.email = validateField('email', email);
        newErrors.phone = validateField('phone', phone);
        newErrors.country = validateField('country', country);
        newErrors.serviceType = validateField('serviceType', serviceType);

        // Remove undefined errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key as keyof FormErrors]) {
                delete newErrors[key as keyof FormErrors];
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle field blur for real-time validation
    const handleFieldBlur = (field: keyof FormErrors, value: string) => {
        const error = validateField(field, value);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const buildServiceDetails = (): ServiceDetails => {
        if (!selectedService) return {};

        switch (selectedService.type) {
            case 'keynote':
                return { theme_expectation: textFieldValue };
            case 'masterclass':
                return { communication_aspect: textFieldValue };
            case 'mentoring':
                return { mentoring_aspect: textFieldValue };
            case 'podcast':
                return { podcast_subject: textFieldValue };
            case 'one_on_one_coaching':
                return {
                    coaching_options: coachingOptions,
                    other_notes: coachingOptions.includes('Other') ? otherNotes : undefined
                };
            case 'consultation':
                return {};
            default:
                return {};
        }
    };

    const submitBooking = async (paymentStatus: 'paid' | 'n/a', paymentReference?: string) => {
        const serviceDetails = buildServiceDetails();
        const priceGHS = selectedService?.priceUSD ? convertToGHS(selectedService.priceUSD) : undefined;

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                country,
                serviceType,
                serviceLabel: selectedService?.label,
                serviceDetails,
                priceUSD: selectedService?.priceUSD || null,
                priceGHS: priceGHS || null,
                paymentStatus,
                paymentReference,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit booking');
        }

        return response.json();
    };

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await submitBooking('n/a');
            setSuccessMessage('Thank you for your inquiry! I will review your request and get back to you within 24-48 hours.');
            setSubmitted(true);
        } catch (error: any) {
            console.error('Booking submission error:', error);
            const errorMessage = error?.message || 'Failed to submit booking.';
            let actionableMessage = 'Please try again.';

            if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                actionableMessage = 'Please check your internet connection and try again.';
            } else if (errorMessage.includes('timeout')) {
                actionableMessage = 'The request took too long. Please try again in a moment.';
            } else if (errorMessage.includes('400') || errorMessage.includes('validation')) {
                actionableMessage = 'Please check all fields are filled correctly.';
            } else if (errorMessage.includes('500') || errorMessage.includes('server')) {
                actionableMessage = 'Our server encountered an issue. Please try again later or contact support.';
            }

            setErrors({ ...errors, serviceType: `${errorMessage} ${actionableMessage}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayment = async () => {
        if (!validateForm()) return;
        if (!selectedService?.priceUSD) return;

        if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
            alert('Payment system configuration error');
            return;
        }

        setIsPaymentProcessing(true);

        try {
            const amountInKobo = Math.round(convertToGHS(selectedService.priceUSD) * 100);
            const reference = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const handler = (window as any).PaystackPop?.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: email,
                amount: amountInKobo,
                currency: 'GHS',
                ref: reference,
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Service",
                            variable_name: "service",
                            value: selectedService.label
                        },
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: fullName
                        }
                    ]
                },
                callback: (response: { reference: string }) => {
                    // Payment successful - use IIFE to handle async operations
                    (async () => {
                        try {
                            const data = await submitBooking('paid', response.reference);

                            if (selectedService.type === 'consultation' && data.calComUrl) {
                                // Redirect to Cal.com for scheduling
                                setCalComUrl(data.calComUrl);
                                setSuccessMessage('Payment successful! Please schedule your consultation session.');
                                setSubmitted(true);
                                // Auto-redirect after a short delay
                                setTimeout(() => {
                                    window.open(data.calComUrl, '_blank');
                                }, 2000);
                            } else {
                                // Coaching - show success message
                                setSuccessMessage('Payment successful! We will contact you shortly to schedule your coaching sessions.');
                                setSubmitted(true);
                            }
                        } catch (error: any) {
                            console.error('Post-payment error:', error);
                            const errorMessage = error?.message || 'Unknown error';
                            alert(`Payment was successful (Reference: ${response.reference}), but we encountered an issue recording your booking.\n\nPlease contact support with this reference number, and we'll resolve this immediately.\n\nError: ${errorMessage}`);
                        } finally {
                            setIsPaymentProcessing(false);
                        }
                    })();
                },
                onClose: function () {
                    setIsPaymentProcessing(false);
                },
            });

            if (handler) {
                handler.openIframe();
            } else {
                alert('Payment system is loading. Please try again in a moment.');
                setIsPaymentProcessing(false);
            }
        } catch (error: any) {
            console.error('Payment initialization error:', error);
            const errorMessage = error?.message || 'Unknown error';
            let actionableMessage = 'Please try again.';

            if (errorMessage.includes('PaystackPop') || errorMessage.includes('script')) {
                actionableMessage = 'Payment system is still loading. Please wait a moment and try again.';
            } else if (errorMessage.includes('network')) {
                actionableMessage = 'Please check your internet connection and try again.';
            }

            alert(`Failed to initialize payment: ${errorMessage}\n\n${actionableMessage}`);
            setIsPaymentProcessing(false);
        }
    };

    const handleCheckboxChange = (option: string) => {
        setCoachingOptions(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPhone('');
        setCountry('');
        setServiceType('');
        setTextFieldValue('');
        setCoachingOptions([]);
        setOtherNotes('');
        setErrors({});
        setCalComUrl(null);
        setSuccessMessage('');
        setSubmitted(false);
    };

    const handleScheduleClick = () => {
        if (calComUrl) {
            window.open(calComUrl, '_blank');
        }
    };

    // Success state
    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-heading text-white">
                    {selectedService?.requiresPayment ? 'Payment Successful!' : 'Inquiry Received!'}
                </h3>
                <p className="text-slate-400 max-w-md mx-auto text-lg">
                    {successMessage}
                </p>

                {/* Schedule Button - Cal.com Redirect */}
                {calComUrl && (
                    <div className="space-y-4 mt-8">
                        <p className="text-white text-sm flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Click below to schedule your session
                        </p>
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleScheduleClick}
                            className="shadow-lg shadow-white/5 hover:shadow-white/10 transition-all duration-300"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Schedule Your Consultation
                        </Button>
                    </div>
                )}

                <Button variant="outline" onClick={resetForm} className="mt-4 border-white/20 text-white hover:bg-white/10">
                    Submit Another Request
                </Button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={selectedService?.requiresPayment ? (e) => { e.preventDefault(); } : handleInquirySubmit} className="space-y-8">
            {/* Service Selection */}
            <div className="space-y-3">
                <Label className="text-white text-lg font-heading">What would you like to book?</Label>
                <Select value={serviceType} onValueChange={(value) => {
                    setServiceType(value as BookingType);
                    setTextFieldValue('');
                    setCoachingOptions([]);
                    setOtherNotes('');
                }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-white/50 h-14 text-base">
                        <SelectValue placeholder="Select a service..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800 text-white max-h-[300px]">
                        {BOOKING_SERVICES.map((service) => (
                            <SelectItem
                                key={service.type}
                                value={service.type}
                                className="py-3 focus:bg-white/10 focus:text-white"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>{service.label}</span>
                                    {service.priceUSD && (
                                        <span className="ml-4 text-white font-semibold">
                                            ${service.priceUSD}
                                        </span>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.serviceType && (
                    <p className="text-red-400 text-sm flex items-center gap-1" role="alert">
                        <span>•</span>
                        {errors.serviceType}
                    </p>
                )}
            </div>

            {/* Dynamic Price Display with GHS Conversion */}
            <AnimatePresence>
                {selectedService?.priceUSD && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 border border-white/20 rounded-xl p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2 text-white">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-heading">Service Price</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg sm:text-2xl font-bold text-white">
                                {rateLoading ? `$${selectedService.priceUSD}` : formatPrice(selectedService.priceUSD)}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Personal Information */}
            <div className="space-y-6">
                <h4 className="text-lg font-heading text-white border-b border-white/10 pb-2">
                    Your Information
                </h4>

                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            // Clear error when user starts typing
                            if (errors.fullName) {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.fullName;
                                    return newErrors;
                                });
                            }
                        }}
                        onBlur={(e) => handleFieldBlur('fullName', e.target.value)}
                        className={`bg-white/5 border-white/10 text-white focus:border-white/50 h-12 ${errors.fullName ? 'border-red-500/50 focus:border-red-500' : ''
                            }`}
                        placeholder="Enter your full name"
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                    {errors.fullName && (
                        <p id="fullName-error" className="text-red-400 text-sm flex items-center gap-1" role="alert">
                            <span>•</span>
                            {errors.fullName}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.email;
                                        return newErrors;
                                    });
                                }
                            }}
                            onBlur={(e) => handleFieldBlur('email', e.target.value)}
                            className={`bg-white/5 border-white/10 text-white focus:border-white/50 h-12 ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''
                                }`}
                            placeholder="you@example.com"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                            <p id="email-error" className="text-red-400 text-sm flex items-center gap-1" role="alert">
                                <span>•</span>
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.phone;
                                        return newErrors;
                                    });
                                }
                            }}
                            onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                            className={`bg-white/5 border-white/10 text-white focus:border-white/50 h-12 ${errors.phone ? 'border-red-500/50 focus:border-red-500' : ''
                                }`}
                            placeholder="+233 XX XXX XXXX"
                            autoComplete="tel"
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                        {errors.phone && (
                            <p id="phone-error" className="text-red-400 text-sm flex items-center gap-1" role="alert">
                                <span>•</span>
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country" className="text-slate-300">Country</Label>
                    <Select
                        value={country}
                        onValueChange={(value) => {
                            setCountry(value);
                            if (errors.country) {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.country;
                                    return newErrors;
                                });
                            }
                        }}
                    >
                        <SelectTrigger
                            className={`bg-white/5 border-white/10 text-white focus:border-white/50 h-12 ${errors.country ? 'border-red-500/50 focus:border-red-500' : ''
                                }`}
                            aria-invalid={!!errors.country}
                            aria-describedby={errors.country ? 'country-error' : undefined}
                        >
                            <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-800 text-white">
                            {COUNTRIES.map((c) => (
                                <SelectItem key={c} value={c} className="focus:bg-white/10 focus:text-white">
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.country && (
                        <p id="country-error" className="text-red-400 text-sm flex items-center gap-1" role="alert">
                            <span>•</span>
                            {errors.country}
                        </p>
                    )}
                </div>
            </div>

            {/* Service-Specific Fields */}
            <AnimatePresence>
                {selectedService && selectedService.fieldType !== 'none' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        {/* Textarea or Input field */}
                        {(selectedService.fieldType === 'textarea' || selectedService.fieldType === 'input') && (
                            <div className="space-y-2">
                                <Label htmlFor="serviceField" className="text-slate-300">
                                    {selectedService.fieldLabel}
                                </Label>
                                {selectedService.fieldType === 'textarea' ? (
                                    <Textarea
                                        id="serviceField"
                                        value={textFieldValue}
                                        onChange={(e) => setTextFieldValue(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white focus:border-white/50 min-h-[120px] resize-none"
                                        placeholder={selectedService.fieldPlaceholder}
                                    />
                                ) : (
                                    <Input
                                        id="serviceField"
                                        value={textFieldValue}
                                        onChange={(e) => setTextFieldValue(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white focus:border-white/50 h-12"
                                        placeholder={selectedService.fieldPlaceholder}
                                    />
                                )}
                            </div>
                        )}

                        {/* Checkboxes for Coaching */}
                        {selectedService.fieldType === 'checkboxes' && selectedService.checkboxOptions && (
                            <div className="space-y-4">
                                <Label className="text-slate-300">Select your coaching focus areas:</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedService.checkboxOptions.map((option) => (
                                        <label
                                            key={option}
                                            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${coachingOptions.includes(option)
                                                ? 'bg-white/10 border-white/50 text-white'
                                                : 'bg-white/5 border-white/10 text-white hover:border-white/20'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={coachingOptions.includes(option)}
                                                onChange={() => handleCheckboxChange(option)}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/50 focus:ring-offset-0"
                                            />
                                            <span className="font-medium">{option}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Other notes field */}
                                {coachingOptions.includes('Other') && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="otherNotes" className="text-slate-300">
                                            Please specify:
                                        </Label>
                                        <Textarea
                                            id="otherNotes"
                                            value={otherNotes}
                                            onChange={(e) => setOtherNotes(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white focus:border-white/50 min-h-[100px] resize-none"
                                            placeholder="Describe what other areas you'd like to focus on..."
                                        />
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit/Pay Button */}
            {selectedService?.requiresPayment ? (
                <Button
                    type="button"
                    variant="default"
                    className="w-full h-12 sm:h-14 text-sm sm:text-lg font-heading tracking-wider shadow-lg shadow-white/5 hover:shadow-white/10 transition-all duration-300"
                    disabled={isPaymentProcessing}
                    onClick={handlePayment}
                >
                    {isPaymentProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin shrink-0" />
                            Processing Payment...
                        </>
                    ) : (
                        <span className="text-center w-full">
                            Pay Now - {rateLoading ? `$${selectedService.priceUSD}` : formatPrice(selectedService.priceUSD!)}
                        </span>
                    )}
                </Button>
            ) : (
                <Button
                    type="submit"
                    variant="default"
                    className="w-full h-12 sm:h-14 text-sm sm:text-lg font-heading tracking-wider shadow-lg shadow-white/5 hover:shadow-white/10 transition-all duration-300"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit Inquiry
                        </>
                    )}
                </Button>
            )}

            {/* Info Text */}
            <p className="text-center text-slate-500 text-sm">
                {selectedService?.requiresPayment
                    ? selectedService.type === 'consultation'
                        ? 'After payment, you will be redirected to schedule your consultation.'
                        : 'After payment, we will contact you to schedule your coaching sessions.'
                    : 'I will contact you within 24-48 hours to discuss details and pricing.'}
            </p>
        </form>
    );
}
