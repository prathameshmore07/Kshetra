import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
