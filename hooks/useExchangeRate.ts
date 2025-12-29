'use client';

import { useState, useEffect } from 'react';

interface ExchangeRateReturn {
    rate: number;
    isLoading: boolean;
    error: string | null;
    convertToGHS: (usd: number) => number;
    formatPrice: (usd: number) => string;
}

/**
 * Custom hook to fetch live USD-to-GHS exchange rate
 * Uses the free Exchange Rate API
 */
export function useExchangeRate(): ExchangeRateReturn {
    const [rate, setRate] = useState<number>(15.5); // Fallback rate
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRate() {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                if (!res.ok) {
                    throw new Error('Failed to fetch exchange rate');
                }
                const data = await res.json();
                if (data.rates?.GHS) {
                    setRate(data.rates.GHS);
                }
            } catch (err) {
                console.error('Exchange rate fetch error:', err);
                setError('Could not fetch exchange rate, using fallback');
            } finally {
                setIsLoading(false);
            }
        }
        fetchRate();
    }, []);

    const convertToGHS = (usd: number): number => {
        return usd * rate;
    };

    const formatPrice = (usd: number): string => {
        const ghsAmount = convertToGHS(usd);
        return `$${usd.toFixed(2)} (~GHS ${ghsAmount.toFixed(2)})`;
    };

    return { rate, isLoading, error, convertToGHS, formatPrice };
}
