import React from 'react';
import { cn } from '../../lib/utils';

// ─── Skeleton Line ────────────────────────────────────────────────────────────

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

const Line: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = '16px',
  className,
}) => (
  <div
    className={cn('animate-pulse rounded-md bg-slate-700/60', className)}
    style={{ width, height }}
  />
);

// ─── Skeleton Circle ──────────────────────────────────────────────────────────

interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

const Circle: React.FC<SkeletonCircleProps> = ({ size = 40, className }) => (
  <div
    className={cn('animate-pulse rounded-full bg-slate-700/60 shrink-0', className)}
    style={{ width: size, height: size }}
  />
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => (
  <div
    className={cn(
      'rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 space-y-4',
      className
    )}
  >
    <div className="flex items-center gap-3">
      <Circle size={40} />
      <div className="space-y-2 flex-1">
        <Line width="60%" height="14px" />
        <Line width="40%" height="12px" />
      </div>
    </div>
    <Line height="12px" />
    <Line width="80%" height="12px" />
    <Line width="50%" height="12px" />
  </div>
);

// ─── Skeleton Table ───────────────────────────────────────────────────────────

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 5,
  className,
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex gap-4 pb-2 border-b border-slate-700/50">
      {Array.from({ length: columns }).map((_, i) => (
        <Line key={`h-${i}`} height="14px" className="flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={`r-${rowIdx}`} className="flex items-center gap-4">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <Line
            key={`c-${rowIdx}-${colIdx}`}
            height="12px"
            className="flex-1"
            width={colIdx === 0 ? '70%' : undefined}
          />
        ))}
      </div>
    ))}
  </div>
);

// ─── Export ───────────────────────────────────────────────────────────────────

export const Skeleton = {
  Line,
  Circle,
  Card: SkeletonCard,
  Table: SkeletonTable,
};
