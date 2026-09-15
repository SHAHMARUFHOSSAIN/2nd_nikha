export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[0-9]{10,15}$/.test(phone.trim());
}

export function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 8;
}

export function isValidName(name: string): boolean {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 100;
}

export function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function sanitizeText(value: unknown, maxLength = 10000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function toInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value), 10);
  return isNaN(n) ? fallback : n;
}

export function toFloat(value: unknown, fallback = 0): number {
  const n = parseFloat(String(value));
  return isNaN(n) ? fallback : n;
}

export function isValidAmount(amount: number, min = 1, max = 1000000): boolean {
  return (
    typeof amount === 'number' &&
    !isNaN(amount) &&
    amount >= min &&
    amount <= max
  );
}