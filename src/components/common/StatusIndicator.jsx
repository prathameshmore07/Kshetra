import React from 'react';

/**
 * Strict Minimalist Status Indicator:
 * Status color appears ONLY as a small dot (2x2) or text token.
 * Never a full colored background.
 */
export function StatusDot({ status = 'green', className = '' }) {
  const dotColor = {
    green: 'bg-[#16a34a]',
    yellow: 'bg-[#ca8a04]',
    orange: 'bg-[#ea580c]',
    red: 'bg-[#dc2626]',
  }[status] || 'bg-[#16a34a]';

  return (
    <span
      className={`inline-block w-2 h-2 rounded-sm ${dotColor} ${className}`}
      aria-label={`Status: ${status}`}
    />
  );
}

export function StatusLabel({ status = 'green', label = null }) {
  const text = label || {
    green: 'Normal Flow',
    yellow: 'Moderate Wait',
    orange: 'High Friction',
    red: 'Blocked / Urgent',
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-700 dark:text-zinc-300">
      <StatusDot status={status} />
      <span>{text}</span>
    </span>
  );
}

export function getStatusBorderClass(status = 'green') {
  switch (status) {
    case 'red':
      return 'border-l-[3px] border-l-[#dc2626]';
    case 'orange':
      return 'border-l-[3px] border-l-[#ea580c]';
    case 'yellow':
      return 'border-l-[3px] border-l-[#ca8a04]';
    case 'green':
    default:
      return 'border-l-[3px] border-l-[#16a34a]';
  }
}
