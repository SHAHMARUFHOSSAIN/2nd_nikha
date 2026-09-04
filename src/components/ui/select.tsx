import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | SelectOption)[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-stone-600"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-white border border-stone-200 text-stone-800 text-sm rounded-xl py-2.5 pl-3.5 pr-10 transition-all duration-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 disabled:bg-stone-50 disabled:cursor-not-allowed cursor-pointer',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 pointer-events-none" />
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-stone-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
