// Database Types


export interface Service {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    display_order: number;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    description: string;
    video_url: string;
    resource_url: string | null;
    day_number: number;
    is_published: boolean;
    created_at: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    long_description?: string;
    price: number;
    video_url: string | null;
    thumbnail_url: string | null;
    is_published: boolean;
    display_order: number;
    duration: number;
    created_at: string;
    updated_at: string;
}

export interface Purchase {
    id: string;
    user_id: string;
    course_id: string;
    purchase_date: string;
    amount_paid: number;
}

export interface Profile {
    id: string;
    full_name: string;
    role: 'student' | 'admin';
    email_notifications: boolean;
    marketing_updates: boolean;
    created_at: string;
    updated_at: string;
}

export interface Waitlist {
    id: string;
    email: string;
    created_at: string;
}

export interface CourseProgress {
    id: string;
    user_id: string;
    course_id: string;
    minutes_watched: number;
    is_completed: boolean;
    last_watched_at: string;
}

// Booking Types
export type BookingType =
    | 'keynote'
    | 'masterclass'
    | 'mentoring'
    | 'podcast'
    | 'one_on_one_coaching'
    | 'consultation';

export interface BookingServiceConfig {
    type: BookingType;
    label: string;
    priceUSD?: number;
    requiresPayment: boolean;
    requiresScheduling?: boolean;
    fieldType: 'textarea' | 'input' | 'checkboxes' | 'none';
    fieldLabel?: string;
    fieldPlaceholder?: string;
    checkboxOptions?: string[];
}

export interface ServiceDetails {
    theme_expectation?: string;
    communication_aspect?: string;
    mentoring_aspect?: string;
    podcast_subject?: string;
    coaching_options?: string[];
    other_notes?: string;
}

export interface BookingFormData {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    serviceType: BookingType;
    serviceDetails: ServiceDetails;
    priceUSD?: number;
    priceGHS?: number;
    paymentStatus: 'pending' | 'paid' | 'n/a';
    paymentReference?: string;
}

// User type for components
export interface User {
    id: string;
    email: string;
    user_metadata?: {
        full_name?: string;
    };
}