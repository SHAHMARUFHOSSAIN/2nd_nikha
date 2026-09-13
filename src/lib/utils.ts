import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null, currency: string = 'BDT'): string {
  const numericAmount = typeof amount === 'number' ? amount : (parseFloat(String(amount || 0)) || 0);
  const cleanCurrency = String(currency || 'BDT').toUpperCase();
  if (cleanCurrency === 'USD' || cleanCurrency === '$') {
    return `$${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `৳${numericAmount.toLocaleString('en-BD')}`;
}
