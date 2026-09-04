import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null, currency: string = 'BDT'): string {
  const numericAmount = typeof amount === 'number' ? amount : (parseFloat(String(amount || 0)) || 0);
  if (currency === 'BDT') {
    return `৳${numericAmount.toLocaleString('en-BD')}`;
  }
  return `$${numericAmount.toLocaleString('en-US')}`;
}
