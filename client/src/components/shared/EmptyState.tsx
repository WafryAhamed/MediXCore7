import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className
      )}
    >
      {icon || (
        <svg
          className="h-20 w-20 text-slate-600"
          fill="none"
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="14" y="10" width="52" height="60" rx="6" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M26 28h28M26 38h20M26 48h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="58" cy="58" r="16" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M52 58h12M58 52v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </svg>
      )}
      <div>
        <p className="text-base font-medium text-slate-300">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
