import React from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusDot } from './StatusIndicator';

export function Toast() {
  const { toastMessage } = useEvent();
  if (!toastMessage) return null;

  const dotStatus = {
    success: 'green',
    error: 'red',
    warning: 'orange',
    info: 'yellow',
  }[toastMessage.type] || 'green';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-3 text-xs text-zinc-900 dark:text-zinc-100 flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="pt-0.5">
        <StatusDot status={dotStatus} />
      </div>
      <div className="flex-1">
        <p className="font-normal leading-relaxed">{toastMessage.msg}</p>
      </div>
    </div>
  );
}
