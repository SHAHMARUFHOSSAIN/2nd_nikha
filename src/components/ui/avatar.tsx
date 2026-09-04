import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallbackInitials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  isVerified?: boolean;
}

export function Avatar({
  className,
  src,
  alt = 'Profile Avatar',
  fallbackInitials = '2C',
  size = 'md',
  isOnline,
  isVerified,
  ...props
}: AvatarProps) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const pixelMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  return (
    <div className="relative inline-block" {...props}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden border-2 border-rose-100 bg-rose-50 flex items-center justify-center font-semibold text-rose-800 shadow-sm shrink-0',
          sizeMap[size],
          className
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={pixelMap[size]}
            height={pixelMap[size]}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{fallbackInitials}</span>
        )}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
