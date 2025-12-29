// Paystack payment response types
export interface PaystackResponse {
    reference: string;
    status: 'success' | 'failed' | 'pending';
    message?: string;
    data?: {
        reference: string;
        status: string;
        amount: number;
        [key: string]: unknown;
    };
}

// Extended Window interface for Paystack
declare global {
    interface Window {
        PaystackPop?: {
            setup: (config: PaystackConfig) => {
                openIframe: () => void;
            };
        };
    }
}

export interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata?: Record<string, unknown>;
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
}

