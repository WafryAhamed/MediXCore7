import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../lib/utils';

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-xl',
};

const statusColorMap = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  offline: 'bg-slate-500',
};

const statusSizeMap = {
  xs: 'h-1.5 w-1.5 border',
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border-2',
  lg: 'h-3 w-3 border-2',
  xl: 'h-4 w-4 border-2',
};

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: keyof typeof sizeMap;
  status?: keyof typeof statusColorMap;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  status,
  className,
}) => {
  const initials = getInitials(name || '?');

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <AvatarPrimitive.Root
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700',
          sizeMap[size]
        )}
      >
        <AvatarPrimitive.Image
          className="aspect-square h-full w-full object-cover"
          src={src || undefined}
          alt={name}
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/80 to-primary font-semibold text-white"
          delayMs={300}
        >
          {initials}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-slate-900',
            statusColorMap[status],
            statusSizeMap[size]
          )}
        />
      )}
    </div>
  );
};
