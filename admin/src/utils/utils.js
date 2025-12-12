import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncate(str, max = 60) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const absNum = Math.abs(num);

  // For numbers >= 1 billion
  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }

  // For numbers >= 1 million
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  // For numbers >= 1 thousand
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  // For numbers < 1000, add comma separators
  return num.toLocaleString('en-US');
}
