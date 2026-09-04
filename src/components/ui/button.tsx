import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'wine' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-pink-200/80 hover:shadow-lg focus:ring-pink-400',
      wine:
        'bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white shadow-md shadow-pink-900/30 hover:shadow-lg focus:ring-pink-500',
      secondary:
        'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200/80 focus:ring-pink-300 font-bold',
      outline:
        'bg-white hover:bg-pink-50/80 text-stone-700 border border-stone-200 hover:border-pink-300 focus:ring-pink-300',
      ghost:
        'bg-transparent hover:bg-pink-50/80 text-stone-700 hover:text-pink-700 focus:ring-pink-200',
      link:
        'bg-transparent text-pink-600 hover:text-pink-800 underline-offset-4 hover:underline focus:ring-0 p-0 font-bold',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
